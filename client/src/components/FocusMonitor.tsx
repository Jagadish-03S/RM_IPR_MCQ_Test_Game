import React, { useEffect, useState, useRef } from 'react';
import { ShieldAlert } from 'lucide-react';
import { studentApi } from '../services/api';

interface FocusMonitorProps {
  moduleId: number;
  maxWarnings?: number;
  initialWarnings?: number;
  onWarningCountChange?: (count: number) => void;
  onDisqualified?: () => void;
}

export const FocusMonitor: React.FC<FocusMonitorProps> = ({
  moduleId,
  initialWarnings = 0,
  onWarningCountChange,
  onDisqualified
}) => {
  const [warnings, setWarnings] = useState<number>(initialWarnings);
  const blurTimeRef = useRef<number | null>(null);

  useEffect(() => {
    setWarnings(initialWarnings);
  }, [initialWarnings]);

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        blurTimeRef.current = Date.now();
      } else {
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
        // One switch = out of test!
        if (res.data.disqualified && onDisqualified) {
          onDisqualified();
        }
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
  }, [moduleId, onWarningCountChange, onDisqualified]);

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-[11px] sm:text-xs font-bold border ${
        warnings === 0
          ? 'bg-slate-900/90 text-emerald-400 border-emerald-900/60'
          : 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
      }`}
    >
      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
      <span>
        <span className="sm:hidden">Strict Proctoring</span>
        <span className="hidden sm:inline">
          Strict Proctoring: <strong>0 Tab Switches Allowed</strong> (1 Switch = Out)
        </span>
      </span>
    </div>
  );
};
