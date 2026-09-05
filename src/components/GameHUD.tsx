import React from 'react';
import {
  Trophy,
  Timer,
  Trees,
  Building2,
  Snowflake,
  Sun,
  Palmtree,
  Volume2,
  VolumeX,
  Pause,
  Play,
  RotateCcw,
  BookOpen,
  Camera,
  Flame,
} from 'lucide-react';
import { BiomeType, GameStats, StuckObjectInfo } from '../types';
import { formatBallSize, formatTime } from '../utils/formatters';

interface GameHUDProps {
  stats: GameStats;
  recentPickup: StuckObjectInfo | null;
  milestoneNotice: string | null;
  isMuted: boolean;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onResetLevel: () => void;
  onOpenCatalog: () => void;
  onToggleCamera: () => void;
  onBoost: () => void;
}

const BIOME_INFO: Record<BiomeType, { label: string; icon: React.ReactNode; color: string; bg: string; border: string }> = {
  snow: {
    label: 'Snow World',
    icon: <Snowflake className="w-4 h-4 text-blue-300" />,
    color: 'text-blue-200',
    bg: 'bg-sky-950/70',
    border: 'border-sky-500/30',
  },
  city: {
    label: 'City World',
    icon: <Building2 className="w-4 h-4 text-indigo-300" />,
    color: 'text-indigo-200',
    bg: 'bg-indigo-950/70',
    border: 'border-indigo-500/30',
  },
  forest: {
    label: 'Forest World',
    icon: <Trees className="w-4 h-4 text-emerald-300" />,
    color: 'text-emerald-200',
    bg: 'bg-emerald-950/70',
    border: 'border-emerald-500/30',
  },
  desert: {
    label: 'Desert World',
    icon: <Sun className="w-4 h-4 text-amber-300" />,
    color: 'text-amber-200',
    bg: 'bg-amber-950/70',
    border: 'border-amber-500/30',
  },
  beach: {
    label: 'Beach World',
    icon: <Palmtree className="w-4 h-4 text-teal-300" />,
    color: 'text-teal-200',
    bg: 'bg-teal-950/70',
    border: 'border-teal-500/30',
  },
};

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  recentPickup,
  milestoneNotice,
  isMuted,
  onToggleMute,
  onTogglePause,
  onResetLevel,
  onOpenCatalog,
  onToggleCamera,
  onBoost,
}) => {
  const biomeData = BIOME_INFO[stats.currentBiome] || BIOME_INFO.forest;
  const progressPercent = stats.totalObjectsCount > 0
    ? Math.min(100, Math.round((stats.collectedCount / stats.totalObjectsCount) * 100))
    : 0;

  // Time warning if under 60 seconds
  const isTimeCritical = stats.timeRemaining < 60;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 overflow-hidden select-none">
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-3 w-full max-w-7xl mx-auto">
        {/* Left: Current Ball Size */}
        <div className="pointer-events-auto bg-slate-900/80 backdrop-blur-md border border-emerald-500/40 rounded-2xl p-3.5 shadow-xl min-w-[200px] md:min-w-[260px] transition-all">
          <div className="flex items-center justify-between text-xs tracking-wider uppercase text-emerald-400 font-semibold mb-1">
            <span>Ball Diameter</span>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
              Lvl {stats.level}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white tracking-tight font-mono">
            {formatBallSize(stats.ballDiameter)}
          </div>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300">
            <span className="text-slate-400">Score:</span>
            <span className="font-bold text-amber-400">{stats.score.toLocaleString()} pts</span>
          </div>
        </div>

        {/* Center: Timer & Biome */}
        <div className="flex flex-col items-center gap-2">
          {/* 10-Minute Countdown Clock */}
          <div
            className={`pointer-events-auto flex items-center gap-2.5 px-4 py-2 rounded-2xl backdrop-blur-md border shadow-lg transition-all ${
              isTimeCritical
                ? 'bg-rose-950/80 border-rose-500/60 text-rose-300 animate-pulse'
                : 'bg-slate-900/80 border-slate-700/60 text-white'
            }`}
          >
            <Timer className={`w-4 h-4 ${isTimeCritical ? 'text-rose-400' : 'text-slate-400'}`} />
            <div className="flex flex-col items-center leading-none">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Time Limit</span>
              <span className="text-xl md:text-2xl font-black font-mono tracking-wider">
                {formatTime(stats.timeRemaining)}
              </span>
            </div>
          </div>

          {/* Current Biome Indicator */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-md ${biomeData.bg} ${biomeData.border} transition-colors duration-300`}
          >
            {biomeData.icon}
            <span className={`text-xs font-bold ${biomeData.color}`}>{biomeData.label}</span>
          </div>
        </div>

        {/* Right: High Score & Quick Controls */}
        <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
          {/* Record to beat */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-amber-500/40 rounded-2xl p-3 shadow-xl min-w-[170px] md:min-w-[210px] text-right">
            <div className="flex items-center justify-end gap-1.5 text-xs tracking-wider uppercase text-amber-400 font-semibold mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Record to Beat</span>
            </div>
            <div className="text-lg md:text-xl font-black text-amber-300 font-mono">
              {stats.highScoreDiameter > 0 ? formatBallSize(stats.highScoreDiameter) : 'None yet'}
            </div>
          </div>

          {/* Utility Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 p-1.5 rounded-xl shadow-lg">
            <button
              id="catalog-button"
              onClick={onOpenCatalog}
              title="Collection Catalog"
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <BookOpen className="w-4 h-4" />
            </button>
            <button
              id="camera-view-button"
              onClick={onToggleCamera}
              title="Toggle Camera View (C)"
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              id="mute-button"
              onClick={onToggleMute}
              title="Toggle Sound (M)"
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              id="pause-button"
              onClick={onTogglePause}
              title="Pause Game (P)"
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              {stats.isPaused ? <Play className="w-4 h-4 text-amber-400" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              id="reset-level-button"
              onClick={onResetLevel}
              title="Restart Planet Level"
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Middle Banner Notifications: Milestones & Pickups */}
      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none my-auto">
        {milestoneNotice && (
          <div className="animate-bounce bg-gradient-to-r from-amber-500/90 via-orange-500/90 to-amber-500/90 text-white font-black text-sm md:text-base px-6 py-2.5 rounded-full shadow-2xl border border-amber-300 backdrop-blur-md">
            {milestoneNotice}
          </div>
        )}

        {recentPickup && (
          <div className="bg-slate-900/85 backdrop-blur-md border border-emerald-500/50 text-white px-4 py-1.5 rounded-xl shadow-lg flex items-center gap-2.5 animate-pulse text-xs md:text-sm">
            <span className="text-emerald-400 font-bold">★ Picked up:</span>
            <span className="font-semibold text-slate-100">{recentPickup.name}</span>
            <span className="text-emerald-300 font-mono text-xs">({formatBallSize(recentPickup.radius * 2)})</span>
          </div>
        )}
      </div>

      {/* Bottom Status & Progress Bar */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-2 pointer-events-auto">
        {/* Progress Bar */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-2xl p-3 shadow-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <span>Planet Cleaned:</span>
              <strong className="text-emerald-400 font-bold">
                {stats.collectedCount} / {stats.totalObjectsCount}
              </strong>
              <span className="text-slate-400">({progressPercent}%)</span>
            </span>
            <span className="text-slate-400 hidden sm:inline text-[11px]">
              Roll over smaller items to grow · Touch bigger items once you're large enough!
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Keyboard instructions badge */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 bg-slate-950/60 backdrop-blur-sm py-1.5 px-4 rounded-full mx-auto border border-slate-800">
          <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">W</kbd><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 ml-0.5">A</kbd><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 ml-0.5">S</kbd><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 ml-0.5">D</kbd> or <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Arrows</kbd> to Roll</span>
          <span>•</span>
          <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Space</kbd> Boost Dash</span>
          <span>•</span>
          <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">C</kbd> Camera</span>
        </div>
      </div>
    </div>
  );
};
