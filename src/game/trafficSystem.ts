/**
 * GTA Cotonou - Autonomous AI Traffic System
 * Manages 10-15 AI vehicles (Zémidjans, Taxis, Tokpa-Tokpa Minibuses)
 * driving on Cotonou road networks with obstacle avoidance and dynamic horn/siren reactions.
 */

import * as THREE from 'three';
import { createZemidjanMesh, createTaxi505Mesh, createTokpaTokpaBusMesh } from './models.ts';
import { calculateDistance } from './rules.ts';

export type AIVehicleType = 'zemidjan' | 'taxi' | 'bus';

export interface Waypoint {
  x: number;
  z: number;
}

export interface AIVehicle {
  id: string;
  type: AIVehicleType;
  mesh: THREE.Group;
  x: number;
  z: number;
  speed: number;
  maxSpeed: number;
  rotation: number;
  path: Waypoint[];
  currentWaypointIndex: number;
  panicTimer: number;
  lateralOffset: number;
  targetLateralOffset: number;
}

// Cotonou Road Loops (Waypoints realistically circumnavigating Place de l'Étoile Rouge roundabout)
export const COTONOU_TRAFFIC_PATHS: Waypoint[][] = [
  // Loop 1: Étoile Rouge Roundabout -> Dantokpa -> Nokoué Avenue -> Étoile Rouge
  [
    { x: 32, z: -4 },
    { x: 96, z: -4 },
    { x: 100, z: -30 },
    { x: 100, z: -75 },
    { x: 50, z: -90 },
    { x: 4, z: -90 },
    { x: 4, z: -32 },
    // Roundabout arc (counter-clockwise)
    { x: 15, z: -15 },
    { x: 21, z: 0 },
  ],
  // Loop 2: Étoile Rouge -> Fidjrossè -> Route des Pêches -> Beach Avenue -> Étoile Rouge
  [
    { x: -32, z: 4 },
    { x: -96, z: 4 },
    { x: -135, z: 4 },
    { x: -135, z: -90 },
    { x: -96, z: -90 },
    { x: -4, z: -90 },
    { x: -4, z: -32 },
    // Roundabout arc
    { x: -15, z: -15 },
    { x: -21, z: 0 },
    { x: -15, z: 15 },
  ],
  // Loop 3: Avenue Jean-Paul II / Steinmetz (Cadjehoun -> Étoile Rouge -> Marina)
  [
    { x: 4, z: -180 },
    { x: 4, z: -90 },
    { x: 4, z: -32 },
    // Roundabout arc East side
    { x: 18, z: -11 },
    { x: 21, z: 0 },
    { x: 18, z: 11 },
    { x: 4, z: 32 },
    { x: 4, z: 90 },
    { x: 4, z: 180 },
    // Return North
    { x: -4, z: 180 },
    { x: -4, z: 90 },
    { x: -4, z: 32 },
    // Roundabout arc West side
    { x: -18, z: 11 },
    { x: -21, z: 0 },
    { x: -18, z: -11 },
    { x: -4, z: -32 },
    { x: -4, z: -90 },
  ],
  // Loop 4: Boulevard de la Marina (East-West)
  [
    { x: -180, z: 4 },
    { x: -90, z: 4 },
    { x: -32, z: 4 },
    // Roundabout South arc
    { x: -11, z: 18 },
    { x: 0, z: 21 },
    { x: 11, z: 18 },
    { x: 32, z: 4 },
    { x: 90, z: 4 },
    { x: 180, z: 4 },
    // Return West
    { x: 180, z: -4 },
    { x: 90, z: -4 },
    { x: 32, z: -4 },
    // Roundabout North arc
    { x: 11, z: -18 },
    { x: 0, z: -21 },
    { x: -11, z: -18 },
    { x: -32, z: -4 },
    { x: -90, z: -4 },
  ],
];

export class TrafficSystem {
  private vehicles: AIVehicle[] = [];
  private scene: THREE.Scene;
  private maxDensity: number = 12; // 10-15 balanced density

  constructor(scene: THREE.Scene, density: number = 12) {
    this.scene = scene;
    this.maxDensity = density;
    this.initTraffic();
  }

  /**
   * Spawns initial fleet of Zémidjans, Taxis, and Tokpa-Tokpa minibuses
   */
  private initTraffic() {
    const types: AIVehicleType[] = ['zemidjan', 'zemidjan', 'taxi', 'zemidjan', 'taxi', 'bus'];

    for (let i = 0; i < this.maxDensity; i++) {
      const type = types[i % types.length];
      const pathIndex = i % COTONOU_TRAFFIC_PATHS.length;
      const path = COTONOU_TRAFFIC_PATHS[pathIndex];
      const startWpIndex = Math.floor((i / this.maxDensity) * path.length);
      const startWp = path[startWpIndex];

      this.spawnVehicle(type, path, startWpIndex, startWp.x, startWp.z);
    }
  }

  private spawnVehicle(
    type: AIVehicleType,
    path: Waypoint[],
    wpIndex: number,
    x: number,
    z: number
  ) {
    let mesh: THREE.Group;
    let maxSpeed = 12.0;

    if (type === 'zemidjan') {
      mesh = createZemidjanMesh();
      maxSpeed = 15.0; // Zémidjans are agile and faster
    } else if (type === 'taxi') {
      mesh = createTaxi505Mesh();
      maxSpeed = 12.5;
    } else {
      mesh = createTokpaTokpaBusMesh();
      maxSpeed = 10.0; // Minibuses drive steadily
    }

    mesh.position.set(x, 0, z);
    this.scene.add(mesh);

    const vehicle: AIVehicle = {
      id: 'traffic_' + Math.random().toString(36).substring(2, 9),
      type,
      mesh,
      x,
      z,
      speed: maxSpeed * 0.7,
      maxSpeed,
      rotation: 0,
      path,
      currentWaypointIndex: wpIndex,
      panicTimer: 0,
      lateralOffset: 0,
      targetLateralOffset: 0,
    };

    this.vehicles.push(vehicle);
  }

