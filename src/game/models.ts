/**
 * GTA Cotonou - High-Fidelity Procedural 3D Models (Three.js)
 * Smooth, non-geometric, curved humanoid anatomy (CapsuleGeometry & SphereGeometry)
 * Detailed vehicles (Zémidjan, Peugeot 505 Taxi, G-Wagon, Police Républicaine)
 * Iconic monuments (Monument de l'Amazone, Place de l'Étoile Rouge, Dantokpa)
 */

import * as THREE from 'three';
import {
  createTropicalStuccoTexture,
  createLouvreWindowTexture,
  createACUnitTexture,
  createStripedAwningTexture,
  createCorrugatedRoofTexture,
} from './textures.ts';

// Procedural texture generators
function createWaxPatternTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#E65100'; // Rich African orange base
  ctx.fillRect(0, 0, 256, 256);

  // Geometric floral & circular wax print motifs (Kente & Vlisco inspired)
  ctx.fillStyle = '#FDD835'; // Golden yellow circles
  for (let x = 32; x < 256; x += 64) {
    for (let y = 32; y < 256; y += 64) {
      ctx.beginPath();
      ctx.arc(x, y, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1A237E'; // Deep blue center
      ctx.beginPath();
      ctx.arc(x, y, 11, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#B71C1C'; // Red accent
      ctx.fillRect(x - 4, y - 4, 8, 8);
      ctx.fillStyle = '#FDD835';
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

function createTaxiSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 32;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFF8E1';
  ctx.fillRect(0, 0, 128, 32);
  ctx.fillStyle = '#B71C1C';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TAXI COTONOU', 64, 16);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPoliceDecalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0D47A1';
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('POLICE RÉPUBLICAINE', 128, 32);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Wheel builder (Smooth curved tire with tread, alloy rim & hubcap)
function createWheel(radius: number, width: number, isBike: boolean = false): THREE.Group {
  const group = new THREE.Group();

  // Outer rubber tire with rounded bevel
  const tireGeo = new THREE.CylinderGeometry(radius, radius, width, 24);
  tireGeo.rotateZ(Math.PI / 2);
  const tireMat = new THREE.MeshStandardMaterial({
    color: 0x1A1A1A,
    roughness: 0.9,
    metalness: 0.1,
  });
  const tire = new THREE.Mesh(tireGeo, tireMat);
  tire.castShadow = true;
  group.add(tire);

  // Chrome / metallic alloy rim
  const rimGeo = new THREE.CylinderGeometry(radius * 0.68, radius * 0.68, width + 0.02, 16);
  rimGeo.rotateZ(Math.PI / 2);
  const rimMat = new THREE.MeshStandardMaterial({
    color: isBike ? 0xD8D8D8 : 0xEEEEEE,
    roughness: 0.25,
    metalness: 0.85,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  group.add(rim);

  // Spokes or center hub
  const hubGeo = new THREE.CylinderGeometry(radius * 0.25, radius * 0.25, width + 0.04, 12);
  hubGeo.rotateZ(Math.PI / 2);
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x212121, metalness: 0.9, roughness: 0.2 });
  const hub = new THREE.Mesh(hubGeo, hubMat);
  group.add(hub);

  return group;
}

/**
 * 1. Zémidjan Motorcycle (Smooth curved contours, teardrop tank, dual suspension)
 */
export function createZemidjanMesh(): THREE.Group {
  const group = new THREE.Group();

  // Main tubular frame (curved cylinders)
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.4, metalness: 0.8 });
  const frameGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.3, 12);
  frameGeo.rotateX(Math.PI / 2.3);
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.set(0, 0.6, 0);
  frame.castShadow = true;
  group.add(frame);

  // Engine block with cooling fins
  const engineMat = new THREE.MeshStandardMaterial({ color: 0x757575, roughness: 0.3, metalness: 0.9 });
  const engine = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.32, 0.42), engineMat);
  engine.position.set(0, 0.46, 0.05);
  engine.castShadow = true;
  group.add(engine);

  // Curved Teardrop Fuel Tank (Iconic Cotonou Zémidjan Yellow)
  const tankGeo = new THREE.SphereGeometry(0.24, 16, 12);
  tankGeo.scale(0.8, 0.9, 1.4);
  const tankMat = new THREE.MeshStandardMaterial({
    color: 0xFFCC00, // Vibrant yellow
    roughness: 0.18,
    metalness: 0.3,
  });
  const tank = new THREE.Mesh(tankGeo, tankMat);
  tank.position.set(0, 0.82, 0.25);
  tank.castShadow = true;
  group.add(tank);

  // Contoured Leather Saddle
  const seatGeo = new THREE.CapsuleGeometry(0.14, 0.45, 6, 12);
  seatGeo.rotateX(Math.PI / 2);
  const seatMat = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.85 });
  const seat = new THREE.Mesh(seatGeo, seatMat);
  seat.position.set(0, 0.82, -0.35);
  group.add(seat);

  // Wheels
  const frontWheel = createWheel(0.36, 0.12, true);
  frontWheel.position.set(0, 0.36, 0.85);
  group.add(frontWheel);

  const rearWheel = createWheel(0.36, 0.12, true);
  rearWheel.position.set(0, 0.36, -0.85);
  group.add(rearWheel);

  // Front Suspension Forks & Handlebars
  const forkGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.9, 8);
  const forkMat = new THREE.MeshStandardMaterial({ color: 0xE0E0E0, metalness: 0.9, roughness: 0.2 });
  const forkL = new THREE.Mesh(forkGeo, forkMat);
  forkL.position.set(-0.1, 0.65, 0.65);
  forkL.rotateX(0.3);
  const forkR = new THREE.Mesh(forkGeo, forkMat);
  forkR.position.set(0.1, 0.65, 0.65);
  forkR.rotateX(0.3);
  group.add(forkL, forkR);

  // Handlebar with rubber grips & rearview mirrors
  const barGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.75, 8);
  barGeo.rotateZ(Math.PI / 2);
  const bar = new THREE.Mesh(barGeo, forkMat);
  bar.position.set(0, 1.05, 0.55);
  group.add(bar);

  // Curved Headlight
  const lampGeo = new THREE.SphereGeometry(0.12, 12, 12);
  lampGeo.scale(1, 1, 0.7);
  const lampMat = new THREE.MeshStandardMaterial({
    color: 0xFFEE58,
    emissive: 0xFFD54F,
    emissiveIntensity: 0.7,
    roughness: 0.1,
  });
  const lamp = new THREE.Mesh(lampGeo, lampMat);
  lamp.position.set(0, 0.95, 0.75);
  group.add(lamp);

  // Chrome Curved Exhaust Pipe
  const exhaustGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.95, 8);
  exhaustGeo.rotateX(Math.PI / 2.2);
  const exhaustMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, metalness: 0.95, roughness: 0.15 });
  const exhaust = new THREE.Mesh(exhaustGeo, exhaustMat);
  exhaust.position.set(0.18, 0.35, -0.35);
  group.add(exhaust);

  // Soft Radial Contact Shadow
  const shadowGeo = new THREE.CircleGeometry(1.0, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

/**
 * 2. Kéké Tricycle Bajaj
 */
export function createKekeMesh(): THREE.Group {
  const group = new THREE.Group();

  // Curved chassis bottom
  const chassisGeo = new THREE.BoxGeometry(1.4, 0.3, 2.5);
  const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.4, metalness: 0.3 });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.set(0, 0.45, 0);
  chassis.castShadow = true;
  group.add(chassis);

  // Passenger Cabin
  const cabinGeo = new THREE.BoxGeometry(1.35, 1.1, 1.6);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0xFDD835, roughness: 0.3, metalness: 0.1 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, 1.15, -0.35);
  cabin.castShadow = true;
  group.add(cabin);

  // Curved Fabric Canopy Roof
  const roofGeo = new THREE.CylinderGeometry(0.72, 0.72, 2.3, 16, 1, false, 0, Math.PI);
  roofGeo.rotateZ(Math.PI / 2);
  roofGeo.rotateY(Math.PI / 2);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.7 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, 1.7, -0.05);
  group.add(roof);

  // Windshield
  const glassGeo = new THREE.BoxGeometry(1.2, 0.6, 0.06);
  glassGeo.rotateX(-0.15);
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x81D4FA, transparent: true, opacity: 0.45, roughness: 0.1 });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, 1.35, 0.75);
  group.add(glass);

  // Wheels
  const frontWheel = createWheel(0.32, 0.14);
  frontWheel.position.set(0, 0.32, 1.1);
  group.add(frontWheel);

  const rearLeft = createWheel(0.32, 0.14);
  rearLeft.position.set(-0.7, 0.32, -0.75);
  group.add(rearLeft);

  const rearRight = createWheel(0.32, 0.14);
  rearRight.position.set(0.7, 0.32, -0.75);
  group.add(rearRight);

  // Dual headlights
  const lampGeo = new THREE.SphereGeometry(0.09, 12, 12);
  const lampMat = new THREE.MeshStandardMaterial({ color: 0xFFFF8D, emissive: 0xFFD54F, emissiveIntensity: 0.6 });
  const lampL = new THREE.Mesh(lampGeo, lampMat);
  lampL.position.set(-0.35, 0.7, 1.15);
  const lampR = new THREE.Mesh(lampGeo, lampMat);
  lampR.position.set(0.35, 0.7, 1.15);
  group.add(lampL, lampR);

  // Contact shadow
  const shadowGeo = new THREE.PlaneGeometry(1.8, 3.0);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

/**
 * 3. Peugeot 505 Taxi Jaune & Vert (Iconic Cotonou Taxi)
 */
