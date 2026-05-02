import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../store/AppContext';

export const BreathingUI: React.FC = () => {
  const { mode } = useApp();
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  useEffect(() => {
    if (mode !== 'meditation') return;

    let timeout1: NodeJS.Timeout, timeout2: NodeJS.Timeout, timeout3: NodeJS.Timeout;

    const runCycle = () => {
      setPhase('inhale');
      timeout1 = setTimeout(() => {
        setPhase('hold');
        timeout2 = setTimeout(() => {
          setPhase('exhale');
          timeout3 = setTimeout(runCycle, 4000); // 4s exhale
        }, 4000); // 4s hold
      }, 4000); // 4s inhale
    };

    runCycle();

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [mode]);

  if (mode !== 'meditation') return null;

  const getScale = () => {
    switch (phase) {
      case 'inhale': return 1.5;
      case 'hold': return 1.5;
      case 'exhale': return 1;
    }
  };

  const getMessage = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold': return 'Hold';
      case 'exhale': return 'Breathe Out';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 h-full w-full">
      <div className="relative w-64 h-64 flex items-center justify-center">
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-teal-400/5 border border-teal-400/20 backdrop-blur-md"
          animate={{ scale: getScale() }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-teal-400/10 backdrop-blur-lg"
          animate={{ scale: getScale() }}
          transition={{ duration: 4, ease: "easeInOut", delay: 0.1 }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="z-10 text-xl font-medium tracking-widest text-teal-400"
          >
            {getMessage()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
