import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-3.5 py-1.5 rounded-full shadow-lg text-xs transition active:scale-95 ${className}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Installer l'application</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1 rounded-full text-xs font-medium transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span>Installer sur iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 pointer-events-auto">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border-2 border-slate-700 p-5 shadow-2xl text-slate-100 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-base font-bold text-white font-mono uppercase mb-2">
                Installer sur iOS (iPhone / iPad)
              </h3>
              <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside">
                <li>Appuyez sur le bouton <strong>Partager</strong> dans Safari.</li>
                <li>Faites défiler vers le bas et touchez <strong>Sur l'écran d'accueil</strong>.</li>
                <li>Touchez <strong>Ajouter</strong> en haut à droite.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-slate-800 py-2 text-xs font-bold text-white hover:bg-slate-700"
              >
                Compris
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
