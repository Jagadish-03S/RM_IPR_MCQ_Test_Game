import { questionBank, QuestionItem } from '../data/questionBank';

const STORAGE_KEYS = {
  ATTEMPTS: 'rm_ipr_storage_attempts',
  STUDENTS: 'rm_ipr_storage_students',
  CONFIG: 'rm_ipr_storage_config'
};

const DEFAULT_CONFIG = {
  id: 'default',
  testTitle: 'RM & IPR MCQ Test Game',
  marksPerCorrect: 1.0,
  negativeMarksPerWrong: 0.0,
  marksUnanswered: 0.0,
  timeLimitMinutesPerModule: 20,
  allowAnswerReview: true,
  isTestActive: true,
  maxFocusWarnings: 5,
  usnRegexPattern: '^[0-9][A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{3}$'
};

function getStoredConfig() {
  const raw = localStorage.getItem(STORAGE_KEYS.CONFIG);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
    return DEFAULT_CONFIG;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONFIG;
  }
}

function getStoredAttempts(): any[] {
  const raw = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveStoredAttempts(attempts: any[]) {
  localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
}

export const mockStorage = {
  // Admin Login
  adminLogin: (credentials: { email: string; password: string }) => {
    const email = credentials.email.toLowerCase().trim();
    const password = credentials.password;

    if (email === 'sjagadish89772@gmail.com' && password === 'Prathiksha@123') {
      return {
        data: {
          token: 'rm_ipr_admin_verified_token_vtu_2026',
          admin: {
            id: 'admin-super-01',
            name: 'Jagadish S',
            email: 'sjagadish89772@gmail.com',
            role: 'SUPER_ADMIN'
          }
        }
      };
    }
    throw {
      response: {
        data: { error: 'Invalid administrator email or password.' },
        status: 401
      }
    };
  },

  // Admin Dashboard
  getDashboard: () => {
    const attempts = getStoredAttempts();
    const completedList = attempts.filter((a) => a.status === 'COMPLETED');
    const inProgressAttempts = attempts.filter((a) => a.status === 'IN_PROGRESS').length;

    let totalScoreSum = 0;
    let highestScore = 0;
    let lowestScore = completedList.length > 0 ? 100 : 0;
    let totalWarnings = 0;

    const moduleScoresSum: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const moduleCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    completedList.forEach((att) => {
      totalScoreSum += att.totalScore || 0;
      totalWarnings += att.totalWarnings || 0;
      if (att.totalScore > highestScore) highestScore = att.totalScore;
      if (att.totalScore < lowestScore) lowestScore = att.totalScore;

      (att.moduleAttempts || []).forEach((m: any) => {
        if (moduleScoresSum[m.moduleId] !== undefined) {
          moduleScoresSum[m.moduleId] += m.score || 0;
          moduleCount[m.moduleId] += 1;
        }
      });
    });

    const averageScore = completedList.length > 0
      ? Math.round((totalScoreSum / completedList.length) * 100) / 100
      : 0;

    const moduleAverages: Record<number, number> = {};
    for (let m = 1; m <= 5; m++) {
      moduleAverages[m] = moduleCount[m] > 0
        ? Math.round((moduleScoresSum[m] / moduleCount[m]) * 100) / 100
        : 0;
    }

    return {
      data: {
        overview: {
          totalStudents: attempts.length,
          totalAttempts: attempts.length,
          completedAttempts: completedList.length,
          inProgressAttempts,
          averageScore,
          highestScore,
          lowestScore,
          totalWarnings,
          moduleAverages
        }
      }
    };
  },

  // Admin Get Attempts
  getAttempts: (params?: { search?: string; status?: string; sortBy?: string; sortOrder?: string }) => {
    let attempts = getStoredAttempts();

    if (params?.status && params.status !== 'ALL') {
      attempts = attempts.filter((a) => a.status === params.status);
    }

    if (params?.search && params.search.trim().length > 0) {
      const q = params.search.trim().toLowerCase();
      attempts = attempts.filter(
        (a) =>
          a.student.fullName.toLowerCase().includes(q) ||
          a.student.usn.toLowerCase().includes(q)
      );
    }

    // Sort
    const sortBy = params?.sortBy || 'totalScore';
    attempts.sort((a, b) => {
      if (sortBy === 'totalScore') return b.totalScore - a.totalScore;
      if (sortBy === 'name') return a.student.fullName.localeCompare(b.student.fullName);
      if (sortBy === 'usn') return a.student.usn.localeCompare(b.student.usn);
      if (sortBy === 'warnings') return b.totalWarnings - a.totalWarnings;
      return 0;
    });

    return {
      data: {
        attempts
      }
    };
  },

  // Admin Attempt Detail
  getAttemptDetail: (id: string) => {
    const attempts = getStoredAttempts();
    const att = attempts.find((a) => a.id === id);
    if (!att) throw new Error('Attempt not found');
    return { data: { attempt: att } };
  },

  // Admin Reset Attempt
  resetAttempt: (id: string) => {
    const attempts = getStoredAttempts();
    const idx = attempts.findIndex((a) => a.id === id);
    if (idx !== -1) {
      attempts[idx].status = 'IN_PROGRESS';
      attempts[idx].currentModuleId = 1;
      attempts[idx].totalScore = 0;
      attempts[idx].percentage = 0;
      attempts[idx].totalWarnings = 0;
      attempts[idx].answers = {};
      attempts[idx].moduleAttempts = [];
      saveStoredAttempts(attempts);
    }
    return { data: { success: true } };
  },

  // Admin Delete Attempt
  deleteAttempt: (id: string) => {
    let attempts = getStoredAttempts();
    attempts = attempts.filter((a) => a.id !== id);
    saveStoredAttempts(attempts);
    return { data: { success: true } };
  },

  // Admin Config
  getConfig: () => {
    return { data: { config: getStoredConfig() } };
  },

  updateConfig: (data: any) => {
    const current = getStoredConfig();
    const updated = { ...current, ...data };
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    return { data: { config: updated } };
  },

  // Student Login
  studentLogin: (fullName: string, usn: string) => {
    const cleanUsn = usn.trim().toUpperCase();
    const cleanName = fullName.trim();
    const attempts = getStoredAttempts();

    let attempt = attempts.find((a) => a.student.usn === cleanUsn);

    if (!attempt) {
      attempt = {
        id: 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        sessionToken: 'sess_' + cleanUsn + '_' + Date.now(),
        student: {
          fullName: cleanName,
          usn: cleanUsn
        },
        status: 'IN_PROGRESS',
        currentModuleId: 1,
        startedAt: new Date().toISOString(),
        totalScore: 0,
        percentage: 0,
        totalAttempted: 0,
        totalCorrect: 0,
        totalWrong: 0,
        totalWarnings: 0,
        answers: {},
        moduleAttempts: []
      };
      attempts.push(attempt);
      saveStoredAttempts(attempts);
      return {
        data: {
          sessionToken: attempt.sessionToken,
          student: attempt.student,
          resumed: false,
          alreadyCompleted: false
        }
      };
    }

    // Existing attempt
    return {
      data: {
        sessionToken: attempt.sessionToken,
        student: attempt.student,
        resumed: attempt.status === 'IN_PROGRESS',
        alreadyCompleted: attempt.status === 'COMPLETED'
      }
    };
  },

  // Student Get Attempt
  getStudentAttempt: () => {
    const token = localStorage.getItem('rm_ipr_student_session');
    const attempts = getStoredAttempts();
    const attempt = attempts.find((a) => a.sessionToken === token);
    if (!attempt) throw new Error('Session not found');

    return {
      data: {
        attempt,
        student: attempt.student,
        config: getStoredConfig()
      }
    };
  },

  // Student Get Module Questions
  getModuleQuestions: (moduleId: number) => {
    const filtered = questionBank.filter((q) => q.moduleId === Number(moduleId));
    const token = localStorage.getItem('rm_ipr_student_session');
    const attempts = getStoredAttempts();
    const attempt = attempts.find((a) => a.sessionToken === token);

    const publicQuestions = filtered.map((q) => ({
      id: q.id,
      moduleId: q.moduleId,
      moduleTitle: q.moduleTitle,
      questionNumber: q.questionNumber,
      question: q.question,
      options: q.options,
      chapterReference: q.chapterReference
    }));

    return {
      data: {
        moduleId,
        moduleTitle: filtered[0]?.moduleTitle || `Module ${moduleId}`,
        timeLimitMinutes: 20,
        questions: publicQuestions,
        existingAnswers: attempt?.answers || {},
        totalWarnings: attempt?.totalWarnings || 0,
        isDisqualified: attempt?.status === 'DISQUALIFIED'
      }
    };
  },

  // Student Save Answer
  saveAnswer: (questionId: string, selectedOption: string | null) => {
    const token = localStorage.getItem('rm_ipr_student_session');
    const attempts = getStoredAttempts();
    const attempt = attempts.find((a) => a.sessionToken === token);
    if (attempt) {
      if (!attempt.answers) attempt.answers = {};
      attempt.answers[questionId] = selectedOption;
      saveStoredAttempts(attempts);
    }
    return { data: { success: true } };
  },

  // Student Submit Module
  submitModule: (moduleId: number, _timeTakenSeconds?: number) => {
    const token = localStorage.getItem('rm_ipr_student_session');
    const attempts = getStoredAttempts();
    const attempt = attempts.find((a) => a.sessionToken === token);
    if (!attempt) throw new Error('Attempt not found');

    const moduleQuestions = questionBank.filter((q) => q.moduleId === Number(moduleId));
    let moduleScore = 0;
    let moduleCorrect = 0;

    moduleQuestions.forEach((q) => {
      const studentAns = attempt.answers?.[q.id];
      if (studentAns === q.correctAnswer) {
        moduleScore += 1;
        moduleCorrect += 1;
      }
    });

    if (!attempt.moduleAttempts) attempt.moduleAttempts = [];
    const existingModIdx = attempt.moduleAttempts.findIndex((m: any) => m.moduleId === moduleId);
    const modRecord = {
      moduleId,
      score: moduleScore,
      correctCount: moduleCorrect,
      totalQuestions: moduleQuestions.length,
      submittedAt: new Date().toISOString()
    };

    if (existingModIdx !== -1) {
      attempt.moduleAttempts[existingModIdx] = modRecord;
    } else {
      attempt.moduleAttempts.push(modRecord);
    }

    if (moduleId >= 5) {
      attempt.status = 'COMPLETED';
      attempt.completedAt = new Date().toISOString();

      let totalScore = 0;
      let totalCorrect = 0;
      let totalAttempted = 0;

      questionBank.forEach((q) => {
        const ans = attempt.answers?.[q.id];
        if (ans) {
          totalAttempted += 1;
          if (ans === q.correctAnswer) {
            totalScore += 1;
            totalCorrect += 1;
          }
        }
      });

      attempt.totalScore = totalScore;
      attempt.totalCorrect = totalCorrect;
      attempt.totalAttempted = totalAttempted;
      attempt.totalWrong = totalAttempted - totalCorrect;
      attempt.percentage = Math.round((totalScore / questionBank.length) * 100);
    } else {
      attempt.currentModuleId = moduleId + 1;
    }

    saveStoredAttempts(attempts);

    return {
      data: {
        success: true,
        nextModuleId: moduleId >= 5 ? null : moduleId + 1,
        isCompleted: moduleId >= 5,
        moduleScore
      }
    };
  },

  // Student Focus Event (Tab Switch / Window Blur)
  sendFocusEvent: (_moduleId: number, _eventType: string, _durationAwayMs?: number) => {
    const token = localStorage.getItem('rm_ipr_student_session');
    const attempts = getStoredAttempts();
    const attempt = attempts.find((a) => a.sessionToken === token);
    const config = getStoredConfig();

    if (attempt) {
      attempt.totalWarnings = (attempt.totalWarnings || 0) + 1;
      const isDisqualified = attempt.totalWarnings >= (config.maxFocusWarnings || 5);
      if (isDisqualified) {
        attempt.status = 'DISQUALIFIED';
      }
      saveStoredAttempts(attempts);
      return {
        data: {
          totalWarnings: attempt.totalWarnings,
          isDisqualified
        }
      };
    }
    return { data: { totalWarnings: 0, isDisqualified: false } };
  },

  // Student Restart Test
  restartTest: () => {
    const token = localStorage.getItem('rm_ipr_student_session');
    const attempts = getStoredAttempts();
    const attempt = attempts.find((a) => a.sessionToken === token);
    if (attempt) {
      attempt.status = 'IN_PROGRESS';
      attempt.currentModuleId = 1;
      attempt.totalScore = 0;
      attempt.percentage = 0;
      attempt.totalWarnings = 0;
      attempt.answers = {};
      attempt.moduleAttempts = [];
      saveStoredAttempts(attempts);
    }
    return { data: { success: true } };
  },

  // Student Results
  getResults: () => {
    const token = localStorage.getItem('rm_ipr_student_session');
    const attempts = getStoredAttempts();
    const attempt = attempts.find((a) => a.sessionToken === token);
    if (!attempt) throw new Error('Attempt not found');

    const detailedQuestions = questionBank.map((q) => ({
      id: q.id,
      moduleId: q.moduleId,
      moduleTitle: q.moduleTitle,
      questionNumber: q.questionNumber,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      chapterReference: q.chapterReference,
      selectedOption: attempt.answers?.[q.id] || null,
      isCorrect: attempt.answers?.[q.id] === q.correctAnswer
    }));

    return {
      data: {
        attempt,
        student: attempt.student,
        questions: detailedQuestions,
        config: getStoredConfig()
      }
    };
  }
};

