/**
 * GTA Cotonou - Virtual Analog Touch Joystick for Mobile / Android
 * Smooth 360-degree analog control optimized for landscape viewports
 * Supports unified Pointer Events (Touch, Stylus, and Mouse)
 */

import React, { useRef, useState, useCallback, useEffect } from 'react';

interface VirtualJoystickProps {
  onMove: (x: number, z: number) => void;
  size?: number;
}

export const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ onMove, size = 130 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activePointerId, setActivePointerId] = useState<number | null>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const radius = size / 2;
  const maxDistance = radius - 18;

  const updateKnob = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const clampedDist = Math.min(dist, maxDistance);
    const angle = Math.atan2(dy, dx);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    setKnobPos({ x: knobX, y: knobY });

    // Output normalized coordinates:
    // x: steer (-1 to 1)
    // z: move forward/back (-1 to 1, where -dy is forward)
    const normX = knobX / maxDistance;
    const normZ = -knobY / maxDistance; // Invert Y so up is forward (+Z)

    onMove(normX, normZ);
  }, [maxDistance, onMove]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (activePointerId !== null) return;
    setActivePointerId(e.pointerId);
    setIsActive(true);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId === null || e.pointerId !== activePointerId) return;
    e.preventDefault();
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerId === null || e.pointerId !== activePointerId) return;
    e.preventDefault();
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
    setActivePointerId(null);
    setIsActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMove(0, 0);
  };

  // Global safety reset if pointer leaves window
  useEffect(() => {
    const handleGlobalCancel = () => {
      if (activePointerId !== null) {
        setActivePointerId(null);
        setIsActive(false);
        setKnobPos({ x: 0, y: 0 });
        onMove(0, 0);
      }
    };

    window.addEventListener('pointercancel', handleGlobalCancel);
    window.addEventListener('pointerup', handleGlobalCancel);
    return () => {
      window.removeEventListener('pointercancel', handleGlobalCancel);
      window.removeEventListener('pointerup', handleGlobalCancel);
    };
  }, [activePointerId, onMove]);

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ width: size, height: size }}
      className={`relative rounded-full border-2 select-none touch-none transition-all duration-150 flex items-center justify-center cursor-pointer ${
        isActive
          ? 'bg-slate-950/80 border-amber-400 shadow-[0_0_25px_rgba(251,191,36,0.5)] scale-105'
          : 'bg-slate-950/50 border-slate-600/70 shadow-2xl backdrop-blur-sm'
      }`}
      aria-label="Joystick tactile analogique"
    >
      {/* Directional ticks */}
      <div className="absolute top-2 w-1.5 h-3 bg-amber-400/60 rounded-full" />
      <div className="absolute bottom-2 w-1.5 h-3 bg-slate-500/50 rounded-full" />
      <div className="absolute left-2 w-3 h-1.5 bg-slate-500/50 rounded-full" />
      <div className="absolute right-2 w-3 h-1.5 bg-slate-500/50 rounded-full" />

      {/* Outer subtle guide ring */}
      <div className="absolute inset-3 rounded-full border border-dashed border-slate-700/50 pointer-events-none" />

      {/* Analog thumb knob */}
      <div
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          width: size * 0.44,
          height: size * 0.44,
        }}
        className={`rounded-full shadow-2xl flex items-center justify-center transition-transform duration-75 border-2 pointer-events-none ${
          isActive
            ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 border-white text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.8)]'
            : 'bg-gradient-to-tr from-slate-800 to-slate-700 border-slate-500/80 text-slate-400'
        }`}
      >
        <div className={`w-4 h-4 rounded-full ${isActive ? 'bg-white/60' : 'bg-slate-400/30'}`} />
      </div>
    </div>
  );
};