export function createTaxi505Mesh(): THREE.Group {
  const group = new THREE.Group();

  // Main contoured body
  const bodyGeo = new THREE.BoxGeometry(1.85, 0.65, 4.2);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xFBC02D, roughness: 0.28, metalness: 0.25 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0.65, 0);
  body.castShadow = true;
  group.add(body);

  // Green Taxi Roof with rounded corners
  const cabinGeo = new THREE.BoxGeometry(1.65, 0.65, 2.3);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.3, metalness: 0.2 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, 1.25, -0.2);
  cabin.castShadow = true;
  group.add(cabin);

  // Front & Rear Glass
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x90CAF9, transparent: true, opacity: 0.45, roughness: 0.1 });
  const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.5, 0.08), glassMat);
  frontGlass.position.set(0, 1.18, 1.0);
  frontGlass.rotateX(-0.35);
  group.add(frontGlass);

  const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.45, 0.08), glassMat);
  rearGlass.position.set(0, 1.18, -1.4);
  rearGlass.rotateX(0.35);
  group.add(rearGlass);

  // 4 Wheels
  const wheelPositions = [
    [-0.95, 0.36, 1.3],
    [0.95, 0.36, 1.3],
    [-0.95, 0.36, -1.3],
    [0.95, 0.36, -1.3],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = createWheel(0.36, 0.22);
    wheel.position.set(x, y, z);
    group.add(wheel);
  });

  // Roof "TAXI COTONOU" sign
  const signGeo = new THREE.BoxGeometry(0.8, 0.22, 0.25);
  const signMat = new THREE.MeshStandardMaterial({
    map: createTaxiSignTexture(),
    roughness: 0.2,
    emissive: 0x443300,
    emissiveIntensity: 0.3,
  });
  const taxiSign = new THREE.Mesh(signGeo, signMat);
  taxiSign.position.set(0, 1.68, -0.15);
  group.add(taxiSign);

  // Headlights
  const lightGeo = new THREE.BoxGeometry(0.35, 0.18, 0.05);
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xFFFF8D, emissive: 0xFFD54F, emissiveIntensity: 0.7 });
  const lightL = new THREE.Mesh(lightGeo, lightMat);
  lightL.position.set(-0.65, 0.65, 2.12);
  const lightR = new THREE.Mesh(lightGeo, lightMat);
  lightR.position.set(0.65, 0.65, 2.12);
  group.add(lightL, lightR);

  // Shadow
  const shadowGeo = new THREE.PlaneGeometry(2.3, 4.6);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

/**
 * 3.5. Minibus Tokpa-Tokpa (Transports collectifs populaires de Cotonou)
 */
export function createTokpaTokpaBusMesh(): THREE.Group {
  const group = new THREE.Group();

  // Van body
  const bodyGeo = new THREE.BoxGeometry(2.1, 1.4, 4.8);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.3, metalness: 0.2 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 1.1, 0);
  body.castShadow = true;
  group.add(body);

  // White stripe along side
  const stripeGeo = new THREE.BoxGeometry(2.14, 0.25, 4.6);
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.set(0, 1.1, 0);
  group.add(stripe);

  // Windows
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.5, roughness: 0.1 });
  const frontWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.65, 0.08), glassMat);
  frontWindshield.position.set(0, 1.35, 2.38);
  frontWindshield.rotateX(-0.2);
  group.add(frontWindshield);

  // Side windows
  const sideGlassGeo = new THREE.BoxGeometry(2.16, 0.45, 3.2);
  const sideGlass = new THREE.Mesh(sideGlassGeo, glassMat);
  sideGlass.position.set(0, 1.35, -0.3);
  group.add(sideGlass);

  // Wheels
  const wheelPositions = [
    [-1.08, 0.42, 1.5],
    [1.08, 0.42, 1.5],
    [-1.08, 0.42, -1.5],
    [1.08, 0.42, -1.5],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = createWheel(0.42, 0.24);
    wheel.position.set(x, y, z);
    group.add(wheel);
  });

  // Destination Signboard "DANTOKPA - ÉTOILE ROUGE"
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 256;
  signCanvas.height = 48;
  const ctx = signCanvas.getContext('2d')!;
  ctx.fillStyle = '#F59E0B';
  ctx.fillRect(0, 0, 256, 48);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TOKPA-TOKPA COTONOU', 128, 24);

  const signTex = new THREE.CanvasTexture(signCanvas);
  signTex.colorSpace = THREE.SRGBColorSpace;
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.32),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  signMesh.position.set(0, 1.72, 2.38);
  signMesh.rotateX(-0.1);
  group.add(signMesh);

  // Headlights
  const lightGeo = new THREE.BoxGeometry(0.32, 0.2, 0.06);
  const lightMat = new THREE.MeshStandardMaterial({ color: 0xFFFF8D, emissive: 0xFFD54F, emissiveIntensity: 0.7 });
  const lightL = new THREE.Mesh(lightGeo, lightMat);
  lightL.position.set(-0.75, 0.75, 2.41);
  const lightR = new THREE.Mesh(lightGeo, lightMat);
  lightR.position.set(0.75, 0.75, 2.41);
  group.add(lightL, lightR);

  // Shadow
  const shadowGeo = new THREE.PlaneGeometry(2.5, 5.2);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

/**
 * 4. Luxury G-Wagon SUV
 */
export function createGWagonMesh(): THREE.Group {
  const group = new THREE.Group();

  const chassisGeo = new THREE.BoxGeometry(2.05, 0.8, 4.4);
  const chassisMat = new THREE.MeshStandardMaterial({ color: 0x1E1E1E, roughness: 0.35, metalness: 0.5 });
  const chassis = new THREE.Mesh(chassisGeo, chassisMat);
  chassis.position.set(0, 0.85, 0);
  chassis.castShadow = true;
  group.add(chassis);

  const cabinGeo = new THREE.BoxGeometry(1.95, 0.9, 2.8);
  const cabin = new THREE.Mesh(cabinGeo, chassisMat);
  cabin.position.set(0, 1.65, -0.4);
  cabin.castShadow = true;
  group.add(cabin);

  // Dark tinted windows
  const tintMat = new THREE.MeshStandardMaterial({ color: 0x080808, roughness: 0.1, metalness: 0.9 });
  const winFront = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.65, 0.05), tintMat);
  winFront.position.set(0, 1.65, 1.02);
  winFront.rotateX(-0.1);
  group.add(winFront);

  // 4 Big Off-road wheels
  const wheelPositions = [
    [-1.05, 0.45, 1.35],
    [1.05, 0.45, 1.35],
    [-1.05, 0.45, -1.35],
    [1.05, 0.45, -1.35],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = createWheel(0.45, 0.28);
    wheel.position.set(x, y, z);
    group.add(wheel);
  });

  // Spare tire mounted on back
  const spareWheel = createWheel(0.4, 0.22);
  spareWheel.position.set(0, 1.3, -2.25);
  group.add(spareWheel);

  // Circular LED headlights
  const ledGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.06, 16);
  ledGeo.rotateX(Math.PI / 2);
  const ledMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xE0F7FA, emissiveIntensity: 0.9 });
  const ledL = new THREE.Mesh(ledGeo, ledMat);
  ledL.position.set(-0.75, 0.85, 2.22);
  const ledR = new THREE.Mesh(ledGeo, ledMat);
  ledR.position.set(0.75, 0.85, 2.22);
  group.add(ledL, ledR);

  // Shadow
  const shadowGeo = new THREE.PlaneGeometry(2.5, 4.8);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  group.add(shadow);

  return group;
}

/**
 * 5. Police Républicaine Cruiser
 */
export function createPoliceCruiserMesh(): { group: THREE.Group; lightRed: THREE.PointLight; lightBlue: THREE.PointLight } {
  const group = new THREE.Group();

  const bodyGeo = new THREE.BoxGeometry(1.9, 0.65, 4.3);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0xF5F5F5, roughness: 0.25, metalness: 0.3 });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0.65, 0);
  body.castShadow = true;
  group.add(body);

  const cabinGeo = new THREE.BoxGeometry(1.7, 0.65, 2.3);
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0D47A1, roughness: 0.3, metalness: 0.4 });
  const cabin = new THREE.Mesh(cabinGeo, cabinMat);
  cabin.position.set(0, 1.25, -0.2);
  cabin.castShadow = true;
  group.add(cabin);

  // Decals
  const decalGeo = new THREE.PlaneGeometry(2.2, 0.4);
  const decalMat = new THREE.MeshBasicMaterial({ map: createPoliceDecalTexture(), transparent: true });
  const decalL = new THREE.Mesh(decalGeo, decalMat);
  decalL.position.set(-0.96, 0.7, 0);
  decalL.rotateY(-Math.PI / 2);
  const decalR = new THREE.Mesh(decalGeo, decalMat);
  decalR.position.set(0.96, 0.7, 0);
  decalR.rotateY(Math.PI / 2);
  group.add(decalL, decalR);

  // Wheels
  const wheelPositions = [
    [-0.98, 0.36, 1.3],
    [0.98, 0.36, 1.3],
    [-0.98, 0.36, -1.3],
    [0.98, 0.36, -1.3],
  ];
  wheelPositions.forEach(([x, y, z]) => {
    const wheel = createWheel(0.36, 0.22);
    wheel.position.set(x, y, z);
    group.add(wheel);
  });

  // Emergency Lightbar
  const redLensMat = new THREE.MeshStandardMaterial({ color: 0xFF1744, emissive: 0xD50000, emissiveIntensity: 0.8 });
  const blueLensMat = new THREE.MeshStandardMaterial({ color: 0x2979FF, emissive: 0x0091EA, emissiveIntensity: 0.8 });
  const redLens = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 0.2), redLensMat);
  redLens.position.set(-0.3, 1.68, -0.2);
  const blueLens = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.12, 0.2), blueLensMat);
  blueLens.position.set(0.3, 1.68, -0.2);
  group.add(redLens, blueLens);

  const lightRed = new THREE.PointLight(0xFF1744, 2.5, 18);
  lightRed.position.set(-0.3, 1.75, -0.2);
  const lightBlue = new THREE.PointLight(0x2979FF, 2.5, 18);
  lightBlue.position.set(0.3, 1.75, -0.2);
  group.add(lightRed, lightBlue);

  // Shadow
  const shadowGeo = new THREE.PlaneGeometry(2.4, 4.6);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.4 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  group.add(shadow);

  return { group, lightRed, lightBlue };
}

/**
 * 6. Smooth Curved Humanoid Character (NO BLOCKY / MINECRAFT GEOMETRY!)
 * Uses CapsuleGeometry, SphereGeometry and contoured anatomical proportions.
 */
