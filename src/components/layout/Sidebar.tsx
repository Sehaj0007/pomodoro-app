import React from 'react';
import { useApp } from '../../store/AppContext';
import { Settings2, Volume2, CloudRain, Wind, Trees, Music, Waves } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { 
    mode, setMode, 
    distractionFree, toggleDistractionFree, 
    volumes, setVolume, 
    activeBackground, setActiveBackground, 
    applyPreset,
    focusDuration, setFocusDuration,
    breakDuration, setBreakDuration
  } = useApp();

  const sounds = [
    { id: 'rain', icon: CloudRain, label: 'Rain' },
    { id: 'forest', icon: Trees, label: 'Forest' },
    { id: 'ocean', icon: Waves, label: 'Ocean' },
    { id: 'whiteNoise', icon: Wind, label: 'Noise' },
    { id: 'piano', icon: Music, label: 'Piano' },
  ];

  if (distractionFree) {
    return (
      <button 
        onClick={toggleDistractionFree}
        className="fixed top-6 right-6 p-3 rounded-full bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 backdrop-blur transition-all z-50 text-slate-700 dark:text-slate-300"
      >
        <Settings2 size={20} />
      </button>
    );
  }

  return (
    <div className="absolute right-0 top-0 sm:relative w-full sm:w-[320px] h-full sm:my-6 sm:mr-6 sm:rounded-3xl sm:h-[calc(100%-3rem)] bg-white/5 border border-white/10 backdrop-blur-md p-6 sm:p-8 flex flex-col gap-8 overflow-y-auto no-scrollbar z-40 transition-transform shadow-2xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-slate-100">FocusFlow</h2>
        <button 
          onClick={toggleDistractionFree}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400"
        >
          <Settings2 size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Mode</h3>
        <div className="grid grid-cols-2 gap-2">
          {['focus', 'break', 'meditation'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={cn(
                "py-2 px-3 rounded-xl text-sm font-medium capitalize transition-all border border-transparent",
                mode === m 
                  ? "bg-white/10 text-white border-white/20" 
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Durations</h3>
        <div className="flex gap-4">
          <label className="flex flex-col gap-2 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Focus (min)</span>
            <input 
              type="number" 
              min="1" max="90" 
              className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-slate-100 outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50" 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val > 0) setFocusDuration(val * 60);
              }}
              value={focusDuration / 60}
            />
          </label>
          <label className="flex flex-col gap-2 flex-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-500">Break (min)</span>
            <input 
              type="number" 
              min="1" max="30" 
              className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-sm text-slate-100 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50" 
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (!isNaN(val) && val > 0) setBreakDuration(val * 60);
              }}
              value={breakDuration / 60}
            />
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Presets</h3>
        <div className="grid grid-cols-1 gap-2">
          <button onClick={() => applyPreset('focus')} className="text-left py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-teal-400 font-medium transition-colors border border-transparent hover:border-white/10 text-sm">🧠 Deep Focus</button>
          <button onClick={() => applyPreset('relax')} className="text-left py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-400 font-medium transition-colors border border-transparent hover:border-white/10 text-sm">🌿 Relax & Breathe</button>
          <button onClick={() => applyPreset('sleep')} className="text-left py-2 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-purple-400 font-medium transition-colors border border-transparent hover:border-white/10 text-sm">🌙 Sleep</button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Soundscapes</h3>
        <div className="space-y-5">
          {sounds.map(({ id, icon: Icon, label }) => (
            <div key={id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-100">
                  <Icon size={16} className={volumes[id] > 0 ? "text-teal-400" : "text-slate-500"} />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                {volumes[id] > 0 && <span className="text-xs text-slate-500">{Math.round(volumes[id] * 100)}%</span>}
              </div>
              <div className="relative h-1.5 w-full bg-white/10 rounded-full flex items-center group">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volumes[id]}
                  onChange={(e) => setVolume(id, parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div 
                  className={cn("absolute h-full rounded-full pointer-events-none transition-all", volumes[id] > 0 ? "bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)]" : "")} 
                  style={{ width: `${volumes[id] * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Environment</h3>
        <div className="grid grid-cols-2 gap-2">
          {['minimal', 'rain', 'night', 'beach'].map((bg) => (
            <button
              key={bg}
              onClick={() => setActiveBackground(bg as any)}
              className={cn(
                "py-2 px-3 rounded-xl text-sm font-medium capitalize transition-all border border-transparent",
                activeBackground === bg 
                  ? "bg-white/10 text-white border-white/20" 
                  : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
              )}
            >
              {bg}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
