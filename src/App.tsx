import React, { useEffect, useRef, useState, useCallback } from 'react';
import { StickyBallGame } from './game/stickyBallGame';
import { GameStats, StuckObjectInfo } from './types';
import { soundEngine } from './game/audio';
import { GameHUD } from './components/GameHUD';
import { ControlsOverlay } from './components/ControlsOverlay';
import { GameOverModal } from './components/GameOverModal';
import { CatalogModal } from './components/CatalogModal';
import { PauseOverlay } from './components/PauseOverlay';
import { formatBallSize } from './utils/formatters';

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<StickyBallGame | null>(null);

  const [stats, setStats] = useState<GameStats>({
    level: 1,
    score: 0,
    ballRadius: 0.65,
    ballDiameter: 1.3,
    timeRemaining: 600,
    totalObjectsCount: 0,
    collectedCount: 0,
    stuckObjects: [],
    currentBiome: 'forest',
    highScoreDiameter: 0,
    isGameOver: false,
    isPaused: false,
    isVictory: false,
  });

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [recentPickup, setRecentPickup] = useState<StuckObjectInfo | null>(null);
  const [milestoneNotice, setMilestoneNotice] = useState<string | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState<boolean>(false);
  const pickupTimeoutRef = useRef<number | null>(null);
  const milestoneTimeoutRef = useRef<number | null>(null);

  // Initialize Three.js Game
  useEffect(() => {
    if (!containerRef.current) return;

    const game = new StickyBallGame(containerRef.current, {
      onStatsUpdate: (newStats) => {
        setStats(newStats);
      },
      onObjectPickedUp: (item) => {
        setRecentPickup(item);
        if (pickupTimeoutRef.current) {
          clearTimeout(pickupTimeoutRef.current);
        }
        pickupTimeoutRef.current = window.setTimeout(() => {
          setRecentPickup(null);
        }, 1600);
      },
      onMilestoneReached: (diameter) => {
        setMilestoneNotice(`★ ${diameter.toFixed(1)}m Milestone! Ball is growing massive!`);
        if (milestoneTimeoutRef.current) {
          clearTimeout(milestoneTimeoutRef.current);
        }
        milestoneTimeoutRef.current = window.setTimeout(() => {
          setMilestoneNotice(null);
        }, 3200);
      },
      onBiomeChange: (_biome) => {
        // Biome changed
      },
      onGameOver: (finalStats) => {
        setStats(finalStats);
      },
    });

    gameRef.current = game;

    return () => {
      game.destroy();
      gameRef.current = null;
    };
  }, []);

  const handleToggleMute = useCallback(() => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  }, []);

  const handleTogglePause = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.togglePause();
    }
  }, []);

  const handleResetLevel = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.initLevel(stats.level);
    }
  }, [stats.level]);

  const handleNextLevel = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.initLevel(stats.level + 1);
    }
  }, [stats.level]);

  const handleToggleCamera = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.toggleCameraView();
    }
  }, []);

  const handleBoost = useCallback(() => {
    if (gameRef.current) {
      gameRef.current.boost();
    }
  }, []);

  const handleVirtualInput = useCallback((forward: number, turn: number, isBoosting: boolean) => {
    if (gameRef.current) {
      gameRef.current.applyVirtualInput(forward, turn, isBoosting);
    }
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Main Game HUD Layer */}
      <GameHUD
        stats={stats}
        recentPickup={recentPickup}
        milestoneNotice={milestoneNotice}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onTogglePause={handleTogglePause}
        onResetLevel={handleResetLevel}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onToggleCamera={handleToggleCamera}
        onBoost={handleBoost}
      />

      {/* On-screen touch & virtual controls */}
      <ControlsOverlay
        onInput={handleVirtualInput}
        onCameraToggle={handleToggleCamera}
        onBoost={handleBoost}
      />

      {/* Pause Menu */}
      {stats.isPaused && !stats.isGameOver && (
        <PauseOverlay
          stats={stats}
          isMuted={isMuted}
          onResume={handleTogglePause}
          onReset={handleResetLevel}
          onToggleMute={handleToggleMute}
          onOpenCatalog={() => setIsCatalogOpen(true)}
        />
      )}

      {/* Game Over / Level Complete Modal */}
      {stats.isGameOver && (
        <GameOverModal
          stats={stats}
          onNextLevel={handleNextLevel}
          onRetryLevel={handleResetLevel}
          onOpenCatalog={() => setIsCatalogOpen(true)}
        />
      )}

      {/* Collection Catalog Modal */}
      {isCatalogOpen && (
        <CatalogModal
          stuckObjects={stats.stuckObjects}
          onClose={() => setIsCatalogOpen(false)}
        />
      )}
    </div>
  );
}
