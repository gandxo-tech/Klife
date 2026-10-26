/**
 * GTA Cotonou: Vice Littoral - Smartphone In-Game "Kobo Phone 229"
 * Features 3 integrated apps:
 * 1. Kobo Invest: Buy local Cotonou businesses & collect accumulated passive dividends
 * 2. MoMo Pay: Deposit and withdraw funds between Cash and secure Mobile Money account
 * 3. Jobs & Contrats: Accept legal delivery/taxi jobs or trigger high-stakes heists
 */

import React, { useState } from 'react';
import {
  PlayerEconomyState,
  BusinessProperty,
  COTONOU_PROPERTIES,
  COTONOU_JOBS,
  EconomicJob,
  depositToMoMo,
  withdrawFromMoMo,
  buyBusinessProperty,
  collectDividends,
} from '../game/economy.ts';
import {
  X,
  Smartphone,
  TrendingUp,
  Building,
  Briefcase,
  DollarSign,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';

interface PhoneModalProps {
  economy: PlayerEconomyState;
  onUpdateEconomy: (newEconomy: PlayerEconomyState) => void;
  onStartJob: (job: EconomicJob) => void;
  onClose: () => void;
  onNotification: (msg: string) => void;
}

export const PhoneModal: React.FC<PhoneModalProps> = ({
  economy,
  onUpdateEconomy,
  onStartJob,
  onClose,
  onNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'invest' | 'momo' | 'jobs'>('invest');
  const [transferAmount, setTransferAmount] = useState<number>(25000);

  const handleDeposit = () => {
    const res = depositToMoMo(economy, transferAmount);
    if (res.success) {
      onUpdateEconomy(res.state);
      onNotification(res.message);
    } else {
      onNotification(res.message);
    }
  };

  const handleWithdraw = () => {
    const res = withdrawFromMoMo(economy, transferAmount);
    if (res.success) {
      onUpdateEconomy(res.state);
      onNotification(res.message);
    } else {
      onNotification(res.message);
    }
  };

  const handleBuyProperty = (propId: string) => {
    const res = buyBusinessProperty(economy, propId);
    if (res.success) {
      onUpdateEconomy(res.state);
      onNotification(res.message);
    } else {
      onNotification(res.message);
    }
  };

  const handleCollectDividends = () => {
    const res = collectDividends(economy);
    if (res.collectedAmount > 0) {
      onUpdateEconomy(res.state);
      onNotification(
        `+${res.collectedAmount.toLocaleString('fr-FR')} FCFA de dividendes collectés sur votre compte MoMo !`
      );
    } else {
      onNotification('Aucun dividende à collecter pour le moment.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      {/* Smartphone Chassis */}
      <div className="relative w-full max-w-md h-[88vh] max-h-[720px] bg-slate-950 border-[6px] border-slate-700/80 rounded-[44px] shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans">
        {/* Smartphone Speaker & Camera Notch */}
        <div className="w-full h-7 bg-slate-950 flex items-center justify-center relative select-none">
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-2 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-slate-950"></span>
            <span className="w-6 h-1 rounded-full bg-slate-800"></span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Network & Status Header */}
        <div className="px-5 py-2 flex items-center justify-between text-xs text-slate-400 border-b border-slate-900 select-none">
          <span className="font-bold tracking-wider text-amber-400 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            BENINTEL 4G+
          </span>
          <span className="font-mono text-emerald-400 font-semibold">100% ⚡</span>
        </div>

        {/* Balance Overview Card */}
        <div className="p-4 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-inner">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                Cash en Main
              </span>
              <div className="text-lg font-black text-amber-400 font-mono tracking-tight">
                {economy.cashFCFA.toLocaleString('fr-FR')} <span className="text-xs">F</span>
              </div>
              <span className="text-[10px] text-amber-500/80 font-medium">À risque d'arrestation</span>
            </div>

            <div className="bg-emerald-950/40 border border-emerald-800/50 rounded-2xl p-3 shadow-inner">
              <span className="text-[10px] text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Compte MoMo
              </span>
              <div className="text-lg font-black text-emerald-400 font-mono tracking-tight">
                {economy.bankMoMoFCFA.toLocaleString('fr-FR')} <span className="text-xs">F</span>
              </div>
              <span className="text-[10px] text-emerald-500/80 font-medium">100% Sécurisé</span>
            </div>
          </div>
        </div>

        {/* App Switcher Tabs */}
        <div className="flex bg-slate-900/60 p-1 border-b border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('invest')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'invest'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            Invest
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('momo')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'momo'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            MoMo Pay
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jobs')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'jobs'
                ? 'bg-indigo-500 text-white shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            Jobs & Heists
          </button>
        </div>

        {/* Tab 1: Kobo Invest (Properties & Passive Income) */}
        {activeTab === 'invest' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Dividends Claim Card */}
            <div className="bg-gradient-to-r from-amber-500/10 to-emerald-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block">
                  Dividendes Passifs Accumulés
                </span>
                <div className="text-xl font-black text-amber-400 font-mono">
                  {economy.accumulatedDividendsFCFA.toLocaleString('fr-FR')} FCFA
                </div>
              </div>
              <button
                type="button"
                onClick={handleCollectDividends}
                disabled={economy.accumulatedDividendsFCFA <= 0}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs py-2 px-3.5 rounded-xl shadow transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Collecter
              </button>
            </div>

            {/* Market Commodities Quick Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-amber-400" />
                Marché Local & Matières Premières
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Essence DahoFuel</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {economy.commodities.fuelPriceFCFA} F/L
                  </span>
                  <span
                    className={`text-[9px] block font-mono ${
                      economy.commodities.fuelTrendPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {economy.commodities.fuelTrendPercent >= 0 ? '+' : ''}
                    {economy.commodities.fuelTrendPercent}%
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Pagne Dantokpa</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {economy.commodities.waxIndexFCFA.toLocaleString('fr-FR')} F
                  </span>
                  <span
                    className={`text-[9px] block font-mono ${
                      economy.commodities.waxTrendPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {economy.commodities.waxTrendPercent >= 0 ? '+' : ''}
                    {economy.commodities.waxTrendPercent}%
                  </span>
                </div>

                <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Action Kobo</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {economy.commodities.koboCashStockFCFA} F
                  </span>
                  <span
                    className={`text-[9px] block font-mono ${
                      economy.commodities.koboStockTrendPercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {economy.commodities.koboStockTrendPercent >= 0 ? '+' : ''}
                    {economy.commodities.koboStockTrendPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Properties Buyout List */}
            <div className="space-y-2.5">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                Commerces & Propriétés à Acquérir
              </span>

              {COTONOU_PROPERTIES.map((prop) => {
                const isOwned = economy.ownedPropertyIds.includes(prop.id);
                const canAfford = economy.cashFCFA + economy.bankMoMoFCFA >= prop.priceFCFA;

                return (
                  <div
                    key={prop.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isOwned
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                          {prop.name}
                          {isOwned && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 inline-block" />
                          )}
                        </h4>
                        <span className="text-[11px] text-slate-400">{prop.district}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        +{prop.incomePerMinFCFA.toLocaleString('fr-FR')} F/min
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                      {prop.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                      <span className="font-mono text-sm font-extrabold text-amber-400">
                        {prop.priceFCFA.toLocaleString('fr-FR')} FCFA
                      </span>

                      {isOwned ? (
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-xl">
                          Propriété de Zack
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuyProperty(prop.id)}
                          disabled={!canAfford}
                          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs py-1.5 px-3.5 rounded-xl shadow transition-all"
                        >
                          Acheter
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: MoMo Pay (Deposit & Withdraw) */}
        {activeTab === 'momo' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4 text-center">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
              <h3 className="font-extrabold text-base text-white">MTN MoMo & Moov Flooz</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Déposez votre argent liquide pour le protéger intégralement contre les saisies de la Police Républicaine lors des arrestations.
              </p>
            </div>

            {/* Quick Amount Selector */}
            <div>
              <span className="text-xs text-slate-400 font-semibold block mb-2">
                Montant à Transférer
              </span>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[10000, 25000, 50000, 100000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTransferAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                      transferAmount === amt
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {(amt / 1000).toLocaleString('fr-FR')}k
                  </button>
                ))}
              </div>

              {/* Custom amount input */}
              <input
                type="number"
                step="5000"
                min="5000"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-center font-mono font-bold text-amber-400 text-base focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDeposit}
                disabled={economy.cashFCFA < transferAmount}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs py-3 px-4 rounded-2xl shadow transition-all flex flex-col items-center gap-1"
              >
                <ArrowDownRight className="w-5 h-5" />
                Déposer en MoMo
                <span className="text-[10px] font-normal opacity-80">(Protéger du Cash)</span>
              </button>

              <button
                type="button"
                onClick={handleWithdraw}
                disabled={economy.bankMoMoFCFA < transferAmount}
                className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs py-3 px-4 rounded-2xl shadow transition-all flex flex-col items-center gap-1"
              >
                <ArrowUpRight className="w-5 h-5" />
                Retirer en Cash
                <span className="text-[10px] font-normal opacity-80">(Espèces en main)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Jobs & Heists */}
        {activeTab === 'jobs' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
              Missions Économiques & Braquages Disponibles
            </span>

            {COTONOU_JOBS.map((job) => (
              <div
                key={job.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  job.isIllegal
                    ? 'bg-red-950/20 border-red-500/40 hover:border-red-500/70'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                      {job.title}
                    </h4>
                    <span className="text-[11px] text-slate-400">{job.employer}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      job.isIllegal
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}
                  >
                    {job.isIllegal ? 'CLANDESTIN // BRAQUAGE' : 'EMPLOI LÉGAL'}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {job.durationSec} sec
                  </span>
                  {job.isIllegal && (
                    <span className="flex items-center gap-1 text-red-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      +{job.wantedStarsOnStart} Étoiles Police
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="font-mono text-base font-extrabold text-amber-400">
                    +{job.rewardFCFA.toLocaleString('fr-FR')} FCFA
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      onStartJob(job);
                      onClose();
                    }}
                    className={`font-black text-xs py-1.5 px-4 rounded-xl shadow transition-all ${
                      job.isIllegal
                        ? 'bg-red-600 hover:bg-red-500 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {job.isIllegal ? 'Lancer le Braquage' : 'Démarrer le Job'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Smartphone Home Bar at Bottom */}
        <div className="w-full h-6 bg-slate-950 flex items-center justify-center border-t border-slate-900 select-none">
          <div className="w-32 h-1 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
