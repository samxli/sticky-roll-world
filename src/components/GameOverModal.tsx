import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw, Sparkles, BookOpen, Clock, Target } from 'lucide-react';
import { GameStats } from '../types';
import { formatBallSize } from '../utils/formatters';

interface GameOverModalProps {
  stats: GameStats;
  onNextLevel: () => void;
  onRetryLevel: () => void;
  onOpenCatalog: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  onNextLevel,
  onRetryLevel,
  onOpenCatalog,
}) => {
  const isNewRecord = stats.ballDiameter >= stats.highScoreDiameter && stats.ballDiameter > 1.3;

  useEffect(() => {
    // Fire festive confetti if new record or victory
    if (isNewRecord || stats.isVictory) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'],
      });
    }
  }, [isNewRecord, stats.isVictory]);

  // Biome counts
  const biomeCounts: Record<string, number> = {};
  stats.stuckObjects.forEach((obj) => {
    biomeCounts[obj.biome] = (biomeCounts[obj.biome] || 0) + 1;
  });

  // Find largest object stuck
  let largestObj = stats.stuckObjects[0];
  stats.stuckObjects.forEach((o) => {
    if (!largestObj || o.radius > largestObj.radius) {
      largestObj = o;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6 text-white text-center">
        {/* Header Badge */}
        <div className="flex flex-col items-center gap-2">
          {stats.isVictory ? (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-sm font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Planet 100% Absorbed!
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-sm font-bold uppercase tracking-wider">
              <Clock className="w-4 h-4 text-amber-400" /> 10-Minute Limit Ended
            </div>
          )}

          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">
            {stats.isVictory ? 'Outstanding Roll!' : 'Final Tally'}
          </h2>
          <p className="text-sm text-slate-400">
            {stats.isVictory
              ? 'You absorbed all objects on the planet before time ran out!'
              : 'The cosmos acknowledges your sticky creation. Here is your final size.'}
          </p>
        </div>

        {/* Big Diameter Card */}
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-inner flex flex-col items-center">
          <span className="text-xs uppercase font-bold tracking-widest text-emerald-400 mb-1">
            Final Ball Diameter
          </span>
          <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-white text-emerald-300">
            {formatBallSize(stats.ballDiameter)}
          </span>

          {/* Record Comparison */}
          <div className="mt-3">
            {isNewRecord ? (
              <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/50 text-amber-300 px-3.5 py-1.5 rounded-full text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>NEW RECORD TO BEAT FOR NEXT LEVEL!</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-400" />
                <span>High score record to beat: <strong className="text-amber-300 font-mono">{formatBallSize(stats.highScoreDiameter)}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-medium">Objects Rolled Up</div>
            <div className="text-lg font-bold text-white mt-0.5">
              {stats.collectedCount} <span className="text-xs text-slate-400">/ {stats.totalObjectsCount}</span>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 font-medium">Total Score</div>
            <div className="text-lg font-bold text-amber-300 mt-0.5 font-mono">
              {stats.score.toLocaleString()} pts
            </div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-3 col-span-2 sm:col-span-1">
            <div className="text-[11px] text-slate-400 font-medium">Largest Item</div>
            <div className="text-sm font-bold text-teal-300 mt-0.5 truncate">
              {largestObj ? largestObj.name : 'None'}
            </div>
          </div>
        </div>

        {/* Biome Breakdown Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {Object.entries(biomeCounts).map(([biome, count]) => (
            <span
              key={biome}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 capitalize"
            >
              {biome}: <strong className="text-emerald-400">{count}</strong>
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <button
            id="modal-next-level-btn"
            onClick={onNextLevel}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-lg flex items-center justify-center gap-2 transition active:scale-98"
          >
            <span>Level {stats.level + 1} (New Planet)</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            id="modal-retry-btn"
            onClick={onRetryLevel}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry</span>
          </button>

          <button
            id="modal-catalog-btn"
            onClick={onOpenCatalog}
            className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm border border-slate-600 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <BookOpen className="w-4 h-4" />
            <span>Catalog</span>
          </button>
        </div>
      </div>
    </div>
  );
};
