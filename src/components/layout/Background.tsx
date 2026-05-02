import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../store/AppContext';
import { cn } from '../../lib/utils';

export const Background: React.FC = () => {
  const { activeBackground } = useApp();

  const backgrounds = {
    minimal: 'bg-[#09090B]',
    rain: 'bg-gradient-to-b from-[#09090B] to-slate-950',
    night: 'bg-gradient-to-tr from-indigo-950/20 via-[#09090B] to-black',
    beach: 'bg-gradient-to-t from-teal-950/20 to-[#09090B]',
  };

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-teal-900/10 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-900/10 blur-[100px]"></div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBackground}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className={cn("absolute inset-0 w-full h-full", backgrounds[activeBackground])}
        >
          {activeBackground === 'rain' && <RainOverlay />}
          {activeBackground === 'night' && <StarsOverlay />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const RainOverlay = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-30">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white/40 w-[1px]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20}%`,
            height: `${Math.random() * 20 + 20}px`
          }}
          animate={{
            y: ['0vh', '120vh'],
          }}
          transition={{
            duration: Math.random() * 0.5 + 0.5,
            repeat: Infinity,
            ease: 'linear',
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};

const StarsOverlay = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 100 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
          }}
          animate={{
            opacity: [0.1, 0.8, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 2
          }}
        />
      ))}
    </div>
  );
};
