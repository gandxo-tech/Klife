import React from 'react';
import { MISSIONS } from '../game/missions.ts';
import { formatFCFA } from '../game/rules.ts';
import { X, Play, MapPin, Award, Clock } from 'lucide-react';

interface MissionsModalProps {
  onClose: () => void;
  onStartMission: (missionId: string) => void;
  currentMissionId?: string;
}

export const MissionsModal: React.FC<MissionsModalProps> = ({
  onClose,
  onStartMission,
  currentMissionId,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm pointer-events-auto">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-white font-mono uppercase tracking-wider flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Contrats & Missions de Cotonou
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Sélectionne un contrat pour lancer le briefing vocal et gagner des FCFA
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            aria-label="Fermer la liste des missions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Missions List */}
        <div className="overflow-y-auto py-4 space-y-3.5 pr-1">
          {MISSIONS.map((mission, idx) => {
            const isCurrent = currentMissionId === mission.id;
            return (
              <div
                key={mission.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'bg-amber-950/30 border-amber-500/80 ring-1 ring-amber-500'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-[11px] font-bold text-amber-400 font-mono">
                      #{idx + 1}
                    </span>
                    <h3 className="font-bold text-white text-base">{mission.title}</h3>
                    <span className="text-xs text-slate-400">· Donneur : {mission.bossName}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed max-w-lg">
                    {mission.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono pt-1 text-slate-400">
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {mission.locationName}
                    </span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-sky-400" />
                      {mission.timeLimitSec}s chrono
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Récompense : {formatFCFA(mission.rewardFCFA)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onStartMission(mission.id);
                    onClose();
                  }}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 transition flex items-center gap-2 shadow-lg ${
                    isCurrent
                      ? 'bg-amber-600 text-white cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isCurrent ? 'En cours' : 'Lancer'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
