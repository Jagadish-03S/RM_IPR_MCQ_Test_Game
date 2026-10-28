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
    <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center space-x-3">
          <div className="p-2 bg-blue-600/40 rounded-lg text-blue-300">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">
              Submit Module {moduleId}: Final Confirmation
            </h3>
            <p className="text-xs text-slate-400">{moduleTitle}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
              <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-emerald-800">{answeredCount}</div>
              <div className="text-xs text-emerald-600 font-medium">Answered</div>
            </div>

            <div
              className={`rounded-xl p-4 text-center border ${
                unansweredCount > 0
                  ? 'bg-amber-50 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <AlertCircle
                className={`w-5 h-5 mx-auto mb-1 ${
                  unansweredCount > 0 ? 'text-amber-600' : 'text-slate-400'
                }`}
              />
              <div
                className={`text-2xl font-bold ${
                  unansweredCount > 0 ? 'text-amber-800' : 'text-slate-700'
                }`}
              >
                {unansweredCount}
              </div>
              <div
                className={`text-xs font-medium ${
                  unansweredCount > 0 ? 'text-amber-600' : 'text-slate-500'
                }`}
              >
                Unanswered
              </div>
            </div>
          </div>

          {unansweredCount > 0 && (
            <div className="mb-4 bg-amber-50 border-l-4 border-amber-500 p-3 text-xs text-amber-900 rounded-r">
              <p className="font-semibold">You have {unansweredCount} unanswered question(s).</p>
              <p>Unanswered questions receive 0 marks. You can return to answer them before submitting.</p>
            </div>
          )}

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600 space-y-1 mb-6">
            <p className="font-semibold text-slate-800">Please Note:</p>
            <p>1. Once submitted, your answers for Module {moduleId} will be permanently locked.</p>
            <p>
              2.{' '}
              {isFinalModule
                ? 'This is the 5th and final module. Submitting will end the entire 100-mark test.'
                : `After submission, Module ${moduleId + 1} will unlock immediately.`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onCancel}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition"
            >
              Return to Review
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow transition flex items-center space-x-2"
            >
              {isSubmitting ? (
                <span>Submitting Module...</span>
              ) : (
                <>
                  <span>{isFinalModule ? 'Submit Complete Assessment' : `Confirm & Submit Module ${moduleId}`}</span>
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