export function createCharacterMesh(
  isHero: boolean = false,
  shirtColorHex: number = 0x3F51B5,
  customConfig?: {
    gender?: 'garcon' | 'fille';
    style?: 'wax' | 'streetwear' | 'swag' | 'chic';
    colorHex?: string;
    hat?: 'cap' | 'hat' | 'none';
    glasses?: boolean;
  }
): {
  group: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
} {
  const group = new THREE.Group();

  const isFemale = customConfig?.gender === 'fille';
  const outfitStyle = customConfig?.style || 'wax';
  const hexColor = customConfig?.colorHex || '#E65100';

  // Natural skin material with warm sub-surface undertones
  const skinMat = new THREE.MeshStandardMaterial({
    color: 0x4E342E, // Warm West African skin tone
    roughness: 0.55,
    metalness: 0.05,
  });

  const jeansMat = new THREE.MeshStandardMaterial({
    color: isFemale ? 0x0F172A : 0x1E3A8A, // Stylish dark trousers or denim
    roughness: 0.75,
  });

  const sneakerMat = new THREE.MeshStandardMaterial({
    color: isFemale ? 0xFDE047 : 0xF8FAFC, // Golden or white sneakers
    roughness: 0.35,
  });

  let shirtMat: THREE.Material;
  if (isHero) {
    const canvasTex = createWaxPatternTexture();
    shirtMat = new THREE.MeshStandardMaterial({
      map: canvasTex,
      roughness: 0.5,
    });
  } else {
    shirtMat = new THREE.MeshStandardMaterial({
      color: shirtColorHex,
      roughness: 0.5,
    });
  }

  // 1. Contoured Smooth Torso (Capsule / Rounded Cylinder)
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 1.15, 0);

  // Upper chest / shoulders
  const chestGeo = new THREE.CapsuleGeometry(isFemale ? 0.165 : 0.18, 0.32, 10, 16);
  const chest = new THREE.Mesh(chestGeo, shirtMat);
  chest.scale.set(isFemale ? 1.05 : 1.2, 1.0, 0.75);
  chest.castShadow = true;
  torsoGroup.add(chest);

  // Neck (smooth cylinder)
  const neckGeo = new THREE.CylinderGeometry(0.07, 0.08, 0.16, 16);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.set(0, 0.28, 0);
  torsoGroup.add(neck);

  group.add(torsoGroup);

  // 2. Sculpted Head (Smooth Sphere with jaw curvature)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.62, 0);

  const skullGeo = new THREE.SphereGeometry(0.165, 20, 20);
  skullGeo.scale(0.9, 1.15, 1.0);
  const head = new THREE.Mesh(skullGeo, skinMat);
  head.castShadow = true;
  headGroup.add(head);

  if (isFemale) {
    // Elegant African braided crown / afro puff
    const hairGeo = new THREE.SphereGeometry(0.19, 16, 16);
    hairGeo.scale(1.1, 0.9, 1.1);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x0F0F0F, roughness: 0.9 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.06, -0.02);
    headGroup.add(hair);

    // Gold hoop earrings
    const earringGeo = new THREE.TorusGeometry(0.035, 0.008, 8, 16);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xFDE047, metalness: 0.9, roughness: 0.1 });
    const eL = new THREE.Mesh(earringGeo, goldMat);
    eL.position.set(-0.15, -0.02, 0.02);
    eL.rotateY(Math.PI / 2);
    const eR = new THREE.Mesh(earringGeo, goldMat);
    eR.position.set(0.15, -0.02, 0.02);
    eR.rotateY(Math.PI / 2);
    headGroup.add(eL, eR);
  } else if (customConfig?.hat === 'cap' || isHero) {
    // Stylish Red Snapback Cap with curved visor
    const capGeo = new THREE.SphereGeometry(0.175, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.7 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 0.04, 0);
    headGroup.add(cap);

    // Visor
    const visorGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.03, 16, 1, false, -Math.PI / 3, (Math.PI * 2) / 3);
    const visor = new THREE.Mesh(visorGeo, capMat);
    visor.position.set(0, 0.02, 0.08);
    visor.rotateX(0.15);
    headGroup.add(visor);
  } else {
    // Natural hair styling
    const hairGeo = new THREE.SphereGeometry(0.175, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2.2);
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x171717, roughness: 0.95 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 0.03, 0);
    headGroup.add(hair);
  }

  if (customConfig?.glasses || isHero) {
    // Dark sleek sunglasses
    const glassesGeo = new THREE.TorusGeometry(0.07, 0.02, 8, 16, Math.PI);
    const glassesMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.9, roughness: 0.1 });
    const glassesL = new THREE.Mesh(glassesGeo, glassesMat);
    glassesL.position.set(-0.065, 0.02, 0.13);
    glassesL.rotateX(Math.PI);
    const glassesR = new THREE.Mesh(glassesGeo, glassesMat);
    glassesR.position.set(0.065, 0.02, 0.13);
    glassesR.rotateX(Math.PI);
    headGroup.add(glassesL, glassesR);
  }

  group.add(headGroup);

  // 3. Smooth Legs (Thigh + Knee + Calf + Contoured Sneaker)
  function createSmoothLeg(isLeft: boolean): { legRoot: THREE.Group } {
    const legRoot = new THREE.Group();
    legRoot.position.set(isLeft ? -0.13 : 0.13, 0.88, 0);

    // Thigh (Capsule)
    const thighGeo = new THREE.CapsuleGeometry(0.09, 0.36, 10, 16);
    const thigh = new THREE.Mesh(thighGeo, jeansMat);
    thigh.position.set(0, -0.2, 0);
    thigh.castShadow = true;
    legRoot.add(thigh);

    // Knee joint (Sphere)
    const kneeGeo = new THREE.SphereGeometry(0.082, 12, 12);
    const knee = new THREE.Mesh(kneeGeo, jeansMat);
    knee.position.set(0, -0.42, 0.01);
    legRoot.add(knee);

    // Calf (Capsule)
    const calfGeo = new THREE.CapsuleGeometry(0.078, 0.34, 10, 16);
    const calf = new THREE.Mesh(calfGeo, jeansMat);
    calf.position.set(0, -0.62, 0);
    calf.castShadow = true;
    legRoot.add(calf);

    // Sneaker (Contoured organic foot)
    const shoeGroup = new THREE.Group();
    shoeGroup.position.set(0, -0.83, 0.04);

    const shoeSole = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.085, 0.18, 8, 12),
      sneakerMat
    );
    shoeSole.scale.set(0.9, 0.55, 1.3);
    shoeSole.rotateX(Math.PI / 2);
    shoeSole.castShadow = true;
    shoeGroup.add(shoeSole);

    legRoot.add(shoeGroup);
    return { legRoot };
  }

  const { legRoot: leftLeg } = createSmoothLeg(true);
  const { legRoot: rightLeg } = createSmoothLeg(false);
  group.add(leftLeg, rightLeg);

  // 4. Smooth Arms (Deltoid + Bicep + Elbow + Forearm + Hand)
  function createSmoothArm(isLeft: boolean): { armRoot: THREE.Group } {
    const armRoot = new THREE.Group();
    armRoot.position.set(isLeft ? -0.28 : 0.28, 1.32, 0);

    // Shoulder Deltoid (Sphere)
    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 12), shirtMat);
    armRoot.add(shoulder);

    // Upper arm (Capsule)
    const bicepGeo = new THREE.CapsuleGeometry(0.075, 0.28, 8, 16);
    const bicep = new THREE.Mesh(bicepGeo, skinMat);
    bicep.position.set(0, -0.16, 0);
    bicep.castShadow = true;
    armRoot.add(bicep);

    // Elbow joint
    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), skinMat);
    elbow.position.set(0, -0.32, 0);
    armRoot.add(elbow);

    // Forearm (Capsule)
    const forearmGeo = new THREE.CapsuleGeometry(0.065, 0.26, 8, 16);
    const forearm = new THREE.Mesh(forearmGeo, skinMat);
    forearm.position.set(0, -0.46, 0.02);
    forearm.castShadow = true;
    armRoot.add(forearm);

    // Sculpted Hand with knuckles
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), skinMat);
    hand.scale.set(0.7, 1.1, 1.2);
    hand.position.set(0, -0.62, 0.02);
    armRoot.add(hand);

    return { armRoot };
  }

  const { armRoot: leftArm } = createSmoothArm(true);
  const { armRoot: rightArm } = createSmoothArm(false);
  group.add(leftArm, rightArm);

  // Soft Radial Contact Shadow
  const shadowGeo = new THREE.CircleGeometry(0.42, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.02;
  group.add(shadow);

  return { group, leftLeg, rightLeg, leftArm, rightArm };
}

/**
 * 7. Monument de l'Étoile Rouge (Authentic Roundabout Architecture)
 * Cotonou's central revolutionary roundabout monument with 5 radial pathways,
 * commemorative bronze reliefs, central obelisk, and glowing ruby star.
 */
