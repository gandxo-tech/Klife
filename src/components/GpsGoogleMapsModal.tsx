/**
 * GTA Cotonou: Vice Littoral - Google Maps Platform Satellite GPS Tablet
 * High-resolution satellite imagery powered by @vis.gl/react-google-maps
 * Features:
 * - Live player tracking (Zack/Zahra) in Cotonou coordinates (6.367°N, 2.425°E)
 * - AdvancedMarker elements for landmarks, garages, MoMo kiosks, and buyable businesses
 * - One-click 3D waypoint placement anywhere on Cotonou satellite map
 * - Hybrid, Satellite, and Terrain view toggles
 * - Instant teleportation for developer and player freedom
 */

import React, { useState, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
} from '@vis.gl/react-google-maps';
import { PlayerStats } from '../game/types.ts';
import {
  COTONOU_ORIGIN_LAT,
  COTONOU_ORIGIN_LNG,
  COTONOU_LANDMARKS,
  threeToGeo,
  geoToThree,
} from '../game/geoUtils.ts';
import { GARAGE_LOCATIONS } from '../game/garages.ts';
import { COTONOU_PROPERTIES } from '../game/economy.ts';
import {
  X,
  Compass,
  Navigation,
  Layers,
  MapPin,
  ExternalLink,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Satellite,
  Building,
  Store,
  DollarSign,
  ShieldAlert,
} from 'lucide-react';

interface GpsGoogleMapsModalProps {
  player: PlayerStats;
  ownedPropertyIds?: string[];
  onClose: () => void;
  onTeleport?: (threeX: number, threeZ: number) => void;
  onSetWaypoint?: (threeX: number, threeZ: number, name: string) => void;
}

