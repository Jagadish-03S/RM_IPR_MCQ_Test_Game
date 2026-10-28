import { Router, Response } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { questionService } from '../services/questionService';
import { ScoringService } from '../services/scoringService';
import { verifyStudentSession, AuthenticatedStudentRequest } from '../middleware/auth';

export const studentRouter = Router();

const loginSchema = z.object({
  fullName: z.string().trim().min(2, 'Name must be at least 2 characters long').max(100),
  usn: z.string().trim().min(3, 'USN is required')
});

// 1. STUDENT LOGIN OR RESUME
studentRouter.post('/login', async (req, res: Response) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors[0].message });
    }

    const { fullName, usn } = parseResult.data;
    const normalizedUsn = usn.toUpperCase().replace(/\s+/g, '');

    // Fetch Test Config
    let config = await prisma.testConfig.findUnique({ where: { id: 'default' } });
    if (!config) {
      config = await prisma.testConfig.create({ data: { id: 'default' } });
    }

    if (!config.isTestActive) {
      return res.status(403).json({ error: 'The assessment is currently closed or inactive. Please contact the administrator.' });
    }

    // Validate USN if pattern configured
    if (config.usnRegexPattern && config.usnRegexPattern.trim().length > 0) {
      try {
        const regex = new RegExp(config.usnRegexPattern.trim(), 'i');
        if (!regex.test(normalizedUsn)) {
          return res.status(400).json({
            error: 'Invalid University Seat Number. Please enter your valid USN.'
          });
        }
      } catch (err) {
        console.warn('Invalid USN regex pattern in config:', config.usnRegexPattern);
      }
    }

    // Check if USN is already registered
    const existingStudent = await prisma.student.findUnique({
      where: { normalizedUsn }
    });

    if (existingStudent) {
      // 1. Check for name mismatch
      const cleanExisting = existingStudent.fullName.trim().toLowerCase().replace(/\s+/g, ' ');
      const cleanEntered = fullName.trim().toLowerCase().replace(/\s+/g, ' ');

      if (cleanExisting !== cleanEntered) {
        return res.status(403).json({
          error: `Access Denied: This University Seat Number (${existingStudent.usn}) is already registered under candidate "${existingStudent.fullName}". You cannot log in using a different name.`
        });
      }

      // 2. Check if this USN has already completed/attended the assessment
      const alreadyCompletedAttempt = await prisma.testAttempt.findFirst({
        where: {
          studentId: existingStudent.id,
          status: 'COMPLETED'
        }
      });

      if (alreadyCompletedAttempt) {
        return res.status(403).json({
          alreadyCompleted: true,
          error: `Access Denied: Candidate ${existingStudent.fullName} (${existingStudent.usn}) has already attended and submitted this examination. Multiple attempts under the same USN are prohibited.`
        });
      }
    }

    // Upsert Student with matching verified identity
    const student = await prisma.student.upsert({
      where: { normalizedUsn },
      update: { fullName },
      create: {
        fullName,
        usn: usn.trim().toUpperCase(),
        normalizedUsn
      }
    });

    // Check for existing attempts
    const existingAttempt = await prisma.testAttempt.findFirst({
      where: {
        studentId: student.id,
        status: { in: ['IN_PROGRESS', 'NOT_STARTED', 'DISQUALIFIED'] }
      },
      include: {
        moduleAttempts: { orderBy: { moduleId: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (existingAttempt) {
      // Resume existing active attempt
      return res.json({
        resumed: true,
        sessionToken: existingAttempt.sessionToken,
        student: { id: student.id, fullName: student.fullName, usn: student.usn },
        attempt: existingAttempt,
        config: {
          testTitle: config.testTitle,
          timeLimitMinutesPerModule: config.timeLimitMinutesPerModule,
          maxFocusWarnings: config.maxFocusWarnings,
          marksPerCorrect: config.marksPerCorrect
        }
      });
    }

    // Check if student already completed an attempt
    const completedAttempt = await prisma.testAttempt.findFirst({
      where: {
        studentId: student.id,
        status: 'COMPLETED'
      },
      include: {
        moduleAttempts: { orderBy: { moduleId: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (completedAttempt) {
      return res.json({
        resumed: false,
        alreadyCompleted: true,
        sessionToken: completedAttempt.sessionToken,
        student: { id: student.id, fullName: student.fullName, usn: student.usn },
        attempt: completedAttempt,
        config: {
          testTitle: config.testTitle,
          timeLimitMinutesPerModule: config.timeLimitMinutesPerModule,
          maxFocusWarnings: config.maxFocusWarnings,
          marksPerCorrect: config.marksPerCorrect
        }
      });
    }

    // Create fresh attempt
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const newAttempt = await prisma.testAttempt.create({
      data: {
        studentId: student.id,
        sessionToken,
        status: 'IN_PROGRESS',
        currentModuleId: 1,
        moduleAttempts: {
          create: [1, 2, 3, 4, 5].map((modId) => ({
            moduleId: modId,
            moduleTitle: questionService.getModuleTitle(modId),
            status: modId === 1 ? 'IN_PROGRESS' : 'NOT_STARTED',
            unanswered: 20,
            startedAt: modId === 1 ? new Date() : null
          }))
        }
      },
      include: {
        moduleAttempts: { orderBy: { moduleId: 'asc' } }
      }
    });

    return res.json({
      resumed: false,
      sessionToken: newAttempt.sessionToken,
      student: { id: student.id, fullName: student.fullName, usn: student.usn },
      attempt: newAttempt,
      config: {
        testTitle: config.testTitle,
        timeLimitMinutesPerModule: config.timeLimitMinutesPerModule,
        maxFocusWarnings: config.maxFocusWarnings,
        marksPerCorrect: config.marksPerCorrect
      }
    });
  } catch (error) {
    console.error('Error during student login:', error);
    return res.status(500).json({ error: 'Failed to process student assessment login.' });
  }
});

// 2. GET CURRENT ATTEMPT STATUS
studentRouter.get('/attempt', verifyStudentSession, async (req: AuthenticatedStudentRequest, res: Response) => {
  try {
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: req.attempt.id },
      include: {
        student: true,
        moduleAttempts: { orderBy: { moduleId: 'asc' } }
      }
    });

    const config = await prisma.testConfig.findUnique({ where: { id: 'default' } });

    return res.json({
      attempt,
      student: attempt?.student,
      config: {
        testTitle: config?.testTitle || 'RM & IPR MCQ Test Game',
        timeLimitMinutesPerModule: config?.timeLimitMinutesPerModule || 20,
        maxFocusWarnings: config?.maxFocusWarnings || 5,
        allowAnswerReview: config?.allowAnswerReview ?? true
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch current attempt status.' });
  }
});

// 3. GET QUESTIONS FOR A MODULE
studentRouter.get('/module/:moduleId', verifyStudentSession, async (req: AuthenticatedStudentRequest, res: Response) => {
  try {
    const moduleId = parseInt(req.params.moduleId, 10);
    if (isNaN(moduleId) || moduleId < 1 || moduleId > 5) {
      return res.status(400).json({ error: 'Module ID must be an integer between 1 and 5.' });
    }

    const attempt = req.attempt;

    if (attempt.status === 'DISQUALIFIED') {
      return res.status(403).json({
        disqualified: true,
        error: 'Assessment terminated due to tab switch violation. Please restart the test from the beginning.'
      });
    }

    // Check sequencing: module cannot be accessed if previous module is not submitted
    const targetModuleAttempt = attempt.moduleAttempts.find((m: any) => m.moduleId === moduleId);
    if (!targetModuleAttempt) {
      return res.status(404).json({ error: 'Module attempt not found.' });
    }

    // Verify prerequisites
    for (let m = 1; m < moduleId; m++) {
      const prevMod = attempt.moduleAttempts.find((item: any) => item.moduleId === m);
      if (!prevMod || prevMod.status !== 'SUBMITTED') {
        return res.status(403).json({
          error: `Module ${moduleId} is locked. You must complete and submit Module ${m} first.`
        });
      }
    }

    // Mark module as IN_PROGRESS if NOT_STARTED
    if (targetModuleAttempt.status === 'NOT_STARTED') {
      await prisma.moduleAttempt.update({
        where: { id: targetModuleAttempt.id },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      });
      targetModuleAttempt.status = 'IN_PROGRESS';
    }

    // Get public questions (NO correct answers or explanations!)
    const questions = questionService.getPublicModuleQuestions(moduleId);

    // Get student's existing responses for this module
    const savedResponses = await prisma.studentResponse.findMany({
      where: {
        attemptId: attempt.id,
        moduleId
      },
      select: {
        questionId: true,
        selectedOption: true
      }
    });

    const config = await prisma.testConfig.findUnique({ where: { id: 'default' } });

    return res.json({
      moduleId,
      moduleTitle: targetModuleAttempt.moduleTitle,
      status: targetModuleAttempt.status,
      timeLimitMinutes: config?.timeLimitMinutesPerModule || 20,
      startedAt: targetModuleAttempt.startedAt,
      questions,
      savedResponses
    });
  } catch (error) {
    console.error('Error fetching module questions:', error);
    return res.status(500).json({ error: 'Failed to retrieve module questions.' });
  }
});

// 4. SAVE AN ANSWER TO A QUESTION
studentRouter.post('/save-answer', verifyStudentSession, async (req: AuthenticatedStudentRequest, res: Response) => {
  try {
    if (req.attempt.status === 'DISQUALIFIED') {
      return res.status(403).json({
        disqualified: true,
        error: 'Assessment terminated due to tab switch violation. Please restart the test.'
      });
    }

    const { questionId, selectedOption } = req.body;
    if (!questionId) {
      return res.status(400).json({ error: 'Missing questionId.' });
    }

    const q = questionService.getQuestionById(questionId);
    if (!q) {
      return res.status(404).json({ error: 'Question not found in question bank.' });
    }

    const modAttempt = req.attempt.moduleAttempts.find((m: any) => m.moduleId === q.moduleId);
    if (modAttempt && modAttempt.status === 'SUBMITTED') {
      return res.status(403).json({ error: `Module ${q.moduleId} has already been submitted and answers are locked.` });
    }

    const option = selectedOption ? String(selectedOption).toUpperCase().trim() : null;
    if (option && !['A', 'B', 'C', 'D'].includes(option)) {
      return res.status(400).json({ error: 'Selected option must be A, B, C, D, or null.' });
    }

    const saved = await prisma.studentResponse.upsert({
      where: {
        attemptId_questionId: {
          attemptId: req.attempt.id,
          questionId
        }
      },
      update: {
        selectedOption: option,
        answeredAt: new Date()
      },
      create: {
        attemptId: req.attempt.id,
        questionId,
        moduleId: q.moduleId,
        selectedOption: option,
        answeredAt: new Date()
      }
    });

    return res.json({
      success: true,
      questionId: saved.questionId,
      selectedOption: saved.selectedOption
    });
  } catch (error) {
    console.error('Error saving answer:', error);
    return res.status(500).json({ error: 'Failed to save student answer.' });
  }
});

// 5. SUBMIT A MODULE
studentRouter.post('/submit-module', verifyStudentSession, async (req: AuthenticatedStudentRequest, res: Response) => {
  try {
    if (req.attempt.status === 'DISQUALIFIED') {
      return res.status(403).json({
        disqualified: true,
        error: 'Assessment terminated due to tab switch violation. Please restart the test.'
      });
    }

    const { moduleId, timeTakenSeconds } = req.body;
    const modId = parseInt(moduleId, 10);
    if (isNaN(modId) || modId < 1 || modId > 5) {
      return res.status(400).json({ error: 'Valid moduleId between 1 and 5 is required.' });
    }

    const modAttempt = req.attempt.moduleAttempts.find((m: any) => m.moduleId === modId);
    if (!modAttempt) {
      return res.status(404).json({ error: 'Module attempt not found.' });
    }

    if (modAttempt.status === 'SUBMITTED') {
      return res.json({
        alreadySubmitted: true,
        message: `Module ${modId} was already submitted.`
      });
    }

    const config = await prisma.testConfig.findUnique({ where: { id: 'default' } });
    const scoringCfg = {
      marksPerCorrect: config?.marksPerCorrect ?? 1.0,
      negativeMarksPerWrong: config?.negativeMarksPerWrong ?? 0.0,
      marksUnanswered: config?.marksUnanswered ?? 0.0
    };

    // Retrieve all student responses for this module
    const responses = await prisma.studentResponse.findMany({
      where: {
        attemptId: req.attempt.id,
        moduleId: modId
      }
    });

    const moduleScore = ScoringService.calculateModuleScore(modId, responses, scoringCfg);

    // Update responses with evaluated marks and correctness
    for (const ev of moduleScore.evaluatedList) {
      await prisma.studentResponse.updateMany({
        where: {
          attemptId: req.attempt.id,
          questionId: ev.questionId
        },
        data: {
          isCorrect: ev.isCorrect,
          marksObtained: ev.marks
        }
      });
    }

    // Update module attempt record
    const updatedMod = await prisma.moduleAttempt.update({
      where: { id: modAttempt.id },
      data: {
        status: 'SUBMITTED',
        score: moduleScore.score,
        attempted: moduleScore.attempted,
        correct: moduleScore.correct,
        wrong: moduleScore.wrong,
        unanswered: moduleScore.unanswered,
        submittedAt: new Date(),
        timeTakenSeconds: timeTakenSeconds ? Math.max(0, parseInt(timeTakenSeconds, 10)) : 0
      }
    });

    const isFinalModule = modId === 5;

    if (!isFinalModule) {
      // Advance to next module
      const nextModId = modId + 1;
      await prisma.testAttempt.update({
        where: { id: req.attempt.id },
        data: {
          currentModuleId: nextModId
        }
      });

      // Activate next module
      const nextModAttempt = req.attempt.moduleAttempts.find((m: any) => m.moduleId === nextModId);
      if (nextModAttempt && nextModAttempt.status === 'NOT_STARTED') {
        await prisma.moduleAttempt.update({
          where: { id: nextModAttempt.id },
          data: {
            status: 'IN_PROGRESS',
            startedAt: new Date()
          }
        });
      }

      return res.json({
        isComplete: false,
        nextModuleId: nextModId,
        moduleSummary: updatedMod
      });
    }

    // FINAL SUBMISSION (Module 5 submitted)
    // Calculate overall results across all 5 modules
    const allResponses = await prisma.studentResponse.findMany({
      where: { attemptId: req.attempt.id }
    });

    const overallScores = ScoringService.calculateScores(allResponses, scoringCfg);

    const completedAttempt = await prisma.testAttempt.update({
      where: { id: req.attempt.id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        totalScore: overallScores.totalScore,
        totalAttempted: overallScores.totalAttempted,
        totalCorrect: overallScores.totalCorrect,
        totalWrong: overallScores.totalWrong,
        totalUnanswered: overallScores.totalUnanswered,
        percentage: overallScores.percentage
      },
      include: {
        moduleAttempts: { orderBy: { moduleId: 'asc' } },
        student: true
      }
    });

    return res.json({
      isComplete: true,
      attempt: completedAttempt,
      overallScores
    });
  } catch (error) {
    console.error('Error submitting module:', error);
    return res.status(500).json({ error: 'Failed to submit module.' });
  }
});

// 6. RECORD TAB-SWITCH & INTEGRITY FOCUS EVENT (ONE-STRIKE DISQUALIFICATION)
studentRouter.post('/focus-event', verifyStudentSession, async (req: AuthenticatedStudentRequest, res: Response) => {
  try {
    const { moduleId, eventType, durationAwayMs } = req.body;
    const modId = parseInt(moduleId, 10) || req.attempt.currentModuleId || 1;

    const currentWarnings = (req.attempt.totalWarnings || 0) + 1;

    // Persist focus event
    await prisma.focusEvent.create({
      data: {
        attemptId: req.attempt.id,
        moduleId: modId,
        eventType: eventType || 'TAB_SWITCH',
        warningCount: currentWarnings,
        durationAwayMs: durationAwayMs ? parseInt(durationAwayMs, 10) : 0,
        timestamp: new Date()
      }
    });

    // STRICT EXAMINATION RULE: A SINGLE (1) TAB-SWITCH DISQUALIFIES THE CANDIDATE IMMEDIATELY!
    const updatedAttempt = await prisma.testAttempt.update({
      where: { id: req.attempt.id },
      data: {
        totalWarnings: currentWarnings,
        status: 'DISQUALIFIED'
      }
    });

    return res.json({
      success: true,
      disqualified: true,
      totalWarnings: updatedAttempt.totalWarnings,
      message: 'Assessment terminated. A tab switch was detected. You have been removed from the test and must restart from the beginning.'
    });
  } catch (error) {
    console.error('Error recording focus event:', error);
    return res.status(500).json({ error: 'Failed to record focus monitoring event.' });
  }
});

// 7. RESTART ASSESSMENT AFTER TAB-SWITCH DISQUALIFICATION
studentRouter.post('/restart', verifyStudentSession, async (req: AuthenticatedStudentRequest, res: Response) => {
  try {
    const attemptId = req.attempt.id;

    // Clear saved student responses & focus events
    await prisma.studentResponse.deleteMany({ where: { attemptId } });
    await prisma.focusEvent.deleteMany({ where: { attemptId } });

    // Reset module attempts
    await prisma.moduleAttempt.updateMany({
      where: { attemptId },
      data: {
        status: 'NOT_STARTED',
        score: 0.0,
        attempted: 0,
        correct: 0,
        wrong: 0,
        unanswered: 20,
        startedAt: null,
        submittedAt: null,
        timeTakenSeconds: 0
      }
    });

    // Reset Module 1 to IN_PROGRESS
    const mod1 = await prisma.moduleAttempt.findFirst({
      where: { attemptId, moduleId: 1 }
    });
    if (mod1) {
      await prisma.moduleAttempt.update({
        where: { id: mod1.id },
        data: {
          status: 'IN_PROGRESS',
          startedAt: new Date()
        }
      });
    }

    // Reset TestAttempt to IN_PROGRESS with 0 warnings
    const restartedAttempt = await prisma.testAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'IN_PROGRESS',
        currentModuleId: 1,
        startedAt: new Date(),
        completedAt: null,
        totalScore: 0.0,
        totalAttempted: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalUnanswered: 100,
        percentage: 0.0,
        totalWarnings: 0
      },
      include: {
        student: true,
        moduleAttempts: { orderBy: { moduleId: 'asc' } }
      }
    });

    return res.json({
      success: true,
      message: 'Assessment restarted from Module 1. Please remain on this window to avoid disqualification.',
      attempt: restartedAttempt
    });
  } catch (error) {
    console.error('Error restarting assessment:', error);
    return res.status(500).json({ error: 'Failed to restart assessment.' });
  }
});

// 7. GET FINAL RESULTS & DETAILED REVIEW
studentRouter.get('/results', verifyStudentSession, async (req: AuthenticatedStudentRequest, res: Response) => {
  try {
    const attempt = await prisma.testAttempt.findUnique({
      where: { id: req.attempt.id },
      include: {
        student: true,
        moduleAttempts: { orderBy: { moduleId: 'asc' } },
        responses: true,
        focusEvents: { orderBy: { timestamp: 'desc' } }
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt record not found.' });
    }

    const config = await prisma.testConfig.findUnique({ where: { id: 'default' } });
    const allowReview = config?.allowAnswerReview ?? true;

    // Build question-by-question review if allowed
    let review: any[] = [];
    if (allowReview) {
      const allQuestions = questionService.getAllQuestions();
      const responseMap = new Map<string, string | null>();
      attempt.responses.forEach((r) => responseMap.set(r.questionId, r.selectedOption));

      review = allQuestions.map((q) => {
        const studentChoice = responseMap.get(q.id) || null;
        const isCorrect = studentChoice === q.correctAnswer;
        return {
          questionId: q.id,
          moduleId: q.moduleId,
          moduleTitle: q.moduleTitle,
          questionNumber: q.questionNumber,
          question: q.question,
          options: q.options,
          selectedOption: studentChoice,
          correctAnswer: q.correctAnswer,
          isCorrect,
          explanation: q.explanation,
          chapterReference: q.chapterReference,
          pageReference: q.pageReference
        };
      });
    }

    return res.json({
      attempt: {
        id: attempt.id,
        status: attempt.status,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        totalScore: attempt.totalScore,
        totalAttempted: attempt.totalAttempted,
        totalCorrect: attempt.totalCorrect,
        totalWrong: attempt.totalWrong,
        totalUnanswered: attempt.totalUnanswered,
        percentage: attempt.percentage,
        totalWarnings: attempt.totalWarnings,
        moduleAttempts: attempt.moduleAttempts
      },
      student: {
        id: attempt.student.id,
        fullName: attempt.student.fullName,
        usn: attempt.student.usn
      },
      allowReview,
      review,
      focusEvents: attempt.focusEvents
    });
  } catch (error) {
    console.error('Error fetching results:', error);
    return res.status(500).json({ error: 'Failed to retrieve assessment results.' });
  }
});

