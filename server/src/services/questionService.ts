import fs from 'fs';
import path from 'path';

export interface Question {
  id: string;
  moduleId: number;
  moduleTitle: string;
  questionNumber: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  chapterReference: string;
  pageReference: number;
}

export interface PublicQuestion {
  id: string;
  moduleId: number;
  moduleTitle: string;
  questionNumber: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  chapterReference: string;
}

class QuestionService {
  private questions: Question[] = [];

  constructor() {
    this.loadQuestions();
  }

  private loadQuestions() {
    const possiblePaths = [
      path.resolve(__dirname, '../../../data/question-bank.json'),
      path.resolve(__dirname, '../../data/question-bank.json'),
      path.resolve(process.cwd(), 'data/question-bank.json'),
      path.resolve(process.cwd(), '../data/question-bank.json')
    ];

    let loaded = false;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        try {
          const raw = fs.readFileSync(p, 'utf-8');
          this.questions = JSON.parse(raw);
          loaded = true;
          break;
        } catch (err) {
          console.error(`Error reading question bank at ${p}:`, err);
        }
      }
    }

    if (!loaded || this.questions.length === 0) {
      throw new Error('Failed to load question-bank.json from any known path.');
    }
  }

  public getAllQuestions(): Question[] {
    return [...this.questions];
  }

  public getQuestionById(id: string): Question | undefined {
    return this.questions.find((q) => q.id === id);
  }

  public getQuestionsByModule(moduleId: number): Question[] {
    return this.questions.filter((q) => q.moduleId === moduleId);
  }

  public getPublicModuleQuestions(moduleId: number): PublicQuestion[] {
    return this.getQuestionsByModule(moduleId).map((q) => ({
      id: q.id,
      moduleId: q.moduleId,
      moduleTitle: q.moduleTitle,
      questionNumber: q.questionNumber,
      question: q.question,
      options: { ...q.options },
      chapterReference: q.chapterReference
    }));
  }

  public getModuleTitle(moduleId: number): string {
    const q = this.questions.find((item) => item.moduleId === moduleId);
    return q ? q.moduleTitle : `Module ${moduleId}`;
  }
}

export const questionService = new QuestionService();

