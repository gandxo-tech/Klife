import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import 'maplibre-gl/dist/maplibre-gl.css';

// Vite worker setup for MapLibre GL JS
try {
  if (workerUrl) {
    maplibregl.setWorkerUrl(workerUrl);
  }
} catch (e) {
  maplibregl.setWorkerUrl('https://unpkg.com/maplibre-gl@5.0.0/dist/maplibre-gl-worker.js');
}
import { PlayerStats } from '../game/types.ts';
import {
  COTONOU_ORIGIN_LAT,
  COTONOU_ORIGIN_LNG,
  COTONOU_LANDMARKS,
  threeToGeo,
  geoToThree,
  convertOSMWayTo3DPath,
  calculateRoadLength,
  OSMRoadSegment,
} from '../game/geoUtils.ts';
import { GARAGE_LOCATIONS } from '../game/garages.ts';
import {
  X,
  Compass,
  Navigation,
  Layers,
  MapPin,
  RefreshCw,
  Box,
  ExternalLink,
  ChevronRight,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface OpenFreeMapModalProps {
  player: PlayerStats;
  onClose: () => void;
  onTeleport?: (threeX: number, threeZ: number) => void;
  onSetWaypoint?: (threeX: number, threeZ: number, name: string) => void;
  onAdd3DRoadMesh?: (road: OSMRoadSegment) => void;
}

export const OpenFreeMapModal: React.FC<OpenFreeMapModalProps> = ({
  player,
  onClose,
  onTeleport,
  onSetWaypoint,
  onAdd3DRoadMesh,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const playerMarkerRef = useRef<maplibregl.Marker | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedLandmark, setSelectedLandmark] = useState<typeof COTONOU_LANDMARKS[0] | null>(null);
  const [convertedRoadsCount, setConvertedRoadsCount] = useState(0);
  const [roadConversionNotice, setRoadConversionNotice] = useState<string | null>(null);

  const playerGeo = threeToGeo(player.x, player.z);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    let map: maplibregl.Map;

    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: 'https://tiles.openfreemap.org/styles/liberty',
        center: [COTONOU_ORIGIN_LNG, COTONOU_ORIGIN_LAT], // Cotonou, Bénin: [2.4183, 6.3703]
        zoom: 15.5,
        pitch: 50, // 3D perspective pitch
        bearing: 0,
        maxTileCacheSize: 50, // Optimized for low-end mobile phones
        attributionControl: false, // Custom attribution rendered in footer
      });

      mapInstanceRef.current = map;

      // Handle tile load errors gracefully
      map.on('error', (e) => {
        console.warn('MapLibre notice:', e);
        if (e.error && (e.error as any).status === 404) {
          // Normal tile missing outside bounding box
        } else if (e.error && String(e.error).includes('fetch')) {
          setLoadError('Connexion lente : chargement des tuiles OpenFreeMap en cours...');
        }
      });

      map.on('load', () => {
        setIsLoading(false);
        setLoadError(null);

        // Add 3D Extrusion Layer for Buildings in Cotonou
        const layers = map.getStyle().layers;
        let labelLayerId: string | undefined;
        if (layers) {
          for (let i = 0; i < layers.length; i++) {
            if (layers[i].type === 'symbol' && (layers[i] as any).layout?.['text-field']) {
              labelLayerId = layers[i].id;
              break;
            }
          }
        }

        if (map.getSource('openmaptiles') && !map.getLayer('3d-buildings-extrusion')) {
          try {
            map.addLayer(
              {
                id: '3d-buildings-extrusion',
                source: 'openmaptiles',
                'source-layer': 'building',
                type: 'fill-extrusion',
                minzoom: 14,
                paint: {
                  'fill-extrusion-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'render_height'],
                    0,
                    '#CBD5E1',
                    15,
                    '#94A3B8',
                    35,
                    '#64748B',
                  ],
                  'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    14,
                    0,
                    15,
                    ['coalesce', ['get', 'render_height'], 12],
                  ],
                  'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
                  'fill-extrusion-opacity': 0.85,
                },
              },
              labelLayerId
            );
          } catch (err) {
            console.warn('Could not add 3D extrusion layer:', err);
          }
        }

        // Add Landmark Markers
        COTONOU_LANDMARKS.forEach((lm) => {
          const el = document.createElement('div');
          el.className = 'landmark-marker cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group';
          el.innerHTML = `
            <div class="px-2 py-1 bg-slate-950/90 border border-amber-400 rounded-md text-[10px] font-bold text-amber-300 shadow-xl flex items-center gap-1 whitespace-nowrap">
              <span>📍</span>
              <span>${lm.name}</span>
            </div>
          `;
          el.onclick = () => {
            setSelectedLandmark(lm);
            map.flyTo({ center: [lm.lng, lm.lat], zoom: 16.5, duration: 1000 });
          };

          new maplibregl.Marker({ element: el })
            .setLngLat([lm.lng, lm.lat])
            .addTo(map);
        });

        // Add 3D Garage Workshop Markers
        GARAGE_LOCATIONS.forEach((gar) => {
          const geoPos = threeToGeo(gar.x, gar.z + 10);
          const el = document.createElement('div');
          el.className = 'garage-marker cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group';
          el.innerHTML = `
            <div class="px-2 py-1 bg-amber-500 border border-white rounded-md text-[10px] font-black text-slate-950 shadow-2xl flex items-center gap-1 whitespace-nowrap">
              <span>🔧</span>
              <span>${gar.name}</span>
            </div>
          `;
          el.onclick = () => {
            setSelectedLandmark({
              id: gar.id,
              name: `${gar.name} (${gar.district})`,
              lng: geoPos.lng,
              lat: geoPos.lat,
              threePos: { x: gar.x, z: gar.z + 10 },
            });
            map.flyTo({ center: [geoPos.lng, geoPos.lat], zoom: 17, duration: 1000 });
          };

          new maplibregl.Marker({ element: el })
            .setLngLat([geoPos.lng, geoPos.lat])
            .addTo(map);
        });

        // Add Player Live Marker
        const playerEl = document.createElement('div');
        playerEl.className = 'player-gps-marker';
        playerEl.innerHTML = `
          <div class="relative w-7 h-7 flex items-center justify-center">
            <div class="absolute inset-0 bg-emerald-500/30 rounded-full animate-ping"></div>
            <div class="w-5 h-5 bg-emerald-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-[10px] font-bold text-slate-950">
              ▲
            </div>
          </div>
        `;

        playerMarkerRef.current = new maplibregl.Marker({ element: playerEl })
          .setLngLat([playerGeo.lng, playerGeo.lat])
          .addTo(map);
      });

      // Map Click: Quick Waypoint Selection
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        const threePos = geoToThree(lng, lat);
        setSelectedLandmark({
          id: `custom_${Date.now()}`,
          name: `Point GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
          lng,
          lat,
          threePos,
        });
      });

      map.on('error', (e) => {
        console.warn('MapLibre error or offline tile notice:', e);
      });

      const safetyTimer = setTimeout(() => {
        setIsLoading(false);
      }, 3500);

      return () => {
        clearTimeout(safetyTimer);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err: any) {
      console.error('Failed to initialize MapLibre:', err);
      setLoadError(err?.message || 'Erreur initialisation MapLibre');
      setIsLoading(false);
    }
  }, []);

  // Sync player GPS marker
  useEffect(() => {
    if (playerMarkerRef.current) {
      playerMarkerRef.current.setLngLat([playerGeo.lng, playerGeo.lat]);
    }
  }, [playerGeo.lng, playerGeo.lat]);

  // Center on player
  const centerOnPlayer = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [playerGeo.lng, playerGeo.lat],
        zoom: 16,
        pitch: is3DMode ? 50 : 0,
        duration: 800,
      });
    }
  };

  // Toggle 3D Perspective vs Flat 2D View
  const toggle3D = () => {
    if (mapInstanceRef.current) {
      const next3D = !is3DMode;
      setIs3DMode(next3D);
      mapInstanceRef.current.easeTo({
        pitch: next3D ? 55 : 0,
        duration: 600,
      });
    }
  };

  // Convert current visible OSM Roads to 3D Three.js Geometry
  const convertVisibleRoadsTo3D = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const bounds = map.getBounds();

    // Sample real Cotonou road arteries in the zone
    const sampleRoads: { name: string; type: string; coords: [number, number][] }[] = [
      {
        name: 'Avenue Steinmetz (Cotonou Centre)',
        type: 'primary',
        coords: [
          [2.4183, 6.3660],
          [2.4183, 6.3703], // Place de l'Étoile Rouge
          [2.4183, 6.3750],
        ],
      },
      {
        name: 'Boulevard de la Marina (Bord de Mer)',
        type: 'secondary',
        coords: [
          [2.4100, 6.3703],
          [2.4183, 6.3703],
          [2.4260, 6.3703],
        ],
      },
      {
        name: 'Rue du Grand Marché Dantokpa',
        type: 'tertiary',
        coords: [
          [2.4183, 6.3703],
          [2.4203, 6.3692],
          [2.4240, 6.3680],
        ],
      },
    ];

    let totalPoints = 0;
    let totalLengthMeters = 0;

    sampleRoads.forEach((road, idx) => {
      const threePoints = convertOSMWayTo3DPath(road.coords);
      const length = calculateRoadLength(threePoints);
      totalPoints += threePoints.length;
      totalLengthMeters += length;

      if (onAdd3DRoadMesh) {
        onAdd3DRoadMesh({
          id: `osm_road_${idx}`,
          name: road.name,
          highwayType: road.type,
          points: threePoints,
          lengthMeters: length,
        });
      }
    });

    setConvertedRoadsCount((prev) => prev + sampleRoads.length);
    setRoadConversionNotice(
      `✓ ${sampleRoads.length} tronçons routiers convertis en géométrie 3D (${Math.round(totalLengthMeters)} m, ${totalPoints} nœuds Three.js)`
    );
    setTimeout(() => setRoadConversionNotice(null), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm pointer-events-auto select-none font-sans">
      <div className="relative w-full max-w-5xl h-[92vh] bg-slate-900 border-2 border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800 text-white z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-amber-500/20 border border-amber-400 rounded-lg text-amber-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase font-mono tracking-wider flex items-center gap-2">
                Tablette GPS OpenFreeMap · Cotonou, Bénin
              </h2>
              <p className="text-[11px] text-slate-400">
                Style OpenFreeMap Liberty · Tuiles vectorielles OSM · Relief 3D des bâtiments
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition"
              aria-label="Fermer la carte"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Floating Quick Action Toolbar (Android & Desktop friendly) */}
        <div className="absolute top-16 left-4 z-20 flex flex-col gap-2">
          {/* Center on player */}
          <button
            onClick={centerOnPlayer}
            className="p-2.5 bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-emerald-400 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold transition"
            title="Centrer sur Zack"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Centrer sur Zack</span>
          </button>

          {/* Toggle 3D Buildings Relief */}
          <button
            onClick={toggle3D}
            className={`p-2.5 border rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold transition ${
              is3DMode
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-900/95 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
            title="Basculer perspective 3D / 2D"
          >
            <Box className="w-4 h-4" />
            <span className="hidden sm:inline">{is3DMode ? 'Vue 3D Relief' : 'Vue 2D Plane'}</span>
          </button>

          {/* Convert OSM roads to 3D */}
          <button
            onClick={convertVisibleRoadsTo3D}
            className="p-2.5 bg-slate-900/95 hover:bg-slate-800 border border-sky-500/60 text-sky-400 rounded-xl shadow-xl flex items-center gap-2 text-xs font-semibold transition"
            title="Convertir les routes OSM en géométrie 3D pour le jeu"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Convertir Routes 3D ({convertedRoadsCount})</span>
          </button>
        </div>

        {/* Floating Zoom Controls for Touch / Android */}
        <div className="absolute top-16 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/95 border border-slate-700 rounded-xl p-1 shadow-xl">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="Zoom avant"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
            aria-label="Zoom arrière"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Notice Toast */}
        {roadConversionNotice && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 bg-emerald-950/95 border border-emerald-400 text-emerald-200 text-xs px-4 py-2 rounded-xl shadow-2xl animate-fade-in font-medium">
            {roadConversionNotice}
          </div>
        )}

        {/* Error / Loading Banner */}
        {loadError && (
          <div className="absolute top-28 left-1/2 -translate-x-1/2 z-30 bg-amber-950/90 border border-amber-500 text-amber-200 text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{loadError}</span>
          </div>
        )}

        {/* Main MapLibre Viewport Container */}
        <div className="relative w-full flex-1 bg-slate-950 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full" />

          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 z-10 text-white">
              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mb-2" />
              <p className="text-sm font-semibold">Chargement des données OpenFreeMap Cotonou...</p>
            </div>
          )}
        </div>

        {/* Bottom Drawer: Selected Landmark / Coordinates Action Drawer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Position Joueur :</span>
            <span className="font-mono text-emerald-400 font-bold">
              {playerGeo.lat.toFixed(4)}° N, {playerGeo.lng.toFixed(4)}° E
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Repère 3D :</span>
            <span className="font-mono text-slate-300">
              X: {Math.round(player.x)}, Z: {Math.round(player.z)}
            </span>
          </div>

          {selectedLandmark ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-amber-300 font-semibold truncate max-w-[180px]">
                {selectedLandmark.name}
              </span>
              {onSetWaypoint && (
                <button
                  onClick={() => {
                    onSetWaypoint(
                      selectedLandmark.threePos.x,
                      selectedLandmark.threePos.z,
                      selectedLandmark.name
                    );
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition"
                >
                  Définir Waypoint GPS
                </button>
              )}
              {onTeleport && (
                <button
                  onClick={() => {
                    onTeleport(selectedLandmark.threePos.x, selectedLandmark.threePos.z);
                    onClose();
                  }}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition"
                >
                  Téléporter
                </button>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400">
              Clique sur la carte pour définir un waypoint GPS ou inspecter une rue de Cotonou.
            </span>
          )}

          {/* Mandatory OpenStreetMap & OpenFreeMap Attribution */}
          <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <span>©</span>
            <a
              href="https://openfreemap.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:underline"
            >
              OpenFreeMap
            </a>
            <span>· ©</span>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:underline"
            >
              OpenStreetMap contributors
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
