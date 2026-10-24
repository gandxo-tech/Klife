/**
 * GTA Cotonou - Interactive Garage & Vehicle Customization Modal
 * Tuning, Benin wax/flag paint jobs, engine stage upgrades, armor, neons, and garage storage
 */

import React, { useState } from 'react';
import { ActiveVehicle, GarageLocation, PlayerStats, StoredVehicle, VehicleCustomization } from '../game/types.ts';
import {
  ARMOR_UPGRADES,
  ENGINE_UPGRADES,
  NEON_COLORS,
  PAINT_PRESETS,
  createDefaultCustomization,
} from '../game/garages.ts';
import { formatFCFA } from '../game/rules.ts';
import { Wrench, Car, Sparkles, Shield, Zap, X, Check, Save, ArrowUpRight, Palette, Layers, DollarSign } from 'lucide-react';

interface GarageModalProps {
  garage: GarageLocation;
  player: PlayerStats;
  activeVehicle: ActiveVehicle | null;
  storedVehicles: StoredVehicle[];
  onClose: () => void;
  onApplyCustomization: (vehicleId: string, customization: VehicleCustomization, costFCFA: number) => void;
  onStoreVehicle: (vehicleId: string, garageId: string) => void;
  onSpawnStoredVehicle: (storedVehicleId: string, garage: GarageLocation) => void;
  onNotification: (msg: string) => void;
}

