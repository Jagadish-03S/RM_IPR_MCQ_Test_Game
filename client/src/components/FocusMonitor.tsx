import React, { useEffect, useState, useRef } from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { studentApi } from '../services/api';

interface FocusMonitorProps {
  moduleId: number;
  maxWarnings?: number;
  initialWarnings?: number;
  onWarningCountChange?: (count: number) => void;
}

export const FocusMonitor: React.FC<FocusMonitorProps> = ({
  moduleId,
  maxWarnings = 5,
  initialWarnings = 0,
  onWarningCountChange
}) => {
  const [warnings, setWarnings] = useState<number>(initialWarnings);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [lastEventReason, setLastEventReason] = useState<string>('');
  const blurTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setWarnings(initialWarnings);
  }, [initialWarnings]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        // User switched tab or minimized window
        blurTimeRef.current = Date.now();
      } else {
        // User returned to tab
        const durationAway = blurTimeRef.current ? Date.now() - blurTimeRef.current : 0;
        blurTimeRef.current = null;
        await triggerFocusViolation('TAB_SWITCH_OR_MINIMIZE', durationAway);
      }
    };

    const handleWindowBlur = async () => {
      if (!blurTimeRef.current) {
        blurTimeRef.current = Date.now();
      }
    };

    const handleWindowFocus = async () => {
      if (blurTimeRef.current) {
        const durationAway = Date.now() - blurTimeRef.current;
        blurTimeRef.current = null;
        // Only trigger if away for > 400ms to ignore micro-clicks
        if (durationAway > 400) {
          await triggerFocusViolation('WINDOW_FOCUS_LOST', durationAway);
        }
      }
    };

    const triggerFocusViolation = async (type: string, durationMs: number) => {
      try {
        const res = await studentApi.sendFocusEvent(moduleId, type, durationMs);
        const newCount = res.data.totalWarnings;
        setWarnings(newCount);
        if (onWarningCountChange) {
          onWarningCountChange(newCount);
        }
        setLastEventReason(
          type === 'TAB_SWITCH_OR_MINIMIZE'
            ? 'Tab switch or browser window minimize detected.'
            : 'Assessment window lost active focus.'
        );
        setShowWarningModal(true);
      } catch (err) {
        console.error('Failed to report focus event:', err);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [moduleId, onWarningCountChange]);

  return (
    <>
      {/* Persistent Status Badge in Test Header */}
      <div
        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
          warnings === 0
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : warnings < maxWarnings
            ? 'bg-amber-50 text-amber-800 border-amber-300'
            : 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
        }`}
      >
        <ShieldAlert className="w-3.5 h-3.5" />
        <span>
          Focus Integrity: <strong>{warnings}</strong> / {maxWarnings} Warnings
        </span>
      </div>

      {/* Urgent Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-amber-300 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-amber-500 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-white" />
                <h3 className="font-bold text-lg">Integrity Alert: Focus Lost</h3>
              </div>
              <button
                onClick={() => setShowWarningModal(false)}
                className="text-amber-100 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-700 mb-3">
                <strong>Attention:</strong> {lastEventReason}
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1 mb-4">
                <p className="font-semibold">
                  Cumulative Warning Count: <span className="text-base text-amber-700">{warnings}</span> of {maxWarnings} allowed threshold.
                </p>
                <p>
                  Every tab switch, application change, or page blur is logged with an exact timestamp in the university audit transcript for the examiner.
                </p>
              </div>

              <p className="text-xs text-slate-500 mb-6">
                Please remain on this window until you complete and submit your module.
              </p>

              <button
                onClick={() => setShowWarningModal(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg text-sm shadow transition"
              >
                I Understand & Return to Assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

