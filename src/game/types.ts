/**
 * GTA Cotonou: Vice Littoral - Types and Data Structures
 */

export type GameState = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

export type VehicleType = 'zemidjan' | 'keke' | 'taxi505' | 'gwagon' | 'police';

export interface VehicleConfig {
  type: VehicleType;
  name: string;
  maxSpeed: number; // units/sec
  acceleration: number;
  reverseSpeed: number;
  handling: number;
  braking: number;
  health: number;
  color: string;
  accentColor: string;
  length: number;
  width: number;
  height: number;
}

export interface VehicleCustomization {
  colorHex: string;
  accentHex?: string;
  engineLevel: number; // 0 (stock), 1 (+15%), 2 (+30%), 3 (+50%)
  armorLevel: number;  // 0 (stock), 1 (125%), 2 (150%), 3 (200%)
  neonColorHex?: string | null;
  licensePlate: string;
}

export interface ActiveVehicle {
  id: string;
  type: VehicleType;
  name: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  speed: number;
  steerAngle: number;
  health: number;
  maxHealth: number;
  isPlayerDriving: boolean;
  isPolice: boolean;
  sirenActive: boolean;
  config: VehicleConfig;
  targetX?: number;
  targetZ?: number;
  customization?: VehicleCustomization;
}

export interface GarageLocation {
  id: string;
  name: string;
  district: string;
  x: number;
  z: number;
  radius: number;
  description: string;
}

export interface StoredVehicle {
  id: string;
  type: VehicleType;
  name: string;
  customization: VehicleCustomization;
  storedAtGarageId: string;
  savedAt: number;
}

export interface Pedestrian {
  id: string;
  x: number;
  y: number;
  z: number;
  rotationY: number;
  speed: number;
  state: 'walking' | 'idle' | 'fleeing' | 'down';
  targetX: number;
  targetZ: number;
  outfitColor: string;
  health: number;
  fleeTimer?: number;
}

export type WeaponType = 'fist' | 'bat' | 'pistol';

export interface PlayerStats {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  health: number;
  maxHealth: number;
  armor: number;
  cashFCFA: number;
  wantedStars: number; // 0 to 5
  wantedProgress: number; // timer / threshold
  currentVehicleId: string | null;
  currentWeapon: WeaponType;
  ammo: number;
  stamina: number;
  isInMission: boolean;
}

export interface MissionStage {
  instruction: string;
  targetX: number;
  targetZ: number;
  targetRadius: number;
  requiresVehicleType?: VehicleType;
  spawnPoliceStars?: number;
}

export interface Mission {
  id: string;
  title: string;
  bossName: string;
  locationName: string;
  description: string;
  audioPrompt: string;
  rewardFCFA: number;
  timeLimitSec: number;
  stages: MissionStage[];
}

export interface ActiveMissionState {
  mission: Mission;
  currentStageIndex: number;
  timeLeft: number;
  completed: boolean;
  failed: boolean;
  failReason?: string;
}

export interface RadioStation {
  id: string;
  name: string;
  freq: string;
  genre: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  ttsEnabled: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';
  timeOfDay: 'noon' | 'sunset' | 'night';
}