export function createEtoileRougeMesh(): THREE.Group {
  const group = new THREE.Group();

  // Tier 1 Base Plinth (Polished Granite finish with red brick trim)
  const plinthGeo = new THREE.CylinderGeometry(14.5, 15.5, 1.2, 36);
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.65 });
  const plinth = new THREE.Mesh(plinthGeo, plinthMat);
  plinth.position.y = 0.6;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Red laterite circular ring curb
  const redRingGeo = new THREE.RingGeometry(13.8, 15.2, 36);
  redRingGeo.rotateX(-Math.PI / 2);
  const redRingMat = new THREE.MeshStandardMaterial({ color: 0xB91C1C, roughness: 0.8 });
  const redRing = new THREE.Mesh(redRingGeo, redRingMat);
  redRing.position.y = 1.22;
  group.add(redRing);

  // 5 Radial paved pathways extending outwards from central podium
  const pathMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.6 });
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
    const pathGeo = new THREE.PlaneGeometry(2.4, 6.5);
    pathGeo.rotateX(-Math.PI / 2);
    const pathMesh = new THREE.Mesh(pathGeo, pathMat);
    pathMesh.rotation.y = -angle;
    pathMesh.position.set(Math.cos(angle) * 9.8, 1.23, Math.sin(angle) * 9.8);
    group.add(pathMesh);
  }

  // Tier 2 Raised Terrace (Pedestal steps)
  const terraceGeo = new THREE.CylinderGeometry(8.2, 8.8, 1.0, 28);
  const terraceMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.5 });
  const terrace = new THREE.Mesh(terraceGeo, terraceMat);
  terrace.position.y = 1.7;
  terrace.receiveShadow = true;
  group.add(terrace);

  // Commemorative bronze relief pillars around base
  const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xB45309, metalness: 0.8, roughness: 0.3 });
  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2;
    const plaquePillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.2, 0.4), bronzeMat);
    plaquePillar.position.set(Math.cos(ang) * 6.5, 2.8, Math.sin(ang) * 6.5);
    plaquePillar.rotation.y = -ang;
    plaquePillar.castShadow = true;
    group.add(plaquePillar);
  }

  // Towering Central Obelisk Pillar (fluted hexagonal tapering column)
  const towerGeo = new THREE.CylinderGeometry(1.6, 2.5, 17, 8);
  const towerMat = new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    roughness: 0.3,
    metalness: 0.2,
  });
  const tower = new THREE.Mesh(towerGeo, towerMat);
  tower.position.y = 10.5;
  tower.castShadow = true;
  group.add(tower);

  // Bronze ring band around mid-tower
  const bandGeo = new THREE.CylinderGeometry(2.05, 2.05, 0.8, 16);
  const band = new THREE.Mesh(bandGeo, bronzeMat);
  band.position.y = 11.0;
  group.add(band);

  // Inscription Plaque Banner on North & South sides of base
  const plaqueCanvas = document.createElement('canvas');
  plaqueCanvas.width = 256;
  plaqueCanvas.height = 64;
  const pCtx = plaqueCanvas.getContext('2d')!;
  pCtx.fillStyle = '#B45309';
  pCtx.fillRect(0, 0, 256, 64);
  pCtx.fillStyle = '#FEF08A';
  pCtx.font = 'bold 15px sans-serif';
  pCtx.textAlign = 'center';
  pCtx.textBaseline = 'middle';
  pCtx.fillText("PLACE DE L'ÉTOILE ROUGE", 128, 22);
  pCtx.font = '12px sans-serif';
  pCtx.fillText('RÉPUBLIQUE DU BÉNIN', 128, 44);

  const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
  plaqueTex.colorSpace = THREE.SRGBColorSpace;
  const plaqueMat = new THREE.MeshBasicMaterial({ map: plaqueTex });

  const plaqueN = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.0), plaqueMat);
  plaqueN.position.set(0, 2.2, 8.25);
  group.add(plaqueN);

  const plaqueS = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.0), plaqueMat);
  plaqueS.position.set(0, 2.2, -8.25);
  plaqueS.rotation.y = Math.PI;
  group.add(plaqueS);

  // Majestic Red Five-Pointed Star at Summit
  const starShape = new THREE.Shape();
  const points = 5;
  const outerR = 3.6;
  const innerR = 1.55;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) starShape.moveTo(x, y);
    else starShape.lineTo(x, y);
  }
  starShape.closePath();

  const starExtrudeSettings = { depth: 0.9, bevelEnabled: true, bevelThickness: 0.3, bevelSize: 0.15 };
  const starGeo = new THREE.ExtrudeGeometry(starShape, starExtrudeSettings);
  starGeo.center();
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xDC2626, // Luminous revolutionary red
    emissive: 0xB91C1C,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.4,
  });
  const star = new THREE.Mesh(starGeo, starMat);
  star.position.set(0, 20.4, 0);
  star.castShadow = true;
  group.add(star);

  // Star Point Light (Subtle ruby red beacon glow)
  const starLight = new THREE.PointLight(0xEF4444, 2.0, 25);
  starLight.position.set(0, 21.0, 0);
  group.add(starLight);

  return group;
}

/**
 * 8. Monument de l'Amazone (Majestic Bronze Dahomey Warrior Statue)
 * Modeled after the 30-meter high Queen Tassi Hangbe bronze statue on Boulevard de la Marina.
 */
export function createAmazoneMonumentMesh(): THREE.Group {
  const group = new THREE.Group();

  // Tiered Granite Pedestal with ceremonial steps
  const baseStepGeo = new THREE.BoxGeometry(11.0, 0.8, 11.0);
  const graniteMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5, metalness: 0.2 });
  const baseStep = new THREE.Mesh(baseStepGeo, graniteMat);
  baseStep.position.y = 0.4;
  baseStep.receiveShadow = true;
  group.add(baseStep);

  const midStep = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.0, 8.5), graniteMat);
  midStep.position.y = 1.3;
  midStep.receiveShadow = true;
  group.add(midStep);

  const pedestalGeo = new THREE.BoxGeometry(6.4, 4.4, 6.4);
  const pedestal = new THREE.Mesh(pedestalGeo, graniteMat);
  pedestal.position.y = 4.0;
  pedestal.castShadow = true;
  pedestal.receiveShadow = true;
  group.add(pedestal);

  // Commemorative bronze inscription
  const amzCanvas = document.createElement('canvas');
  amzCanvas.width = 512;
  amzCanvas.height = 96;
  const aCtx = amzCanvas.getContext('2d')!;
  aCtx.fillStyle = '#0F172A';
  aCtx.fillRect(0, 0, 512, 96);
  aCtx.strokeStyle = '#D97706';
  aCtx.lineWidth = 4;
  aCtx.strokeRect(6, 6, 500, 84);
  aCtx.fillStyle = '#FBBF24';
  aCtx.font = 'bold 26px sans-serif';
  aCtx.textAlign = 'center';
  aCtx.textBaseline = 'middle';
  aCtx.fillText("MONUMENT DE L'AMAZONE", 256, 36);
  aCtx.font = '16px sans-serif';
  aCtx.fillStyle = '#E2E8F0';
  aCtx.fillText('HOMMAGE AUX BRAVES FEMMES DU BÉNIN • MINO', 256, 66);

  const amzTex = new THREE.CanvasTexture(amzCanvas);
  amzTex.colorSpace = THREE.SRGBColorSpace;
  const amzSign = new THREE.Mesh(
    new THREE.PlaneGeometry(5.2, 1.1),
    new THREE.MeshBasicMaterial({ map: amzTex })
  );
  amzSign.position.set(0, 3.8, 3.25);
  group.add(amzSign);

  // Bronze Amazon Warrior Silhouette
  const bronzeMat = new THREE.MeshStandardMaterial({
    color: 0x92400E, // Dahomey authentic cast bronze
    roughness: 0.35,
    metalness: 0.85,
  });

  // Torso & Warrior dress
  const statueTorso = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.9, 6.8, 16), bronzeMat);
  statueTorso.position.y = 9.6;
  statueTorso.castShadow = true;
  group.add(statueTorso);

  // Dahomey royal sash across chest
  const sashGeo = new THREE.TorusGeometry(1.65, 0.16, 8, 16);
  sashGeo.rotateX(Math.PI / 3);
  const sash = new THREE.Mesh(sashGeo, bronzeMat);
  sash.position.y = 10.2;
  group.add(sash);

  // Head with royal braided crown / turban
  const statueHead = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 16), bronzeMat);
  statueHead.position.y = 13.8;
  group.add(statueHead);

  // Crown headdress
  const crownGeo = new THREE.CylinderGeometry(1.15, 0.95, 0.8, 14);
  const crown = new THREE.Mesh(crownGeo, bronzeMat);
  crown.position.y = 14.7;
  group.add(crown);

  // Dahomey Amazon Spear (held high vertically)
  const spearGeo = new THREE.CylinderGeometry(0.09, 0.09, 15.5, 10);
  const spear = new THREE.Mesh(spearGeo, bronzeMat);
  spear.position.set(1.5, 12.0, 0.6);
  spear.rotateZ(-0.15);
  spear.castShadow = true;
  group.add(spear);

  // Spear head blade
  const bladeGeo = new THREE.ConeGeometry(0.3, 1.8, 4);
  const blade = new THREE.Mesh(bladeGeo, bronzeMat);
  blade.position.set(1.5 + Math.sin(0.15) * 7.5, 12.0 + Math.cos(0.15) * 7.5, 0.6);
  blade.rotateZ(-0.15);
  group.add(blade);

  // Dahomey Royal Shield (embossed warrior crest)
  const shieldGeo = new THREE.BoxGeometry(0.24, 4.2, 2.5);
  const shield = new THREE.Mesh(shieldGeo, bronzeMat);
  shield.position.set(-1.5, 9.8, 0.5);
  shield.castShadow = true;
  group.add(shield);

  // 4 Upward floodlights illuminating the statue from corners
  [-3.8, 3.8].forEach((fx) => {
    [-3.8, 3.8].forEach((fz) => {
      const lampGeo = new THREE.BoxGeometry(0.6, 0.3, 0.6);
      const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
      const lamp = new THREE.Mesh(lampGeo, lampMat);
      lamp.position.set(fx, 0.95, fz);
      group.add(lamp);

      const spot = new THREE.PointLight(0xFDE68A, 1.5, 18);
      spot.position.set(fx, 1.2, fz);
      group.add(spot);
    });
  });

  return group;
}

/**
 * 9. Palm Tree (Curved trunk + coconut cluster + palm fronds)
 */
export function createPalmTree(): THREE.Group {
  const group = new THREE.Group();

  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.9 });
  const trunkGeo = new THREE.CylinderGeometry(0.28, 0.48, 7.5, 10);
  trunkGeo.translate(0, 3.75, 0);
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.rotation.z = (Math.random() - 0.5) * 0.15;
  trunk.castShadow = true;
  group.add(trunk);

  // Coconuts
  const coconutMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.8 });
  for (let i = 0; i < 4; i++) {
    const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), coconutMat);
    const ang = (i / 4) * Math.PI * 2;
    coconut.position.set(Math.cos(ang) * 0.35, 7.4, Math.sin(ang) * 0.35);
    group.add(coconut);
  }

  // Fronds
  const frondMat = new THREE.MeshStandardMaterial({ color: 0x15803D, roughness: 0.6, side: THREE.DoubleSide });
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const frondGeo = new THREE.ConeGeometry(0.85, 4.0, 6);
    frondGeo.rotateX(Math.PI / 2.3);
    const frond = new THREE.Mesh(frondGeo, frondMat);
    frond.position.set(0, 7.6, 0);
    frond.rotation.y = angle;
    frond.castShadow = true;
    group.add(frond);
  }

  return group;
}

/**
 * 10. Colorful Dantokpa Market Stall
 */
