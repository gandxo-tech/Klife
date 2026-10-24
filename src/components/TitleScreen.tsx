import React from 'react';
import { MISSIONS } from '../game/missions.ts';
import { Play, Sparkles, ShieldCheck, HelpCircle, Compass, Maximize2, Minimize2, Smartphone } from 'lucide-react';
import { useFullscreen } from '../hooks/useFullscreen.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface TitleScreenProps {
  onStartGame: () => void;
  onSelectMission: (missionId: string) => void;
  onOpenHowToPlay: () => void;
  onOpenMap?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onSelectMission,
  onOpenHowToPlay,
  onOpenMap,
}) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-4 md:p-12 pointer-events-none select-none font-sans overflow-hidden">
      {/* Top Header: Badge, Fullscreen & Status */}
      <div className="flex flex-wrap items-center justify-between gap-2 pointer-events-auto z-10">
        <div className="flex items-center gap-2 bg-slate-950/80 border border-amber-500/50 rounded-full px-3.5 py-1 text-xs font-semibold text-amber-300 shadow backdrop-blur">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">ÉDITION BÉNIN · MONDE OUVERT 3D</span>
        </div>

        <div className="flex items-center gap-2">
          {/* PWA Installation Button */}
          <PWAInstallButton />

          {/* Fullscreen Button for Android Mobile */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 bg-indigo-950/90 hover:bg-indigo-900 border border-indigo-500/80 text-indigo-200 hover:text-white rounded-full px-3.5 py-1 text-xs font-bold transition shadow active:scale-95"
            title="Activer/Désactiver le mode plein écran"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Quitter Plein Écran</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>📱 Plein Écran Android</span>
              </>
            )}
          </button>

          {onOpenMap && (
            <button
              onClick={onOpenMap}
              className="flex items-center gap-1.5 bg-sky-950/80 hover:bg-sky-900/90 border border-sky-500/80 rounded-full px-3.5 py-1 text-xs text-sky-200 hover:text-white transition shadow"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden sm:inline">Carte OpenFreeMap</span>
              <span className="sm:hidden">GPS</span>
            </button>
          )}

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-full px-3 py-1 text-xs text-slate-300 hover:text-white transition shadow"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Commandes</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: Bespoke SVG Title Lockup */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-auto text-center max-w-2xl mx-auto py-2">
        {/* Inline SVG Title Lockup */}
        <div className="w-full max-w-lg mb-2 drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]">
          <svg viewBox="0 0 500 120" className="w-full h-auto">
            <defs>
              <linearGradient id="gtaTitleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#EF4444" />
              </linearGradient>
              <linearGradient id="viceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
            </defs>
            <text
              x="250"
              y="58"
              textAnchor="middle"
              fill="url(#gtaTitleGrad)"
              fontFamily="Chakra Petch, Impact, sans-serif"
              fontWeight="900"
              fontSize="68"
              letterSpacing="3"
              stroke="#000000"
              strokeWidth="5"
              paintOrder="stroke fill"
            >
              GTA COTONOU
            </text>
            <text
              x="250"
              y="105"
              textAnchor="middle"
              fill="url(#viceGrad)"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="800"
              fontSize="24"
              letterSpacing="6"
              stroke="#0F172A"
              strokeWidth="3"
              paintOrder="stroke fill"
            >
              VICE LITTORAL · BÉNIN
            </text>
          </svg>
        </div>

        <p className="text-xs md:text-base text-slate-200 font-medium max-w-lg bg-slate-950/75 border border-slate-800 rounded-xl px-4 py-2 mb-4 backdrop-blur-none shadow-xl">
          Parcours Cotonou en Zémidjan ou en bolide, accomplis les contrats de Da Silva et sème la Police Républicaine !
        </p>

        {/* Primary CTA & Android Fullscreen Launcher */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full max-w-md">
          <button
            onClick={async () => {
              if (!isFullscreen) {
                await toggleFullscreen();
              }
              onStartGame();
            }}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 active:from-amber-600 active:to-amber-400 text-slate-950 font-black text-base rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.5)] transition duration-150 transform hover:scale-[1.02] flex items-center justify-center gap-2 border border-amber-200"
          >
            <Play className="w-5 h-5 fill-slate-950 shrink-0" />
            <span>COMMENCER LA PARTIE</span>
          </button>
        </div>

        {/* Quick Missions Drawer Buttons */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-xl">
          {MISSIONS.map((m, idx) => (
            <button
              key={m.id}
              onClick={async () => {
                if (!isFullscreen) {
                  await toggleFullscreen();
                }
                onSelectMission(m.id);
                onStartGame();
              }}
              className="px-3 py-1.5 bg-slate-900/85 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-400/80 rounded-lg text-xs font-semibold text-slate-300 hover:text-amber-300 transition flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Mission {idx + 1} : {m.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Flat Control Hint Line & Android Orientation Safe Hint */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2 pointer-events-auto gap-1">
        <div className="flex items-center gap-2 font-mono tracking-wider text-amber-400">
          <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Android / Mobile : Joystick Virtuel + Mode Plein Écran Paysage</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          GTA Cotonou OpenFreeMap 3D · Version Mobile
        </span>
      </div>
    </div>
  );
};

