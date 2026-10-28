import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { questionService } from '../services/questionService';
import { verifyAdminToken, AuthenticatedAdminRequest } from '../middleware/auth';

export const adminRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'rm-ipr-secure-secret-token-key-university-2026-vtu';

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// 1. ADMIN LOGIN
adminRouter.post('/login', async (req, res: Response) => {
  try {
    const parse = adminLoginSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Valid email and password are required.' });
    }

    const { email, password } = parse.data;
    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid administrator credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    return res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ error: 'Failed to process admin login.' });
  }
});

// 2. GET CURRENT ADMIN PROFILE
adminRouter.get('/me', verifyAdminToken, async (req: AuthenticatedAdminRequest, res: Response) => {
  return res.json({ admin: req.admin });
});

// 3. DASHBOARD SUMMARY ANALYTICS
adminRouter.get('/dashboard', verifyAdminToken, async (req: AuthenticatedAdminRequest, res: Response) => {
  try {
    const totalStudents = await prisma.student.count();
    const totalAttempts = await prisma.testAttempt.count();
    const completedAttempts = await prisma.testAttempt.count({ where: { status: 'COMPLETED' } });
    const inProgressAttempts = await prisma.testAttempt.count({ where: { status: 'IN_PROGRESS' } });

    // Aggregate statistics for completed attempts
    const completedList = await prisma.testAttempt.findMany({
      where: { status: 'COMPLETED' },
      select: {
        totalScore: true,
        percentage: true,
        totalWarnings: true,
        moduleAttempts: {
          select: { moduleId: true, score: true }
        }
      }
    });

    let averageScore = 0;
    let highestScore = 0;
    let lowestScore = completedList.length > 0 ? 100 : 0;
    let totalWarnings = 0;
    const moduleScoresSum: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const moduleCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    if (completedList.length > 0) {
      let sum = 0;
      completedList.forEach((att) => {
        sum += att.totalScore;
        totalWarnings += att.totalWarnings;
        if (att.totalScore > highestScore) highestScore = att.totalScore;
        if (att.totalScore < lowestScore) lowestScore = att.totalScore;

        att.moduleAttempts.forEach((m) => {
          if (moduleScoresSum[m.moduleId] !== undefined) {
            moduleScoresSum[m.moduleId] += m.score;
            moduleCount[m.moduleId] += 1;
          }
        });
      });
      averageScore = Math.round((sum / completedList.length) * 100) / 100;
    }

    const moduleAverages: Record<number, number> = {};
    for (let m = 1; m <= 5; m++) {
      moduleAverages[m] = moduleCount[m] > 0
        ? Math.round((moduleScoresSum[m] / moduleCount[m]) * 100) / 100
        : 0;
    }

    return res.json({
      overview: {
        totalStudents,
        totalAttempts,
        completedAttempts,
        inProgressAttempts,
        averageScore,
        highestScore,
        lowestScore,
        totalWarnings,
        moduleAverages
      }
    });
  } catch (error) {
    console.error('Error fetching admin dashboard analytics:', error);
    return res.status(500).json({ error: 'Failed to retrieve dashboard analytics.' });
  }
});

// 4. GET ALL ATTEMPTS (WITH SEARCH, FILTER, SORT)
adminRouter.get('/attempts', verifyAdminToken, async (req: AuthenticatedAdminRequest, res: Response) => {
  try {
    const { search, status, sortBy = 'totalScore', sortOrder = 'desc' } = req.query;

    const whereClause: any = {};

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search && typeof search === 'string' && search.trim().length > 0) {
      const q = search.trim();
      whereClause.student = {
        OR: [
          { fullName: { contains: q } },
          { usn: { contains: q } },
          { normalizedUsn: { contains: q.toUpperCase() } }
        ]
      };
    }

    let orderBy: any = {};
    if (sortBy === 'name') {
      orderBy = { student: { fullName: sortOrder === 'asc' ? 'asc' : 'desc' } };
    } else if (sortBy === 'usn') {
      orderBy = { student: { usn: sortOrder === 'asc' ? 'asc' : 'desc' } };
    } else if (sortBy === 'startedAt') {
      orderBy = { startedAt: sortOrder === 'asc' ? 'asc' : 'desc' };
    } else if (sortBy === 'warnings') {
      orderBy = { totalWarnings: sortOrder === 'asc' ? 'asc' : 'desc' };
    } else {
      orderBy = { totalScore: sortOrder === 'asc' ? 'asc' : 'desc' };
    }

    const attempts = await prisma.testAttempt.findMany({
      where: whereClause,
      include: {
        student: true,
        moduleAttempts: { orderBy: { moduleId: 'asc' } },
        _count: {
          select: { focusEvents: true }
        }
      },
      orderBy
    });

    return res.json({ attempts });
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return res.status(500).json({ error: 'Failed to retrieve student assessment attempts.' });
  }
});

