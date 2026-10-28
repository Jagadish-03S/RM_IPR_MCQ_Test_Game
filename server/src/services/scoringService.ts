import { questionService } from './questionService';

export interface ScoreResult {
  totalQuestions: number;
  totalAttempted: number;
  totalCorrect: number;
  totalWrong: number;
  totalUnanswered: number;
  totalScore: number;
  maxPossibleMarks: number;
  percentage: number;
  moduleResults: Record<
    number,
    {
      moduleId: number;
      moduleTitle: string;
      totalQuestions: number;
      attempted: number;
      correct: number;
      wrong: number;
      unanswered: number;
      score: number;
      maxScore: number;
    }
  >;
  evaluatedResponses: Array<{
    questionId: string;
    moduleId: number;
    selectedOption: string | null;
    correctAnswer: string;
    isCorrect: boolean;
    marksObtained: number;
  }>;
}

export interface ScoringConfig {
  marksPerCorrect: number;
  negativeMarksPerWrong: number;
  marksUnanswered: number;
}

export class ScoringService {
  public static calculateScores(
    studentResponses: Array<{ questionId: string; selectedOption: string | null }>,
    config: ScoringConfig = {
      marksPerCorrect: 1.0,
      negativeMarksPerWrong: 0.0,
      marksUnanswered: 0.0
    }
  ): ScoreResult {
    const allQuestions = questionService.getAllQuestions();
    const responsesMap = new Map<string, string | null>();
    studentResponses.forEach((r) => {
      responsesMap.set(r.questionId, r.selectedOption ? r.selectedOption.trim().toUpperCase() : null);
    });

    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalScore = 0;

    const moduleResults: ScoreResult['moduleResults'] = {
      1: { moduleId: 1, moduleTitle: questionService.getModuleTitle(1), totalQuestions: 20, attempted: 0, correct: 0, wrong: 0, unanswered: 20, score: 0, maxScore: 20 * config.marksPerCorrect },
      2: { moduleId: 2, moduleTitle: questionService.getModuleTitle(2), totalQuestions: 20, attempted: 0, correct: 0, wrong: 0, unanswered: 20, score: 0, maxScore: 20 * config.marksPerCorrect },
      3: { moduleId: 3, moduleTitle: questionService.getModuleTitle(3), totalQuestions: 20, attempted: 0, correct: 0, wrong: 0, unanswered: 20, score: 0, maxScore: 20 * config.marksPerCorrect },
      4: { moduleId: 4, moduleTitle: questionService.getModuleTitle(4), totalQuestions: 20, attempted: 0, correct: 0, wrong: 0, unanswered: 20, score: 0, maxScore: 20 * config.marksPerCorrect },
      5: { moduleId: 5, moduleTitle: questionService.getModuleTitle(5), totalQuestions: 20, attempted: 0, correct: 0, wrong: 0, unanswered: 20, score: 0, maxScore: 20 * config.marksPerCorrect }
    };

    const evaluatedResponses: ScoreResult['evaluatedResponses'] = [];

    for (const q of allQuestions) {
      const selected = responsesMap.get(q.id) || null;
      const mod = moduleResults[q.moduleId];

      if (selected && ['A', 'B', 'C', 'D'].includes(selected)) {
        totalAttempted += 1;
        if (mod) mod.attempted += 1;

        if (selected === q.correctAnswer) {
          totalCorrect += 1;
          const marks = config.marksPerCorrect;
          totalScore += marks;
          if (mod) {
            mod.correct += 1;
            mod.score += marks;
          }
          evaluatedResponses.push({
            questionId: q.id,
            moduleId: q.moduleId,
            selectedOption: selected,
            correctAnswer: q.correctAnswer,
            isCorrect: true,
            marksObtained: marks
          });
        } else {
          totalWrong += 1;
          const penalty = -Math.abs(config.negativeMarksPerWrong);
          totalScore += penalty;
          if (mod) {
            mod.wrong += 1;
            mod.score += penalty;
          }
          evaluatedResponses.push({
            questionId: q.id,
            moduleId: q.moduleId,
            selectedOption: selected,
            correctAnswer: q.correctAnswer,
            isCorrect: false,
            marksObtained: penalty
          });
        }
      } else {
        // Unanswered
        const marks = config.marksUnanswered;
        totalScore += marks;
        if (mod) {
          mod.score += marks;
        }
        evaluatedResponses.push({
          questionId: q.id,
          moduleId: q.moduleId,
          selectedOption: null,
          correctAnswer: q.correctAnswer,
          isCorrect: false,
          marksObtained: marks
        });
      }
    }

    // Calculate unanswered counts
    const totalQuestions = allQuestions.length; // 100
    const totalUnanswered = totalQuestions - totalAttempted;

    for (let m = 1; m <= 5; m++) {
      const mod = moduleResults[m];
      mod.unanswered = mod.totalQuestions - mod.attempted;
      // Round scores to 2 decimals
      mod.score = Math.round(mod.score * 100) / 100;
    }

    const maxPossibleMarks = totalQuestions * config.marksPerCorrect;
    const rawPercentage = maxPossibleMarks > 0 ? (totalScore / maxPossibleMarks) * 100 : 0;
    const percentage = Math.max(0, Math.min(100, Math.round(rawPercentage * 100) / 100));
    totalScore = Math.round(totalScore * 100) / 100;

    return {
      totalQuestions,
      totalAttempted,
      totalCorrect,
      totalWrong,
      totalUnanswered,
      totalScore,
      maxPossibleMarks,
      percentage,
      moduleResults,
      evaluatedResponses
    };
  }

  public static calculateModuleScore(
    moduleId: number,
    studentResponses: Array<{ questionId: string; selectedOption: string | null }>,
    config: ScoringConfig = {
      marksPerCorrect: 1.0,
      negativeMarksPerWrong: 0.0,
      marksUnanswered: 0.0
    }
  ) {
    const moduleQuestions = questionService.getQuestionsByModule(moduleId);
    const responsesMap = new Map<string, string | null>();
    studentResponses.forEach((r) => {
      responsesMap.set(r.questionId, r.selectedOption ? r.selectedOption.trim().toUpperCase() : null);
    });

    let attempted = 0;
    let correct = 0;
    let wrong = 0;
    let score = 0;

    const evaluatedList = [];

    for (const q of moduleQuestions) {
      const selected = responsesMap.get(q.id) || null;
      if (selected && ['A', 'B', 'C', 'D'].includes(selected)) {
        attempted += 1;
        if (selected === q.correctAnswer) {
          correct += 1;
          score += config.marksPerCorrect;
          evaluatedList.push({
            questionId: q.id,
            selectedOption: selected,
            isCorrect: true,
            marks: config.marksPerCorrect
          });
        } else {
          wrong += 1;
          const penalty = -Math.abs(config.negativeMarksPerWrong);
          score += penalty;
          evaluatedList.push({
            questionId: q.id,
            selectedOption: selected,
            isCorrect: false,
            marks: penalty
          });
        }
      } else {
        score += config.marksUnanswered;
        evaluatedList.push({
          questionId: q.id,
          selectedOption: null,
          isCorrect: false,
          marks: config.marksUnanswered
        });
      }
    }

    const totalQuestions = moduleQuestions.length;
    const unanswered = totalQuestions - attempted;

    return {
      moduleId,
      totalQuestions,
      attempted,
      correct,
      wrong,
      unanswered,
      score: Math.round(score * 100) / 100,
      evaluatedList
    };
  }
}

