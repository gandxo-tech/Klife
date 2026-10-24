/**
 * GTA Cotonou - Pure Game Rules & Physics Calculations
 * Decoupled from UI and Three.js for deterministic testing
 */

import { VehicleConfig, VehicleType } from './types.ts';

export const VEHICLE_CONFIGS: Record<VehicleType, VehicleConfig> = {
  zemidjan: {
    type: 'zemidjan',
    name: 'Zémidjan 125cc (Moto)',
    maxSpeed: 42,
    acceleration: 30,
    reverseSpeed: 8,
    handling: 4.2,
    braking: 35,
    health: 120,
    color: '#FFCC00', // Iconic yellow
    accentColor: '#1A1A1A',
    length: 2.2,
    width: 0.9,
    height: 1.2,
  },
  keke: {
    type: 'keke',
    name: 'Kéké Tricycle Bajaj',
    maxSpeed: 30,
    acceleration: 20,
    reverseSpeed: 10,
    handling: 3.2,
    braking: 25,
    health: 220,
    color: '#2E7D32', // Green/yellow Cotonou tricycle
    accentColor: '#FDD835',
    length: 3.0,
    width: 1.5,
    height: 1.8,
  },
  taxi505: {
    type: 'taxi505',
    name: 'Peugeot 505 Taxi Jaune & Vert',
    maxSpeed: 45,
    acceleration: 24,
    reverseSpeed: 12,
    handling: 2.6,
    braking: 28,
    health: 350,
    color: '#FBC02D', // Yellow base
    accentColor: '#1B5E20', // Green roof
    length: 4.6,
    width: 1.9,
    height: 1.45,
  },
  gwagon: {
    type: 'gwagon',
    name: 'SUV 4x4 Haie Vive V8',
    maxSpeed: 52,
    acceleration: 32,
    reverseSpeed: 15,
    handling: 2.8,
    braking: 34,
    health: 550,
    color: '#212121', // Luxury matte black
    accentColor: '#B0BEC5',
    length: 4.8,
    width: 2.1,
    height: 1.95,
  },
  police: {
    type: 'police',
    name: 'Cruiser Police Républicaine',
    maxSpeed: 50,
    acceleration: 34,
    reverseSpeed: 15,
    handling: 3.0,
    braking: 36,
    health: 480,
    color: '#FAFAFA', // White & Blue Police Républicaine
    accentColor: '#0D47A1',
    length: 4.7,
    width: 2.0,
    height: 1.55,
  },
};

/**
 * Format currency amount with space separators according to West African FCFA standard
 */
