import React from 'react';
import { useApp } from '../../store/AppContext';
import { formatTime } from '../../lib/utils';
import { Activity, Target } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { totalFocusTime, sessionsCompleted, distractionFree } = useApp();

  if (distractionFree) return null;

  return (
    <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 flex gap-4 z-40 max-w-[calc(100vw-2rem)] overflow-x-auto no-scrollbar">
      <div className="flex gap-4">
        <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[120px] backdrop-blur-sm">
          <div className="text-2xl font-semibold text-slate-100">{sessionsCompleted}</div>
          <div className="text-[10px] uppercase text-slate-500 tracking-wider mt-1">Sessions Today</div>
        </div>
        <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-center min-w-[120px] backdrop-blur-sm">
          <div className="text-2xl font-semibold text-slate-100">{formatTime(totalFocusTime)}</div>
          <div className="text-[10px] uppercase text-slate-500 tracking-wider mt-1">Total Flow</div>
        </div>
      </div>
    </div>
  );
};
