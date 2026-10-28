import React from 'react';

interface QuestionGridProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, string | null>;
  questions: Array<{ id: string; questionNumber: number }>;
  onSelectIndex: (index: number) => void;
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({
  totalQuestions = 20,
  currentIndex,
  answers,
  questions,
  onSelectIndex
}) => {
  const answeredCount = questions.filter((q) => answers[q.id] && answers[q.id] !== '').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Question Navigator
        </h3>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          {answeredCount} / {totalQuestions} Answered
        </span>
      </div>

      {/* Grid of 20 questions */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const isAnswered = Boolean(answers[q.id]);
          const isCurrent = idx === currentIndex;

          let btnClass = 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200';
          if (isAnswered) {
            btnClass = 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600 shadow-sm';
          }
          if (isCurrent) {
            btnClass = isAnswered
              ? 'bg-emerald-600 text-white ring-2 ring-blue-500 ring-offset-2'
              : 'bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`h-9 w-full rounded-lg font-semibold text-xs border transition flex items-center justify-center ${btnClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300"></span>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>Active</span>
        </div>
      </div>
    </div>
  );
};

