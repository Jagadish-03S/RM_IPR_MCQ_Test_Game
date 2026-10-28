import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  initialMinutes: number;
  startedAt?: string | null;
  onTimeExpired: () => void;
}

export const Timer: React.FC<TimerProps> = ({ initialMinutes, startedAt, onTimeExpired }) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (startedAt) {
      const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
      const total = initialMinutes * 60;
      return Math.max(0, total - elapsed);
    }
    return initialMinutes * 60;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeExpired]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  const isCritical = secondsRemaining < 180; // < 3 mins
  const isUrgent = secondsRemaining < 60; // < 1 min

  return (
    <div
      className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-mono text-sm font-semibold border transition-colors ${
        isUrgent
          ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
          : isCritical
          ? 'bg-amber-100 text-amber-900 border-amber-300'
          : 'bg-slate-100 text-slate-800 border-slate-300'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