  /**
   * Returns current active traffic vehicles for Minimap & collision queries
   */
  public getVehicles(): AIVehicle[] {
    return this.vehicles;
  }

  /**
   * Updates all AI traffic positions, obstacle avoidance, and horn/siren reactions
   */
  public update(
    delta: number,
    playerX: number,
    playerZ: number,
    wantedStars: number = 0,
    isPoliceNear: boolean = false,
    isPlayerHonking: boolean = false
  ) {
    const safeDelta = Math.min(delta, 0.1);

    this.vehicles.forEach((v) => {
      // 1. Check Horn Reaction
      const distToPlayer = calculateDistance(v.x, v.z, playerX, playerZ);
      if (isPlayerHonking && distToPlayer < 28) {
        v.panicTimer = 2.5;
        if (v.type === 'zemidjan') {
          v.targetLateralOffset = 1.8; // Swerve to shoulder
        } else {
          v.targetLateralOffset = 1.2;
        }
      }

      // 2. Check Police Siren Reaction
      if (wantedStars > 0 && isPoliceNear && distToPlayer < 45) {
        v.panicTimer = 3.0;
        v.targetLateralOffset = 2.5; // Pull over to the right
      }

      // 3. Handle Panic Decay & Lateral Offset Transition
      if (v.panicTimer > 0) {
        v.panicTimer -= safeDelta;
        if (v.panicTimer <= 0) {
          v.targetLateralOffset = 0;
        }
      }

      v.lateralOffset = THREE.MathUtils.damp(
        v.lateralOffset,
        v.targetLateralOffset,
        3.0,
        safeDelta
      );

      // 4. Waypoint Navigation
      const wp = v.path[v.currentWaypointIndex];
      const nextWpIndex = (v.currentWaypointIndex + 1) % v.path.length;
      const nextWp = v.path[nextWpIndex];

      // Calculate path direction vector
      const dx = nextWp.x - wp.x;
      const dz = nextWp.z - wp.z;
      const pathDist = Math.hypot(dx, dz);

      let targetX = wp.x;
      let targetZ = wp.z;

      if (pathDist > 0.001) {
        // Apply lateral offset perpendicular to path
        const nx = -dz / pathDist;
        const nz = dx / pathDist;
        targetX = nextWp.x + nx * v.lateralOffset;
        targetZ = nextWp.z + nz * v.lateralOffset;
      }

      const toTargetX = targetX - v.x;
      const toTargetZ = targetZ - v.z;
      const distToTarget = Math.hypot(toTargetX, toTargetZ);

      if (distToTarget < 3.5) {
        // Advance to next waypoint
        v.currentWaypointIndex = nextWpIndex;
      } else {
        // Rotate towards target
        const targetAngle = Math.atan2(toTargetX, toTargetZ);
        let diffAngle = targetAngle - v.rotation;

        // Wrap angle to [-PI, PI]
        while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
        while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;

        v.rotation += diffAngle * Math.min(1.0, safeDelta * 4.0);
      }

      // 5. Vehicle Spacing & Avoidance
      let targetSpeed = v.maxSpeed;

      // Slow down if close to player
      if (distToPlayer < 7.0) {
        targetSpeed = Math.min(targetSpeed, 3.0);
      }

      // Slow down if close to another AI vehicle ahead
      this.vehicles.forEach((other) => {
        if (other.id !== v.id) {
          const distOther = calculateDistance(v.x, v.z, other.x, other.z);
          if (distOther < 6.5) {
            targetSpeed = Math.min(targetSpeed, other.speed * 0.8);
          }
        }
      });

      // Emergency slow down during panic pull-over
      if (v.panicTimer > 0 && v.type !== 'zemidjan') {
        targetSpeed *= 0.6;
      }

      v.speed = THREE.MathUtils.damp(v.speed, targetSpeed, 2.5, safeDelta);

      // 6. Update Position & Three.js Mesh Transformation
      const moveX = Math.sin(v.rotation) * v.speed * safeDelta;
      const moveZ = Math.cos(v.rotation) * v.speed * safeDelta;

      v.x += moveX;
      v.z += moveZ;

      v.mesh.position.set(v.x, 0, v.z);
      v.mesh.rotation.y = v.rotation;

      // 7. Far Distance Recycling (Respawn ahead if too far from player > 220m)
      if (distToPlayer > 220) {
        // Find a path waypoint close to player
        const newPathIndex = Math.floor(Math.random() * COTONOU_TRAFFIC_PATHS.length);
        const newPath = COTONOU_TRAFFIC_PATHS[newPathIndex];
        const randomWpIndex = Math.floor(Math.random() * newPath.length);
        const newWp = newPath[randomWpIndex];

        // Teleport if the new waypoint is closer to player (< 120m)
        if (calculateDistance(newWp.x, newWp.z, playerX, playerZ) < 120) {
          v.path = newPath;
          v.currentWaypointIndex = randomWpIndex;
          v.x = newWp.x;
          v.z = newWp.z;
          v.mesh.position.set(v.x, 0, v.z);
        }
      }
    });
  }

  /**
   * Cleans up 3D meshes from scene on unmount
   */
  public dispose() {
    this.vehicles.forEach((v) => {
      this.scene.remove(v.mesh);
    });
    this.vehicles = [];
  }
}