export function createMarketStallMesh(shadeColorHex: number = 0xE53935): THREE.Group {
  const group = new THREE.Group();

  const tableMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.85 });
  const table = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 1.8), tableMat);
  table.position.y = 0.45;
  table.castShadow = true;
  group.add(table);

  const poleMat = new THREE.MeshStandardMaterial({ color: 0x451A03, roughness: 0.7 });
  const poleGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.4, 6);
  [
    [-1.5, 1.2, -0.8],
    [1.5, 1.2, -0.8],
    [-1.5, 1.2, 0.8],
    [1.5, 1.2, 0.8],
  ].forEach(([x, y, z]) => {
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(x, y, z);
    group.add(pole);
  });

  // Striped Canopy or Corrugated Zinc Roof (Authentic Dantokpa market sheds)
  const canopyMat = new THREE.MeshStandardMaterial({
    map: shadeColorHex === 0xDC2626 ? createStripedAwningTexture('#DC2626', '#FEF08A') : createCorrugatedRoofTexture(),
    roughness: 0.5,
    metalness: shadeColorHex === 0xDC2626 ? 0.05 : 0.65,
    side: THREE.DoubleSide,
  });
  const canopyGeo = new THREE.BoxGeometry(3.6, 0.15, 2.2);
  canopyGeo.rotateX(-0.1);
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, 2.45, 0);
  canopy.castShadow = true;
  group.add(canopy);

  // Display items (fruits, wax textiles)
  const fruitMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.5 });
  const fabricMat = new THREE.MeshStandardMaterial({ color: 0x0D9488, roughness: 0.6 });
  for (let i = 0; i < 5; i++) {
    const item = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.4, 8),
      i % 2 === 0 ? fruitMat : fabricMat
    );
    item.position.set(-1.0 + i * 0.5, 1.1, (Math.random() - 0.5) * 0.5);
    group.add(item);
  }

  return group;
}

/**
 * 11. Benin National Flagpole (Tricolor Vert / Jaune / Rouge)
 */
export function createBeninFlagpole(): THREE.Group {
  const group = new THREE.Group();

  // Polished chrome mast
  const mastMat = new THREE.MeshStandardMaterial({ color: 0xD4D4D8, metalness: 0.9, roughness: 0.2 });
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 12, 8), mastMat);
  mast.position.y = 6;
  mast.castShadow = true;
  group.add(mast);

  // Gold finial sphere on top
  const finialMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, metalness: 0.9, roughness: 0.1 });
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), finialMat);
  finial.position.y = 12.1;
  group.add(finial);

  // Tricolor canvas flag (Green left, Yellow top-right, Red bottom-right)
  const flagCanvas = document.createElement('canvas');
  flagCanvas.width = 128;
  flagCanvas.height = 80;
  const ctx = flagCanvas.getContext('2d')!;
  // Benin Flag layout: Left vertical green bar, Right split yellow/red
  ctx.fillStyle = '#008751'; // Green
  ctx.fillRect(0, 0, 50, 80);
  ctx.fillStyle = '#FCD116'; // Yellow
  ctx.fillRect(50, 0, 78, 40);
  ctx.fillStyle = '#E8112D'; // Red
  ctx.fillRect(50, 40, 78, 40);

  const flagTex = new THREE.CanvasTexture(flagCanvas);
  flagTex.colorSpace = THREE.SRGBColorSpace;

  const flagMat = new THREE.MeshStandardMaterial({
    map: flagTex,
    side: THREE.DoubleSide,
    roughness: 0.7,
  });

  const flagGeo = new THREE.PlaneGeometry(3.0, 1.8, 4, 2);
  // Slight wave distortion
  const flag = new THREE.Mesh(flagGeo, flagMat);
  flag.position.set(1.5, 10.8, 0.1);
  flag.castShadow = true;
  group.add(flag);

  return group;
}

/**
 * 12. Iconic Cotonou Mobile Money Kiosk (MTN MoMo Yellow / Moov Money)
 */
export function createMoMoKiosk(brand: 'mtn' | 'moov' = 'mtn'): THREE.Group {
  const group = new THREE.Group();

  const isMtn = brand === 'mtn';
  const mainColor = isMtn ? 0xFACC15 : 0x0284C7; // MTN Yellow or Moov Blue

  // Kiosk box structure
  const boothMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.4, metalness: 0.2 });
  const booth = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 2.2), boothMat);
  booth.position.y = 1.3;
  booth.castShadow = true;
  booth.receiveShadow = true;
  group.add(booth);

  // Overhanging roof
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5 });
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.2, 2.6), roofMat);
  roof.position.y = 2.65;
  roof.castShadow = true;
  group.add(roof);

  // Counter window
  const counterMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
  const counter = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 0.3), counterMat);
  counter.position.set(0, 1.3, 1.05);
  group.add(counter);

  // Signboard texture
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 128;
  signCanvas.height = 32;
  const sCtx = signCanvas.getContext('2d')!;
  sCtx.fillStyle = isMtn ? '#FACC15' : '#0284C7';
  sCtx.fillRect(0, 0, 128, 32);
  sCtx.fillStyle = isMtn ? '#000000' : '#FFFFFF';
  sCtx.font = 'bold 13px sans-serif';
  sCtx.textAlign = 'center';
  sCtx.textBaseline = 'middle';
  sCtx.fillText(isMtn ? 'MTN MoMo' : 'MOOV FLOOZ', 64, 16);

  const signTex = new THREE.CanvasTexture(signCanvas);
  signTex.colorSpace = THREE.SRGBColorSpace;
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 0.45),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  signMesh.position.set(0, 2.35, 1.12);
  group.add(signMesh);

  return group;
}

/**
 * 13. Dantokpa Grand Entrance Archway
 */
export function createDantokpaArch(): THREE.Group {
  const group = new THREE.Group();

  const archMat = new THREE.MeshStandardMaterial({ color: 0x0D9488, roughness: 0.5 }); // Teal gateway
  const pillarGeo = new THREE.BoxGeometry(1.4, 7.5, 1.4);

  const leftPillar = new THREE.Mesh(pillarGeo, archMat);
  leftPillar.position.set(-6, 3.75, 0);
  leftPillar.castShadow = true;
  group.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeo, archMat);
  rightPillar.position.set(6, 3.75, 0);
  rightPillar.castShadow = true;
  group.add(rightPillar);

  const beamGeo = new THREE.BoxGeometry(14, 1.6, 1.6);
  const beam = new THREE.Mesh(beamGeo, archMat);
  beam.position.set(0, 7.5, 0);
  beam.castShadow = true;
  group.add(beam);

  // Inscription banner
  const bannerCanvas = document.createElement('canvas');
  bannerCanvas.width = 256;
  bannerCanvas.height = 48;
  const bCtx = bannerCanvas.getContext('2d')!;
  bCtx.fillStyle = '#F59E0B';
  bCtx.fillRect(0, 0, 256, 48);
  bCtx.fillStyle = '#111827';
  bCtx.font = 'bold 15px sans-serif';
  bCtx.textAlign = 'center';
  bCtx.textBaseline = 'middle';
  bCtx.fillText('MARCHÉ INTERNATIONAL DANTOKPA', 128, 24);

  const bannerTex = new THREE.CanvasTexture(bannerCanvas);
  bannerTex.colorSpace = THREE.SRGBColorSpace;
  const bannerMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 1.2),
    new THREE.MeshBasicMaterial({ map: bannerTex })
  );
  bannerMesh.position.set(0, 7.5, 0.85);
  group.add(bannerMesh);

  return group;
}

/**
 * 14. Traditional Wooden Pirogue (Lake Nokoué / Ganvié style canoe)
 */
export function createPirogueMesh(): THREE.Group {
  const group = new THREE.Group();

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.8 });
  const hullGeo = new THREE.BoxGeometry(1.2, 0.6, 6.5);
  const hull = new THREE.Mesh(hullGeo, woodMat);
  hull.position.y = 0.3;
  hull.castShadow = true;
  group.add(hull);

  // Carved bow and stern points
  const tipGeo = new THREE.ConeGeometry(0.6, 1.2, 4);
  tipGeo.rotateX(Math.PI / 2);
  const bow = new THREE.Mesh(tipGeo, woodMat);
  bow.position.set(0, 0.3, 3.8);
  group.add(bow);

  const stern = new THREE.Mesh(tipGeo, woodMat);
  stern.position.set(0, 0.3, -3.8);
  stern.rotateY(Math.PI);
  group.add(stern);

  return group;
}



/**
 * 15. 3D Garage Building & Tuning Workshop Mesh
 */
export function createGarageMesh(titleText: string): THREE.Group {
  const group = new THREE.Group();

  // Garage Main Structure
  const buildingMat = new THREE.MeshStandardMaterial({
    map: createTropicalStuccoTexture('#374151'),
    color: 0x374151, // Industrial Slate Grey
    roughness: 0.75,
    metalness: 0.15,
  });
  const building = new THREE.Mesh(new THREE.BoxGeometry(16, 7.5, 14), buildingMat);
  building.position.set(0, 3.75, 0);
  building.castShadow = true;
  building.receiveShadow = true;
  group.add(building);

  // Roof Trim / Parapet
  const trimMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.3 }); // Benin Orange / Gold trim
  const trim = new THREE.Mesh(new THREE.BoxGeometry(16.4, 0.8, 14.4), trimMat);
  trim.position.set(0, 7.5, 0);
  group.add(trim);

  // Large Shutter Bay Door (Roll-up corrugated metal door)
  const shutterMat = new THREE.MeshStandardMaterial({
    map: createCorrugatedRoofTexture(),
    color: 0xCBD5E1,
    roughness: 0.35,
    metalness: 0.85,
  });
  const shutter = new THREE.Mesh(new THREE.BoxGeometry(8, 5.2, 0.2), shutterMat);
  shutter.position.set(0, 2.6, 7.05);
  shutter.castShadow = true;
  group.add(shutter);

  // Door Frame Accent
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x111827 });
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(9.2, 0.6, 0.4), frameMat);
  frameTop.position.set(0, 5.4, 7.1);
  group.add(frameTop);

  // Neon Workshop Sign Billboard
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const ctx = signCanvas.getContext('2d')!;
  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 8;
  ctx.strokeRect(8, 8, 496, 112);

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🔧 ' + titleText.toUpperCase(), 256, 44);

  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('TUNING • MÉCANIQUE • PEINTURE', 256, 88);

  const signTex = new THREE.CanvasTexture(signCanvas);
  signTex.colorSpace = THREE.SRGBColorSpace;

  const signBoard = new THREE.Mesh(
    new THREE.PlaneGeometry(9.5, 2.4),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  signBoard.position.set(0, 6.8, 7.15);
  group.add(signBoard);

  // Ground Pad Driveway with Yellow Hazard Lines
  const padMat = new THREE.MeshStandardMaterial({
    color: 0x1F2937,
    roughness: 0.9,
  });
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), padMat);
  pad.rotateX(-Math.PI / 2);
  pad.position.set(0, 0.04, 11.5);
  pad.receiveShadow = true;
  group.add(pad);

  // Yellow Hazard Lines Pad Border
  const borderMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24 });
  const bLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 10), borderMat);
  bLeft.rotateX(-Math.PI / 2);
  bLeft.position.set(-6, 0.05, 11.5);
  group.add(bLeft);

  const bRight = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 10), borderMat);
  bRight.rotateX(-Math.PI / 2);
  bRight.position.set(6, 0.05, 11.5);
  group.add(bRight);

  // Oil Barrels next to garage
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0xDC2626, metalness: 0.6 });
  [-7.2, -6.2].forEach((bx, idx) => {
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.4, 12), barrelMat);
    barrel.position.set(bx, 0.7, 7.8 + idx * 0.8);
    barrel.castShadow = true;
    group.add(barrel);
  });

  return group;
}

