import React from 'react';
import { formatFCFA } from '../game/rules.ts';
import { Trophy, Skull, RotateCcw, Play } from 'lucide-react';

interface GameResultModalProps {
  type: 'victory' | 'gameover';
  title?: string;
  rewardFCFA?: number;
  onRestart: () => void;
  onContinue: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  type,
  title,
  rewardFCFA,
  onRestart,
  onContinue,
}) => {
  const isVictory = type === 'victory';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md pointer-events-auto">
      <div
        className={`border-2 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl ${
          isVictory ? 'bg-slate-900 border-amber-500/80' : 'bg-slate-900 border-rose-600/80'
        }`}
      >
        <div className="flex justify-center mb-3">
          {isVictory ? (
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 animate-pulse">
              <Trophy className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-500 animate-pulse">
              <Skull className="w-8 h-8" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black font-mono uppercase tracking-wider text-white">
          {isVictory ? 'MISSION RÉUSSIE !' : 'VOUS ÊTES ARRÊTÉ !'}
        </h2>

        <p className="text-xs text-slate-400 mt-1 mb-4">
          {isVictory
            ? title || 'Contrat accompli avec succès à Cotonou'
            : 'La Police Républicaine a neutralisé votre véhicule.'}
        </p>

        {isVictory && rewardFCFA && (
          <div className="bg-emerald-950/40 border border-emerald-500/50 rounded-xl p-3 mb-6">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
              Gain Récolté
            </span>
            <span className="text-xl font-extrabold text-emerald-300 font-mono tabular-nums">
              +{formatFCFA(rewardFCFA)}
            </span>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <button
            onClick={onContinue}
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 transition flex items-center justify-center gap-2 shadow-lg ${
              isVictory
                ? 'bg-amber-400 hover:bg-amber-300'
                : 'bg-emerald-500 hover:bg-emerald-400'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            {isVictory ? 'Continuer à Cotonou' : 'Réapparaître au commissariat'}
          </button>

          <button
            onClick={onRestart}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Menu Principal
          </button>
        </div>
      </div>
    </div>
  );
};
