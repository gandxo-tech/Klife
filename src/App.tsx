/**
 * GTA Cotonou: Vice Littoral - Main Application Entry
 * Full-viewport 3D Game Shell adhering to Three.js and Ultra-mode guidelines
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameEngine } from './game/GameEngine.ts';
import { ActiveMissionState, ActiveVehicle, GameState, GarageLocation, PlayerStats } from './game/types.ts';
import { TitleScreen } from './components/TitleScreen.tsx';
import { HUD } from './components/HUD.tsx';
import { MissionsModal } from './components/MissionsModal.tsx';
import { PauseModal } from './components/PauseModal.tsx';
import { HowToPlayModal } from './components/HowToPlayModal.tsx';
import { GameResultModal } from './components/GameResultModal.tsx';
import { OpenFreeMapModal } from './components/OpenFreeMapModal.tsx';
import { GpsGoogleMapsModal } from './components/GpsGoogleMapsModal.tsx';
import { PhoneModal } from './components/PhoneModal.tsx';
import { CharacterCreatorModal, CharacterConfig } from './components/CharacterCreatorModal.tsx';
import { GarageModal } from './components/GarageModal.tsx';
import {
  PlayerEconomyState,
  createInitialEconomy,
  updatePassiveDividends,
  simulateMarketFluctuation,
  EconomicJob,
  applyArrestConfiscation,
} from './game/economy.ts';
import { Mission } from './game/types.ts';

export default function App() {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [gameState, setGameState] = useState<GameState>('title');
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    x: 0,
    y: 0,
    z: 0,
    rotationY: Math.PI,
    health: 100,
    maxHealth: 100,
    armor: 50,
    cashFCFA: 50000,
    wantedStars: 0,
    wantedProgress: 0,
    currentVehicleId: null,
    currentWeapon: 'fist',
    ammo: 30,
    stamina: 100,
    isInMission: false,
  });

  const [activeVehicle, setActiveVehicle] = useState<ActiveVehicle | null>(null);
  const [activeMission, setActiveMission] = useState<ActiveMissionState | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [interactionTip, setInteractionTip] = useState<string | null>(null);
  const [notificationTimer, setNotificationTimer] = useState<any>(null);

  const [characterCreatorOpen, setCharacterCreatorOpen] = useState(false);
  const [missionsModalOpen, setMissionsModalOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [openFreeMapOpen, setOpenFreeMapOpen] = useState(false);
  const [gpsGoogleMapsOpen, setGpsGoogleMapsOpen] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [activeGarageModal, setActiveGarageModal] = useState<GarageLocation | null>(null);
  const [victoryData, setVictoryData] = useState<{ title: string; reward: number } | null>(null);

  // Economy state
  const [economy, setEconomy] = useState<PlayerEconomyState>(() => createInitialEconomy(50000));

  const triggerNotification = useCallback((text: string) => {
    setNotification(text);
    if (notificationTimer) clearTimeout(notificationTimer);
    const timer = setTimeout(() => {
      setNotification(null);
    }, 4000);
    setNotificationTimer(timer);
  }, [notificationTimer]);

  const handleUpdateEconomy = useCallback((newEco: PlayerEconomyState) => {
    setEconomy(newEco);
    if (engineRef.current) {
      engineRef.current.player.cashFCFA = newEco.cashFCFA;
    }
  }, []);

  // Periodic passive dividends & commodities fluctuation
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setEconomy((prev) => {
        const withDivs = updatePassiveDividends(prev);
        return simulateMarketFluctuation(withDivs);
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Mount 3D Game Engine once
  useEffect(() => {
    if (!canvasMountRef.current) return;

    const engine = new GameEngine(canvasMountRef.current, {
      onStatsUpdate: (stats) => {
        setPlayerStats(stats);
        setEconomy((prev) => {
          if (prev.cashFCFA !== stats.cashFCFA) {
            return { ...prev, cashFCFA: stats.cashFCFA };
          }
          return prev;
        });
      },
      onMissionUpdate: (mission) => setActiveMission(mission),
      onVehicleUpdate: (veh) => setActiveVehicle(veh),
      onNotification: (text) => triggerNotification(text),
      onOpenCharacterCreator: () => setCharacterCreatorOpen(true),
      onOpenGarageModal: (garage) => setActiveGarageModal(garage),
      onOpenPhone: () => setPhoneModalOpen(true),
      onInteractionTip: (tip) => setInteractionTip(tip),
      onGameOver: () => {
        setGameState('gameover');
        setEconomy((prev) => {
          const { state, lostCash } = applyArrestConfiscation(prev);
          if (lostCash > 0) {
            triggerNotification(`Arrestation : ${lostCash.toLocaleString('fr-FR')} FCFA saisis ! Vos fonds MoMo sont saufs.`);
          }
          return state;
        });
      },
      onVictory: (title, reward) => {
        setVictoryData({ title, reward });
        setGameState('victory');
      },
    });

    engineRef.current = engine;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('autostart') === '1') {
      engine.startGame();
      setGameState('playing');
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGameState((prev) => {
          if (prev === 'playing') {
            engine.setGameState('paused');
            return 'paused';
          } else if (prev === 'paused') {
            engine.setGameState('playing');
            return 'playing';
          }
          return prev;
        });
      }
      if (e.key.toLowerCase() === 'm') {
        setGpsGoogleMapsOpen((prev) => !prev);
      }
      if (e.key.toLowerCase() === 'p') {
        setPhoneModalOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleStartGame = () => {
    if (engineRef.current) {
      engineRef.current.startGame();
      setGameState('playing');
    }
  };

  const handleSelectMission = (missionId: string) => {
    if (engineRef.current) {
      if (engineRef.current.isIndoorBedroom) {
        engineRef.current.exitBedroomToCity();
      }
      engineRef.current.startMission(missionId);
    }
  };

  const handleEnterExitVehicle = () => {
    if (engineRef.current) {
      engineRef.current.handleActionTrigger();
    }
  };

  const handleAttack = () => {
    if (engineRef.current) {
      engineRef.current.triggerAttack();
    }
  };

  const handleResume = () => {
    if (engineRef.current) {
      engineRef.current.setGameState('playing');
      setGameState('playing');
    }
  };

  const handleRestart = () => {
    if (engineRef.current) {
      engineRef.current.cancelMission();
      engineRef.current.setGameState('title');
      setGameState('title');
    }
  };

  const handleContinueAfterGameOver = () => {
    if (engineRef.current) {
      engineRef.current.player.health = 100;
      engineRef.current.player.wantedStars = 0;
      engineRef.current.player.x = -50;
      engineRef.current.player.z = -105;
      engineRef.current.isIndoorBedroom = false;
      engineRef.current.setGameState('playing');
      setGameState('playing');
      triggerNotification('Réapparu dans le quartier Sikè-Fictif à Cotonou !');
    }
  };

  const handleConfirmCharacter = (config: CharacterConfig) => {
    if (engineRef.current) {
      engineRef.current.applyCharacterConfig(config);
    }
  };

  const handleStartEconomicJob = (job: EconomicJob) => {
    if (engineRef.current) {
      if (engineRef.current.isIndoorBedroom) {
        engineRef.current.exitBedroomToCity();
      }
      const customMission: Mission = {
        id: job.id,
        title: job.title,
        bossName: job.employer,
        locationName: job.targetDistrict,
        description: job.description,
        audioPrompt: `${job.employer} : ${job.description}`,
        rewardFCFA: job.rewardFCFA,
        timeLimitSec: job.durationSec,
        stages: [
          {
            instruction: `Rejoindre ${job.targetDistrict} a Cotonou`,
            targetX: job.targetX,
            targetZ: job.targetZ,
            targetRadius: 18,
            spawnPoliceStars: job.wantedStarsOnStart,
          },
        ],
      };
      engineRef.current.startCustomMission(customMission);
      if (job.wantedStarsOnStart > 0) {
        engineRef.current.player.wantedStars = Math.max(
          engineRef.current.player.wantedStars,
          job.wantedStarsOnStart
        );
      }
      setPhoneModalOpen(false);
      setGpsGoogleMapsOpen(false);
      triggerNotification(`Mission lancee : ${job.title} (+${job.rewardFCFA.toLocaleString('fr-FR')} FCFA)`);
    }
  };

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none"
      data-state={gameState}
    >
      {/* 1. WebGL Mount Container */}
      <div
        ref={canvasMountRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
        data-testid="webgl-canvas-container"
      />

      {/* 2. Title Screen Shell */}
      {gameState === 'title' && (
        <TitleScreen
          onStartGame={handleStartGame}
          onSelectMission={handleSelectMission}
          onOpenHowToPlay={() => setHowToPlayOpen(true)}
          onOpenMap={() => setOpenFreeMapOpen(true)}
        />
      )}

      {/* 3. In-Game HUD Overlay */}
      {gameState === 'playing' && (
        <HUD
          player={playerStats}
          bankMoMoFCFA={economy.bankMoMoFCFA}
          vehicles={engineRef.current ? (engineRef.current as any).vehicles || [] : []}
          trafficVehicles={engineRef.current ? engineRef.current.getTrafficVehicles() : []}
          activeVehicle={activeVehicle}
          activeMission={activeMission}
          notification={notification}
          interactionTip={interactionTip}
          onOpenMissions={() => setMissionsModalOpen(true)}
          onOpenMap={() => setGpsGoogleMapsOpen(true)}
          onOpenGoogleMaps={() => setGpsGoogleMapsOpen(true)}
          onOpenPhone={() => setPhoneModalOpen(true)}
          onOpenCustomizer={() => setCharacterCreatorOpen(true)}
          onOpenPause={() => {
            engineRef.current?.setGameState('paused');
            setGameState('paused');
          }}
          onEnterExitVehicle={handleEnterExitVehicle}
          onAttack={handleAttack}
          onVirtualMove={(x, z) => {
            if (engineRef.current) {
              engineRef.current.virtualInput.moveX = x;
              engineRef.current.virtualInput.moveZ = z;
            }
          }}
          onVirtualThrottle={(throttle) => {
            if (engineRef.current) {
              engineRef.current.virtualInput.moveZ = throttle;
            }
          }}
          onVirtualSprint={(sprint) => {
            if (engineRef.current) {
              engineRef.current.virtualInput.sprint = sprint;
            }
          }}
          onHonk={() => {
            if (engineRef.current) {
              engineRef.current.honkHorn();
            }
          }}
        />
      )}

      {/* 4. Pause Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={handleResume}
          onRestart={handleRestart}
          onOpenHowToPlay={() => setHowToPlayOpen(true)}
        />
      )}

      {/* 5. Game Over / Victory Modal */}
      {gameState === 'gameover' && (
        <GameResultModal
          type="gameover"
          onRestart={handleRestart}
          onContinue={handleContinueAfterGameOver}
        />
      )}

      {gameState === 'victory' && victoryData && (
        <GameResultModal
          type="victory"
          title={victoryData.title}
          rewardFCFA={victoryData.reward}
          onRestart={handleRestart}
          onContinue={() => {
            setGameState('playing');
            engineRef.current?.setGameState('playing');
          }}
        />
      )}

      {/* 6. Character Customizer Modal (Indoor Bedroom Mirror) */}
      {characterCreatorOpen && (
        <CharacterCreatorModal
          initialConfig={engineRef.current?.currentCharacterConfig}
          onConfirm={handleConfirmCharacter}
          onClose={() => setCharacterCreatorOpen(false)}
        />
      )}

      {/* 7. Missions Modal */}
      {missionsModalOpen && (
        <MissionsModal
          onClose={() => setMissionsModalOpen(false)}
          onStartMission={(id) => {
            handleSelectMission(id);
            setGameState('playing');
          }}
          currentMissionId={activeMission?.mission.id}
        />
      )}

      {/* 8. How To Play Modal */}
      {howToPlayOpen && <HowToPlayModal onClose={() => setHowToPlayOpen(false)} />}

      {/* 9. OpenFreeMap GPS Tablet Modal */}
      {openFreeMapOpen && (
        <OpenFreeMapModal
          player={playerStats}
          onClose={() => setOpenFreeMapOpen(false)}
          onTeleport={(x, z) => engineRef.current?.teleportPlayer(x, z)}
          onSetWaypoint={(x, z, name) => engineRef.current?.setCustomWaypoint(x, z, name)}
          onAdd3DRoadMesh={(road) => engineRef.current?.add3DRoadMesh(road)}
        />
      )}

      {/* 10. Google Maps Platform Satellite GPS Tablet Modal */}
      {gpsGoogleMapsOpen && (
        <GpsGoogleMapsModal
          player={playerStats}
          ownedPropertyIds={economy.ownedPropertyIds}
          onClose={() => setGpsGoogleMapsOpen(false)}
          onTeleport={(x, z) => engineRef.current?.teleportPlayer(x, z)}
          onSetWaypoint={(x, z, name) => engineRef.current?.setCustomWaypoint(x, z, name)}
        />
      )}

      {/* 11. Smartphone In-Game (Kobo Invest, MoMo Pay, Jobs & Heists) */}
      {phoneModalOpen && (
        <PhoneModal
          economy={economy}
          onUpdateEconomy={handleUpdateEconomy}
          onStartJob={handleStartEconomicJob}
          onClose={() => setPhoneModalOpen(false)}
          onNotification={(msg) => triggerNotification(msg)}
        />
      )}

      {/* 12. Garage Tuning & Storage Workshop Modal */}
      {activeGarageModal && (
        <GarageModal
          garage={activeGarageModal}
          player={playerStats}
          activeVehicle={activeVehicle}
          storedVehicles={engineRef.current?.storedVehicles || []}
          onClose={() => setActiveGarageModal(null)}
          onApplyCustomization={(vehId, cust, cost) => {
            engineRef.current?.applyVehicleCustomization(vehId, cust, cost);
          }}
          onStoreVehicle={(vehId, garId) => {
            engineRef.current?.storeCurrentVehicle(garId);
            setActiveGarageModal(null);
          }}
          onSpawnStoredVehicle={(storedId, gar) => {
            engineRef.current?.spawnStoredVehicle(storedId, gar);
            setActiveGarageModal(null);
          }}
          onNotification={(msg) => triggerNotification(msg)}
        />
      )}
    </main>
  );
}
