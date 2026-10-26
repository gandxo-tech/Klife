/**
 * GTA Cotonou - Main 3D Game Engine (Three.js)
 * High-performance 60fps simulation engine with:
 * - Indoor Bedroom Spawn (Résidence Sikè-Fictif)
 * - Real-time Character Customization (Zack / Zahra)
 * - Software-WebGL safety guard & ACESFilmicToneMapping
 * - RoomEnvironment reflection pipeline
 * - Damped third-person camera & vehicle kinematics
 * - Real-time wanted level & police AI pursuit
 * - Mission triggers, pedestrian simulation & procedural audio
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ActiveMissionState,
  ActiveVehicle,
  GameState,
  GarageLocation,
  Mission,
  Pedestrian,
  PlayerStats,
  StoredVehicle,
  VehicleCustomization,
  VehicleType,
} from './types.ts';
import { GARAGE_LOCATIONS, createDefaultCustomization } from './garages.ts';
import {
  applyCrimeWanted,
  calculateDistance,
  checkCircleCollision,
  checkObstacleCollision,
  checkStageCompletion,
  stepVehiclePhysics,
  updateWantedState,
  VEHICLE_CONFIGS,
} from './rules.ts';
import { buildCotonouCity, WorldObstacle } from './cityMap.ts';
import { BedroomScene } from './BedroomScene.ts';
import {
  createCharacterMesh,
  createGWagonMesh,
  createKekeMesh,
  createPoliceCruiserMesh,
  createTaxi505Mesh,
  createZemidjanMesh,
} from './models.ts';
import { sound } from './audio.ts';
import { MISSIONS } from './missions.ts';
import { CharacterConfig } from '../components/CharacterCreatorModal.tsx';
import { TrafficSystem } from './trafficSystem.ts';

const _scratchCamTarget = new THREE.Vector3();

const ROAD_NODES: { x: number; z: number; neighbors: number[] }[] = [
  // Intersections
  { x: -100, z: -90, neighbors: [1, 3, 9, 12] }, // 0
  { x: 0, z: -90, neighbors: [0, 2, 4, 13] }, // 1
  { x: 100, z: -90, neighbors: [1, 5, 10, 14] }, // 2
  { x: -100, z: 0, neighbors: [0, 4, 6, 15] }, // 3
  { x: 0, z: 0, neighbors: [1, 3, 5, 7] }, // 4 Étoile Rouge
  { x: 100, z: 0, neighbors: [2, 4, 8, 16] }, // 5
  { x: -100, z: 90, neighbors: [3, 7, 11, 17] }, // 6
  { x: 0, z: 90, neighbors: [4, 6, 8, 18] }, // 7
  { x: 100, z: 90, neighbors: [5, 7, 19] }, // 8
  // Road Endpoints / Extension Nodes
  { x: -180, z: -90, neighbors: [0] }, // 9
  { x: 180, z: -90, neighbors: [2] }, // 10
  { x: -180, z: 90, neighbors: [6] }, // 11
  { x: -100, z: -180, neighbors: [0] }, // 12
  { x: 0, z: -180, neighbors: [1] }, // 13
  { x: 100, z: -180, neighbors: [2] }, // 14
  { x: -180, z: 0, neighbors: [3] }, // 15
  { x: 180, z: 0, neighbors: [5] }, // 16
  { x: -100, z: 180, neighbors: [6] }, // 17
  { x: 0, z: 180, neighbors: [7] }, // 18
  { x: 100, z: 180, neighbors: [8] }, // 19
];

export interface EngineCallbacks {
  onStatsUpdate: (stats: PlayerStats) => void;
  onMissionUpdate: (state: ActiveMissionState | null) => void;
  onVehicleUpdate: (vehicle: ActiveVehicle | null) => void;
  onNotification: (text: string) => void;
  onGameOver: () => void;
  onVictory: (missionTitle: string, reward: number) => void;
  onOpenCharacterCreator?: () => void;
  onOpenGarageModal?: (garage: GarageLocation) => void;
  onOpenPhone?: () => void;
  onInteractionTip?: (tip: string | null) => void;
}

export const COTONOU_MOMO_KIOSKS = [
  { name: 'Kiosque MoMo Sikè-Fictif', x: -42, z: -95, radius: 4.5, isArmoredVan: false },
  { name: 'Kiosque MoMo Dantokpa Marché', x: 108, z: -48, radius: 4.5, isArmoredVan: false },
  { name: 'Kiosque Moov Flooz Dantokpa', x: 108, z: -72, radius: 4.5, isArmoredVan: false },
  { name: 'Kiosque MoMo Étoile Rouge', x: 22, z: -25, radius: 4.5, isArmoredVan: false },
  { name: 'Fourgon Blindé Trésor Public', x: 55, z: 101, radius: 5.5, isArmoredVan: true },
];

export class GameEngine {
  private container: HTMLDivElement;
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private frameId: number = 0;
  private isDestroyed: boolean = false;
  private isSoftwareGl: boolean = false;
  private callbacks: EngineCallbacks;

  // Indoor vs City State
  public isIndoorBedroom: boolean = true;
  private bedroomScene!: BedroomScene;
  private sunLight!: THREE.DirectionalLight;

  // Game World State
  private obstacles: WorldObstacle[] = [];
  private vehicles: ActiveVehicle[] = [];
  private vehicleMeshes = new Map<string, THREE.Group>();
  private policeLights: { red: THREE.PointLight; blue: THREE.PointLight }[] = [];
  private trafficSystem!: TrafficSystem;
  private waterMesh: THREE.Mesh | null = null;

  private pedestrians: Pedestrian[] = [];
  private pedestrianMeshes = new Map<string, THREE.Group>();

  // Player Entity & Customization
  public currentCharacterConfig: CharacterConfig = {
    gender: 'garcon',
    name: 'Zack',
    style: 'wax',
    colorHex: '#E65100',
    hat: 'cap',
    glasses: true,
    accessory: 'chain',
  };

  private playerMeshGroup!: THREE.Group;
  private playerAnim = {
    leftLeg: null as THREE.Group | null,
    rightLeg: null as THREE.Group | null,
    leftArm: null as THREE.Group | null,
    rightArm: null as THREE.Group | null,
    walkTime: 0,
  };

  public player: PlayerStats = {
    x: 0,
    y: 0,
    z: 0, // Inside bedroom
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
  };

  // Active Mission
  public activeMission: ActiveMissionState | null = null;
  public missionWaypointMesh!: THREE.Mesh;

  // Input State
  private keys: Record<string, boolean> = {};
  public virtualInput = {
    moveX: 0,
    moveZ: 0,
    action: false,
    brake: false,
    sprint: false,
  };

  private gameState: GameState = 'title';

  constructor(container: HTMLDivElement, callbacks: EngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.init();
  }

  private init() {
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.renderer.setSize(width, height);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xDCEEF8);
    this.scene.fog = new THREE.FogExp2(0xDCEEF8, 0.0035);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.2, 500);
    this.camera.position.set(0, 3, -5);

    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // West African Tropical Midday Sun & Sharp PCF Shadows
    this.sunLight = new THREE.DirectionalLight(0xFFF7E6, 2.6);
    this.sunLight.position.set(50, 120, 35);
    this.sunLight.castShadow = !this.isSoftwareGl;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 280;
    this.sunLight.shadow.camera.left = -80;
    this.sunLight.shadow.camera.right = 80;
    this.sunLight.shadow.camera.top = 80;
    this.sunLight.shadow.camera.bottom = -80;
    this.sunLight.shadow.bias = -0.0004;
    this.sunLight.shadow.normalBias = 0.02;
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);

    // Tropical Atlantic azure sky bounce + warm latérite ground reflection
    const hemiLight = new THREE.HemisphereLight(0x38BDF8, 0xD97706, 1.25);
    this.scene.add(hemiLight);

    // Build Indoor Bedroom Scene
    this.bedroomScene = new BedroomScene();
    this.scene.add(this.bedroomScene.group);

    // Build Cotonou World
    const { obstacles, waterMesh } = buildCotonouCity(this.scene);
    this.obstacles = obstacles;
    this.waterMesh = waterMesh;

    // Build Player Mesh
    this.rebuildPlayerMesh();

    // Mission Waypoint Marker
    const markerGeo = new THREE.CylinderGeometry(2.4, 2.4, 12, 16, 1, true);
    const markerMat = new THREE.MeshBasicMaterial({
      color: 0xFFEB3B,
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });
    this.missionWaypointMesh = new THREE.Mesh(markerGeo, markerMat);
    this.missionWaypointMesh.position.set(0, 6, 0);
    this.missionWaypointMesh.visible = false;
    this.scene.add(this.missionWaypointMesh);

    // Spawn Vehicles, Pedestrians & Autonomous Traffic System
    this.loadStoredVehicles();
    this.spawnInitialVehicles();
    this.spawnInitialPedestrians();
    this.trafficSystem = new TrafficSystem(this.scene, 12);

    this.setupEventListeners();
    this.clock.start();
    this.tick();
  }

  public storedVehicles: StoredVehicle[] = [];

  public createVehicleMeshByType(type: VehicleType): THREE.Group {
    if (type === 'zemidjan') {
      return createZemidjanMesh();
    } else if (type === 'keke') {
      return createKekeMesh();
    } else if (type === 'taxi505') {
      return createTaxi505Mesh();
    } else if (type === 'gwagon') {
      return createGWagonMesh();
    } else {
      const pol = createPoliceCruiserMesh();
      this.policeLights.push({ red: pol.lightRed, blue: pol.lightBlue });
      return pol.group;
    }
  }

  public applyCustomizationToMesh(meshGroup: THREE.Group, customization: VehicleCustomization) {
    if (!meshGroup || !customization) return;

    const colorInt = parseInt(customization.colorHex.replace('#', '0x'), 16);
    meshGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial && mat.name !== 'glass') {
              mat.color.setHex(colorInt);
            }
          });
        } else if (child.material instanceof THREE.MeshStandardMaterial) {
          const curHex = child.material.color.getHex();
          if (curHex !== 0x111827 && curHex !== 0x141414 && curHex !== 0x212121) {
            child.material.color.setHex(colorInt);
          }
        }
      }
    });

    const existingNeon = meshGroup.getObjectByName('underglow_neon');
    if (existingNeon) {
      meshGroup.remove(existingNeon);
    }

    if (customization.neonColorHex) {
      const neonHex = parseInt(customization.neonColorHex.replace('#', '0x'), 16);
      const neonLight = new THREE.PointLight(neonHex, 3.5, 6.0);
      neonLight.name = 'underglow_neon';
      neonLight.position.set(0, 0.2, 0);

      const glowGeo = new THREE.PlaneGeometry(1.4, 2.8);
      glowGeo.rotateX(-Math.PI / 2);
      const glowMat = new THREE.MeshBasicMaterial({
        color: neonHex,
        transparent: true,
        opacity: 0.75,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      glowMesh.position.set(0, 0.04, 0);
      neonLight.add(glowMesh);

      meshGroup.add(neonLight);
    }
  }

  public loadStoredVehicles() {
    try {
      const data = localStorage.getItem('gtacotonou_stored_vehicles');
      if (data) {
        this.storedVehicles = JSON.parse(data);
      }
    } catch (e) {
      this.storedVehicles = [];
    }
  }

  public saveStoredVehicles() {
    try {
      localStorage.setItem('gtacotonou_stored_vehicles', JSON.stringify(this.storedVehicles));
    } catch (e) {
      // ignore
    }
  }

  public storeCurrentVehicle(garageId: string) {
    if (!this.player.currentVehicleId) {
      this.callbacks.onNotification('Tu dois être dans un véhicule pour le ranger au garage !');
      return;
    }

    const vehIdx = this.vehicles.findIndex((v) => v.id === this.player.currentVehicleId);
    if (vehIdx === -1) return;

    const veh = this.vehicles[vehIdx];
    const customization = veh.customization || createDefaultCustomization(veh.type, veh.config.color);

    const storedItem: StoredVehicle = {
      id: `stored_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: veh.type,
      name: veh.name,
      customization,
      storedAtGarageId: garageId,
      savedAt: Date.now(),
    };

    this.storedVehicles.push(storedItem);
    this.saveStoredVehicles();

    const mesh = this.vehicleMeshes.get(veh.id);
    if (mesh) {
      this.scene.remove(mesh);
      this.vehicleMeshes.delete(veh.id);
    }

    this.player.currentVehicleId = null;
    this.playerMeshGroup.visible = true;
    this.vehicles.splice(vehIdx, 1);
    this.callbacks.onVehicleUpdate(null);
    this.callbacks.onNotification(`${veh.name} rangé dans votre garage avec succès !`);
  }

  public spawnStoredVehicle(storedVehicleId: string, garage: GarageLocation) {
    const idx = this.storedVehicles.findIndex((s) => s.id === storedVehicleId);
    if (idx === -1) return;

    const stored = this.storedVehicles[idx];
    const conf = VEHICLE_CONFIGS[stored.type];
    const newId = `veh_${Date.now()}_custom`;

    const meshGroup = this.createVehicleMeshByType(stored.type);
    this.applyCustomizationToMesh(meshGroup, stored.customization);

    const spawnX = garage.x;
    const spawnZ = garage.z + 11.5;

    meshGroup.position.set(spawnX, 0, spawnZ);
    meshGroup.rotation.y = 0;
    this.scene.add(meshGroup);
    this.vehicleMeshes.set(newId, meshGroup);

    const activeVeh: ActiveVehicle = {
      id: newId,
      type: stored.type,
      name: stored.name,
      x: spawnX,
      y: 0,
      z: spawnZ,
      rotationY: 0,
      speed: 0,
      steerAngle: 0,
      health: conf.health * (1 + 0.25 * stored.customization.armorLevel),
      maxHealth: conf.health * (1 + 0.25 * stored.customization.armorLevel),
      isPlayerDriving: false,
      isPolice: false,
      sirenActive: false,
      config: {
        ...conf,
        maxSpeed: conf.maxSpeed * (1 + 0.15 * stored.customization.engineLevel),
      },
      customization: stored.customization,
    };

    this.vehicles.push(activeVeh);
    this.storedVehicles.splice(idx, 1);
    this.saveStoredVehicles();

    this.player.x = spawnX + 2.5;
    this.player.z = spawnZ;
    this.playerMeshGroup.position.set(this.player.x, 0, this.player.z);

    this.callbacks.onNotification(`${stored.name} prêt sur la piste du ${garage.name} !`);
  }

  public applyVehicleCustomization(vehicleId: string, customization: VehicleCustomization, costFCFA: number) {
    const veh = this.vehicles.find((v) => v.id === vehicleId);
    if (!veh) return;

    this.player.cashFCFA -= costFCFA;
    veh.customization = customization;

    veh.config.maxSpeed = VEHICLE_CONFIGS[veh.type].maxSpeed * (1 + 0.15 * customization.engineLevel);
    veh.maxHealth = VEHICLE_CONFIGS[veh.type].health * (1 + 0.25 * customization.armorLevel);
    veh.health = veh.maxHealth;

    const mesh = this.vehicleMeshes.get(veh.id);
    if (mesh) {
      this.applyCustomizationToMesh(mesh, customization);
    }

    sound.playCashChime();
    this.callbacks.onNotification(`Customisation appliquée sur ${veh.name} !`);
  }

  public rebuildPlayerMesh() {
    if (this.playerMeshGroup) {
      this.scene.remove(this.playerMeshGroup);
    }

    const char = createCharacterMesh(true, 0x3F51B5, {
      gender: this.currentCharacterConfig.gender,
      style: this.currentCharacterConfig.style,
      colorHex: this.currentCharacterConfig.colorHex,
      hat: this.currentCharacterConfig.hat,
      glasses: this.currentCharacterConfig.glasses,
    });

    this.playerMeshGroup = char.group;
    this.playerAnim.leftLeg = char.leftLeg;
    this.playerAnim.rightLeg = char.rightLeg;
    this.playerAnim.leftArm = char.leftArm;
    this.playerAnim.rightArm = char.rightArm;

    this.playerMeshGroup.position.set(this.player.x, this.player.y, this.player.z);
    this.scene.add(this.playerMeshGroup);
  }

  public applyCharacterConfig(config: CharacterConfig) {
    this.currentCharacterConfig = config;
    this.rebuildPlayerMesh();
    this.callbacks.onNotification(`Look de ${config.name} mis à jour !`);
  }

  private spawnInitialVehicles() {
    const configs: { type: VehicleType; x: number; z: number; rot: number; isPolice?: boolean }[] = [
      { type: 'zemidjan', x: -50, z: -102, rot: Math.PI },
      { type: 'zemidjan', x: 3.2, z: -32, rot: Math.PI },
      { type: 'zemidjan', x: -8, z: -40, rot: Math.PI },
      { type: 'zemidjan', x: 100, z: -50, rot: Math.PI },
      { type: 'keke', x: 15, z: 25, rot: Math.PI / 2 },
      { type: 'keke', x: 85, z: -40, rot: 0 },
      { type: 'taxi505', x: -8, z: 30, rot: 0 },
      { type: 'taxi505', x: -80, z: 10, rot: Math.PI / 2 },
      { type: 'taxi505', x: 40, z: -80, rot: Math.PI },
      { type: 'gwagon', x: 48, z: 146, rot: 0 },
      { type: 'gwagon', x: 60, z: 70, rot: Math.PI / 2 },
      { type: 'police', x: -30, z: -60, rot: 0, isPolice: true },
      { type: 'police', x: 70, z: 110, rot: Math.PI, isPolice: true },
    ];

    configs.forEach((item, index) => {
      const id = `veh_${index}_${item.type}`;
      const conf = VEHICLE_CONFIGS[item.type];
      let meshGroup: THREE.Group;

      if (item.type === 'zemidjan') {
        meshGroup = createZemidjanMesh();
      } else if (item.type === 'keke') {
        meshGroup = createKekeMesh();
      } else if (item.type === 'taxi505') {
        meshGroup = createTaxi505Mesh();
      } else if (item.type === 'gwagon') {
        meshGroup = createGWagonMesh();
      } else {
        const pol = createPoliceCruiserMesh();
        meshGroup = pol.group;
        this.policeLights.push({ red: pol.lightRed, blue: pol.lightBlue });
      }

      meshGroup.position.set(item.x, 0, item.z);
      meshGroup.rotation.y = item.rot;
      this.scene.add(meshGroup);
      this.vehicleMeshes.set(id, meshGroup);

      this.vehicles.push({
        id,
        type: item.type,
        name: conf.name,
        x: item.x,
        y: 0,
        z: item.z,
        rotationY: item.rot,
        speed: 0,
        steerAngle: 0,
        health: conf.health,
        maxHealth: conf.health,
        isPlayerDriving: false,
        isPolice: !!item.isPolice,
        sirenActive: false,
        config: conf,
      });
    });
  }

  private spawnInitialPedestrians() {
    const shirtColors = [0xE53935, 0x1E88E5, 0x43A047, 0xFB8C00, 0x8E24AA, 0x00897B];
    for (let i = 0; i < 18; i++) {
      const id = `ped_${i}`;
      const x = -90 + Math.random() * 180;
      const z = -90 + Math.random() * 180;
      const color = shirtColors[i % shirtColors.length];

      const { group } = createCharacterMesh(false, color);
      group.position.set(x, 0, z);
      this.scene.add(group);
      this.pedestrianMeshes.set(id, group);

      this.pedestrians.push({
        id,
        x,
        y: 0,
        z,
        rotationY: Math.random() * Math.PI * 2,
        speed: 1.8 + Math.random() * 1.2,
        state: 'walking',
        targetX: x + (Math.random() - 0.5) * 50,
        targetZ: z + (Math.random() - 0.5) * 50,
        outfitColor: `#${color.toString(16)}`,
        health: 50,
      });
    }
  }

  private setupEventListeners() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ' && this.gameState === 'title') {
        this.startGame();
      }
      if (e.key.toLowerCase() === 'e' || e.key.toLowerCase() === 'f') {
        this.handleActionTrigger();
      }
      if (e.key.toLowerCase() === 'h') {
        sound.playHorn();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    window.addEventListener('blur', () => {
      this.keys = {};
    });

    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    if (!this.renderer || !this.camera || !this.container) return;
    const w = this.container.clientWidth || window.innerWidth;
    const h = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  public startGame() {
    sound.resume();
    this.gameState = 'playing';
    this.isIndoorBedroom = true;
    this.player.x = 0;
    this.player.y = 200;
    this.player.z = 0;
    this.player.rotationY = Math.PI;
    this.playerMeshGroup.position.set(0, 200, 0);

    this.callbacks.onNotification(
      'Spawné dans ta chambre à Sikè-Fictif. Approche du miroir pour te relooker ou de la porte pour sortir !'
    );
    sound.startRadioStation('tokpa');
  }

  public setGameState(state: GameState) {
    this.gameState = state;
    if (state === 'paused') {
      sound.stopEngine();
    }
  }

  public exitBedroomToCity() {
    this.isIndoorBedroom = false;
    this.scene.remove(this.bedroomScene.group);
    this.player.x = -50;
    this.player.y = 0;
    this.player.z = -105;
    this.player.rotationY = 0;
    this.rebuildPlayerMesh();
    this.callbacks.onNotification(
      `Bienvenue dans les rues de Cotonou (Sikè-Fictif) ! Ton Zémidjan te demande.`
    );
  }

  public handleActionTrigger() {
    if (this.isIndoorBedroom) {
      // Check bedroom triggers
      for (const trg of this.bedroomScene.triggers) {
        const d = calculateDistance(this.player.x, this.player.z, trg.x, trg.z);
        if (d < trg.radius) {
          if (trg.id === 'mirror') {
            if (this.callbacks.onOpenCharacterCreator) {
              this.callbacks.onOpenCharacterCreator();
            }
          } else if (trg.id === 'door') {
            this.exitBedroomToCity();
          } else if (trg.id === 'desk') {
            this.callbacks.onNotification('Smartphone Sikè : 1ère mission t’attend sur la moto dehors !');
          }
          return;
        }
      }
    } else {
      let nearGarage: GarageLocation | null = null;
      for (const gar of GARAGE_LOCATIONS) {
        const d = calculateDistance(this.player.x, this.player.z, gar.x, gar.z + 10);
        if (d < gar.radius) {
          nearGarage = gar;
          break;
        }
      }

      if (nearGarage && this.callbacks.onOpenGarageModal) {
        this.callbacks.onOpenGarageModal(nearGarage);
        return;
      }

      // Check MoMo Kiosks / Armored Van
      for (const kiosk of COTONOU_MOMO_KIOSKS) {
        const d = calculateDistance(this.player.x, this.player.z, kiosk.x, kiosk.z);
        if (d < kiosk.radius) {
          if (this.callbacks.onOpenPhone) {
            this.callbacks.onOpenPhone();
            return;
          }
        }
      }

      this.toggleEnterVehicle();
    }
  }

  public startMission(missionId: string) {
    const mission = MISSIONS.find((m) => m.id === missionId);
    if (!mission) return;

    this.startCustomMission(mission);
  }

  public startCustomMission(mission: Mission) {
    this.activeMission = {
      mission,
      currentStageIndex: 0,
      timeLeft: mission.timeLimitSec,
      completed: false,
      failed: false,
    };

    this.player.isInMission = true;
    sound.playMissionStart();
    sound.playGeminiTTS(mission.audioPrompt, mission.bossName);
    this.callbacks.onMissionUpdate(this.activeMission);
    this.callbacks.onNotification(`Mission lancée : ${mission.title}`);
    this.updateMissionWaypoint();
  }

  public cancelMission() {
    this.activeMission = null;
    this.player.isInMission = false;
    this.missionWaypointMesh.visible = false;
    this.callbacks.onMissionUpdate(null);
  }

  private updateMissionWaypoint() {
    if (!this.activeMission) {
      this.missionWaypointMesh.visible = false;
      return;
    }
    const stage = this.activeMission.mission.stages[this.activeMission.currentStageIndex];
    if (stage) {
      this.missionWaypointMesh.position.set(stage.targetX, 6, stage.targetZ);
      this.missionWaypointMesh.visible = true;
    } else {
      this.missionWaypointMesh.visible = false;
    }
  }

  public toggleEnterVehicle() {
    if (this.player.currentVehicleId) {
      const currentVeh = this.vehicles.find((v) => v.id === this.player.currentVehicleId);
      if (currentVeh) {
        currentVeh.isPlayerDriving = false;
        this.player.x = currentVeh.x - Math.cos(currentVeh.rotationY) * 2.0;
        this.player.z = currentVeh.z + Math.sin(currentVeh.rotationY) * 2.0;
        this.player.rotationY = currentVeh.rotationY;
      }
      this.player.currentVehicleId = null;
      this.playerMeshGroup.visible = true;
      sound.stopEngine();
      this.callbacks.onVehicleUpdate(null);
      this.callbacks.onNotification('Tu es descendu du véhicule.');
    } else {
      let closest: ActiveVehicle | null = null;
      let minDist = 3.8;

      for (const veh of this.vehicles) {
        const d = calculateDistance(this.player.x, this.player.z, veh.x, veh.z);
        if (d < minDist) {
          minDist = d;
          closest = veh;
        }
      }

      if (closest) {
        closest.isPlayerDriving = true;
        this.player.currentVehicleId = closest.id;
        this.playerMeshGroup.visible = false;
        this.callbacks.onVehicleUpdate(closest);
        this.callbacks.onNotification(`Tu conduis : ${closest.name}`);

        if (closest.isPolice && this.player.wantedStars < 2) {
          const crime = applyCrimeWanted(this.player.wantedStars, 2);
          this.player.wantedStars = crime.stars;
          this.player.wantedProgress = crime.progress;
          this.callbacks.onNotification('Vol de véhicule de Police Républicaine ! 2 étoiles !');
        }
      }
    }
  }

  public triggerAttack() {
    sound.playPunch();
    for (const ped of this.pedestrians) {
      if (ped.state === 'down') continue;
      const d = calculateDistance(this.player.x, this.player.z, ped.x, ped.z);
      if (d < 2.5) {
        ped.health -= 35;
        if (ped.health <= 0) {
          ped.state = 'down';
          const crime = applyCrimeWanted(this.player.wantedStars, 1);
          this.player.wantedStars = crime.stars;
          this.player.cashFCFA += 15000;
          sound.playCashChime();
          this.callbacks.onNotification('+15 000 FCFA récupérés');
        } else {
          ped.state = 'fleeing';
          ped.fleeTimer = 10;
        }
        break;
      }
    }
  }

  private tick = () => {
    if (this.isDestroyed) return;

    const rawDt = this.clock.getDelta();
    const dt = Math.min(rawDt, 0.05);

    if (this.gameState === 'title') {
      this.updateTitleCinematic(dt);
    } else if (this.gameState === 'playing') {
      this.updateSimulation(dt);
    }

    if (this.isIndoorBedroom && this.bedroomScene) {
      this.bedroomScene.update(dt);
    }

    if (this.waterMesh) {
      const elapsed = this.clock.getElapsedTime();
      this.waterMesh.position.y = 0.08 + Math.sin(elapsed * 1.5) * 0.035;
    }

    this.renderer.render(this.scene, this.camera);

    if (this.isSoftwareGl) {
      this.afterDraw(this.tick);
    } else {
      this.frameId = requestAnimationFrame(this.tick);
    }
  };

  private afterDraw(cb: () => void) {
    const gl = this.renderer.getContext() as WebGL2RenderingContext;
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        this.frameId = window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        this.frameId = window.setTimeout(cb, 60);
      }
    };
    this.frameId = window.setTimeout(poll, 5);
  }

  private updateTitleCinematic(dt: number) {
    const elapsed = this.clock.getElapsedTime();
    const camRadius = 75;
    this.camera.position.x = Math.sin(elapsed * 0.25) * camRadius;
    this.camera.position.z = Math.cos(elapsed * 0.25) * camRadius;
    this.camera.position.y = 28 + Math.sin(elapsed * 0.15) * 6;
    this.camera.lookAt(0, 10, 0);
  }

  private updateSimulation(dt: number) {
    let moveForward = 0;
    let turn = 0;

    if (this.keys['w'] || this.keys['arrowup']) moveForward += 1;
    if (this.keys['s'] || this.keys['arrowdown']) moveForward -= 1;
    if (this.keys['a'] || this.keys['arrowleft']) turn += 1;
    if (this.keys['d'] || this.keys['arrowright']) turn -= 1;

    if (this.virtualInput.moveZ !== 0) moveForward = this.virtualInput.moveZ;
    if (this.virtualInput.moveX !== 0) turn = -this.virtualInput.moveX;

    if (this.isIndoorBedroom) {
      // Bedroom Movement
      const walkSpeed = 3.5;
      if (turn !== 0) {
        this.player.rotationY += turn * 3.5 * dt;
      }
      if (moveForward !== 0) {
        const deltaX = Math.sin(this.player.rotationY) * moveForward * walkSpeed * dt;
        const deltaZ = Math.cos(this.player.rotationY) * moveForward * walkSpeed * dt;

        // Bedroom room bounds (-3.2 to 3.2)
        const nextX = Math.max(-3.0, Math.min(3.0, this.player.x + deltaX));
        const nextZ = Math.max(-3.0, Math.min(3.2, this.player.z + deltaZ));

        this.player.x = nextX;
        this.player.z = nextZ;
      }

      this.playerMeshGroup.position.set(this.player.x, 200, this.player.z);
      this.playerMeshGroup.rotation.y = this.player.rotationY;

      // Check bedroom triggers tip
      let activeTip: string | null = null;
      for (const trg of this.bedroomScene.triggers) {
        const d = calculateDistance(this.player.x, this.player.z, trg.x, trg.z);
        if (d < trg.radius) {
          activeTip = trg.label;
          break;
        }
      }

      if (this.callbacks.onInteractionTip) {
        this.callbacks.onInteractionTip(activeTip);
      }

      // Camera inside bedroom
      this.camera.position.set(
        this.player.x - Math.sin(this.player.rotationY) * 2.5,
        201.7,
        this.player.z - Math.cos(this.player.rotationY) * 2.5
      );
      this.camera.lookAt(this.player.x, 201.2, this.player.z);
    } else {
      // Outdoor City Movement
      const isDriving = !!this.player.currentVehicleId;
      const currentVeh = this.vehicles.find((v) => v.id === this.player.currentVehicleId);

      let activeTip: string | null = null;
      for (const gar of GARAGE_LOCATIONS) {
        const d = calculateDistance(this.player.x, this.player.z, gar.x, gar.z + 10);
        if (d < gar.radius) {
          activeTip = isDriving
            ? `🔧 ${gar.name} - Appuie sur [ACTION] pour customiser ou ranger`
            : `🔧 ${gar.name} - Appuie sur [ACTION] pour accéder à l'atelier`;
          break;
        }
      }

      if (!activeTip) {
        for (const kiosk of COTONOU_MOMO_KIOSKS) {
          const d = calculateDistance(this.player.x, this.player.z, kiosk.x, kiosk.z);
          if (d < kiosk.radius) {
            activeTip = kiosk.isArmoredVan
              ? `💰 ${kiosk.name} - Touche E ou P pour braquer (300 000 FCFA)`
              : `📱 ${kiosk.name} - Touche E pour ouvrir MoMo Pay`;
            break;
          }
        }
      }

      if (this.callbacks.onInteractionTip) {
        this.callbacks.onInteractionTip(activeTip);
      }

      if (isDriving && currentVeh) {
        const throttle = moveForward;
        const steer = -turn;
        const physics = stepVehiclePhysics(
          currentVeh.speed,
          currentVeh.rotationY,
          throttle,
          steer,
          currentVeh.config,
          dt
        );

        currentVeh.speed = physics.speed;
        currentVeh.rotationY = physics.rotationY;

        const nextX = currentVeh.x + physics.deltaX;
        const nextZ = currentVeh.z + physics.deltaZ;
        let collided = false;

        // Shoreline water boundary: prevent sinking into the deep ocean
        if (nextX < -242) {
          collided = true;
          currentVeh.speed = -currentVeh.speed * 0.5;
          sound.playCrash(0.4);
        } else {
          for (const obs of this.obstacles) {
            if (checkObstacleCollision(nextX, nextZ, currentVeh.config.width * 0.52, obs)) {
              collided = true;
              currentVeh.speed = -currentVeh.speed * 0.4;
              sound.playCrash(Math.abs(physics.speed) / 20);
              break;
            }
          }
        }

        if (!collided) {
          currentVeh.x = Math.max(-242, Math.min(290, nextX));
          currentVeh.z = Math.max(-290, Math.min(290, nextZ));
        }

        this.player.x = currentVeh.x;
        this.player.z = currentVeh.z;
        this.player.rotationY = currentVeh.rotationY;

        sound.updateEngine(
          currentVeh.speed / currentVeh.config.maxSpeed,
          true,
          currentVeh.type === 'zemidjan'
        );

        this.callbacks.onVehicleUpdate(currentVeh);
      } else {
        const isSprinting = this.keys['shift'] || this.virtualInput.sprint;
        const walkSpeed = isSprinting ? 10.5 : 5.5;

        if (turn !== 0) {
          this.player.rotationY += turn * 3.2 * dt;
        }

        if (moveForward !== 0) {
          const deltaX = Math.sin(this.player.rotationY) * moveForward * walkSpeed * dt;
          const deltaZ = Math.cos(this.player.rotationY) * moveForward * walkSpeed * dt;
          const targetX = this.player.x + deltaX;
          const targetZ = this.player.z + deltaZ;

          let canMove = true;
          if (targetX < -242) {
            canMove = false;
          } else {
            for (const obs of this.obstacles) {
              if (checkObstacleCollision(targetX, targetZ, 0.75, obs)) {
                canMove = false;
                break;
              }
            }
          }

          if (canMove) {
            this.player.x = Math.max(-242, Math.min(290, targetX));
            this.player.z = Math.max(-290, Math.min(290, targetZ));
          }

          this.playerAnim.walkTime += dt * (isSprinting ? 14 : 9);
          const legAngle = Math.sin(this.playerAnim.walkTime) * 0.6;
          if (this.playerAnim.leftLeg) this.playerAnim.leftLeg.rotation.x = legAngle;
          if (this.playerAnim.rightLeg) this.playerAnim.rightLeg.rotation.x = -legAngle;
          if (this.playerAnim.leftArm) this.playerAnim.leftArm.rotation.x = -legAngle * 0.8;
          if (this.playerAnim.rightArm) this.playerAnim.rightArm.rotation.x = legAngle * 0.8;
        } else {
          if (this.playerAnim.leftLeg) this.playerAnim.leftLeg.rotation.x = 0;
          if (this.playerAnim.rightLeg) this.playerAnim.rightLeg.rotation.x = 0;
          if (this.playerAnim.leftArm) this.playerAnim.leftArm.rotation.x = 0;
          if (this.playerAnim.rightArm) this.playerAnim.rightArm.rotation.x = 0;
        }

        sound.stopEngine();
      }

      this.playerMeshGroup.position.set(this.player.x, 0, this.player.z);
      this.playerMeshGroup.rotation.y = this.player.rotationY;

      this.updateVehiclesAndPolice(dt);
      this.updatePedestrians(dt);

      const anyPoliceNearby = this.vehicles.some(
        (v) => v.isPolice && calculateDistance(this.player.x, this.player.z, v.x, v.z) < 55
      );
      const isHonking = !!(this.keys['h'] || false);

      if (this.trafficSystem) {
        this.trafficSystem.update(
          dt,
          this.player.x,
          this.player.z,
          this.player.wantedStars,
          anyPoliceNearby,
          isHonking
        );
      }

      this.updateCamera(dt, isDriving, currentVeh);
      this.updateMissionLogic(dt);

      const updatedWanted = updateWantedState(
        this.player.wantedStars,
        this.player.wantedProgress,
        anyPoliceNearby && this.player.wantedStars > 0,
        dt
      );
      this.player.wantedStars = updatedWanted.stars;
      this.player.wantedProgress = updatedWanted.progress;
      sound.setPoliceSiren(this.player.wantedStars > 0 && anyPoliceNearby);
    }

    this.callbacks.onStatsUpdate({ ...this.player });
  }

  private getNextNpcWaypoint(veh: ActiveVehicle): { x: number; z: number } {
    let closestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < ROAD_NODES.length; i++) {
      const node = ROAD_NODES[i];
      const dist = (node.x - veh.x) ** 2 + (node.z - veh.z) ** 2;
      if (dist < minDist) {
        minDist = dist;
        closestIdx = i;
      }
    }

    const currentNode = ROAD_NODES[closestIdx];
    const candidateIndices = currentNode.neighbors;

    if (candidateIndices.length === 0) {
      return { x: 0, z: 0 };
    }

    const forwardDx = Math.sin(veh.rotationY);
    const forwardDz = Math.cos(veh.rotationY);

    const validCandidates: number[] = [];
    for (const candIdx of candidateIndices) {
      const cand = ROAD_NODES[candIdx];
      const dx = cand.x - veh.x;
      const dz = cand.z - veh.z;
      const len = Math.sqrt(dx * dx + dz * dz) || 1;
      const dot = (dx * forwardDx + dz * forwardDz) / len;

      if (dot > -0.5) {
        validCandidates.push(candIdx);
      }
    }

    const chosenIdx =
      validCandidates.length > 0
        ? validCandidates[Math.floor(Math.random() * validCandidates.length)]
        : candidateIndices[Math.floor(Math.random() * candidateIndices.length)];

    const targetNode = ROAD_NODES[chosenIdx];
    return { x: targetNode.x, z: targetNode.z };
  }

  private isVehicleBlockedAhead(veh: ActiveVehicle): boolean {
    const forwardDx = Math.sin(veh.rotationY);
    const forwardDz = Math.cos(veh.rotationY);

    const pdx = this.player.x - veh.x;
    const pdz = this.player.z - veh.z;
    const pDist = Math.sqrt(pdx * pdx + pdz * pdz);
    if (pDist < 7.5 && pDist > 0.1) {
      const dot = (pdx * forwardDx + pdz * forwardDz) / pDist;
      if (dot > 0.55) return true;
    }

    for (const other of this.vehicles) {
      if (other.id === veh.id) continue;
      const dx = other.x - veh.x;
      const dz = other.z - veh.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 8.5 && dist > 0.1) {
        const dot = (dx * forwardDx + dz * forwardDz) / dist;
        if (dot > 0.55) return true;
      }
    }

    for (const obs of this.obstacles) {
      const dx = obs.x - veh.x;
      const dz = obs.z - veh.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      const obsRadius = obs.type === 'box' ? Math.max(obs.halfWidth, obs.halfDepth) : obs.radius;
      const minDistThreshold = obsRadius + 3.2;
      if (dist < minDistThreshold && dist > 0.1) {
        const dot = (dx * forwardDx + dz * forwardDz) / dist;
        if (dot > 0.6) return true;
      }
    }

    return false;
  }

  private updateVehiclesAndPolice(dt: number) {
    const isPlayerWanted = this.player.wantedStars > 0;
    const time = this.clock.getElapsedTime();

    this.vehicles.forEach((veh) => {
      const mesh = this.vehicleMeshes.get(veh.id);
      if (!mesh) return;

      if (!veh.isPlayerDriving) {
        if (veh.isPolice && isPlayerWanted) {
          veh.sirenActive = true;
          const targetX = this.player.x;
          const targetZ = this.player.z;
          const dx = targetX - veh.x;
          const dz = targetZ - veh.z;
          const targetAngle = Math.atan2(dx, dz);

          let angleDiff = targetAngle - veh.rotationY;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          veh.rotationY += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), 2.5 * dt);

          const dist = Math.sqrt(dx * dx + dz * dz);
          const topSpeed = 26 + this.player.wantedStars * 4;
          veh.speed = Math.min(veh.speed + 15 * dt, topSpeed);

          veh.x += Math.sin(veh.rotationY) * veh.speed * dt;
          veh.z += Math.cos(veh.rotationY) * veh.speed * dt;

          if (dist < 4.0) {
            this.player.health -= 12 * dt;
            if (this.player.health <= 0) {
              this.callbacks.onGameOver();
              this.setGameState('gameover');
            }
          }
        } else {
          veh.sirenActive = false;

          if (veh.targetX === undefined || veh.targetZ === undefined) {
            const wp = this.getNextNpcWaypoint(veh);
            veh.targetX = wp.x;
            veh.targetZ = wp.z;
          }

          const distToTarget = calculateDistance(veh.x, veh.z, veh.targetX, veh.targetZ);
          if (distToTarget < 5.0) {
            const wp = this.getNextNpcWaypoint(veh);
            veh.targetX = wp.x;
            veh.targetZ = wp.z;
          }

          const dx = veh.targetX - veh.x;
          const dz = veh.targetZ - veh.z;
          const targetAngle = Math.atan2(dx, dz);

          let angleDiff = targetAngle - veh.rotationY;
          while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
          while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

          veh.rotationY += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), 2.0 * dt);

          const blocked = this.isVehicleBlockedAhead(veh);
          const cruiseSpeed = veh.config.maxSpeed * 0.45;

          if (blocked) {
            veh.speed = Math.max(0, veh.speed - 22 * dt);
          } else {
            if (veh.speed < cruiseSpeed) {
              veh.speed = Math.min(veh.speed + veh.config.acceleration * 0.7 * dt, cruiseSpeed);
            } else {
              veh.speed = Math.max(cruiseSpeed, veh.speed - veh.config.braking * dt);
            }
          }

          const deltaX = Math.sin(veh.rotationY) * veh.speed * dt;
          const deltaZ = Math.cos(veh.rotationY) * veh.speed * dt;

          let hitObstacle = false;
          for (const obs of this.obstacles) {
            if (checkObstacleCollision(veh.x + deltaX, veh.z + deltaZ, veh.config.width * 0.55, obs)) {
              hitObstacle = true;
              break;
            }
          }

          if (!hitObstacle) {
            veh.x += deltaX;
            veh.z += deltaZ;
          } else {
            veh.speed = 0;
            const wp = this.getNextNpcWaypoint(veh);
            veh.targetX = wp.x;
            veh.targetZ = wp.z;
          }
        }
      }

      mesh.position.set(veh.x, 0, veh.z);
      mesh.rotation.y = veh.rotationY;

      mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.CylinderGeometry) {
          child.rotation.x += veh.speed * 0.15 * dt;
        }
      });
    });

    const flash = Math.sin(time * 16) > 0;
    this.policeLights.forEach((pl) => {
      pl.red.intensity = flash ? 3.0 : 0.2;
      pl.blue.intensity = flash ? 0.2 : 3.0;
    });
  }

  private updatePedestrians(dt: number) {
    this.pedestrians.forEach((ped) => {
      const mesh = this.pedestrianMeshes.get(ped.id);
      if (!mesh) return;

      if (ped.state === 'down') {
        mesh.rotation.z = Math.PI / 2;
        mesh.position.y = 0.2;
        return;
      }

      const distToPlayer = calculateDistance(ped.x, ped.z, this.player.x, this.player.z);
      if (distToPlayer < 7.5 && this.player.currentVehicleId) {
        ped.state = 'fleeing';
        ped.fleeTimer = 6;
      }

      if (ped.state === 'fleeing') {
        const dx = ped.x - this.player.x;
        const dz = ped.z - this.player.z;
        ped.rotationY = Math.atan2(dx, dz);
        ped.x += Math.sin(ped.rotationY) * 6.5 * dt;
        ped.z += Math.cos(ped.rotationY) * 6.5 * dt;

        if (ped.fleeTimer) {
          ped.fleeTimer -= dt;
          if (ped.fleeTimer <= 0) ped.state = 'walking';
        }
      } else {
        const dx = ped.targetX - ped.x;
        const dz = ped.targetZ - ped.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist < 2.0) {
          ped.targetX = ped.x + (Math.random() - 0.5) * 60;
          ped.targetZ = ped.z + (Math.random() - 0.5) * 60;
        } else {
          ped.rotationY = Math.atan2(dx, dz);
          ped.x += Math.sin(ped.rotationY) * ped.speed * dt;
          ped.z += Math.cos(ped.rotationY) * ped.speed * dt;
        }
      }

      mesh.position.set(ped.x, 0, ped.z);
      mesh.rotation.y = ped.rotationY;
    });
  }

  private updateCamera(dt: number, isDriving: boolean, currentVeh?: ActiveVehicle) {
    const camDist = isDriving ? 11.5 : 5.8;
    const camHeight = isDriving ? 4.8 : 2.6;
    const lookAhead = isDriving ? 4.0 : 1.5;

    const heading = isDriving && currentVeh ? currentVeh.rotationY : this.player.rotationY;

    const targetCamX = this.player.x - Math.sin(heading) * camDist;
    const targetCamZ = this.player.z - Math.cos(heading) * camDist;
    const targetCamY = camHeight;

    const k = isDriving ? 8.0 : 12.0;
    const factor = 1 - Math.exp(-k * dt);

    this.camera.position.x += (targetCamX - this.camera.position.x) * factor;
    this.camera.position.y += (targetCamY - this.camera.position.y) * factor;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * factor;

    _scratchCamTarget.set(
      this.player.x + Math.sin(heading) * lookAhead,
      isDriving ? 1.4 : 1.2,
      this.player.z + Math.cos(heading) * lookAhead
    );
    this.camera.lookAt(_scratchCamTarget);

    // Keep the high-resolution shadow frustum centered tightly around the player
    if (this.sunLight) {
      this.sunLight.position.set(this.player.x + 50, 120, this.player.z + 35);
      this.sunLight.target.position.set(this.player.x, 0, this.player.z);
    }
  }

  private updateMissionLogic(dt: number) {
    if (!this.activeMission) return;

    this.missionWaypointMesh.rotation.y += 1.5 * dt;

    this.activeMission.timeLeft -= dt;
    if (this.activeMission.timeLeft <= 0) {
      this.activeMission.failed = true;
      this.activeMission.failReason = 'Temps écoulé !';
      this.callbacks.onNotification('Mission échouée : Temps écoulé !');
      this.cancelMission();
      return;
    }

    const currentVeh = this.vehicles.find((v) => v.id === this.player.currentVehicleId);
    const stage = this.activeMission.mission.stages[this.activeMission.currentStageIndex];

    if (stage) {
      const reached = checkStageCompletion(
        this.player.x,
        this.player.z,
        stage.targetX,
        stage.targetZ,
        stage.targetRadius,
        currentVeh ? currentVeh.type : null,
        stage.requiresVehicleType
      );

      if (reached) {
        sound.playCashChime();

        if (stage.spawnPoliceStars) {
          const crime = applyCrimeWanted(this.player.wantedStars, stage.spawnPoliceStars);
          this.player.wantedStars = crime.stars;
          this.player.wantedProgress = crime.progress;
          this.callbacks.onNotification(`Alerte Police Républicaine ! ${crime.stars} étoiles !`);
        }

        if (this.activeMission.currentStageIndex + 1 < this.activeMission.mission.stages.length) {
          this.activeMission.currentStageIndex++;
          this.updateMissionWaypoint();
          this.callbacks.onMissionUpdate({ ...this.activeMission });
          this.callbacks.onNotification(`Objectif réussi ! Étape suivante.`);
        } else {
          const reward = this.activeMission.mission.rewardFCFA;
          this.player.cashFCFA += reward;
          sound.playMissionSuccess();
          this.callbacks.onVictory(this.activeMission.mission.title, reward);
          this.cancelMission();
        }
      }
    }
  }

  public honkHorn() {
    sound.playHorn();
    this.callbacks.onNotification('Klaxon retenti !');
  }

  public teleportPlayer(x: number, z: number) {
    this.player.x = x;
    this.player.z = z;
    if (this.isIndoorBedroom) {
      this.exitBedroomToCity();
    }
    if (this.player.currentVehicleId) {
      const veh = this.vehicles.find((v) => v.id === this.player.currentVehicleId);
      if (veh) {
        veh.x = x;
        veh.z = z;
        veh.speed = 0;
      }
    }
    this.playerMeshGroup.position.set(x, 0, z);
    this.callbacks.onNotification(`Téléporté à Cotonou : X=${Math.round(x)}, Z=${Math.round(z)}`);
  }

  public setCustomWaypoint(x: number, z: number, name: string) {
    this.missionWaypointMesh.position.set(x, 6, z);
    this.missionWaypointMesh.visible = true;
    this.callbacks.onNotification(`Repère GPS défini : ${name}`);
  }

  public add3DRoadMesh(road: { id: string; name: string; points: { x: number; z: number }[] }) {
    if (!road.points || road.points.length < 2) return;

    const roadGroup = new THREE.Group();
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x242424,
      roughness: 0.85,
      metalness: 0.05,
    });

    const lineMat = new THREE.MeshBasicMaterial({ color: 0xFFEB3B });

    for (let i = 0; i < road.points.length - 1; i++) {
      const p1 = road.points[i];
      const p2 = road.points[i + 1];

      const dx = p2.x - p1.x;
      const dz = p2.z - p1.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 0.1) continue;

      const angle = Math.atan2(dx, dz);
      const midX = (p1.x + p2.x) / 2;
      const midZ = (p1.z + p2.z) / 2;

      const roadGeo = new THREE.PlaneGeometry(10, dist);
      roadGeo.rotateX(-Math.PI / 2);
      const segmentMesh = new THREE.Mesh(roadGeo, roadMat);
      segmentMesh.position.set(midX, 0.05, midZ);
      segmentMesh.rotation.y = angle;
      segmentMesh.receiveShadow = true;
      roadGroup.add(segmentMesh);

      const lineGeo = new THREE.PlaneGeometry(0.8, dist * 0.9);
      lineGeo.rotateX(-Math.PI / 2);
      const lineMesh = new THREE.Mesh(lineGeo, lineMat);
      lineMesh.position.set(midX, 0.06, midZ);
      lineMesh.rotation.y = angle;
      roadGroup.add(lineMesh);
    }

    this.scene.add(roadGroup);
    this.callbacks.onNotification(`Route 3D ajoutée : ${road.name}`);
  }

  public getTrafficVehicles() {
    return this.trafficSystem ? this.trafficSystem.getVehicles() : [];
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.trafficSystem) {
      this.trafficSystem.dispose();
    }
    cancelAnimationFrame(this.frameId);
    clearTimeout(this.frameId);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