export const GpsGoogleMapsModal: React.FC<GpsGoogleMapsModalProps> = ({
  player,
  ownedPropertyIds = [],
  onClose,
  onTeleport,
  onSetWaypoint,
}) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const playerGeo = threeToGeo(player.x, player.z);
  const [mapType, setMapType] = useState<'hybrid' | 'satellite' | 'roadmap'>('hybrid');
  const [selectedPlace, setSelectedPlace] = useState<{
    title: string;
    description: string;
    lat: number;
    lng: number;
    threeX: number;
    threeZ: number;
    badge?: string;
    isProperty?: boolean;
    priceFCFA?: number;
    incomePerMin?: number;
  } | null>(null);

  const [waypointNotice, setWaypointNotice] = useState<string | null>(null);

  const handleMapClick = useCallback((e: any) => {
    if (!e.detail.latLng) return;
    const lat = e.detail.latLng.lat;
    const lng = e.detail.latLng.lng;
    const { x, z } = geoToThree(lat, lng);

    if (onSetWaypoint) {
      onSetWaypoint(x, z, 'Repère GPS Satellite');
      setWaypointNotice(`Waypoint placé à (${Math.round(x)}m, ${Math.round(z)}m)`);
      setTimeout(() => setWaypointNotice(null), 3500);
    }
  }, [onSetWaypoint]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 md:p-6 animate-in fade-in duration-200">
      {/* Tablet Bezel Outer Frame */}
      <div className="relative w-full max-w-6xl h-[92vh] bg-slate-900 border-4 border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Tablet Top Status Bar */}
        <div className="bg-slate-950/95 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              GPS SAT-COTONOU // 4G+
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              LAT {playerGeo.lat.toFixed(5)}°N • LNG {playerGeo.lng.toFixed(5)}°E
            </span>
          </div>

          {/* Quick Map Controls */}
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMapType('hybrid')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  mapType === 'hybrid'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Satellite className="w-3.5 h-3.5" />
                Hybride
              </button>
              <button
                type="button"
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  mapType === 'satellite'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Satellite
              </button>
              <button
                type="button"
                onClick={() => setMapType('roadmap')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  mapType === 'roadmap'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Plan
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 border border-slate-700 rounded-lg text-slate-400 transition-colors ml-2"
              title="Fermer la tablette GPS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Waypoint Notice Toast */}
        {waypointNotice && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-amber-500 text-slate-950 font-bold px-4 py-1.5 rounded-full text-xs shadow-lg flex items-center gap-2 animate-bounce">
            <MapPin className="w-4 h-4" />
            {waypointNotice}
          </div>
        )}

        {/* Main Body: Map Viewport + Side Panel */}
        <div className="relative flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Google Maps Container */}
          <div className="relative flex-1 h-full w-full bg-slate-950">
            {apiKey ? (
              <APIProvider apiKey={apiKey}>
                <Map
                  mapId="DEMO_MAP_ID"
                  defaultCenter={{ lat: COTONOU_ORIGIN_LAT, lng: COTONOU_ORIGIN_LNG }}
                  defaultZoom={15}
                  mapTypeId={mapType}
                  gestureHandling="greedy"
                  disableDefaultUI={false}
                  onClick={handleMapClick}
                  className="w-full h-full"
                >
                  {/* 1. Player Live Marker (Zack/Zahra) */}
                  <AdvancedMarker
                    position={{ lat: playerGeo.lat, lng: playerGeo.lng }}
                    title="Position Actuelle (Zack)"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-8 h-8 rounded-full bg-amber-400/30 animate-ping"></div>
                      <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-950 flex items-center justify-center shadow-lg text-slate-950 font-black text-[10px]">
                        ★
                      </div>
                    </div>
                  </AdvancedMarker>

                  {/* 2. Official Landmarks */}
                  {COTONOU_LANDMARKS.map((lm) => (
                    <AdvancedMarker
                      key={lm.name}
                      position={{ lat: lm.lat, lng: lm.lng }}
                      onClick={() => {
                        setSelectedPlace({
                          title: lm.name,
                          description: lm.description || '',
                          lat: lm.lat,
                          lng: lm.lng,
                          threeX: lm.threePos.x,
                          threeZ: lm.threePos.z,
                          badge: 'Lieu Emblématique',
                        });
                      }}
                    >
                      <div className="bg-red-600 hover:bg-red-500 text-white p-1.5 rounded-xl border-2 border-white shadow-xl cursor-pointer hover:scale-110 transition-transform flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                    </AdvancedMarker>
                  ))}

                  {/* 3. Garages */}
                  {GARAGE_LOCATIONS.map((gar) => {
                    const garGeo = threeToGeo(gar.x, gar.z);
                    return (
                      <AdvancedMarker
                        key={gar.id}
                        position={{ lat: garGeo.lat, lng: garGeo.lng }}
                        onClick={() => {
                          setSelectedPlace({
                            title: gar.name,
                            description: `Atelier de mécanique et de tuning à ${gar.district}. Customise tes zémidjans et bolides.`,
                            lat: garGeo.lat,
                            lng: garGeo.lng,
                            threeX: gar.x,
                            threeZ: gar.z,
                            badge: 'Garage & Tuning',
                          });
                        }}
                      >
                        <div className="bg-amber-600 hover:bg-amber-500 text-white p-1.5 rounded-xl border-2 border-white shadow-xl cursor-pointer hover:scale-110 transition-transform">
                          <Store className="w-4 h-4" />
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* 4. Buyable Properties & Businesses */}
                  {COTONOU_PROPERTIES.map((prop) => {
                    const propGeo = threeToGeo(prop.worldX, prop.worldZ);
                    const isOwned = ownedPropertyIds.includes(prop.id);
                    return (
                      <AdvancedMarker
                        key={prop.id}
                        position={{ lat: propGeo.lat, lng: propGeo.lng }}
                        onClick={() => {
                          setSelectedPlace({
                            title: prop.name,
                            description: prop.description,
                            lat: propGeo.lat,
                            lng: propGeo.lng,
                            threeX: prop.worldX,
                            threeZ: prop.worldZ,
                            badge: isOwned ? 'Propriété Acquise' : 'Commerce à Vendre',
                            isProperty: true,
                            priceFCFA: prop.priceFCFA,
                            incomePerMin: prop.incomePerMinFCFA,
                          });
                        }}
                      >
                        <div
                          className={`p-1.5 rounded-xl border-2 border-white shadow-xl cursor-pointer hover:scale-110 transition-transform flex items-center justify-center ${
                            isOwned
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-purple-600 hover:bg-purple-500 text-white'
                          }`}
                        >
                          <Building className="w-4 h-4" />
                        </div>
                      </AdvancedMarker>
                    );
                  })}

                  {/* Info Window for Selected Point */}
                  {selectedPlace && (
                    <InfoWindow
                      position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
                      onCloseClick={() => setSelectedPlace(null)}
                    >
                      <div className="p-1 max-w-xs text-slate-900 font-sans">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                            {selectedPlace.badge}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                          {selectedPlace.title}
                        </h4>
                        <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                          {selectedPlace.description}
                        </p>

                        {selectedPlace.isProperty && (
                          <div className="bg-emerald-50 border border-emerald-200 rounded p-1.5 mb-2 text-xs">
                            <div className="font-bold text-emerald-800">
                              Prix : {selectedPlace.priceFCFA?.toLocaleString('fr-FR')} FCFA
                            </div>
                            <div className="text-emerald-700 font-medium">
                              Rendement : +{selectedPlace.incomePerMin?.toLocaleString('fr-FR')} F/min
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2">
                          {onSetWaypoint && (
                            <button
                              type="button"
                              onClick={() => {
                                onSetWaypoint(selectedPlace.threeX, selectedPlace.threeZ, selectedPlace.title);
                                setWaypointNotice(`Waypoint fixé vers ${selectedPlace.title}`);
                                setSelectedPlace(null);
                              }}
                              className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs py-1.5 px-2 rounded transition-colors text-center"
                            >
                              Balise GPS
                            </button>
                          )}
                          {onTeleport && (
                            <button
                              type="button"
                              onClick={() => {
                                onTeleport(selectedPlace.threeX, selectedPlace.threeZ);
                                onClose();
                              }}
                              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-1.5 px-2.5 rounded transition-colors"
                              title="Téléporter Zack instantanément"
                            >
                              Y aller
                            </button>
                          )}
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <ShieldAlert className="w-12 h-12 text-amber-400 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Clé Google Maps Requise</h3>
                <p className="text-sm text-slate-400 max-w-md mb-4">
                  Vérifiez votre configuration Google Maps Platform dans le fichier d'environnement.
                </p>
              </div>
            )}

            {/* Hint overlay at bottom of map */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs text-slate-300 pointer-events-none flex items-center gap-2 shadow-lg">
              <Crosshair className="w-4 h-4 text-amber-400" />
              Cliquez n'importe où sur Cotonou pour poser un repère GPS 3D
            </div>
          </div>

          {/* Quick Landmark Navigator Side Panel */}
          <div className="w-full md:w-80 bg-slate-900/95 border-t md:border-t-0 md:border-l border-slate-800 flex flex-col p-4 overflow-y-auto max-h-56 md:max-h-full">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Lieux Clés de Cotonou
            </h3>

            <div className="space-y-2 flex-1">
              {COTONOU_LANDMARKS.map((lm) => (
                <div
                  key={lm.name}
                  onClick={() => {
                    setSelectedPlace({
                      title: lm.name,
                      description: lm.description || '',
                      lat: lm.lat,
                      lng: lm.lng,
                      threeX: lm.threePos.x,
                      threeZ: lm.threePos.z,
                      badge: 'Lieu Emblématique',
                    });
                  }}
                  className="p-2.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <h5 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors">
                      {lm.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{lm.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
              ))}

              <div className="pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  Commerces & Entreprises
                </h4>
                {COTONOU_PROPERTIES.map((prop) => {
                  const isOwned = ownedPropertyIds.includes(prop.id);
                  const propGeo = threeToGeo(prop.worldX, prop.worldZ);
                  return (
                    <div
                      key={prop.id}
                      onClick={() => {
                        setSelectedPlace({
                          title: prop.name,
                          description: prop.description,
                          lat: propGeo.lat,
                          lng: propGeo.lng,
                          threeX: prop.worldX,
                          threeZ: prop.worldZ,
                          badge: isOwned ? 'Propriété Acquise' : 'À Vendre',
                          isProperty: true,
                          priceFCFA: prop.priceFCFA,
                          incomePerMin: prop.incomePerMinFCFA,
                        });
                      }}
                      className="p-2 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/40 rounded-lg cursor-pointer transition-all mb-1.5 flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-200">{prop.name}</span>
                          {isOwned && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-mono font-bold">
                              ACQUIS
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          +{prop.incomePerMinFCFA.toLocaleString('fr-FR')} F/min
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {(prop.priceFCFA / 1000).toLocaleString('fr-FR')} kF
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