export function formatFCFA(amount: number): string {
  const rounded = Math.floor(Math.max(0, amount));
  const parts = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${parts} FCFA`;
}

/**
 * 2D Euclidean distance helper
 */
export function calculateDistance(x1: number, z1: number, x2: number, z2: number): number {
  const dx = x1 - x2;
  const dz = z1 - z2;
  return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Check if player is inside the stage target radius and meets vehicle constraints
 */
export function checkStageCompletion(
  playerX: number,
  playerZ: number,
  targetX: number,
  targetZ: number,
  radius: number,
  currentVehicleType: VehicleType | null,
  requiredVehicleType?: VehicleType
): boolean {
  const dist = calculateDistance(playerX, playerZ, targetX, targetZ);
  if (dist > radius) return false;

  if (requiredVehicleType) {
    return currentVehicleType === requiredVehicleType;
  }
  return true;
}

/**
 * Update wanted star status and decay timer
 */
export function updateWantedState(
  currentStars: number,
  progress: number,
  isPoliceChasing: boolean,
  dt: number
): { stars: number; progress: number } {
  if (currentStars <= 0) {
    return { stars: 0, progress: 0 };
  }

  // If police is actively chasing, cooldown timer does not decay
  if (isPoliceChasing) {
    return { stars: currentStars, progress: Math.min(progress + dt * 2, 60) };
  }

  // Hiding: progress decays until a star drops
  const newProgress = progress - dt * 4;
  if (newProgress <= 0) {
    const newStars = Math.max(0, currentStars - 1);
    return {
      stars: newStars,
      progress: newStars > 0 ? 30 : 0,
    };
  }

  return { stars: currentStars, progress: newProgress };
}

/**
 * Add wanted stars on crime (capped at 5)
 */
export function applyCrimeWanted(currentStars: number, starBonus: number): { stars: number; progress: number } {
  const nextStars = Math.min(5, Math.max(currentStars, currentStars + starBonus));
  return {
    stars: nextStars,
    progress: 40 + nextStars * 15,
  };
}

/**
 * Converts 3D world coordinates to a 2D radar minimap position
 * Center is (centerX, centerY), mapRadius is maximum visible world units
 */
export function worldToMinimapCoords(
  targetX: number,
  targetZ: number,
  playerX: number,
  playerZ: number,
  playerHeading: number,
  mapRadius: number,
  radarSizePx: number
): { x: number; y: number; inBounds: boolean; angle: number } {
  const dx = targetX - playerX;
  const dz = targetZ - playerZ;
  const dist = Math.sqrt(dx * dx + dz * dz);

  // Rotate relative to player heading so radar is heading-up
  const angle = Math.atan2(dz, dx) - playerHeading + Math.PI / 2;

  const halfSize = radarSizePx / 2;
  const maxRadiusPx = halfSize - 8;

  const scale = maxRadiusPx / mapRadius;
  const clampedDistPx = Math.min(dist * scale, maxRadiusPx);

  const x = halfSize + Math.sin(angle) * clampedDistPx;
  const y = halfSize - Math.cos(angle) * clampedDistPx;

  return {
    x,
    y,
    inBounds: dist <= mapRadius,
    angle,
  };
}

/**
 * Step vehicle physics simulation
 */
export function stepVehiclePhysics(
  currentSpeed: number,
  currentRotationY: number,
  throttle: number, // -1 (reverse/brake) to 1 (accelerate)
  steer: number,    // -1 (left) to 1 (right)
  config: VehicleConfig,
  dt: number
): { speed: number; rotationY: number; deltaX: number; deltaZ: number } {
  let speed = currentSpeed;
  let rotationY = currentRotationY;

  // Acceleration / braking
  if (throttle > 0) {
    speed += throttle * config.acceleration * dt;
    if (speed > config.maxSpeed) speed = config.maxSpeed;
  } else if (throttle < 0) {
    if (speed > 0.5) {
      // Braking while going forward
      speed -= config.braking * dt;
      if (speed < 0) speed = 0;
    } else {
      // Reversing
      speed += throttle * (config.acceleration * 0.6) * dt;
      if (speed < -config.reverseSpeed) speed = -config.reverseSpeed;
    }
  } else {
    // Natural friction drag
    if (speed > 0) {
      speed = Math.max(0, speed - 15 * dt);
    } else if (speed < 0) {
      speed = Math.min(0, speed + 15 * dt);
    }
  }

  // Steering is proportional to movement speed
  if (Math.abs(speed) > 0.2) {
    const steerDir = speed >= 0 ? 1 : -1;
    const steerFactor = Math.min(1, Math.abs(speed) / 10);
    rotationY -= steer * config.handling * steerFactor * steerDir * dt;
  }

  const deltaX = Math.sin(rotationY) * speed * dt;
  const deltaZ = Math.cos(rotationY) * speed * dt;

  return { speed, rotationY, deltaX, deltaZ };
}

/**
 * Circular collision detection
 */
export function checkCircleCollision(
  x1: number,
  z1: number,
  r1: number,
  x2: number,
  z2: number,
  r2: number
): boolean {
  const dx = x1 - x2;
  const dz = z1 - z2;
  const minDist = r1 + r2;
  return dx * dx + dz * dz < minDist * minDist;
}
