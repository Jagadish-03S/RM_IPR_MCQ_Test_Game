import React from 'react';
import { AlertCircle, CheckCircle, Lock, ArrowRight } from 'lucide-react';

interface ModuleSubmitModalProps {
  isOpen: boolean;
  moduleId: number;
  moduleTitle: string;
  totalQuestions: number;
  answeredCount: number;
  isFinalModule: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ModuleSubmitModal: React.FC<ModuleSubmitModalProps> = ({
  isOpen,
  moduleId,
  moduleTitle,
  totalQuestions,
  answeredCount,
  isFinalModule,
  isSubmitting,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-white">
        {/* Header */}
        <div className="bg-slate-950/90 px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center space-x-3">
          <div className="p-2 bg-blue-600/30 rounded-xl text-blue-400 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm sm:text-base truncate">
              Submit Module {moduleId}: Confirmation
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-400 truncate">{moduleTitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3 sm:p-4 text-center">
              <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xl sm:text-2xl font-black text-emerald-300">{answeredCount}</div>
              <div className="text-[11px] text-emerald-400 font-semibold">Answered</div>
            </div>

            <div
              className={`rounded-xl p-3 sm:p-4 text-center border ${
                unansweredCount > 0
                  ? 'bg-amber-950/40 border-amber-800/60'
                  : 'bg-slate-800/50 border-slate-700'
              }`}
            >
              <AlertCircle
                className={`w-5 h-5 mx-auto mb-1 ${
                  unansweredCount > 0 ? 'text-amber-400' : 'text-slate-400'
                }`}
              />
              <div
                className={`text-xl sm:text-2xl font-black ${
                  unansweredCount > 0 ? 'text-amber-300' : 'text-slate-300'
                }`}
              >
                {unansweredCount}
              </div>
              <div
                className={`text-[11px] font-semibold ${
                  unansweredCount > 0 ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                Unanswered
              </div>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="bg-amber-950/50 border-l-4 border-amber-500 p-3 text-xs text-amber-200 rounded-r-xl">
              <p className="font-bold">You have {unansweredCount} unanswered question(s).</p>
              <p className="text-[11px] text-amber-300/90 mt-0.5">
                Unanswered questions receive 0 marks. You can still return to answer them.
              </p>
            </div>
          )}

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-[11px] sm:text-xs text-slate-300 space-y-1">
            <p className="font-bold text-white">Important Examination Rules:</p>
            <p>1. Once submitted, answers for Module {moduleId} are locked permanently.</p>
            <p>
              2.{' '}
              {isFinalModule
                ? 'This is the 5th and final module. Submitting will calculate your final score.'
                : `After submitting, Module ${moduleId + 1} will unlock immediately.`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2 sm:gap-3 pt-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs sm:text-sm font-semibold transition text-center"
            >
              Return to Review
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/40 transition flex items-center justify-center space-x-2 active:scale-98"
            >
              {isSubmitting ? (
                <span>Submitting Module...</span>
              ) : (
                <>
                  <span>{isFinalModule ? 'Finish Complete Assessment' : `Confirm Submit Module ${moduleId}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
