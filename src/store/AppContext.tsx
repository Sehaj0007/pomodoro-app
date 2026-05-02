import React, { createContext, useContext, useEffect, useState } from 'react';
import { soundEngine } from '../lib/audio';

export type AppMode = 'focus' | 'break' | 'meditation';
export type BackgroundTheme = 'minimal' | 'rain' | 'night' | 'beach';

export interface AppState {
  mode: AppMode;
  timerRunning: boolean;
  timeLeft: number;
  focusDuration: number;
  breakDuration: number;
  sessionsCompleted: number;
  totalFocusTime: number;
  distractionFree: boolean;
  activeBackground: BackgroundTheme;
  volumes: Record<string, number>;
}

interface AppContextType extends AppState {
  setMode: (mode: AppMode) => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  setFocusDuration: (min: number) => void;
  setBreakDuration: (min: number) => void;
  toggleDistractionFree: () => void;
  setActiveBackground: (bg: BackgroundTheme) => void;
  setVolume: (sound: string, vol: number) => void;
  applyPreset: (preset: 'focus' | 'relax' | 'sleep') => void;
}

const defaultFocusSeconds = 25 * 60;
const defaultBreakSeconds = 5 * 60;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('focus');
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusDuration, setFocusDuration] = useState(defaultFocusSeconds);
  const [breakDuration, setBreakDuration] = useState(defaultBreakSeconds);
  const [timeLeft, setTimeLeft] = useState(defaultFocusSeconds);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalFocusTime, setTotalFocusTime] = useState(0);
  const [distractionFree, setDistractionFree] = useState(false);
  const [activeBackground, setActiveBackground] = useState<BackgroundTheme>('minimal');
  const [volumes, setVolumes] = useState<Record<string, number>>({
    rain: 0,
    ocean: 0,
    whiteNoise: 0,
    forest: 0,
    piano: 0,
  });

  // Load from local storage
  useEffect(() => {
    const savedStats = localStorage.getItem('focusflow_stats');
    if (savedStats) {
      try {
        const { sessions, total } = JSON.parse(savedStats);
        setSessionsCompleted(sessions || 0);
        setTotalFocusTime(total || 0);
      } catch (e) {}
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem('focusflow_stats', JSON.stringify({
      sessions: sessionsCompleted,
      total: totalFocusTime
    }));
  }, [sessionsCompleted, totalFocusTime]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
        if (mode === 'focus') {
          setTotalFocusTime(t => t + 1);
        }
      }, 1000);
    } else if (timerRunning && timeLeft === 0) {
      // Switch modes when timer hits 0
      soundEngine.resume(); // Ensure context is active for a bell sound if we add one
      if (mode === 'focus') {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(() => {});
        setSessionsCompleted(s => s + 1);
        setMode('break');
      } else if (mode === 'break') {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play().catch(() => {});
        setMode('focus');
      }
      setTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, mode]);

  // Handle mode changes resetting timer
  useEffect(() => {
    if (!timerRunning) {
      setTimeLeft(mode === 'focus' ? focusDuration : mode === 'break' ? breakDuration : 0);
    }
  }, [mode, focusDuration, breakDuration]);

  // Apply volumes to sound engine
  useEffect(() => {
    Object.entries(volumes).forEach(([sound, v]) => {
      const vol = v as number;
      if (vol > 0) soundEngine.resume();
      switch (sound) {
        case 'rain': soundEngine.playRain(vol); break;
        case 'ocean': soundEngine.playOcean(vol); break;
        case 'whiteNoise': soundEngine.playWhiteNoise(vol); break;
        case 'forest': soundEngine.playForest(vol); break;
        case 'piano': soundEngine.playPiano(vol); break;
      }
    });
  }, [volumes]);

  const value: AppContextType = {
    mode,
    timerRunning,
    timeLeft,
    focusDuration,
    breakDuration,
    sessionsCompleted,
    totalFocusTime,
    distractionFree,
    activeBackground,
    volumes,
    setMode: (m) => {
      setMode(m);
      setTimerRunning(false);
      if (m === 'focus') setTimeLeft(focusDuration);
      if (m === 'break') setTimeLeft(breakDuration);
    },
    toggleTimer: () => {
      soundEngine.resume(); // unlock audio on click
      setTimerRunning(!timerRunning);
    },
    resetTimer: () => {
      setTimerRunning(false);
      setTimeLeft(mode === 'focus' ? focusDuration : mode === 'break' ? breakDuration : 0);
    },
    setFocusDuration: (sec: number) => {
      setFocusDuration(sec);
      if (mode === 'focus' && !timerRunning) setTimeLeft(sec);
    },
    setBreakDuration: (sec: number) => {
      setBreakDuration(sec);
      if (mode === 'break' && !timerRunning) setTimeLeft(sec);
    },
    toggleDistractionFree: () => setDistractionFree(d => !d),
    setActiveBackground: setActiveBackground,
    setVolume: (sound, vol) => setVolumes(prev => ({ ...prev, [sound]: vol })),
    applyPreset: (preset) => {
      switch (preset) {
        case 'focus':
          setActiveBackground('night');
          setMode('focus');
          setVolumes({ rain: 0.6, ocean: 0, whiteNoise: 0.2, forest: 0, piano: 0 });
          break;
        case 'relax':
          setActiveBackground('minimal');
          setMode('meditation');
          setVolumes({ rain: 0, ocean: 0, whiteNoise: 0, forest: 0, piano: 0.7 });
          break;
        case 'sleep':
          setActiveBackground('beach');
          setMode('break');
          setVolumes({ rain: 0, ocean: 0.5, whiteNoise: 0, forest: 0, piano: 0.4 });
          break;
      }
      setTimerRunning(true);
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within AppProvider');
  return context;
};
