import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Flame, Camera } from 'lucide-react';

interface ControlsOverlayProps {
  onInput: (forward: number, turn: number, isBoosting: boolean) => void;
  onCameraToggle: () => void;
  onBoost: () => void;
}

export const ControlsOverlay: React.FC<ControlsOverlayProps> = ({
  onInput,
  onCameraToggle,
  onBoost,
}) => {
  const joystickRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [touchActive, setTouchActive] = useState(false);

  // Detect touch device or show always in responsive view
  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setTouchActive(true);
    }
  }, []);

  const handlePointerStart = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      if (!isDragging || !joystickRef.current) return;
      const rect = joystickRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const maxDist = rect.width / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      const clampedDist = Math.min(dist, maxDist);
      const angle = Math.atan2(dy, dx);

      const knobX = Math.cos(angle) * clampedDist;
      const knobY = Math.sin(angle) * clampedDist;

      setKnobPos({ x: knobX, y: knobY });

      // Inverted Y because dragging UP (negative Y) means moving FORWARD (+1)
      const forward = -knobY / maxDist;
      const turn = knobX / maxDist;
      onInput(forward, turn, false);
    },
    [isDragging, onInput]
  );

  const handlePointerEnd = (e: React.PointerEvent) => {
    setIsDragging(false);
    setKnobPos({ x: 0, y: 0 });
    onInput(0, 0, false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex justify-between items-end p-6 z-20">
      {/* Left: Virtual Joystick (Visible on mobile/tablets or toggleable) */}
      <div
        id="virtual-joystick-container"
        className={`pointer-events-auto select-none touch-none transition-opacity ${
          touchActive ? 'opacity-90' : 'opacity-40 hover:opacity-90'
        }`}
      >
        <div
          ref={joystickRef}
          onPointerDown={handlePointerStart}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          className="relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-slate-900/60 backdrop-blur-md border-2 border-slate-600/60 flex items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl"
        >
          {/* Inner ring */}
          <div className="w-14 h-14 rounded-full border border-dashed border-slate-500/40 pointer-events-none" />

          {/* Knob */}
          <div
            className="absolute w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 shadow-lg border-2 border-emerald-200 pointer-events-none transition-transform duration-75"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
            }}
          />
        </div>
        <div className="text-[10px] text-center text-slate-400 mt-1 font-medium tracking-wider uppercase pointer-events-none">
          Drag to Roll
        </div>
      </div>

      {/* Right: Action Buttons (Boost Dash & Camera) */}
      <div className="pointer-events-auto flex flex-col items-end gap-3 select-none">
        <button
          id="touch-camera-button"
          onClick={onCameraToggle}
          className="w-12 h-12 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-slate-200 flex items-center justify-center shadow-lg active:scale-95 transition"
        >
          <Camera className="w-5 h-5" />
        </button>

        <button
          id="touch-boost-button"
          onClick={onBoost}
          className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white font-black flex flex-col items-center justify-center shadow-xl border-2 border-amber-200/80 active:scale-90 transition transform"
        >
          <Flame className="w-6 h-6 md:w-7 md:h-7 animate-pulse" />
          <span className="text-[10px] uppercase tracking-wider font-extrabold">Boost</span>
        </button>
      </div>
    </div>
  );
};