export const GarageModal: React.FC<GarageModalProps> = ({
  garage,
  player,
  activeVehicle,
  storedVehicles,
  onClose,
  onApplyCustomization,
  onStoreVehicle,
  onSpawnStoredVehicle,
  onNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'custom' | 'collection'>(activeVehicle ? 'custom' : 'collection');

  // Customization Form State initialized with current vehicle or default
  const [selectedColor, setSelectedColor] = useState<string>(
    activeVehicle?.customization?.colorHex || activeVehicle?.config.color || '#FDD835'
  );
  const [selectedEngine, setSelectedEngine] = useState<number>(activeVehicle?.customization?.engineLevel || 0);
  const [selectedArmor, setSelectedArmor] = useState<number>(activeVehicle?.customization?.armorLevel || 0);
  const [selectedNeon, setSelectedNeon] = useState<string | null>(activeVehicle?.customization?.neonColorHex || null);
  const [plateNumber, setPlateNumber] = useState<string>(
    activeVehicle?.customization?.licensePlate || `RB-${Math.floor(1000 + Math.random() * 9000)}-CT`
  );

  // Calculate total upgrade costs
  const paintObj = PAINT_PRESETS.find((p) => p.hex === selectedColor);
  const paintPrice = paintObj?.price || 0;
  const enginePrice = ENGINE_UPGRADES[selectedEngine]?.price || 0;
  const armorPrice = ARMOR_UPGRADES[selectedArmor]?.price || 0;
  const neonObj = NEON_COLORS.find((n) => n.hex === selectedNeon);
  const neonPrice = neonObj?.price || 0;

  const totalCostFCFA = paintPrice + enginePrice + armorPrice + neonPrice;

  const handleApplyCustomization = () => {
    if (!activeVehicle) {
      onNotification('Aucun véhicule à customiser !');
      return;
    }

    if (player.cashFCFA < totalCostFCFA) {
      onNotification(`Fonds insuffisants ! Il vous manque ${formatFCFA(totalCostFCFA - player.cashFCFA)}.`);
      return;
    }

    const customization: VehicleCustomization = {
      colorHex: selectedColor,
      engineLevel: selectedEngine,
      armorLevel: selectedArmor,
      neonColorHex: selectedNeon,
      licensePlate: plateNumber,
    };

    onApplyCustomization(activeVehicle.id, customization, totalCostFCFA);
  };

  const handleStoreCurrentVehicle = () => {
    if (!activeVehicle) return;
    onStoreVehicle(activeVehicle.id, garage.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-5 py-4 flex items-center justify-between shadow-lg text-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-950 text-amber-400 rounded-2xl shadow">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide leading-tight">
                {garage.name}
              </h2>
              <p className="text-xs font-bold text-slate-900 opacity-90">
                {garage.district} • Atelier Tuning & Garonnage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full transition shadow"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 pt-3 gap-3">
          <button
            onClick={() => setActiveTab('custom')}
            disabled={!activeVehicle}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-extrabold text-xs md:text-sm transition border-t-2 border-x-2 ${
              activeTab === 'custom'
                ? 'bg-slate-900 text-amber-400 border-amber-500/80'
                : 'bg-slate-950/80 text-slate-400 border-transparent hover:text-slate-200'
            } ${!activeVehicle ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Tuning & Peinture ({activeVehicle ? activeVehicle.name : 'Aucun véhicule'})</span>
          </button>

          <button
            onClick={() => setActiveTab('collection')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-extrabold text-xs md:text-sm transition border-t-2 border-x-2 ${
              activeTab === 'collection'
                ? 'bg-slate-900 text-amber-400 border-amber-500/80'
                : 'bg-slate-950/80 text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Car className="w-4 h-4 text-emerald-400" />
            <span>Mes Véhicules Stockés ({storedVehicles.length})</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === 'custom' && activeVehicle ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Color & Neons */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Paint Jobs */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-amber-400 flex items-center gap-2">
                      <Palette className="w-4 h-4" /> Peinture & Teintes
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Choix: {paintObj?.name || 'Standard'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                    {PAINT_PRESETS.map((preset) => {
                      const isSelected = selectedColor === preset.hex;
                      return (
                        <button
                          key={preset.name}
                          onClick={() => setSelectedColor(preset.hex)}
                          className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition active:scale-95 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                              : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-full border-2 border-white/80 shadow-md mb-1.5"
                            style={{ backgroundColor: preset.hex }}
                          />
                          <span className="text-[10px] font-bold text-slate-200 text-center leading-tight truncate w-full">
                            {preset.name}
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400 font-semibold mt-0.5">
                            {preset.price === 0 ? 'Gratuit' : formatFCFA(preset.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Engine Performance Upgrades */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-inner">
                  <span className="text-sm font-extrabold text-amber-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Préparation Moteur
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ENGINE_UPGRADES.map((eng) => {
                      const isSelected = selectedEngine === eng.level;
                      return (
                        <button
                          key={eng.level}
                          onClick={() => setSelectedEngine(eng.level)}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 transition active:scale-98 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/10'
                              : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-white">{eng.label}</span>
                            <span className="text-[10px] text-amber-300 font-semibold">{eng.boost}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {eng.price === 0 ? 'Stock' : formatFCFA(eng.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Armor & Resistance */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-inner">
                  <span className="text-sm font-extrabold text-amber-400 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Blindage & Carrosserie
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ARMOR_UPGRADES.map((arm) => {
                      const isSelected = selectedArmor === arm.level;
                      return (
                        <button
                          key={arm.level}
                          onClick={() => setSelectedArmor(arm.level)}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 transition active:scale-98 ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/10'
                              : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-white">{arm.label}</span>
                            <span className="text-[10px] text-sky-300 font-semibold">{arm.boost}</span>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            {arm.price === 0 ? 'Stock' : formatFCFA(arm.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Underglow Neon & Plate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Neons */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-inner">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Néons sous Châssis
                    </span>

                    <select
                      value={selectedNeon || ''}
                      onChange={(e) => setSelectedNeon(e.target.value || null)}
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    >
                      {NEON_COLORS.map((neon) => (
                        <option key={neon.name} value={neon.hex || ''}>
                          {neon.name} ({neon.price === 0 ? 'Aucun' : formatFCFA(neon.price)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* License Plate */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2.5 shadow-inner">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" /> Plaque d'Immatriculation
                    </span>

                    <input
                      type="text"
                      value={plateNumber}
                      onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                      maxLength={12}
                      className="w-full bg-slate-900 border border-slate-700 text-amber-300 font-mono font-black text-center text-sm rounded-xl p-2 focus:outline-none focus:border-amber-500 tracking-wider"
                      placeholder="RB-229-CT"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout & Actions Card */}
              <div className="space-y-5">
                <div className="bg-slate-950 border-2 border-amber-500/80 rounded-3xl p-5 shadow-2xl flex flex-col justify-between space-y-5">
                  <div>
                    <h3 className="text-lg font-extrabold text-amber-400 flex items-center gap-2 mb-1">
                      <Car className="w-5 h-5" />
                      {activeVehicle.name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Immatriculation: <span className="text-amber-300 font-mono font-bold">{plateNumber}</span>
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Peinture:</span>
                        <span className="font-mono text-emerald-400 font-bold">{formatFCFA(paintPrice)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Moteur Stage {selectedEngine}:</span>
                        <span className="font-mono text-emerald-400 font-bold">{formatFCFA(enginePrice)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Blindage Level {selectedArmor}:</span>
                        <span className="font-mono text-emerald-400 font-bold">{formatFCFA(armorPrice)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Éclairage Néon:</span>
                        <span className="font-mono text-emerald-400 font-bold">{formatFCFA(neonPrice)}</span>
                      </div>

                      <div className="border-t border-slate-800 pt-3 flex justify-between items-baseline">
                        <span className="font-bold text-sm text-white">Total Tuning:</span>
                        <span className="text-lg font-black font-mono text-amber-400">
                          {formatFCFA(totalCostFCFA)}
                        </span>
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                        <span>Solde Joueur:</span>
                        <span className={`font-mono font-bold ${player.cashFCFA >= totalCostFCFA ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {formatFCFA(player.cashFCFA)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={handleApplyCustomization}
                      className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:brightness-110 active:scale-98 text-slate-950 font-black text-sm py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition"
                    >
                      <Check className="w-5 h-5" />
                      <span>Appliquer les Modifications</span>
                    </button>

                    <button
                      onClick={handleStoreCurrentVehicle}
                      className="w-full bg-slate-900 border border-slate-700 hover:border-amber-500 text-amber-300 font-bold text-xs py-2.5 rounded-2xl flex items-center justify-center gap-2 transition"
                    >
                      <Save className="w-4 h-4" />
                      <span>Ranger dans mon Garage</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Collection Tab */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-950/60 p-4 border border-slate-800 rounded-2xl">
                <div>
                  <h3 className="text-base font-extrabold text-amber-400">
                    Collection Personnelle ({storedVehicles.length} véhicules)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Vous pouvez sortir n'importe quel véhicule stocké directement sur la piste du garage.
                  </p>
                </div>
              </div>

              {storedVehicles.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/40 border border-dashed border-slate-800 rounded-3xl space-y-3">
                  <Car className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-sm font-semibold text-slate-400">
                    Aucun véhicule stocké dans vos garages.
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Conduisez n'importe quel Zémidjan, Kéké, Taxi ou G-Wagon jusqu'à un garage et cliquez sur "Ranger dans mon garage" pour le conserver !
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {storedVehicles.map((veh) => (
                    <div
                      key={veh.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col justify-between space-y-3 hover:border-amber-500/60 transition"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-white">{veh.name}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-500/40 rounded-lg">
                            {veh.customization.licensePlate}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <div
                            className="w-4 h-4 rounded-full border border-white/60"
                            style={{ backgroundColor: veh.customization.colorHex }}
                          />
                          <span>Moteur Stage {veh.customization.engineLevel}</span>
                          <span>• Blindage Lvl {veh.customization.armorLevel}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onSpawnStoredVehicle(veh.id, garage)}
                        className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 active:scale-98 text-slate-950 font-black text-xs py-2.5 rounded-xl shadow flex items-center justify-center gap-2 transition"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Sortir sur la piste</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