/**
 * 16. Authentic Multi-Story Cotonou Building
 * Features textured walls, ground-floor boutiques with awnings or metal roller gates,
 * window grids with sills & sun visors, rooftop terrace with blue water tank (Citerne Rotoplas),
 * satellite TV dish, and radio antenna mast.
 */
/**
 * 16. Authentic Multi-Story Cotonou Building (High-Density PBR)
 * Features textured tropical stucco walls, recessed ground-floor boutiques,
 * Naco louver windows with sunshades, 3D balconies with metal railings,
 * outdoor split air-conditioning compressors with drainage pipes,
 * rooftop terrace with Rotoplas 1000L water tank, satellite dish & antenna mast.
 */
export function createCotonouBuildingMesh(
  width: number,
  height: number,
  depth: number,
  wallColorHex: number = 0xF1F5F9,
  signTexture?: THREE.Texture,
  hasAwning: boolean = true
): THREE.Group {
  const group = new THREE.Group();

  const hexString = '#' + wallColorHex.toString(16).padStart(6, '0');

  // Main Concrete Stucco Body with Procedural Tropical Stucco Texture
  const wallMat = new THREE.MeshStandardMaterial({
    map: createTropicalStuccoTexture(hexString),
    color: wallColorHex,
    roughness: 0.78,
    metalness: 0.08,
  });
  const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), wallMat);
  body.position.y = height / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  group.add(body);

  // Concrete Base Plinth / Sidewalk curb (Trottoir en ciment)
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 });
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(width + 0.8, 0.4, depth + 0.8), plinthMat);
  plinth.position.y = 0.2;
  plinth.receiveShadow = true;
  group.add(plinth);

  // Recessed Ground Floor Commercial Shopfront Facade
  const shopWidth = Math.min(width * 0.78, width - 3.5);
  const shopHeight = 3.4;

  // Shop entrance recess alcove
  const shopNiche = new THREE.Mesh(
    new THREE.BoxGeometry(shopWidth, shopHeight, 0.6),
    new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.6 })
  );
  shopNiche.position.set(0, shopHeight / 2 + 0.1, depth / 2 - 0.2);
  group.add(shopNiche);

  // Shop glass windows and doors
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x38BDF8,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.65,
  });
  const shopGlass = new THREE.Mesh(new THREE.PlaneGeometry(shopWidth * 0.92, shopHeight * 0.82), glassMat);
  shopGlass.position.set(0, shopHeight / 2 + 0.1, depth / 2 - 0.1);
  group.add(shopGlass);

  // Shop door aluminium frame
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.7, roughness: 0.3 });
  const shopFrame = new THREE.Mesh(new THREE.BoxGeometry(shopWidth * 0.96, 0.1, 0.1), frameMat);
  shopFrame.position.set(0, shopHeight * 0.9, depth / 2 - 0.05);
  group.add(shopFrame);

  // Commercial banner sign board with 3D bracket
  if (signTexture) {
    const signBoard = new THREE.Mesh(
      new THREE.PlaneGeometry(shopWidth * 0.92, 1.8),
      new THREE.MeshBasicMaterial({ map: signTexture })
    );
    signBoard.position.set(0, shopHeight + 1.1, depth / 2 + 0.12);
    group.add(signBoard);

    // Sign frame rim
    const sRimMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.6, roughness: 0.3 });
    const sRim = new THREE.Mesh(new THREE.BoxGeometry(shopWidth * 0.94, 1.9, 0.08), sRimMat);
    sRim.position.set(0, shopHeight + 1.1, depth / 2 + 0.08);
    group.add(sRim);
  }

  // Shop entrance awning (Striped canopy)
  if (hasAwning) {
    const awningMat = new THREE.MeshStandardMaterial({
      map: createStripedAwningTexture(
        wallColorHex === 0xF1F5F9 ? '#DC2626' : '#D97706',
        '#FEF08A'
      ),
      roughness: 0.6,
      side: THREE.DoubleSide,
    });
    const awning = new THREE.Mesh(new THREE.BoxGeometry(shopWidth + 0.8, 0.1, 2.2), awningMat);
    awning.position.set(0, shopHeight + 0.2, depth / 2 + 1.1);
    awning.rotateX(-0.16);
    awning.castShadow = true;
    group.add(awning);

    // Awning side support struts
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.8, roughness: 0.2 });
    [-1, 1].forEach((dir) => {
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 8), strutMat);
      strut.position.set(dir * (shopWidth / 2 + 0.3), shopHeight - 0.5, depth / 2 + 1.0);
      strut.rotateX(-Math.PI / 4);
      group.add(strut);
    });
  }

  // Multi-tier window rows on upper floors
  const numFloors = Math.max(1, Math.floor(height / 4) - 1);
  const windowsPerRow = Math.max(2, Math.floor(width / 5.2));
  const visorMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.5 });
  const railMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.8, roughness: 0.2 });

  for (let f = 1; f <= numFloors; f++) {
    const floorY = 4.4 + f * 3.6;
    if (floorY > height - 2.8) break;

    for (let w = 0; w < windowsPerRow; w++) {
      const wx = -width / 2 + ((w + 1) * width) / (windowsPerRow + 1);

      // Front Naco Louver Window
      const winGeo = new THREE.PlaneGeometry(1.6, 2.0);
      const winMat = new THREE.MeshStandardMaterial({
        map: createLouvreWindowTexture(),
        roughness: 0.25,
        metalness: 0.8,
      });
      const win = new THREE.Mesh(winGeo, winMat);
      win.position.set(wx, floorY, depth / 2 + 0.05);
      group.add(win);

      // Concrete sun visor (brise-soleil au-dessus de la fenêtre)
      const visor = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.14, 0.65), visorMat);
      visor.position.set(wx, floorY + 1.15, depth / 2 + 0.35);
      visor.castShadow = true;
      group.add(visor);

      // Back window
      const winB = new THREE.Mesh(winGeo, winMat);
      winB.position.set(wx, floorY, -depth / 2 - 0.05);
      winB.rotateY(Math.PI);
      group.add(winB);

      // Middle window on floor 1 gets a full 3D balcony!
      if (w === Math.floor(windowsPerRow / 2)) {
        const balcSlab = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, 0.2, 1.2),
          new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 })
        );
        balcSlab.position.set(wx, floorY - 1.0, depth / 2 + 0.6);
        balcSlab.castShadow = true;
        group.add(balcSlab);

        // Balcony wrought-iron railings
        const railTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.06), railMat);
        railTop.position.set(wx, floorY - 0.2, depth / 2 + 1.18);
        const railLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.2), railMat);
        railLeft.position.set(wx - 1.17, floorY - 0.2, depth / 2 + 0.6);
        const railRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 1.2), railMat);
        railRight.position.set(wx + 1.17, floorY - 0.2, depth / 2 + 0.6);
        group.add(railTop, railLeft, railRight);

        // Vertical balusters
        for (let bx = -1.0; bx <= 1.0; bx += 0.35) {
          const balust = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.75, 6), railMat);
          balust.position.set(wx + bx, floorY - 0.58, depth / 2 + 1.18);
          group.add(balust);
        }
      } else {
        // Other windows get an outdoor split AC unit mounted beneath the sill!
        if (f % 2 === 1 && w % 2 === 0) {
          const acUnit = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.6, 0.4),
            new THREE.MeshStandardMaterial({
              map: createACUnitTexture(),
              roughness: 0.4,
              metalness: 0.3,
            })
          );
          acUnit.position.set(wx, floorY - 1.4, depth / 2 + 0.25);
          acUnit.castShadow = true;
          group.add(acUnit);

          // PVC drainage pipe running down
          const pipe = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 1.8, 6),
            new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.5 })
          );
          pipe.position.set(wx + 0.5, floorY - 2.2, depth / 2 + 0.08);
          group.add(pipe);
        }
      }
    }
  }

  // Rooftop Parapet Wall (Safety rim around terrace)
  const parapetMat = new THREE.MeshStandardMaterial({
    map: createTropicalStuccoTexture(hexString),
    color: wallColorHex,
    roughness: 0.85,
  });
  const pFront = new THREE.Mesh(new THREE.BoxGeometry(width, 1.1, 0.4), parapetMat);
  pFront.position.set(0, height + 0.55, depth / 2 - 0.2);
  const pBack = new THREE.Mesh(new THREE.BoxGeometry(width, 1.1, 0.4), parapetMat);
  pBack.position.set(0, height + 0.55, -depth / 2 + 0.2);
  const pLeft = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, depth), parapetMat);
  pLeft.position.set(-width / 2 + 0.2, height + 0.55, 0);
  const pRight = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.1, depth), parapetMat);
  pRight.position.set(width / 2 - 0.2, height + 0.55, 0);
  group.add(pFront, pBack, pLeft, pRight);

  // Rooftop Floor (Waterproof bitumen/concrete slab)
  const roofSlab = new THREE.Mesh(
    new THREE.PlaneGeometry(width - 0.8, depth - 0.8),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
  );
  roofSlab.rotateX(-Math.PI / 2);
  roofSlab.position.set(0, height + 0.02, 0);
  roofSlab.receiveShadow = true;
  group.add(roofSlab);

  // Rooftop Water Tank (Iconic blue "Citerne Rotoplas 1000L" seen everywhere in Cotonou)
  const tankMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, roughness: 0.3, metalness: 0.2 });
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 2.2, 16), tankMat);
  tank.position.set(width * 0.25, height + 1.3, depth * 0.2);
  tank.castShadow = true;
  group.add(tank);

  // Water tank concrete stand
  const standMat = new THREE.MeshStandardMaterial({ color: 0x64748B, roughness: 0.9 });
  const stand = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.4, 2.4), standMat);
  stand.position.set(width * 0.25, height + 0.2, depth * 0.2);
  group.add(stand);

  // Water tank PVC piping & valve
  const pvcMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.4 });
  const tankPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), pvcMat);
  tankPipe.position.set(width * 0.25 + 0.9, height + 0.8, depth * 0.2);
  group.add(tankPipe);

  // Rooftop Satellite TV Dish (Canal+ / DStv typical in Cotonou)
  const dishMat = new THREE.MeshStandardMaterial({ color: 0xD4D4D8, metalness: 0.7, roughness: 0.4 });
  const dishPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 6), dishMat);
  dishPole.position.set(-width * 0.25, height + 0.7, -depth * 0.2);
  group.add(dishPole);

  const dishGeo = new THREE.SphereGeometry(0.65, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.8);
  dishGeo.rotateX(Math.PI / 1.4);
  const dish = new THREE.Mesh(dishGeo, dishMat);
  dish.position.set(-width * 0.25, height + 1.3, -depth * 0.2);
  group.add(dish);

  // Rooftop Radio / Cellular Antenna Mast with flashing beacon light
  const antennaGeo = new THREE.CylinderGeometry(0.03, 0.06, 5.0, 6);
  const antenna = new THREE.Mesh(antennaGeo, dishMat);
  antenna.position.set(0, height + 2.5, 0);
  group.add(antenna);

  // Red beacon on top of antenna
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.12, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xEF4444 })
  );
  beacon.position.set(0, height + 5.0, 0);
  group.add(beacon);

  return group;
}

