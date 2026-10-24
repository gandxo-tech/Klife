import React from 'react';
import { X, ShieldAlert, Car, MapPin, Radio, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm pointer-events-auto">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h2 className="text-lg font-black text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            Guide du Joueur : GTA Cotonou
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-4 space-y-4 text-xs text-slate-300 pr-1">
          {/* Controls table */}
          <div>
            <h3 className="font-bold text-amber-400 uppercase tracking-wider mb-2">Commandes Clavier & Tactile</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-800/80 rounded-lg flex items-center justify-between">
                <span>Déplacement / Direction</span>
                <kbd className="px-2 py-0.5 bg-slate-700 rounded font-mono text-amber-300 text-[11px]">WASD / Flèches</kbd>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg flex items-center justify-between">
                <span>Monter / Sortir de véhicule</span>
                <kbd className="px-2 py-0.5 bg-slate-700 rounded font-mono text-amber-300 text-[11px]">E / F</kbd>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg flex items-center justify-between">
                <span>Accélérer / Freiner</span>
                <kbd className="px-2 py-0.5 bg-slate-700 rounded font-mono text-amber-300 text-[11px]">W / S / Espace</kbd>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg flex items-center justify-between">
                <span>Attaquer / Coup de poing</span>
                <kbd className="px-2 py-0.5 bg-slate-700 rounded font-mono text-amber-300 text-[11px]">Clic Gauche / J</kbd>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg flex items-center justify-between">
                <span>Klaxonner</span>
                <kbd className="px-2 py-0.5 bg-slate-700 rounded font-mono text-amber-300 text-[11px]">Touche H</kbd>
              </div>
              <div className="p-2.5 bg-slate-800/80 rounded-lg flex items-center justify-between">
                <span>Changer de Radio FM</span>
                <kbd className="px-2 py-0.5 bg-slate-700 rounded font-mono text-amber-300 text-[11px]">Touche R</kbd>
              </div>
            </div>
          </div>

          {/* Gameplay Elements */}
          <div className="space-y-2">
            <h3 className="font-bold text-amber-400 uppercase tracking-wider">Le Monde de Cotonou</h3>
            <div className="p-3 bg-slate-800/60 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Car className="w-4 h-4 text-amber-400" />
                <span>Véhicules Légendaires</span>
              </div>
              <p className="text-slate-400">
                Approche-toi d'une moto Zémidjan jaune, d'un Kéké tricycle Bajaj ou d'une berline Peugeot 505 Taxi et appuie sur E/F pour la réquisitionner !
              </p>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Police Républicaine & Indice de Recherche</span>
              </div>
              <p className="text-slate-400">
                Chaque délit (vol de voiture de police, accident, bagarre) augmente tes étoiles de recherche. Les cruisers de police te traqueront avec sirènes hurlantes. Cache-toi pour faire baisser les étoiles !
              </p>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-white font-semibold">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Lieux Cultes</span>
              </div>
              <p className="text-slate-400">
                Explore la Place de l'Étoile Rouge, le grand Monument de l'Amazone, le Grand Marché Dantokpa, le Port Autonome et les plages de Fidjrossè.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition"
        >
          Compris, je joue !
        </button>
      </div>
    </div>
  );
};