// 5. GET DETAILED ATTEMPT AUDIT
adminRouter.get('/attempts/:id', verifyAdminToken, async (req: AuthenticatedAdminRequest, res: Response) => {
  try {
    const { id } = req.params;

    const attempt = await prisma.testAttempt.findUnique({
      where: { id },
      include: {
        student: true,
        moduleAttempts: { orderBy: { moduleId: 'asc' } },
        responses: true,
        focusEvents: { orderBy: { timestamp: 'asc' } }
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    // Combine responses with textbook question details
    const allQuestions = questionService.getAllQuestions();
    const responseMap = new Map<string, any>();
    attempt.responses.forEach((r) => responseMap.set(r.questionId, r));

    const detailedQuestions = allQuestions.map((q) => {
      const resp = responseMap.get(q.id);
      return {
        questionId: q.id,
        moduleId: q.moduleId,
        moduleTitle: q.moduleTitle,
        questionNumber: q.questionNumber,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        selectedOption: resp ? resp.selectedOption : null,
        isCorrect: resp ? resp.isCorrect : false,
        marksObtained: resp ? resp.marksObtained : 0,
        explanation: q.explanation,
        chapterReference: q.chapterReference,
        pageReference: q.pageReference,
        answeredAt: resp ? resp.answeredAt : null
      };
    });

    return res.json({
      attempt,
      questions: detailedQuestions,
      focusEvents: attempt.focusEvents
    });
  } catch (error) {
    console.error('Error fetching attempt detail:', error);
    return res.status(500).json({ error: 'Failed to load attempt audit details.' });
  }
});

// 6. RESET ATTEMPT (ADMIN PRIVILEGE)
adminRouter.post('/attempts/:id/reset', verifyAdminToken, async (req: AuthenticatedAdminRequest, res: Response) => {
  try {
    const { id } = req.params;

    const attempt = await prisma.testAttempt.findUnique({ where: { id } });
    if (!attempt) {
      return res.status(404).json({ error: 'Attempt not found.' });
    }

    // Delete responses & focus events, reset module attempts
    await prisma.studentResponse.deleteMany({ where: { attemptId: id } });
    await prisma.focusEvent.deleteMany({ where: { attemptId: id } });

    await prisma.moduleAttempt.updateMany({
      where: { attemptId: id },
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
      where: { attemptId: id, moduleId: 1 }
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

    // Reset attempt
    const resetAttempt = await prisma.testAttempt.update({
      where: { id },
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
      message: `Assessment attempt for ${resetAttempt.student.fullName} (${resetAttempt.student.usn}) has been completely reset.`,
      attempt: resetAttempt
    });
  } catch (error) {
    console.error('Error resetting attempt:', error);
    return res.status(500).json({ error: 'Failed to reset assessment attempt.' });
  }
});

// 7. DELETE CANDIDATE ATTEMPT & RECORD FROM DATABASE
adminRouter.delete('/attempts/:id', verifyAdminToken, async (req: AuthenticatedAdminRequest, res: Response) => {
  try {
    const { id } = req.params;

    const attempt = await prisma.testAttempt.findUnique({
      where: { id },
      include: { student: true }
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Attempt record not found.' });
    }

    const studentId = attempt.studentId;
    const studentName = attempt.student.fullName;
    const studentUsn = attempt.student.usn;

    // Cascade delete responses, focus events, module attempts, and the attempt
    await prisma.studentResponse.deleteMany({ where: { attemptId: id } });
    await prisma.focusEvent.deleteMany({ where: { attemptId: id } });
    await prisma.moduleAttempt.deleteMany({ where: { attemptId: id } });
    await prisma.testAttempt.delete({ where: { id } });

    // Clean up student identity if no attempts remain
    const remainingAttempts = await prisma.testAttempt.count({ where: { studentId } });
    if (remainingAttempts === 0) {
      await prisma.student.delete({ where: { id: studentId } });
    }

    return res.json({
      success: true,
      message: `Candidate ${studentName} (${studentUsn}) was permanently deleted from the list.`
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return res.status(500).json({ error: 'Failed to delete candidate attempt record.' });
  }
});

// 7. GET TEST CONFIGURATION
adminRouter.get('/config', verifyAdminToken, async (req: AuthenticatedAdminRequest, res: Response) => {
  try {
    let config = await prisma.testConfig.findUnique({ where: { id: 'default' } });
    if (!config) {
      config = await prisma.testConfig.create({ data: { id: 'default' } });
    }
    return res.json({ config });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve test configuration.' });
  }
});

// 8. UPDATE TEST CONFIGURATION
const configUpdateSchema = z.object({
  testTitle: z.string().min(1).optional(),
  marksPerCorrect: z.number().positive().optional(),
  negativeMarksPerWrong: z.number().min(0).optional(),
  marksUnanswered: z.number().min(0).optional(),
  timeLimitMinutesPerModule: z.number().int().positive().optional(),
  allowAnswerReview: z.boolean().optional(),
  isTestActive: z.boolean().optional(),
  maxFocusWarnings: z.number().int().min(1).optional(),
  usnRegexPattern: z.string().optional()
});

adminRouter.put('/config', verifyAdminToken, async (req: AuthenticatedAdminRequest, res: Response) => {
  try {
    const parse = configUpdateSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.errors[0].message });
    }

    const updated = await prisma.testConfig.upsert({
      where: { id: 'default' },
      update: parse.data,
      create: {
        id: 'default',
        ...parse.data
      }
    });

    return res.json({
      success: true,
      message: 'Test configuration updated successfully.',
      config: updated
    });
  } catch (error) {
    console.error('Error updating test config:', error);
    return res.status(500).json({ error: 'Failed to update test configuration.' });
  }
});

