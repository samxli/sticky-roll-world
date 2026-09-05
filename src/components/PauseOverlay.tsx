import React from 'react';
import { Play, RotateCcw, Volume2, VolumeX, BookOpen, Sparkles } from 'lucide-react';
import { GameStats } from '../types';
import { formatBallSize } from '../utils/formatters';

interface PauseOverlayProps {
  stats: GameStats;
  isMuted: boolean;
  onResume: () => void;
  onReset: () => void;
  onToggleMute: () => void;
  onOpenCatalog: () => void;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({
  stats,
  isMuted,
  onResume,
  onReset,
  onToggleMute,
  onOpenCatalog,
}) => {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 text-white text-center">
        <div className="flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Game Paused
          </div>
          <h2 className="text-2xl font-black text-white mt-1">Sticky Roll World</h2>
          <p className="text-xs text-slate-400">
            Level {stats.level} · Current Diameter: <strong className="text-emerald-300 font-mono">{formatBallSize(stats.ballDiameter)}</strong>
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-left text-xs text-slate-300 space-y-2">
          <div className="font-bold text-white mb-1">Controls Guide:</div>
          <div className="flex justify-between">
            <span className="text-slate-400">Roll Ball</span>
            <span className="font-semibold text-slate-200">WASD / Arrow Keys or Virtual Stick</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Dash Boost</span>
            <span className="font-semibold text-slate-200">Spacebar or Boost Button</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Camera View</span>
            <span className="font-semibold text-slate-200">C Key or Camera Icon</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Pause / Resume</span>
            <span className="font-semibold text-slate-200">P Key</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            id="pause-resume-btn"
            onClick={onResume}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Play className="w-4 h-4" />
            <span>Resume Game</span>
          </button>

          <div className="grid grid-cols-3 gap-2">
            <button
              id="pause-mute-btn"
              onClick={onToggleMute}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              id="pause-catalog-btn"
              onClick={onOpenCatalog}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Catalog</span>
            </button>

            <button
              id="pause-restart-btn"
              onClick={onReset}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
