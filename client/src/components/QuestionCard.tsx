import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
  question: {
    id: string;
    questionNumber: number;
    question: string;
    options: {
      A: string;
      B: string;
      C: string;
      D: string;
    };
    chapterReference?: string;
  };
  selectedOption: string | null;
  onSelectOption: (option: string | null) => void;
  disabled?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOption,
  onSelectOption,
  disabled = false
}) => {
  const optionKeys = ['A', 'B', 'C', 'D'] as const;

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl border border-slate-800 p-4 sm:p-7 text-white transition-all">
      {/* Header with Q# and Chapter Reference */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-800/80">
        <span className="text-[11px] sm:text-xs font-black tracking-wider uppercase text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/60">
          Question {question.questionNumber} of 20
        </span>
        {question.chapterReference && (
          <span className="flex items-center space-x-1.5 text-[11px] sm:text-xs text-slate-400 truncate max-w-[200px] sm:max-w-none">
            <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{question.chapterReference}</span>
          </span>
        )}
      </div>

      {/* Question Text */}
      <h2 className="text-sm sm:text-base md:text-lg font-semibold text-slate-100 leading-relaxed mb-4 sm:mb-6">
        {question.question}
      </h2>

      {/* Options List */}
      <div className="space-y-2.5 sm:space-y-3">
        {optionKeys.map((key) => {
          const isSelected = selectedOption === key;
          const text = question.options[key];

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectOption(isSelected ? null : key)}
              className={`w-full text-left p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all flex items-start space-x-3 group min-h-[50px] sm:min-h-[56px] select-none ${
                isSelected
                  ? 'border-blue-500 bg-blue-950/70 text-white ring-2 ring-blue-500/30 shadow-md'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-800/60 text-slate-200'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}`}
            >
              {/* Option Letter Badge */}
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-850 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                }`}
              >
                {key}
              </div>

              {/* Option Text */}
              <div className="flex-1 text-xs sm:text-sm md:text-base leading-snug pt-0.5 sm:pt-1">
                {text}
              </div>

              {/* Selection Checkmark */}
              {isSelected && (
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 shrink-0 self-center" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action to clear choice */}
      {selectedOption && !disabled && (
        <div className="mt-3 sm:mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onSelectOption(null)}
            className="text-[11px] sm:text-xs text-slate-400 hover:text-slate-200 underline transition"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
};
