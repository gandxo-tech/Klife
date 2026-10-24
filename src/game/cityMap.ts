/**
 * GTA Cotonou - City Map & Environment Generator (Three.js)
 * Generates an authentic, atmospheric 3D Cotonou map with fictional Benin brands:
 * - Kobo Cash, BeninTel Mobile, Bière Ganvié, DahoFuel, Chez Tata Tundé
 * - Place de l'Étoile Rouge (roundabout + obelisk)
 * - Monument de l'Amazone (esplanade + bronze statue)
 * - Grand Marché Dantokpa (dense colorful market stalls)
 * - Fidjrossè Plage (golden sand + ocean + palm groves)
 * - Port Autonome de Cotonou (shipping containers + warehouses)
 * - Haie Vive & Sikè-Fictif (paved streets, maquis bars, billboards)
 */

import * as THREE from 'three';
import {
  createEtoileRougeMesh,
  createAmazoneMonumentMesh,
  createPalmTree,
  createMarketStallMesh,
  createBeninFlagpole,
  createMoMoKiosk,
  createDantokpaArch,
  createPirogueMesh,
  createGarageMesh,
} from './models.ts';
import { GARAGE_LOCATIONS } from './garages.ts';
import {
  createKoboCashTexture,
  createBeninTelTexture,
  createGanvieBeerTexture,
  createDahoFuelTexture,
  createTataTundeTexture,
  createNokoueSupermarketTexture,
} from './textures.ts';

export interface WorldObstacle {
  x: number;
  z: number;
  radius: number;
  height?: number;
}