/**
 * 17. Cathédrale Notre-Dame-de-Miséricorde de Cotonou
 * Cotonou's iconic landmark cathedral with famous alternating red and white ceramic stripes,
 * twin towers, and central rosette.
 */
export function createCathedraleCotonouMesh(): THREE.Group {
  const group = new THREE.Group();

  // Characteristic red ceramic and white stone stripe texture
  const stripeCanvas = document.createElement('canvas');
  stripeCanvas.width = 64;
  stripeCanvas.height = 64;
  const sCtx = stripeCanvas.getContext('2d')!;
  sCtx.fillStyle = '#B91C1C'; // Red brick
  sCtx.fillRect(0, 0, 64, 32);
  sCtx.fillStyle = '#F8FAFC'; // White stone
  sCtx.fillRect(0, 32, 64, 32);

  const stripeTex = new THREE.CanvasTexture(stripeCanvas);
  stripeTex.wrapS = THREE.RepeatWrapping;
  stripeTex.wrapT = THREE.RepeatWrapping;
  stripeTex.repeat.set(4, 12);
  stripeTex.colorSpace = THREE.SRGBColorSpace;

  const cathMat = new THREE.MeshStandardMaterial({
    map: stripeTex,
    roughness: 0.5,
  });

  // Central Nave
  const nave = new THREE.Mesh(new THREE.BoxGeometry(18, 16, 28), cathMat);
  nave.position.y = 8;
  nave.castShadow = true;
  nave.receiveShadow = true;
  group.add(nave);

  // Gable pitched roof
  const roofGeo = new THREE.ConeGeometry(13.5, 7.0, 4);
  roofGeo.rotateY(Math.PI / 4);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x991B1B, roughness: 0.4 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, 19.5, 0);
  roof.scale.set(1.0, 1.0, 2.1);
  roof.castShadow = true;
  group.add(roof);

  // Twin Front Towers (Left & Right)
  [-9.5, 9.5].forEach((tx) => {
    const tower = new THREE.Mesh(new THREE.BoxGeometry(6.5, 26, 6.5), cathMat);
    tower.position.set(tx, 13, 13);
    tower.castShadow = true;
    group.add(tower);

    // Tower Spire Pyramids
    const spireGeo = new THREE.ConeGeometry(4.2, 9.0, 4);
    spireGeo.rotateY(Math.PI / 4);
    const spire = new THREE.Mesh(spireGeo, roofMat);
    spire.position.set(tx, 30.5, 13);
    spire.castShadow = true;
    group.add(spire);

    // Cross finials atop towers
    const crossMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, metalness: 0.9, roughness: 0.2 });
    const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.8, 0.15), crossMat);
    crossV.position.set(tx, 35.8, 13);
    const crossH = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.15, 0.15), crossMat);
    crossH.position.set(tx, 36.2, 13);
    group.add(crossV, crossH);
  });

  // Gothic Arched Portal Entrance
  const portalMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.7 });
  const portal = new THREE.Mesh(new THREE.BoxGeometry(5.2, 6.5, 1.0), portalMat);
  portal.position.set(0, 3.25, 14.5);
  group.add(portal);

  // Stained Glass Rosette Window
  const roseGeo = new THREE.CircleGeometry(2.4, 24);
  const roseMat = new THREE.MeshStandardMaterial({
    color: 0x0284C7,
    emissive: 0x0369A1,
    emissiveIntensity: 0.4,
    roughness: 0.2,
  });
  const rose = new THREE.Mesh(roseGeo, roseMat);
  rose.position.set(0, 11.5, 14.1);
  group.add(rose);

  return group;
}

/**
 * 18. Fidjrossè Beach Bar Paillote (Chez Tata Tundé Plage)
 * Thatched palm roof, rustic timber stilts, Ganvié beer bar, and wooden seating.
 */
export function createBeachPailloteMesh(): THREE.Group {
  const group = new THREE.Group();

  // Raised wooden boardwalk floor
  const deckMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.85 });
  const deck = new THREE.Mesh(new THREE.BoxGeometry(10, 0.4, 8), deckMat);
  deck.position.y = 0.2;
  deck.receiveShadow = true;
  group.add(deck);

  // 6 Wooden Stilt Support Poles
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x451A03, roughness: 0.9 });
  const poleGeo = new THREE.CylinderGeometry(0.14, 0.16, 4.2, 8);
  [-4.2, 0, 4.2].forEach((px) => {
    [-3.2, 3.2].forEach((pz) => {
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(px, 2.1, pz);
      pole.castShadow = true;
      group.add(pole);
    });
  });

  // Conical Thatched Straw Palm Roof
  const thatchMat = new THREE.MeshStandardMaterial({
    color: 0xA16207, // Sun-dried golden palm straw
    roughness: 0.95,
  });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(7.2, 3.2, 16), thatchMat);
  roof.position.y = 5.2;
  roof.castShadow = true;
  group.add(roof);

  // Wooden Bar Counter
  const barMat = new THREE.MeshStandardMaterial({ color: 0x854D0E, roughness: 0.7 });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.1, 1.2), barMat);
  bar.position.set(0, 0.75, 0.5);
  bar.castShadow = true;
  group.add(bar);

  // Ganvié Beer Beach Signboard
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 256;
  signCanvas.height = 64;
  const ctx = signCanvas.getContext('2d')!;
  ctx.fillStyle = '#15803D';
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#FEF08A';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PAILLOTE GANVIÉ PLAGE', 128, 22);
  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('POISSON BRAISÉ • BIÈRE FRAÎCHE', 128, 44);

  const signTex = new THREE.CanvasTexture(signCanvas);
  signTex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(3.6, 0.9),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  sign.position.set(0, 3.6, 3.4);
  group.add(sign);

  return group;
}

/**
 * 19. Boulevard Street Light (Curved galvanized pole with downward luminaire)
 */
export function createStreetLight(): THREE.Group {
  const group = new THREE.Group();

  const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.85, roughness: 0.3 });

  // Vertical pole
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 7.5, 8), metalMat);
  pole.position.y = 3.75;
  pole.castShadow = true;
  group.add(pole);

  // Curved overhang arm
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.4, 8), metalMat);
  arm.position.set(0.9, 7.4, 0);
  arm.rotateZ(Math.PI / 3.2);
  group.add(arm);

  // Luminaire lamp head
  const headMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, metalness: 0.9 });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.4), headMat);
  head.position.set(1.9, 7.2, 0);
  group.add(head);

  // Glowing LED lens
  const bulbMat = new THREE.MeshBasicMaterial({ color: 0xFEF08A });
  const bulb = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.3), bulbMat);
  bulb.rotateX(Math.PI / 2);
  bulb.position.set(1.9, 7.08, 0);
  group.add(bulb);

  // Downward warm street light
  const light = new THREE.PointLight(0xFEF08A, 1.2, 16);
  light.position.set(1.9, 6.8, 0);
  group.add(light);

  return group;
}

/**
 * 20. Cotonou Asphalt Speed Bump ("Dos d'âne")
 */
export function createSpeedBumpMesh(length: number = 14): THREE.Group {
  const group = new THREE.Group();

  const bumpGeo = new THREE.CylinderGeometry(0.8, 0.8, length, 12, 1, false, 0, Math.PI);
  bumpGeo.rotateZ(Math.PI / 2);
  bumpGeo.scale(1, 0.22, 1);

  // Yellow and black caution stripe canvas texture
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = '#FACC15';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(32, 0);
  ctx.lineTo(64, 64);
  ctx.lineTo(32, 64);
  ctx.closePath();
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(length / 2, 1);
  tex.colorSpace = THREE.SRGBColorSpace;

  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 });
  const bump = new THREE.Mesh(bumpGeo, mat);
  bump.position.y = 0.08;
  group.add(bump);

  return group;
}

/**
 * 21. Cotonou District / Street Signpost
 */
export function createStreetSignPost(streetName: string, neighborhood: string): THREE.Group {
  const group = new THREE.Group();

  const postMat = new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.8, roughness: 0.3 });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 8), postMat);
  post.position.y = 1.6;
  group.add(post);

  // Sign plate (Authentic Benin green with white border)
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#15803D'; // Green
  ctx.fillRect(0, 0, 256, 64);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 3;
  ctx.strokeRect(3, 3, 250, 58);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(streetName.toUpperCase(), 128, 22);

  ctx.fillStyle = '#FEF08A';
  ctx.font = '11px sans-serif';
  ctx.fillText(neighborhood.toUpperCase(), 128, 44);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.45),
    new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide })
  );
  sign.position.set(0, 2.9, 0);
  group.add(sign);

  return group;
}

/**
 * 22. Ministère de l'Économie et des Finances (Quartier Administratif / Marina)
 * Grand administrative neoclassical building with marble colonnade, pediment,
 * security gatehouse, and national insignia.
 */
