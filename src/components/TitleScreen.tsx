import React from 'react';
import { MISSIONS } from '../game/missions.ts';
import { Play, Sparkles, Volume2, ShieldCheck, HelpCircle, Compass } from 'lucide-react';

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
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between p-6 md:p-12 pointer-events-none select-none font-sans">
      {/* Top Header: Badge & Status */}
      <div className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-950/80 border border-amber-500/50 rounded-full px-3.5 py-1 text-xs font-semibold text-amber-300 shadow">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>ÉDITION BÉNIN · MONDE OUVERT 3D</span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMap && (
            <button
              onClick={onOpenMap}
              className="flex items-center gap-1.5 bg-sky-950/80 hover:bg-sky-900/90 border border-sky-500/80 rounded-full px-3.5 py-1 text-xs text-sky-200 hover:text-white transition shadow"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Carte OpenFreeMap</span>
            </button>
          )}

          <button
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-full px-3 py-1 text-xs text-slate-300 hover:text-white transition shadow"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Commandes</span>
          </button>
        </div>
      </div>

      {/* Centerpiece: Bespoke SVG Title Lockup */}
      <div className="flex flex-col items-center justify-center my-auto pointer-events-auto text-center max-w-2xl mx-auto">
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

        <p className="text-sm md:text-base text-slate-200 font-medium max-w-lg bg-slate-950/75 border border-slate-800 rounded-xl px-4 py-2 mb-6 backdrop-blur-none shadow-xl">
          Parcours Cotonou en Zémidjan ou en bolide, accomplis les contrats de Da Silva et sème la Police Républicaine !
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            onClick={onStartGame}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-base rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.5)] transition duration-150 transform hover:scale-[1.02] flex items-center justify-center gap-2 border border-amber-200"
          >
            <Play className="w-5 h-5 fill-slate-950" />
            COMMENCER LA PARTIE (Espace)
          </button>
        </div>

        {/* Quick Missions Drawer Buttons */}
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-xl">
          {MISSIONS.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
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

      {/* Bottom Flat Control Hint Line */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 bg-slate-950/80 border border-slate-800/80 rounded-xl px-4 py-2 pointer-events-auto">
        <span className="font-mono tracking-wider text-amber-400">
          WASD Se Déplacer · E/F Monter dans un véhicule · Espace Frein · Clic Attaquer · H Klaxon · R Radio
        </span>
        <span className="text-[11px] text-slate-400 font-mono mt-1 sm:mt-0">
          Audio Procedural Synth + Gemini 3.8 Flash TTS
        </span>
      </div>
    </div>
  );
};
