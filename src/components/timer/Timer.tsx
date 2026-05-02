import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { useApp } from '../../store/AppContext';
import { formatTime, cn } from '../../lib/utils';

export const Timer: React.FC = () => {
  const { mode, timeLeft, timerRunning, focusDuration, breakDuration, toggleTimer, resetTimer } = useApp();

  const totalTime = mode === 'focus' ? focusDuration : mode === 'break' ? breakDuration : 100;
  const progress = mode === 'meditation' ? 100 : (1 - timeLeft / totalTime) * 100;

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Circular Progress */}
      <div className="relative w-80 h-80 md:w-[400px] md:h-[400px] flex items-center justify-center">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-white/5"
            strokeWidth="1"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            className={cn(
              "stroke-current transition-colors duration-1000",
              mode === 'focus' ? "text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" : mode === 'break' ? "text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" : "text-transparent"
            )}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 300" }}
            animate={{ strokeDasharray: `${progress * 2.8} 300` }}
            transition={{ ease: "linear", duration: 1 }}
          />
        </svg>

        <div className="flex flex-col items-center z-10">
          <span className="text-xs uppercase tracking-[0.4em] text-slate-500 mb-2">
            {mode === 'focus' ? 'Focus Session' : mode === 'break' ? 'Break Session' : 'Ready'}
          </span>
          <motion.span 
            className="text-7xl md:text-8xl font-light tracking-tighter tabular-nums"
            animate={{ scale: timerRunning ? 1.05 : 1 }}
            transition={{ duration: 0.5 }}
          >
            {formatTime(timeLeft)}
          </motion.span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-4">
        <button
          onClick={resetTimer}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
        >
          <RotateCcw size={22} />
        </button>
        <button
          onClick={toggleTimer}
          className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-black shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all text-2xl"
        >
          {timerRunning ? <Pause size={32} className="fill-current" /> : <Play size={32} className="ml-1 fill-current" />}
        </button>
      </div>
    </div>
  );
};
