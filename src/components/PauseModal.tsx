import React from 'react';
import { Play, RotateCcw, HelpCircle, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { sound } from '../game/audio.ts';
import { useFullscreen } from '../hooks/useFullscreen.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenHowToPlay: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenHowToPlay,
}) => {
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm pointer-events-auto">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center">
        <h2 className="text-2xl font-black text-white font-mono uppercase tracking-wider mb-1">
          JEU EN PAUSE
        </h2>
        <p className="text-xs text-slate-400 mb-4">GTA Cotonou : Vice Littoral</p>

        <div className="flex justify-center mb-4">
          <PWAInstallButton className="w-full justify-center" />
        </div>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            REPRENDRE LA PARTIE
          </button>

          <button
            onClick={toggleFullscreen}
            className="w-full py-2.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/80 text-indigo-200 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 active:scale-95"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-indigo-400" />
                <span>QUITTER LE PLEIN ÉCRAN</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-indigo-400" />
                <span>📱 MODE PLEIN ÉCRAN ANDROID</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenHowToPlay}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            COMMANDES & GUIDE
          </button>

          <button
            onClick={toggleMute}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            {isMuted ? 'RÉACTIVER LE SON' : 'COUPER LE SON'}
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 mt-2"
          >
            <RotateCcw className="w-4 h-4" />
            MENU PRINCIPAL
          </button>
        </div>
      </div>
    </div>
  );
};

