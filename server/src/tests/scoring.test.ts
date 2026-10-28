import { describe, it, expect } from 'vitest';
import { ScoringService } from '../services/scoringService';
import { questionService } from '../services/questionService';

describe('Automatic Scoring Engine Verification', () => {
  const allQuestions = questionService.getAllQuestions();

  it('should compute 100/100 (100%) when all questions are answered correctly', () => {
    const perfectResponses = allQuestions.map((q) => ({
      questionId: q.id,
      selectedOption: q.correctAnswer
    }));

    const result = ScoringService.calculateScores(perfectResponses);

    expect(result.totalQuestions).toBe(100);
    expect(result.totalAttempted).toBe(100);
    expect(result.totalCorrect).toBe(100);
    expect(result.totalWrong).toBe(0);
    expect(result.totalUnanswered).toBe(0);
    expect(result.totalScore).toBe(100);
    expect(result.percentage).toBe(100);

    for (let m = 1; m <= 5; m++) {
      expect(result.moduleResults[m].score).toBe(20);
      expect(result.moduleResults[m].correct).toBe(20);
      expect(result.moduleResults[m].attempted).toBe(20);
      expect(result.moduleResults[m].unanswered).toBe(0);
    }
  });

  it('should compute 0 marks when no questions are answered', () => {
    const emptyResponses: any[] = [];
    const result = ScoringService.calculateScores(emptyResponses);

    expect(result.totalQuestions).toBe(100);
    expect(result.totalAttempted).toBe(0);
    expect(result.totalCorrect).toBe(0);
    expect(result.totalWrong).toBe(0);
    expect(result.totalUnanswered).toBe(100);
    expect(result.totalScore).toBe(0);
    expect(result.percentage).toBe(0);
  });

  it('should correctly satisfy Attempted = Correct + Wrong and Unanswered = Total - Attempted', () => {
    const mixedResponses = allQuestions.slice(0, 50).map((q, idx) => ({
      questionId: q.id,
      selectedOption: idx % 2 === 0 ? q.correctAnswer : (q.correctAnswer === 'A' ? 'B' : 'A')
    }));

    const result = ScoringService.calculateScores(mixedResponses);

    expect(result.totalAttempted).toBe(50);
    expect(result.totalAttempted).toBe(result.totalCorrect + result.totalWrong);
    expect(result.totalUnanswered).toBe(result.totalQuestions - result.totalAttempted);
    expect(result.totalUnanswered).toBe(50);
    expect(result.totalCorrect).toBe(25);
    expect(result.totalWrong).toBe(25);
    expect(result.totalScore).toBe(25);
    expect(result.percentage).toBe(25);
  });

  it('should compute single module score accurately', () => {
    const mod1Questions = questionService.getQuestionsByModule(1);
    const mod1Responses = mod1Questions.slice(0, 15).map((q, idx) => ({
      questionId: q.id,
      selectedOption: idx < 10 ? q.correctAnswer : (q.correctAnswer === 'A' ? 'B' : 'A')
    }));

    const modResult = ScoringService.calculateModuleScore(1, mod1Responses);

    expect(modResult.moduleId).toBe(1);
    expect(modResult.totalQuestions).toBe(20);
    expect(modResult.attempted).toBe(15);
    expect(modResult.correct).toBe(10);
    expect(modResult.wrong).toBe(5);
    expect(modResult.unanswered).toBe(5);
    expect(modResult.score).toBe(10);
  });
});

