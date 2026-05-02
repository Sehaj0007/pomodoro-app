/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './store/AppContext';
import { Background } from './components/layout/Background';
import { Sidebar } from './components/layout/Sidebar';
import { Timer } from './components/timer/Timer';
import { BreathingUI } from './components/meditation/BreathingUI';
import { Dashboard } from './components/dashboard/Dashboard';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from './lib/utils';

const MainScreen = () => {
  const { mode, activeBackground } = useApp();

  return (
    <div className="flex w-full h-full relative overflow-hidden transition-colors duration-1000 text-slate-100">
      <Background />
      
      <div className="flex-1 flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {mode === 'meditation' ? (
            <motion.div
              key="meditation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <BreathingUI />
            </motion.div>
          ) : (
            <motion.div
              key="timer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Timer />
            </motion.div>
          )}
        </AnimatePresence>
        <Dashboard />
      </div>

      <Sidebar />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}
