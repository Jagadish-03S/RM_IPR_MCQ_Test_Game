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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
      {/* Header with Q# and Chapter Reference */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-4 border-b border-slate-100">
        <span className="text-xs font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
          Question {question.questionNumber} of 20
        </span>
        {question.chapterReference && (
          <span className="flex items-center space-x-1.5 text-xs text-slate-500">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>{question.chapterReference}</span>
          </span>
        )}
      </div>

      {/* Question Text */}
      <h2 className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed mb-6">
        {question.question}
      </h2>

      {/* Options List */}
      <div className="space-y-3">
        {optionKeys.map((key) => {
          const isSelected = selectedOption === key;
          const text = question.options[key];

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onSelectOption(isSelected ? null : key)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-start space-x-3.5 group ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-2 ring-blue-600/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 text-slate-800'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Option Letter Badge */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                }`}
              >
                {key}
              </div>

              {/* Option Text */}
              <div className="flex-1 text-sm sm:text-base leading-snug pt-0.5">
                {text}
              </div>

              {/* Selection Checkmark */}
              {isSelected && (
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 self-center" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action to clear choice */}
      {selectedOption && !disabled && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onSelectOption(null)}
            className="text-xs text-slate-400 hover:text-slate-600 underline transition"
          >
            Clear Selected Answer
          </button>
        </div>
      )}
    </div>
  );
};

