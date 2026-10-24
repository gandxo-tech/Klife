/**
 * GTA Cotonou - Mobile & Desktop Landscape HUD
 * Clean, low-occlusion HUD optimized for Android landscape gameplay with Virtual Joystick
 */

import React, { useState, useEffect } from 'react';
import { ActiveMissionState, ActiveVehicle, PlayerStats } from '../game/types.ts';
import { calculateDistance, formatFCFA } from '../game/rules.ts';
import { Minimap } from './Minimap.tsx';
import { VirtualJoystick } from './VirtualJoystick.tsx';
import { sound } from '../game/audio.ts';
import { useFullscreen } from '../hooks/useFullscreen.ts';
import {
  Volume2,
  VolumeX,
  Shield,
  Heart,
  Car,
  MapPin,
  Clock,
  Sparkles,
  Compass,
  Pause,
  Flame,
  Zap,
  RotateCcw,
  Volume1,
  Swords,
  HelpCircle,
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface HUDProps {
  player: PlayerStats;
  vehicles: ActiveVehicle[];
  trafficVehicles?: { x: number; z: number; type: string }[];
  activeVehicle: ActiveVehicle | null;
  activeMission: ActiveMissionState | null;
  notification: string | null;
  interactionTip?: string | null;
  onOpenMissions: () => void;
  onOpenMap: () => void;
  onOpenPause: () => void;
  onOpenCustomizer?: () => void;
  onEnterExitVehicle: () => void;
  onAttack: () => void;
  onHonk?: () => void;
  onVirtualMove: (x: number, z: number) => void;
  onVirtualThrottle?: (throttle: number) => void;
  onVirtualSprint?: (sprint: boolean) => void;
}

export const HUD: React.FC<HUDProps> = ({
  player,
  vehicles,
  trafficVehicles = [],
  activeVehicle,
  activeMission,
  notification,
  interactionTip,
  onOpenMissions,
  onOpenMap,
  onOpenPause,
  onOpenCustomizer,
  onEnterExitVehicle,
  onAttack,
  onHonk,
  onVirtualMove,
  onVirtualThrottle,
  onVirtualSprint,
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isSprinting, setIsSprinting] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [dismissPortraitWarning, setDismissPortraitWarning] = useState(false);
  const [showKeyHelp, setShowKeyHelp] = useState(false);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  // Detect orientation for Android landscape guidance
  useEffect(() => {
    const checkOrientation = () => {
      const portrait = window.innerHeight > window.innerWidth && window.innerWidth < 800;
      setIsPortrait(portrait);
    };
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleSprintToggle = () => {
    const next = !isSprinting;
    setIsSprinting(next);
    onVirtualSprint?.(next);
  };

  // Check if player is close enough to enter a vehicle
  const isNearVehicle = !activeVehicle && vehicles.some((v) => {
    return calculateDistance(player.x, player.z, v.x, v.z) < 3.8;
  });

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-sans p-[env(safe-area-inset-top,12px)] pr-[env(safe-area-inset-right,12px)] pb-[env(safe-area-inset-bottom,12px)] pl-[env(safe-area-inset-left,12px)]">
      {/* 0. PORTRAIT WARNING FOR ANDROID USERS */}
      {isPortrait && !dismissPortraitWarning && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[92vw] max-w-sm bg-amber-500/95 text-slate-950 px-3 py-2 rounded-xl shadow-2xl flex items-center justify-between pointer-events-auto z-50 text-xs font-semibold backdrop-blur border border-amber-300">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 shrink-0 animate-spin" />
            <span>Tournez en mode paysage pour une meilleure maniabilité.</span>
          </div>
          <button
            onClick={() => setDismissPortraitWarning(true)}
            className="p-1 hover:bg-amber-600/50 rounded"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. TOP-LEFT: Mini-Radar & Essential Fast Actions */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-auto z-20">
        {/* Radar Map */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-700/80 bg-slate-950/90">
          <Minimap player={player} vehicles={vehicles} trafficVehicles={trafficVehicles} activeMission={activeMission} size={115} />
        </div>

        {/* Compact Quick Action Bar */}
        <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-xl px-2 py-1 shadow-lg">
          <button
            onClick={onOpenMap}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-sky-600 to-blue-600 active:from-sky-700 active:to-blue-700 hover:brightness-110 text-white font-bold text-[11px] rounded-lg transition shadow"
            title="Carte GPS OpenFreeMap Cotonou (Touche M)"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>GPS</span>
          </button>

          <button
            onClick={onOpenMissions}
            className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500 to-yellow-500 active:from-amber-600 active:to-yellow-600 hover:brightness-110 text-slate-950 font-bold text-[11px] rounded-lg transition shadow"
            title="Missions Cotonou"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Missions</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-indigo-300 hover:text-white transition"
            title={isFullscreen ? 'Quitter le plein écran' : 'Activer le mode plein écran'}
            aria-label="Mode Plein Écran"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-indigo-400" /> : <Maximize2 className="w-4 h-4 text-indigo-400" />}
          </button>

          <button
            onClick={toggleMute}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
            aria-label="Son"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* 2. TOP-CENTER: Active Mission Minimalist Pill */}
      {activeMission && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 max-w-sm md:max-w-md w-[88vw] md:w-auto pointer-events-auto z-10">
          <div className="bg-slate-950/95 backdrop-blur-md border-2 border-amber-500/80 rounded-2xl px-3.5 py-2 shadow-2xl flex items-center justify-between gap-3">
            <div className="flex flex-col truncate">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 flex items-center gap-1 truncate">
                <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                {activeMission.mission.title}
              </span>
              <span className="text-xs font-semibold text-white truncate">
                {activeMission.mission.stages[activeMission.currentStageIndex]?.instruction}
              </span>
            </div>
            <div className="flex items-center gap-1 font-mono text-amber-300 font-extrabold text-xs bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-lg shrink-0">
              <Clock className="w-3 h-3" />
              {Math.max(0, Math.ceil(activeMission.timeLeft))}s
            </div>
          </div>
        </div>
      )}

      {/* 3. TOP-RIGHT: Clean Cash, Wanted Stars, Health & Armor */}
      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 pointer-events-auto z-20">
        <div className="flex items-center gap-2">
          {/* FCFA Cash */}
          <div className="bg-slate-950/90 backdrop-blur-md border border-emerald-500/60 rounded-xl px-3 py-1 shadow-xl">
            <span className="text-emerald-400 text-sm md:text-base font-black tracking-wider font-mono tabular-nums">
              {formatFCFA(player.cashFCFA)}
            </span>
          </div>

          {/* Pause Button */}
          <button
            onClick={onOpenPause}
            className="w-8 h-8 bg-slate-900/90 border border-slate-700/80 rounded-xl flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition shadow"
            title="Pause (Échap)"
            aria-label="Pause"
          >
            <Pause className="w-4 h-4" />
          </button>
        </div>

        {/* Wanted Stars (0 to 5) */}
        <div className="flex items-center gap-0.5 bg-slate-950/85 backdrop-blur-md border border-slate-700/80 rounded-lg px-2 py-1 shadow">
          {[1, 2, 3, 4, 5].map((starIdx) => {
            const isWanted = player.wantedStars >= starIdx;
            return (
              <svg
                key={starIdx}
                className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-300 ${
                  isWanted
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] scale-110 animate-pulse'
                    : 'fill-slate-800 text-slate-700'
                }`}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            );
          })}
        </div>

        {/* Minimal Health & Armor Bars */}
        <div className="w-32 md:w-36 bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1.5 shadow-xl flex flex-col gap-1">
          {/* Health */}
          <div className="flex items-center gap-1.5">
            <Heart className="w-3 h-3 text-emerald-400 shrink-0" />
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-green-400 h-full transition-all duration-150"
                style={{ width: `${Math.max(0, Math.min(100, player.health))}%` }}
              />
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-300 w-5 text-right">
              {Math.ceil(player.health)}
            </span>
          </div>

          {/* Armor */}
          <div className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-sky-400 shrink-0" />
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-cyan-400 h-full transition-all duration-150"
                style={{ width: `${Math.max(0, Math.min(100, player.armor))}%` }}
              />
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-300 w-5 text-right">
              {Math.ceil(player.armor)}
            </span>
          </div>
        </div>
      </div>

      {/* 4. NOTIFICATION TOAST & INTERACTION TIP BANNER */}
      {notification && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 max-w-sm w-[90vw] text-center bg-slate-900/95 backdrop-blur-md border border-amber-500/70 text-amber-200 text-xs md:text-sm font-semibold px-4 py-2 rounded-xl shadow-2xl animate-fade-in pointer-events-auto">
          {notification}
        </div>
      )}

      {interactionTip && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 max-w-md w-[90vw] pointer-events-auto z-40">
          <button
            onClick={onEnterExitVehicle}
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl shadow-2xl border-2 border-white flex items-center justify-between gap-3 animate-pulse hover:scale-105 transition"
          >
            <div className="flex items-center gap-2 text-left truncate">
              <Sparkles className="w-5 h-5 shrink-0" />
              <span className="font-extrabold text-xs md:text-sm truncate">{interactionTip}</span>
            </div>
            <span className="px-2.5 py-1 bg-slate-950 text-amber-300 font-mono font-black text-xs rounded-lg shrink-0">
              ACTION (E)
            </span>
          </button>
        </div>
      )}

      {/* 5. BOTTOM-LEFT: VIRTUAL TOUCH JOYSTICK FOR ANDROID */}
      <div className="absolute bottom-6 left-6 pointer-events-auto z-30">
        <VirtualJoystick onMove={onVirtualMove} size={135} />
      </div>

      {/* 6. BOTTOM-RIGHT: LANDSCAPE ACTION CLUSTER FOR ANDROID */}
      <div className="absolute bottom-6 right-6 pointer-events-auto z-30 flex flex-col items-end gap-3">
        {/* If Driving: Speedometer and Driving Controls */}
        {activeVehicle ? (
          <div className="flex flex-col items-end gap-2.5">
            {/* Speedometer Badge */}
            <div className="bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-1.5 shadow-2xl flex items-center gap-3">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[120px]">
                  {activeVehicle.name}
                </span>
                <div className="w-16 bg-slate-800 rounded-full h-1 overflow-hidden mt-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full"
                    style={{ width: `${Math.max(0, (activeVehicle.health / activeVehicle.maxHealth) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl md:text-3xl font-black font-mono tabular-nums text-white">
                  {Math.floor(Math.abs(activeVehicle.speed) * 2.4)}
                </span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">KM/H</span>
              </div>
            </div>

            {/* Driving Buttons: Horn, Exit, Brake, Gas */}
            <div className="flex items-center gap-2.5">
              {/* Horn Button */}
              <button
                onClick={onHonk}
                className="w-12 h-12 rounded-full bg-slate-900/90 border border-amber-500/60 active:bg-amber-600 active:scale-95 text-amber-400 active:text-white flex items-center justify-center shadow-lg transition"
                aria-label="Klaxonner"
                title="Klaxonner (H)"
              >
                <Volume1 className="w-5 h-5" />
              </button>

              {/* Exit Vehicle Button */}
              <button
                onClick={onEnterExitVehicle}
                className="w-12 h-12 rounded-full bg-slate-900/90 border border-slate-600 active:bg-amber-600 active:scale-95 text-slate-200 active:text-slate-950 flex items-center justify-center shadow-lg transition"
                aria-label="Descendre du véhicule"
                title="Descendre (E)"
              >
                <Car className="w-5 h-5 text-amber-400" />
              </button>

              {/* Brake / Reverse Pedal */}
              <button
                onPointerDown={() => onVirtualThrottle?.(-1)}
                onPointerUp={() => onVirtualThrottle?.(0)}
                onPointerLeave={() => onVirtualThrottle?.(0)}
                className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-700 to-rose-500 active:from-rose-800 active:to-rose-600 text-white font-black text-xs flex flex-col items-center justify-center shadow-2xl active:scale-95 border-2 border-rose-300/80 transition"
                aria-label="Frein et marche arrière"
              >
                <span>FREIN</span>
                <span className="text-[9px] opacity-80">RECUL</span>
              </button>

              {/* Gas / Accelerate Pedal */}
              <button
                onPointerDown={() => onVirtualThrottle?.(1)}
                onPointerUp={() => onVirtualThrottle?.(0)}
                onPointerLeave={() => onVirtualThrottle?.(0)}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 active:from-emerald-700 active:to-teal-500 text-white font-black text-sm flex flex-col items-center justify-center shadow-2xl active:scale-95 border-2 border-emerald-300 transition"
                aria-label="Accélérer"
              >
                <span>GAZ</span>
                <span className="text-[10px] opacity-90">▲▲</span>
              </button>
            </div>
          </div>
        ) : (
          /* If On Foot: Attack, Enter Vehicle, Sprint */
          <div className="flex items-center gap-3">
            {/* Sprint Toggle Button */}
            <button
              onClick={handleSprintToggle}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition active:scale-95 border-2 ${
                isSprinting
                  ? 'bg-sky-500 text-slate-950 border-white shadow-[0_0_15px_rgba(14,165,233,0.8)]'
                  : 'bg-slate-900/90 text-sky-400 border-sky-500/60'
              }`}
              aria-label="Courir / Sprinter"
              title="Courir / Sprinter (Shift)"
            >
              <Zap className="w-5 h-5" />
            </button>

            {/* Enter Vehicle Button (Glows if nearby) */}
            <button
              onClick={onEnterExitVehicle}
              className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-xl transition active:scale-95 border-2 ${
                isNearVehicle
                  ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 border-white shadow-[0_0_20px_rgba(251,191,36,0.9)] ring-2 ring-amber-300/80 animate-pulse'
                  : 'bg-slate-900/90 text-slate-300 border-slate-600/80 active:bg-slate-800'
              }`}
              aria-label="Monter dans un véhicule"
              title="Monter dans un véhicule (E)"
            >
              <Car className="w-6 h-6" />
              <span className="text-[8px] font-black uppercase">Monter</span>
            </button>

            {/* Attack / Punch Button */}
            <button
              onClick={onAttack}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-red-500 active:from-rose-700 active:to-red-600 text-white font-black flex flex-col items-center justify-center shadow-2xl active:scale-95 border-2 border-rose-300 transition"
              aria-label="Attaquer / Frapper"
              title="Attaquer (Clic gauche)"
            >
              <Swords className="w-6 h-6" />
              <span className="text-[8px] uppercase tracking-wider font-extrabold">Frapper</span>
            </button>
          </div>
        )}
      </div>

      {/* 7. DISCREET KEYBOARD SHORTCUT HELPER (Desktop only, low clutter) */}
      <div className="hidden lg:block absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-auto z-10">
        <button
          onClick={() => setShowKeyHelp(!showKeyHelp)}
          className="text-[11px] text-slate-400 hover:text-slate-200 bg-slate-950/70 border border-slate-700/60 rounded-full px-3 py-1 backdrop-blur flex items-center gap-1.5 transition"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Touches clavier (WASD / M / E / Clic)</span>
        </button>

        {showKeyHelp && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-950/95 border border-slate-700 rounded-xl p-3 shadow-2xl flex items-center gap-3 text-xs text-slate-300 whitespace-nowrap">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">WASD</kbd> Déplacements</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">E / F</kbd> Véhicule</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">Clic</kbd> Attaque</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">M</kbd> Carte GPS</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-amber-300">H</kbd> Klaxon</span>
          </div>
        )}
      </div>
    </div>
  );
};