export function buildCotonouCity(scene: THREE.Scene): { obstacles: WorldObstacle[] } {
  const obstacles: WorldObstacle[] = [];

  // Ground plane (Base city asphalt & sand)
  const groundGeo = new THREE.PlaneGeometry(600, 600);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x2A2A2A, // Dark asphalt
    roughness: 0.9,
    metalness: 0.05,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  scene.add(ground);

  // Atlantic Ocean & Fidjrossè Beach (West / South-West)
  const beachGeo = new THREE.PlaneGeometry(240, 600);
  beachGeo.rotateX(-Math.PI / 2);
  const beachMat = new THREE.MeshStandardMaterial({
    color: 0xD7CCC8, // Golden sand
    roughness: 0.95,
  });
  const beach = new THREE.Mesh(beachGeo, beachMat);
  beach.position.set(-220, 0.05, 0);
  beach.receiveShadow = true;
  scene.add(beach);

  // Ocean Water Plane
  const waterGeo = new THREE.PlaneGeometry(200, 600);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0277BD,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.85,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(-340, 0.1, 0);
  scene.add(water);

  // Roads System (Asphalt overlays with road markings)
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x1E1E1E, roughness: 0.85 });

  // Main East-West Boulevard (Boulevard de la Marina / Route des Pêches)
  const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(400, 18), roadMat);
  roadEW.rotateX(-Math.PI / 2);
  roadEW.position.set(0, 0.03, 0);
  roadEW.receiveShadow = true;
  scene.add(roadEW);

  // Main North-South Boulevard (Avenue Jean-Paul II / Steinmetz)
  const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(18, 400), roadMat);
  roadNS.rotateX(-Math.PI / 2);
  roadNS.position.set(0, 0.035, 0);
  roadNS.receiveShadow = true;
  scene.add(roadNS);

  // Secondary grid roads
  [-100, 100].forEach((x) => {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 360), roadMat);
    road.rotateX(-Math.PI / 2);
    road.position.set(x, 0.03, 0);
    road.receiveShadow = true;
    scene.add(road);
  });
  [-90, 90].forEach((z) => {
    const road = new THREE.Mesh(new THREE.PlaneGeometry(360, 14), roadMat);
    road.rotateX(-Math.PI / 2);
    road.position.set(0, 0.03, z);
    road.receiveShadow = true;
    scene.add(road);
  });

  // Road Dashed Yellow Lines (CanvasTexture)
  const lineCanvas = document.createElement('canvas');
  lineCanvas.width = 16;
  lineCanvas.height = 64;
  const lineCtx = lineCanvas.getContext('2d')!;
  lineCtx.fillStyle = '#00000000';
  lineCtx.fillRect(0, 0, 16, 64);
  lineCtx.fillStyle = '#FFEB3B'; // Yellow dashed line
  lineCtx.fillRect(6, 8, 4, 32);

  const lineTex = new THREE.CanvasTexture(lineCanvas);
  lineTex.wrapS = THREE.RepeatWrapping;
  lineTex.wrapT = THREE.RepeatWrapping;
  lineTex.repeat.set(1, 25);
  lineTex.colorSpace = THREE.SRGBColorSpace;

  const lineMat = new THREE.MeshBasicMaterial({ map: lineTex, transparent: true });

  const lineEW = new THREE.Mesh(new THREE.PlaneGeometry(360, 1.2), lineMat);
  lineEW.rotateX(-Math.PI / 2);
  lineEW.rotateZ(Math.PI / 2);
  lineEW.position.set(0, 0.06, 0);
  scene.add(lineEW);

  const lineNS = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 360), lineMat);
  lineNS.rotateX(-Math.PI / 2);
  lineNS.position.set(0, 0.065, 0);
  scene.add(lineNS);

  // 1. PLACE DE L'ÉTOILE ROUGE (at 0, 0)
  const etoileRouge = createEtoileRougeMesh();
  etoileRouge.position.set(0, 0, 0);
  scene.add(etoileRouge);
  obstacles.push({ x: 0, z: 0, radius: 14.5 });

  // 2. MONUMENT DE L'AMAZONE (at 0, 140)
  const amazone = createAmazoneMonumentMesh();
  amazone.position.set(0, 0, 140);
  scene.add(amazone);
  obstacles.push({ x: 0, z: 140, radius: 5 });

  // Green Esplanade around l'Amazone
  const plazaGeo = new THREE.PlaneGeometry(50, 60);
  plazaGeo.rotateX(-Math.PI / 2);
  const plazaMat = new THREE.MeshStandardMaterial({ color: 0x388E3C, roughness: 0.8 });
  const plaza = new THREE.Mesh(plazaGeo, plazaMat);
  plaza.position.set(0, 0.04, 140);
  plaza.receiveShadow = true;
  scene.add(plaza);

  // Ceremonial Benin Tricolor Flagpoles around Amazone Esplanade
  [-14, 14].forEach((fx) => {
    const flag = createBeninFlagpole();
    flag.position.set(fx, 0, 150);
    scene.add(flag);
    obstacles.push({ x: fx, z: 150, radius: 0.8 });
  });

  // 3. GRAND MARCHÉ DANTOKPA (at 110, -60)
  const marketBase = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 70),
    new THREE.MeshStandardMaterial({ color: 0x8D6E63, roughness: 0.9 })
  );
  marketBase.rotateX(-Math.PI / 2);
  marketBase.position.set(110, 0.04, -60);
  marketBase.receiveShadow = true;
  scene.add(marketBase);

  // Grand Entrance Archway to Dantokpa
  const dantokpaArch = createDantokpaArch();
  dantokpaArch.position.set(110, 0, -26);
  scene.add(dantokpaArch);
  obstacles.push({ x: 104, z: -26, radius: 1.2 });
  obstacles.push({ x: 116, z: -26, radius: 1.2 });

  // Stalls grid
  const shadeColors = [0xE53935, 0xFDD835, 0x1E88E5, 0x43A047, 0xFB8C00];
  for (let x = 85; x <= 135; x += 12) {
    for (let z = -85; z <= -35; z += 14) {
      if (Math.abs(x - 110) < 6 && Math.abs(z - (-60)) < 6) continue;
      const color = shadeColors[Math.floor(Math.random() * shadeColors.length)];
      const stall = createMarketStallMesh(color);
      stall.position.set(x + (Math.random() - 0.5) * 2, 0, z + (Math.random() - 0.5) * 2);
      scene.add(stall);
      obstacles.push({ x: stall.position.x, z: stall.position.z, radius: 2.2 });
    }
  }

  // Traditional Pirogues (Lagoon side of Dantokpa)
  [-75, -55, -35].forEach((pz, idx) => {
    const pirogue = createPirogueMesh();
    pirogue.position.set(155, 0.1, pz);
    pirogue.rotation.y = idx % 2 === 0 ? 0.3 : -0.2;
    scene.add(pirogue);
    obstacles.push({ x: 155, z: pz, radius: 3.2 });
  });

  // MTN MoMo & Moov kiosks
  const momo1 = createMoMoKiosk('mtn');
  momo1.position.set(98, 0, -22);
  scene.add(momo1);
  obstacles.push({ x: 98, z: -22, radius: 1.8 });

  const moov1 = createMoMoKiosk('moov');
  moov1.position.set(122, 0, -22);
  scene.add(moov1);
  obstacles.push({ x: 122, z: -22, radius: 1.8 });

  // 4. PORT AUTONOME DE COTONOU (at 145, 50)
  const portBase = new THREE.Mesh(
    new THREE.PlaneGeometry(75, 75),
    new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.7 })
  );
  portBase.rotateX(-Math.PI / 2);
  portBase.position.set(145, 0.04, 50);
  scene.add(portBase);

  // Shipping Containers
  const containerColors = [0x0277BD, 0xD84315, 0x2E7D32, 0xF9A825];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const cx = 130 + row * 10;
      const cz = 35 + col * 15;
      const colColor = containerColors[(row + col) % containerColors.length];
      const containerMat = new THREE.MeshStandardMaterial({
        color: colColor,
        roughness: 0.45,
        metalness: 0.7,
      });

      const c1 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.8, 8.0), containerMat);
      c1.position.set(cx, 1.4, cz);
      c1.castShadow = true;
      scene.add(c1);
      obstacles.push({ x: cx, z: cz, radius: 4.2 });

      if ((row + col) % 2 === 0) {
        const c2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.8, 8.0), containerMat);
        c2.position.set(cx, 4.2, cz);
        c2.castShadow = true;
        scene.add(c2);
      }
    }
  }

  // 5. FIDJROSSÈ PLAGE & PALM GROVES
  for (let i = 0; i < 35; i++) {
    const px = -130 - Math.random() * 60;
    const pz = -140 + Math.random() * 280;
    const palm = createPalmTree();
    palm.position.set(px, 0, pz);
    scene.add(palm);
    obstacles.push({ x: px, z: pz, radius: 1.0 });
  }

  // 6. FICTIONAL BENIN BILLBOARDS ALONG MAIN AVENUES
  const billboardsData = [
    { x: -30, z: -15, rotY: 0, tex: createKoboCashTexture(), label: 'Kobo Cash' },
    { x: 30, z: -15, rotY: Math.PI, tex: createBeninTelTexture(), label: 'BeninTel Mobile' },
    { x: -30, z: 15, rotY: 0, tex: createGanvieBeerTexture(), label: 'Bière Ganvié' },
    { x: 30, z: 15, rotY: Math.PI, tex: createDahoFuelTexture(), label: 'DahoFuel' },
    { x: 75, z: 80, rotY: Math.PI / 2, tex: createTataTundeTexture(), label: 'Chez Tata Tundé' },
    { x: -75, z: -80, rotY: -Math.PI / 2, tex: createNokoueSupermarketTexture(), label: 'Supermarché Nokoué' },
  ];

  billboardsData.forEach((bb) => {
    const bbGroup = new THREE.Group();
    bbGroup.position.set(bb.x, 0, bb.z);
    bbGroup.rotation.y = bb.rotY;

    // Steel support poles
    const poleGeo = new THREE.CylinderGeometry(0.18, 0.22, 7.0, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const p1 = new THREE.Mesh(poleGeo, poleMat);
    p1.position.set(-2.2, 3.5, 0);
    const p2 = new THREE.Mesh(poleGeo, poleMat);
    p2.position.set(2.2, 3.5, 0);
    bbGroup.add(p1, p2);

    // Board panel
    const boardGeo = new THREE.BoxGeometry(5.4, 2.8, 0.2);
    const boardMat = new THREE.MeshStandardMaterial({ map: bb.tex, roughness: 0.3 });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(0, 6.2, 0);
    board.castShadow = true;
    bbGroup.add(board);

    scene.add(bbGroup);
    obstacles.push({ x: bb.x, z: bb.z, radius: 2.8 });
  });

  // 7. BUILDINGS & CITY BLOCKS (Haie Vive, Jonquet, Akpakpa, Sikè-Fictif)
  const blockCoordinates = [
    { x: -50, z: -50, w: 32, d: 32, h: 14, tex: createNokoueSupermarketTexture() },
    { x: -50, z: -130, w: 30, d: 28, h: 18, tex: createKoboCashTexture() },
    { x: -110, z: -40, w: 26, d: 24, h: 12, tex: createBeninTelTexture() },
    { x: 50, z: -50, w: 34, d: 30, h: 16, tex: createGanvieBeerTexture() },
    { x: 50, z: -130, w: 28, d: 26, h: 22, tex: createDahoFuelTexture() },
    { x: -50, z: 50, w: 32, d: 34, h: 14, tex: createTataTundeTexture() },
    { x: -60, z: 120, w: 28, d: 26, h: 12, tex: createKoboCashTexture() },
    { x: 50, z: 50, w: 32, d: 32, h: 20, tex: createBeninTelTexture() },
    { x: 65, z: 120, w: 28, d: 26, h: 16, tex: createGanvieBeerTexture() },
  ];

  blockCoordinates.forEach((block) => {
    const buildingMat = new THREE.MeshStandardMaterial({
      color: 0xF1F5F9,
      roughness: 0.6,
      metalness: 0.1,
    });
    const bMesh = new THREE.Mesh(new THREE.BoxGeometry(block.w, block.h, block.d), buildingMat);
    bMesh.position.set(block.x, block.h / 2, block.z);
    bMesh.castShadow = true;
    bMesh.receiveShadow = true;
    scene.add(bMesh);

    // Front shop sign
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(block.w * 0.6, 2.5),
      new THREE.MeshBasicMaterial({ map: block.tex })
    );
    signMesh.position.set(block.x, 3.5, block.z + block.d / 2 + 0.12);
    scene.add(signMesh);

    obstacles.push({
      x: block.x,
      z: block.z,
      radius: Math.max(block.w, block.d) * 0.65,
      height: block.h,
    });
  });

  // 8. 3D GARAGE WORKSHOPS & TUNING ZONES
  GARAGE_LOCATIONS.forEach((gar) => {
    const garageMesh = createGarageMesh(gar.name);
    garageMesh.position.set(gar.x, 0, gar.z);
    scene.add(garageMesh);

    // Add building back collision obstacle
    obstacles.push({
      x: gar.x,
      z: gar.z,
      radius: 7.2,
      height: 7.5,
    });
  });

  return { obstacles };
}
