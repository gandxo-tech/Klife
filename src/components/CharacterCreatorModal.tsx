import React, { useState } from 'react';
import { User, Sparkles, Shirt, Palette, ShieldCheck, Check, ArrowRight } from 'lucide-react';

export interface CharacterConfig {
  gender: 'garcon' | 'fille';
  name: string;
  style: 'wax' | 'streetwear' | 'swag' | 'chic';
  colorHex: string;
  hat: 'cap' | 'hat' | 'none';
  glasses: boolean;
  accessory: 'bag' | 'chain' | 'none';
}

interface CharacterCreatorModalProps {
  initialConfig?: CharacterConfig;
  onConfirm: (config: CharacterConfig) => void;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  { name: 'Orange Wax', hex: '#E65100' },
  { name: 'Vert Bénin', hex: '#059669' },
  { name: 'Jaune Sol', hex: '#D97706' },
  { name: 'Bleu Lagune', hex: '#0284C7' },
  { name: 'Rouge Étoile', hex: '#DC2626' },
  { name: 'Noir Chic', hex: '#111827' },
];

export const CharacterCreatorModal: React.FC<CharacterCreatorModalProps> = ({
  initialConfig,
  onConfirm,
  onClose,
}) => {
  const [config, setConfig] = useState<CharacterConfig>(
    initialConfig || {
      gender: 'garcon',
      name: 'Zack',
      style: 'wax',
      colorHex: '#E65100',
      hat: 'cap',
      glasses: true,
      accessory: 'chain',
    }
  );

  const handleGenderChange = (gender: 'garcon' | 'fille') => {
    setConfig((prev) => ({
      ...prev,
      gender,
      name: gender === 'garcon' ? 'Zack' : 'Zahra',
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md pointer-events-auto select-none font-sans">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 border border-amber-400 rounded-xl text-amber-400">
              <User className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                Miroir Dressing · Quartier Sikè-Fictif
              </h2>
              <p className="text-xs text-slate-400">
                Personnalise ton apparence avant de sortir dans Cotonou
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-full">
            Dressing Résidence
          </span>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-white">
          {/* 1. Choice of Gender / Hero Identity */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
              <User className="w-4 h-4" /> 1. Choix du Personnage
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleGenderChange('garcon')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
                  config.gender === 'garcon'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">👦</span>
                <span className="font-extrabold text-sm">GARÇON (Zack)</span>
                <span className="text-[11px] text-slate-400">Rider agile de Sikè</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenderChange('fille')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition ${
                  config.gender === 'fille'
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span className="text-2xl">👧</span>
                <span className="font-extrabold text-sm">FILLE (Zahra)</span>
                <span className="text-[11px] text-slate-400">Reine du Style & Speed</span>
              </button>
            </div>
          </div>

          {/* 2. Prénom */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              Prénom du Héros
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold focus:outline-none focus:border-amber-400 text-sm"
              placeholder="Ton nom à Cotonou"
            />
          </div>

          {/* 3. Style d'Outfit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
              <Shirt className="w-4 h-4" /> 2. Style Vestimentaire
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'wax', name: 'Wax Cotonou', desc: 'Motifs Vlisco traditionnel' },
                { id: 'streetwear', name: 'Streetwear 229', desc: 'Look urbain & casquette' },
                { id: 'swag', name: 'Swag Yovo', desc: 'Sapeur étincelant' },
                { id: 'chic', name: 'Chic Cotonou', desc: 'Chemise soie & élégance' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setConfig({ ...config, style: st.id as any })}
                  className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                    config.style === st.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold">{st.name}</span>
                  <span className="text-[10px] text-slate-400 mt-1">{st.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Palette de Couleur */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1">
              <Palette className="w-4 h-4" /> 3. Couleur Principale
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setConfig({ ...config, colorHex: c.hex })}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition ${
                    config.colorHex === c.hex
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {config.colorHex === c.hex && <Check className="w-5 h-5 text-white drop-shadow" />}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Accessoires */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Lunettes Noires
              </label>
              <button
                type="button"
                onClick={() => setConfig({ ...config, glasses: !config.glasses })}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition ${
                  config.glasses
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {config.glasses ? '🕶️ Lunettes Actives' : 'Sans Lunettes'}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Chapeau / Casquette
              </label>
              <select
                value={config.hat}
                onChange={(e) => setConfig({ ...config, hat: e.target.value as any })}
                className="w-full py-2 px-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-amber-400"
              >
                <option value="cap">🧢 Casquette Snapback</option>
                <option value="hat">🎩 Chapeau Chic</option>
                <option value="none">Cheveux Naturels</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
          >
            Fermer le Miroir
          </button>

          <button
            type="button"
            onClick={() => {
              onConfirm(config);
              onClose();
            }}
            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xl flex items-center gap-2 transition"
          >
            <span>Valider le Look ({config.name})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