export function createMinistryOfFinanceMesh(): THREE.Group {
  const group = new THREE.Group();

  // Main Neoclassical Ministry Structure
  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xF8FAFC,
    roughness: 0.35,
    metalness: 0.1,
  });
  const mainBlock = new THREE.Mesh(new THREE.BoxGeometry(34, 14, 22), marbleMat);
  mainBlock.position.y = 7;
  mainBlock.castShadow = true;
  mainBlock.receiveShadow = true;
  group.add(mainBlock);

  // Ground Plaza Podium with Steps
  const podiumMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.8 });
  const podium = new THREE.Mesh(new THREE.BoxGeometry(38, 0.8, 28), podiumMat);
  podium.position.set(0, 0.4, 2);
  podium.receiveShadow = true;
  group.add(podium);

  // Grand Front Colonnade (6 Corinthian-inspired tall columns)
  const colMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.25 });
  const colGeo = new THREE.CylinderGeometry(0.55, 0.65, 11, 16);
  for (let c = -14; c <= 14; c += 5.6) {
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(c, 6.2, 12);
    col.castShadow = true;
    group.add(col);
  }

  // Front Pediment / Portico Roof
  const porticoMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.4 });
  const porticoSlab = new THREE.Mesh(new THREE.BoxGeometry(35, 1.2, 5), porticoMat);
  porticoSlab.position.set(0, 12.3, 12);
  porticoSlab.castShadow = true;
  group.add(porticoSlab);

  // Pediment Triangular Arch
  const triangleGeo = new THREE.ConeGeometry(18, 4.0, 4);
  triangleGeo.rotateY(Math.PI / 4);
  const pediment = new THREE.Mesh(triangleGeo, porticoMat);
  pediment.position.set(0, 14.8, 11.5);
  pediment.castShadow = true;
  group.add(pediment);

  // Ministry Official Front Sign Canvas
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 512;
  signCanvas.height = 128;
  const ctx = signCanvas.getContext('2d')!;
  ctx.fillStyle = '#064E3B'; // Forest Green
  ctx.fillRect(0, 0, 512, 128);
  ctx.strokeStyle = '#FACC15';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 116);

  ctx.fillStyle = '#FACC15';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('RÉPUBLIQUE DU BÉNIN', 256, 38);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'black 26px sans-serif';
  ctx.fillText("MINISTÈRE DE L'ÉCONOMIE ET DES FINANCES", 256, 76);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = 'italic 16px sans-serif';
  ctx.fillText('Direction Générale du Trésor et de la Comptabilité Publique', 256, 106);

  const signTex = new THREE.CanvasTexture(signCanvas);
  signTex.colorSpace = THREE.SRGBColorSpace;
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 4.0),
    new THREE.MeshBasicMaterial({ map: signTex })
  );
  signMesh.position.set(0, 9.5, 11.05);
  group.add(signMesh);

  // Tinted reflective office windows on sides and rear
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x0284C7,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.85,
  });
  for (let f = 3.5; f <= 11; f += 3.8) {
    for (let x = -13; x <= 13; x += 4.5) {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.0), glassMat);
      win.position.set(x, f, 11.05);
      group.add(win);
    }
  }

  // Security Gatehouse (Poste de garde militaire / police républicaine)
  const boothMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5 });
  const gatehouse = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.8, 3.6), boothMat);
  gatehouse.position.set(16, 1.8, 18);
  gatehouse.castShadow = true;
  group.add(gatehouse);

  // Security Barrier Arm (Barrière levante rayée rouge/blanc)
  const barrierMat = new THREE.MeshBasicMaterial({ color: 0xDC2626 });
  const barrier = new THREE.Mesh(new THREE.BoxGeometry(7.0, 0.12, 0.12), barrierMat);
  barrier.position.set(10.5, 1.2, 18);
  group.add(barrier);

  return group;
}

/**
 * 23. Armored Cash Transport Van ("Fourgon Blindé Kobo Cash / Trésor")
 * Heavy security vehicle with reinforced steel armour, bulletproof slit windows,
 * roof turret sirens, and steel bullbar.
 */
export function createArmoredCashVanMesh(): THREE.Group {
  const group = new THREE.Group();

  // Heavy steel body
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x1E293B, // Matte Tactical Navy/Black
    metalness: 0.7,
    roughness: 0.35,
  });
  const mainHull = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.2, 6.2), bodyMat);
  mainHull.position.y = 1.5;
  mainHull.castShadow = true;
  group.add(mainHull);

  // Front sloped cabin hood
  const hood = new THREE.Mesh(new THREE.BoxGeometry(2.7, 1.2, 1.6), bodyMat);
  hood.position.set(0, 1.1, 3.4);
  hood.castShadow = true;
  group.add(hood);

  // Slit bulletproof windshield
  const glassMat = new THREE.MeshStandardMaterial({
    color: 0x38BDF8,
    metalness: 0.95,
    roughness: 0.05,
  });
  const windshield = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.45, 0.1), glassMat);
  windshield.position.set(0, 1.95, 2.7);
  group.add(windshield);

  // Reinforced front steel bullbar
  const barMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.9, roughness: 0.2 });
  const bullbar = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.8, 0.3), barMat);
  bullbar.position.set(0, 0.8, 4.3);
  group.add(bullbar);

  // Side Livery: "TRANSPORT DE FONDS // KOBO CASH"
  const liveryCanvas = document.createElement('canvas');
  liveryCanvas.width = 256;
  liveryCanvas.height = 64;
  const ctx = liveryCanvas.getContext('2d')!;
  ctx.fillStyle = '#064E3B'; // Emerald Green
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#FACC15';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TRANSPORT DE FONDS', 128, 24);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'black 18px sans-serif';
  ctx.fillText('KOBO CASH • TRÉSOR', 128, 48);

  const livTex = new THREE.CanvasTexture(liveryCanvas);
  livTex.colorSpace = THREE.SRGBColorSpace;
  const livMeshL = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.8),
    new THREE.MeshBasicMaterial({ map: livTex })
  );
  livMeshL.position.set(-1.42, 1.6, 0.5);
  livMeshL.rotateY(-Math.PI / 2);
  group.add(livMeshL);

  const livMeshR = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.8),
    new THREE.MeshBasicMaterial({ map: livTex })
  );
  livMeshR.position.set(1.42, 1.6, 0.5);
  livMeshR.rotateY(Math.PI / 2);
  group.add(livMeshR);

  // Emergency flashing beacons on roof
  const sirenMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });
  const siren1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8), sirenMat);
  siren1.position.set(-0.7, 2.7, 2.2);
  const siren2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8),
    new THREE.MeshBasicMaterial({ color: 0x3B82F6 })
  );
  siren2.position.set(0.7, 2.7, 2.2);
  group.add(siren1, siren2);

  // 4 Heavy armored wheels
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 });
  const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  [
    [-1.4, 0.55, 2.0],
    [1.4, 0.55, 2.0],
    [-1.4, 0.55, -1.8],
    [1.4, 0.55, -1.8],
  ].forEach(([wx, wy, wz]) => {
    const wheel = new THREE.Mesh(wheelGeo, tireMat);
    wheel.position.set(wx, wy, wz);
    wheel.castShadow = true;
    group.add(wheel);
  });

  return group;
}

/**
 * 24. Wholesale Market Shed & Pallet Storage (Dantokpa Expansion)
 */
export function createWholesaleMarketShedMesh(): THREE.Group {
  const group = new THREE.Group();

  // Open timber shed frame
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x5C2605, roughness: 0.8 });
  const postGeo = new THREE.CylinderGeometry(0.15, 0.18, 4.5, 6);
  [
    [-4, 2.25, -3],
    [4, 2.25, -3],
    [-4, 2.25, 3],
    [4, 2.25, 3],
  ].forEach(([x, y, z]) => {
    const post = new THREE.Mesh(postGeo, woodMat);
    post.position.set(x, y, z);
    post.castShadow = true;
    group.add(post);
  });

  // Corrugated zinc gabled roof
  const roofMat = new THREE.MeshStandardMaterial({
    color: 0x64748B,
    metalness: 0.8,
    roughness: 0.35,
    side: THREE.DoubleSide,
  });
  const roof = new THREE.Mesh(new THREE.ConeGeometry(6.5, 2.2, 4), roofMat);
  roof.rotateY(Math.PI / 4);
  roof.position.y = 5.2;
  roof.castShadow = true;
  group.add(roof);

  // Stacks of burlap grain and spice sacks (Sacs de maïs, igname, piment)
  const sackMat = new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.9 });
  for (let sx = -2.5; sx <= 2.5; sx += 1.4) {
    for (let sz = -1.5; sz <= 1.5; sz += 1.4) {
      const sack1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.8), sackMat);
      sack1.position.set(sx, 0.25, sz);
      sack1.castShadow = true;
      const sack2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, 0.7), sackMat);
      sack2.position.set(sx + 0.1, 0.7, sz - 0.05);
      sack2.rotation.y = 0.2;
      sack2.castShadow = true;
      group.add(sack1, sack2);
    }
  }

  return group;
}

/**
 * 25. Beach Lounger Set & Surfboards (Fidjrossè Plage Expansion)
 */
export function createBeachLoungerSetMesh(): THREE.Group {
  const group = new THREE.Group();

  // Straw Parasol (Parasol en chaume de palmier)
  const thatchMat = new THREE.MeshStandardMaterial({ color: 0xA16207, roughness: 0.9, side: THREE.DoubleSide });
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x451A03, roughness: 0.7 });
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.2, 8), poleMat);
  pole.position.y = 1.6;
  group.add(pole);

  const umbrella = new THREE.Mesh(new THREE.ConeGeometry(2.4, 0.9, 12), thatchMat);
  umbrella.position.y = 3.1;
  umbrella.castShadow = true;
  group.add(umbrella);

  // 2 Wooden Sun Loungers with colorful Wax cushions
  const loungerMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.6 });
  const cushionMat = new THREE.MeshStandardMaterial({ color: 0xE11D48, roughness: 0.7 });

  [-1.2, 1.2].forEach((lx) => {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 2.2), loungerMat);
    frame.position.set(lx, 0.2, 0);
    frame.castShadow = true;

    const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.1, 2.0), cushionMat);
    cushion.position.set(lx, 0.35, 0);
    group.add(frame, cushion);

    // Reclined backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.1, 0.8), cushionMat);
    back.position.set(lx, 0.6, -0.6);
    back.rotation.x = -0.4;
    group.add(back);
  });

  // Upright Surfboard stuck in the sand
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x0284C7, metalness: 0.3, roughness: 0.2 });
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.2, 0.08), boardMat);
  board.position.set(2.4, 0.9, 0.5);
  board.rotation.z = -0.15;
  board.castShadow = true;
  group.add(board);

  return group;
}

