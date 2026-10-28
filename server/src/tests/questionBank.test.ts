import { describe, it, expect } from 'vitest';
import { questionService } from '../services/questionService';

describe('RM & IPR Question Bank Integrity Verification', () => {
  const allQuestions = questionService.getAllQuestions();

  it('should contain exactly 100 questions total', () => {
    expect(allQuestions).toHaveLength(100);
  });

  it('should contain exactly 20 questions per module across all 5 modules', () => {
    for (let m = 1; m <= 5; m++) {
      const moduleQuestions = questionService.getQuestionsByModule(m);
      expect(moduleQuestions).toHaveLength(20);
    }
  });

  it('should have unique IDs for all 100 questions', () => {
    const ids = allQuestions.map((q) => q.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(100);
  });

  it('should have valid 4 options (A, B, C, D) and a valid single correct answer for every question', () => {
    allQuestions.forEach((q) => {
      expect(q.question).toBeDefined();
      expect(q.question.trim().length).toBeGreaterThan(10);

      expect(q.options).toBeDefined();
      expect(q.options.A).toBeDefined();
      expect(q.options.B).toBeDefined();
      expect(q.options.C).toBeDefined();
      expect(q.options.D).toBeDefined();
      expect(q.options.A.trim().length).toBeGreaterThan(0);
      expect(q.options.B.trim().length).toBeGreaterThan(0);
      expect(q.options.C.trim().length).toBeGreaterThan(0);
      expect(q.options.D.trim().length).toBeGreaterThan(0);

      expect(['A', 'B', 'C', 'D']).toContain(q.correctAnswer);
      expect(q.explanation).toBeDefined();
      expect(q.explanation.trim().length).toBeGreaterThan(5);

      expect(q.chapterReference).toBeDefined();
      expect(q.pageReference).toBeGreaterThanOrEqual(1);
    });
  });

  it('should strictly strip correctAnswer and explanation from public questions', () => {
    for (let m = 1; m <= 5; m++) {
      const publicQuestions = questionService.getPublicModuleQuestions(m);
      expect(publicQuestions).toHaveLength(20);
      publicQuestions.forEach((pq: any) => {
        expect(pq.correctAnswer).toBeUndefined();
        expect(pq.explanation).toBeUndefined();
        expect(pq.options).toBeDefined();
        expect(pq.question).toBeDefined();
      });
    }
  });
});

