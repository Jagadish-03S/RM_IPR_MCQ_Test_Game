import React from 'react';

interface QuestionGridProps {
  totalQuestions?: number;
  currentIndex: number;
  answers: Record<string, string | null>;
  questions: Array<{ id: string; questionNumber: number }>;
  onSelectIndex: (index: number) => void;
  variant?: 'grid' | 'ribbon';
}

export const QuestionGrid: React.FC<QuestionGridProps> = ({
  totalQuestions = 20,
  currentIndex,
  answers,
  questions,
  onSelectIndex,
  variant = 'grid'
}) => {
  const answeredCount = questions.filter((q) => answers[q.id] && answers[q.id] !== '').length;

  if (variant === 'ribbon') {
    return (
      <div className="w-full overflow-x-auto pb-1 no-scrollbar select-none">
        <div className="flex items-center space-x-1.5 px-0.5">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(answers[q.id]);
            const isCurrent = idx === currentIndex;

            let btnClass = 'bg-slate-800/80 text-slate-400 border-slate-700/60';
            if (isAnswered) {
              btnClass = 'bg-emerald-600 text-white border-emerald-500 shadow-sm';
            }
            if (isCurrent) {
              btnClass = isAnswered
                ? 'bg-emerald-600 text-white ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-950 font-black'
                : 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-950 font-black';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onSelectIndex(idx)}
                className={`w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-xl font-bold text-xs border transition flex items-center justify-center active:scale-95 ${btnClass}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-800 p-4 sm:p-5 text-white">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Question Navigator
        </h3>
        <span className="text-[11px] font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded-lg border border-blue-800/60">
          {answeredCount} / {totalQuestions} Done
        </span>
      </div>

      {/* Grid of 20 questions */}
      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, idx) => {
          const isAnswered = Boolean(answers[q.id]);
          const isCurrent = idx === currentIndex;

          let btnClass = 'bg-slate-800/80 text-slate-400 hover:bg-slate-700 border-slate-700/80';
          if (isAnswered) {
            btnClass = 'bg-emerald-600 text-white hover:bg-emerald-500 border-emerald-500 shadow-sm';
          }
          if (isCurrent) {
            btnClass = isAnswered
              ? 'bg-emerald-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900'
              : 'bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-900';
          }

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelectIndex(idx)}
              className={`h-9 w-full rounded-xl font-bold text-xs border transition flex items-center justify-center active:scale-95 ${btnClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
};
