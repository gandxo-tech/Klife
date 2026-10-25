/**
 * GTA Cotonou - City Map & Environment Generator (Three.js)
 * Generates an authentic, atmospheric 3D Cotonou map with fictional Benin brands:
 * - Kobo Cash, BeninTel Mobile, Bière Ganvié, DahoFuel, Chez Tata Tundé, Supermarché Nokoué
 * - Place de l'Étoile Rouge (authentic circular roundabout + central revolutionary obelisk + star)
 * - Monument de l'Amazone (Boulevard de la Marina esplanade + bronze warrior statue)
 * - Grand Marché Dantokpa (organized market district + Nokoué lagoon + pirogues)
 * - Cathédrale Notre-Dame-de-Miséricorde (iconic red & white striped twin-tower cathedral)
 * - Fidjrossè Plage & Route des Pêches (ocean waves + golden sand + palm groves + paillotes)
 * - Port Autonome de Cotonou (stacked shipping containers + industrial logistics zone)
 * - Residential & commercial districts with detailed buildings (water tanks, satellite dishes, shops)
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
  createCotonouBuildingMesh,
  createCathedraleCotonouMesh,
  createBeachPailloteMesh,
  createStreetLight,
  createSpeedBumpMesh,
  createStreetSignPost,
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
import { WorldObstacle } from './rules.ts';

export type { WorldObstacle };

export interface CityBuildResult {
  obstacles: WorldObstacle[];
  waterMesh: THREE.Mesh;
  oceanWaveUniform?: { offset: number };
}

export function buildCotonouCity(scene: THREE.Scene): CityBuildResult {
  const obstacles: WorldObstacle[] = [];

  // ==========================================
  // 1. BASE GROUND & TERRAIN
  // ==========================================

  // Base city asphalt ground
  const groundGeo = new THREE.PlaneGeometry(640, 640);
  groundGeo.rotateX(-Math.PI / 2);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x22262B, // Deep urban road asphalt
    roughness: 0.92,
    metalness: 0.05,
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.receiveShadow = true;
  scene.add(ground);

  // Atlantic Ocean & Fidjrossè Beach (West side: x = -130 to -340)
  const beachGeo = new THREE.PlaneGeometry(160, 640);
  beachGeo.rotateX(-Math.PI / 2);
  const beachMat = new THREE.MeshStandardMaterial({
    color: 0xD8C2A7, // Warm golden Cotonou coastal sand
    roughness: 0.98,
  });
  const beach = new THREE.Mesh(beachGeo, beachMat);
  beach.position.set(-200, 0.04, 0);
  beach.receiveShadow = true;
  scene.add(beach);

  // Atlantic Ocean Water Surface
  const waterGeo = new THREE.PlaneGeometry(180, 640);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x0284C7,
    roughness: 0.12,
    metalness: 0.85,
    transparent: true,
    opacity: 0.88,
  });
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.position.set(-330, 0.08, 0);
  scene.add(water);

  // Foam shoreline wave strip along beach edge (x = -240)
  const foamGeo = new THREE.PlaneGeometry(6, 640);
  foamGeo.rotateX(-Math.PI / 2);
  const foamMat = new THREE.MeshBasicMaterial({
    color: 0xF8FAFC,
    transparent: true,
    opacity: 0.55,
  });
  const foam = new THREE.Mesh(foamGeo, foamMat);
  foam.position.set(-240, 0.09, 0);
  scene.add(foam);

  // Nokoué Lagoon (East side of Dantokpa: x = 185 to 250)
  const lagoonGeo = new THREE.PlaneGeometry(80, 240);
  lagoonGeo.rotateX(-Math.PI / 2);
  const lagoonMat = new THREE.MeshStandardMaterial({
    color: 0x0E7490, // Calmer inland lagoon water
    roughness: 0.2,
    metalness: 0.7,
    transparent: true,
    opacity: 0.9,
  });
  const lagoon = new THREE.Mesh(lagoonGeo, lagoonMat);
  lagoon.position.set(220, 0.05, -60);
  scene.add(lagoon);

  // ==========================================
  // 2. ROAD NETWORK & ROUNDABOUT
  // ==========================================
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x1A1E24, roughness: 0.85 });

  // 2.1 PLACE DE L'ÉTOILE ROUGE ROUNDABOUT RING (at 0, 0)
  // Outer radius 26m, inner radius 15m (11m wide circular road)
  const roundaboutRingGeo = new THREE.RingGeometry(15.2, 26.5, 48);
  roundaboutRingGeo.rotateX(-Math.PI / 2);
  const roundaboutRing = new THREE.Mesh(roundaboutRingGeo, roadMat);
  roundaboutRing.position.set(0, 0.032, 0);
  roundaboutRing.receiveShadow = true;
  scene.add(roundaboutRing);

  // Circular roundabout lane divider (dashed white circular line at r = 21m)
  const roundLineCanvas = document.createElement('canvas');
  roundLineCanvas.width = 128;
  roundLineCanvas.height = 16;
  const rlCtx = roundLineCanvas.getContext('2d')!;
  rlCtx.fillStyle = '#00000000';
  rlCtx.fillRect(0, 0, 128, 16);
  rlCtx.fillStyle = '#FFFFFF';
  rlCtx.fillRect(16, 4, 32, 8);
  rlCtx.fillRect(80, 4, 32, 8);
  const roundLineTex = new THREE.CanvasTexture(roundLineCanvas);
  roundLineTex.wrapS = THREE.RepeatWrapping;
  roundLineTex.repeat.set(12, 1);
  roundLineTex.colorSpace = THREE.SRGBColorSpace;

  const roundDashedGeo = new THREE.RingGeometry(20.4, 21.4, 48);
  roundDashedGeo.rotateX(-Math.PI / 2);
  const roundDashedMat = new THREE.MeshBasicMaterial({ map: roundLineTex, transparent: true });
  const roundDashed = new THREE.Mesh(roundDashedGeo, roundDashedMat);
  roundDashed.position.set(0, 0.045, 0);
  scene.add(roundDashed);

  // 2.2 MAIN BOULEVARDS CONNECTING TO ROUNDABOUT
  // East-West Boulevard (Boulevard de la Marina): split East (x > 26) and West (x < -26)
  const roadEast = new THREE.Mesh(new THREE.PlaneGeometry(180, 18), roadMat);
  roadEast.rotateX(-Math.PI / 2);
  roadEast.position.set(116, 0.03, 0);
  roadEast.receiveShadow = true;
  scene.add(roadEast);

  const roadWest = new THREE.Mesh(new THREE.PlaneGeometry(160, 18), roadMat);
  roadWest.rotateX(-Math.PI / 2);
  roadWest.position.set(-106, 0.03, 0);
  roadWest.receiveShadow = true;
  scene.add(roadWest);

  // North-South Boulevard (Avenue Jean-Paul II): split North (z < -26) and South (z > 26)
  const roadNorth = new THREE.Mesh(new THREE.PlaneGeometry(18, 180), roadMat);
  roadNorth.rotateX(-Math.PI / 2);
  roadNorth.position.set(0, 0.03, -116);
  roadNorth.receiveShadow = true;
  scene.add(roadNorth);

  const roadSouth = new THREE.Mesh(new THREE.PlaneGeometry(18, 180), roadMat);
  roadSouth.rotateX(-Math.PI / 2);
  roadSouth.position.set(0, 0.03, 116);
  roadSouth.receiveShadow = true;
  scene.add(roadSouth);

  // 2.3 SECONDARY GRID AVENUES
  // North-South secondary road at x = 100 (Dantokpa & Port bypass)
  const roadNS_East = new THREE.Mesh(new THREE.PlaneGeometry(14, 380), roadMat);
  roadNS_East.rotateX(-Math.PI / 2);
  roadNS_East.position.set(100, 0.03, 0);
  roadNS_East.receiveShadow = true;
  scene.add(roadNS_East);

  // North-South secondary road at x = -100 (Cadjehoun & Airport corridor)
  const roadNS_West = new THREE.Mesh(new THREE.PlaneGeometry(14, 380), roadMat);
  roadNS_West.rotateX(-Math.PI / 2);
  roadNS_West.position.set(-100, 0.03, 0);
  roadNS_West.receiveShadow = true;
  scene.add(roadNS_West);

  // Route des Pêches (Scenic coastal road alongside Fidjrossè beach at x = -135)
  const roadPeches = new THREE.Mesh(new THREE.PlaneGeometry(14, 380), roadMat);
  roadPeches.rotateX(-Math.PI / 2);
  roadPeches.position.set(-135, 0.035, 0);
  roadPeches.receiveShadow = true;
  scene.add(roadPeches);

  // East-West secondary road at z = -90 (Sikè & Dantokpa North)
  const roadEW_North = new THREE.Mesh(new THREE.PlaneGeometry(360, 14), roadMat);
  roadEW_North.rotateX(-Math.PI / 2);
  roadEW_North.position.set(0, 0.03, -90);
  roadEW_North.receiveShadow = true;
  scene.add(roadEW_North);

  // East-West secondary road at z = 90 (Haie Vive & Port South)
  const roadEW_South = new THREE.Mesh(new THREE.PlaneGeometry(360, 14), roadMat);
  roadEW_South.rotateX(-Math.PI / 2);
  roadEW_South.position.set(0, 0.03, 90);
  roadEW_South.receiveShadow = true;
  scene.add(roadEW_South);

  // 2.4 ROAD CENTERLINES (Yellow dashed lines with correct orientation)
  const yellowLineCanvas = document.createElement('canvas');
  yellowLineCanvas.width = 64;
  yellowLineCanvas.height = 16;
  const yCtx = yellowLineCanvas.getContext('2d')!;
  yCtx.fillStyle = '#00000000';
  yCtx.fillRect(0, 0, 64, 16);
  yCtx.fillStyle = '#FACC15';
  yCtx.fillRect(12, 4, 40, 8);
  const yellowLineTex = new THREE.CanvasTexture(yellowLineCanvas);
  yellowLineTex.wrapS = THREE.RepeatWrapping;
  yellowLineTex.wrapT = THREE.RepeatWrapping;
  yellowLineTex.repeat.set(18, 1);
  yellowLineTex.colorSpace = THREE.SRGBColorSpace;
  const yellowLineMat = new THREE.MeshBasicMaterial({ map: yellowLineTex, transparent: true });

  // East road centerline (horizontal along X)
  const lineEast = new THREE.Mesh(new THREE.PlaneGeometry(170, 0.8), yellowLineMat);
  lineEast.rotateX(-Math.PI / 2);
  lineEast.position.set(116, 0.045, 0);
  scene.add(lineEast);

  // West road centerline (horizontal along X)
  const lineWest = new THREE.Mesh(new THREE.PlaneGeometry(150, 0.8), yellowLineMat);
  lineWest.rotateX(-Math.PI / 2);
  lineWest.position.set(-106, 0.045, 0);
  scene.add(lineWest);

  // North-South dashed centerline texture
  const nsYellowCanvas = document.createElement('canvas');
  nsYellowCanvas.width = 16;
  nsYellowCanvas.height = 64;
  const nsCtx = nsYellowCanvas.getContext('2d')!;
  nsCtx.fillStyle = '#00000000';
  nsCtx.fillRect(0, 0, 16, 64);
  nsCtx.fillStyle = '#FACC15';
  nsCtx.fillRect(4, 12, 8, 40);
  const nsYellowTex = new THREE.CanvasTexture(nsYellowCanvas);
  nsYellowTex.wrapS = THREE.RepeatWrapping;
  nsYellowTex.wrapT = THREE.RepeatWrapping;
  nsYellowTex.repeat.set(1, 18);
  nsYellowTex.colorSpace = THREE.SRGBColorSpace;
  const nsYellowMat = new THREE.MeshBasicMaterial({ map: nsYellowTex, transparent: true });

  const lineNorth = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 170), nsYellowMat);
  lineNorth.rotateX(-Math.PI / 2);
  lineNorth.position.set(0, 0.045, -116);
  scene.add(lineNorth);

  const lineSouth = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 170), nsYellowMat);
  lineSouth.rotateX(-Math.PI / 2);
  lineSouth.position.set(0, 0.045, 116);
  scene.add(lineSouth);

  // 2.5 PEDESTRIAN ZEBRA CROSSINGS AT ROUNDABOUT ENTRANCES
  const zebraCanvas = document.createElement('canvas');
  zebraCanvas.width = 128;
  zebraCanvas.height = 32;
  const zCtx = zebraCanvas.getContext('2d')!;
  zCtx.fillStyle = '#00000000';
  zCtx.fillRect(0, 0, 128, 32);
  zCtx.fillStyle = '#FFFFFF';
  for (let i = 8; i < 128; i += 24) {
    zCtx.fillRect(i, 4, 14, 24);
  }
  const zebraTex = new THREE.CanvasTexture(zebraCanvas);
  zebraTex.colorSpace = THREE.SRGBColorSpace;
  const zebraMat = new THREE.MeshBasicMaterial({ map: zebraTex, transparent: true });

  // North crossing
  const zNorth = new THREE.Mesh(new THREE.PlaneGeometry(16, 4.5), zebraMat);
  zNorth.rotateX(-Math.PI / 2);
  zNorth.position.set(0, 0.046, -28);
  scene.add(zNorth);

  // South crossing
  const zSouth = new THREE.Mesh(new THREE.PlaneGeometry(16, 4.5), zebraMat);
  zSouth.rotateX(-Math.PI / 2);
  zSouth.position.set(0, 0.046, 28);
  scene.add(zSouth);

  // East crossing
  const zEast = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 16), zebraMat);
  zEast.rotateX(-Math.PI / 2);
  zEast.position.set(28, 0.046, 0);
  scene.add(zEast);

  // West crossing
  const zWest = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 16), zebraMat);
  zWest.rotateX(-Math.PI / 2);
  zWest.position.set(-28, 0.046, 0);
  scene.add(zWest);

  // ==========================================
  // 3. LANDMARK 1: PLACE DE L'ÉTOILE ROUGE
  // ==========================================
  const etoileRouge = createEtoileRougeMesh();
  etoileRouge.position.set(0, 0, 0);
  scene.add(etoileRouge);
  // Roundabout central podium circular obstacle
  obstacles.push({
    type: 'circle',
    x: 0,
    z: 0,
    radius: 15.2,
    height: 22,
  });

  // Streetlights around Étoile Rouge roundabout perimeter (r = 28m)
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const lamp = createStreetLight();
    lamp.position.set(Math.cos(angle) * 28.5, 0, Math.sin(angle) * 28.5);
    lamp.rotation.y = -angle - Math.PI / 2;
    scene.add(lamp);
    obstacles.push({ type: 'circle', x: lamp.position.x, z: lamp.position.z, radius: 0.8 });
  }

  // ==========================================
  // 4. LANDMARK 2: MONUMENT DE L'AMAZONE & MARINA ESPLANADE
  // Located at x = 40, z = 140 (Adjacent to Boulevard de la Marina)
  // Leaves the main North-South boulevard at x = 0 completely clear!
  // ==========================================
  const amazoneEsplanadeGeo = new THREE.PlaneGeometry(55, 55);
  amazoneEsplanadeGeo.rotateX(-Math.PI / 2);
  const amazoneEsplanadeMat = new THREE.MeshStandardMaterial({
    color: 0x15803D, // Green lawn park surrounded by granite pavers
    roughness: 0.85,
  });
  const amazoneEsplanade = new THREE.Mesh(amazoneEsplanadeGeo, amazoneEsplanadeMat);
  amazoneEsplanade.position.set(40, 0.035, 140);
  amazoneEsplanade.receiveShadow = true;
  scene.add(amazoneEsplanade);

  // Granite Ceremonial Paved Plaza (Inner)
  const amzPavedGeo = new THREE.PlaneGeometry(32, 32);
  amzPavedGeo.rotateX(-Math.PI / 2);
  const amzPavedMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.55 });
  const amzPaved = new THREE.Mesh(amzPavedGeo, amzPavedMat);
  amzPaved.position.set(40, 0.045, 140);
  amzPaved.receiveShadow = true;
  scene.add(amzPaved);

  // The 30m Bronze Dahomey Amazon Warrior Statue
  const amazone = createAmazoneMonumentMesh();
  amazone.position.set(40, 0, 140);
  scene.add(amazone);
  obstacles.push({
    type: 'box',
    x: 40,
    z: 140,
    halfWidth: 5.5,
    halfDepth: 5.5,
    height: 16,
  });

  // Ceremonial Benin Tricolor Flagpoles around Amazone Esplanade
  [-12, 12].forEach((fx) => {
    [-12, 12].forEach((fz) => {
      const flag = createBeninFlagpole();
      flag.position.set(40 + fx, 0, 140 + fz);
      scene.add(flag);
      obstacles.push({ type: 'circle', x: 40 + fx, z: 140 + fz, radius: 0.8 });
    });
  });

  // Palm grove lining the Marina Esplanade
  [-22, 22].forEach((px) => {
    for (let pz = -20; pz <= 20; pz += 10) {
      const palm = createPalmTree();
      palm.position.set(40 + px, 0, 140 + pz);
      scene.add(palm);
      obstacles.push({ type: 'circle', x: 40 + px, z: 140 + pz, radius: 1.0 });
    }
  });

  // ==========================================
  // 5. LANDMARK 3: GRAND MARCHÉ DANTOKPA
  // Located at x = 145, z = -60 (Along Nokoué Lagoon)
  // Strictly east of the avenue at x = 100
  // ==========================================
  const marketBase = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 65),
    new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.95 }) // Reddish clay market ground
  );
  marketBase.rotateX(-Math.PI / 2);
  marketBase.position.set(145, 0.038, -60);
  marketBase.receiveShadow = true;
  scene.add(marketBase);

  // Grand Entrance Gateway Arch facing the avenue at x = 100
  const dantokpaArch = createDantokpaArch();
  dantokpaArch.position.set(112, 0, -60);
  dantokpaArch.rotation.y = Math.PI / 2;
  scene.add(dantokpaArch);
  obstacles.push({ type: 'circle', x: 112, z: -66, radius: 1.2 });
  obstacles.push({ type: 'circle', x: 112, z: -54, radius: 1.2 });

  // Vibrant Market Stalls (Fruits, Kente/Wax Textiles, Spices, Crafts)
  const shadeColors = [0xDC2626, 0xFACC15, 0x0284C7, 0x16A34A, 0xEA580C, 0x9333EA];
  for (let x = 125; x <= 168; x += 11) {
    for (let z = -84; z <= -36; z += 12) {
      if (Math.abs(x - 145) < 5 && Math.abs(z - (-60)) < 5) continue;
      const color = shadeColors[Math.floor(Math.random() * shadeColors.length)];
      const stall = createMarketStallMesh(color);
      stall.position.set(x + (Math.random() - 0.5) * 1.5, 0, z + (Math.random() - 0.5) * 1.5);
      scene.add(stall);
      obstacles.push({
        type: 'box',
        x: stall.position.x,
        z: stall.position.z,
        halfWidth: 1.8,
        halfDepth: 1.2,
      });
    }
  }

  // Wooden Lake Nokoué Mooring Pier & Traditional Pirogues
  const pierMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.9 });
  const pier = new THREE.Mesh(new THREE.BoxGeometry(10, 0.5, 70), pierMat);
  pier.position.set(182, 0.25, -60);
  pier.receiveShadow = true;
  scene.add(pier);

  [-80, -65, -50, -35].forEach((pz, idx) => {
    const pirogue = createPirogueMesh();
    pirogue.position.set(192, 0.1, pz);
    pirogue.rotation.y = idx % 2 === 0 ? 0.35 : -0.25;
    scene.add(pirogue);
    obstacles.push({ type: 'circle', x: 192, z: pz, radius: 2.8 });
  });

  // MTN MoMo & Moov Flooz Kiosks at Market entrance
  const momoMarket = createMoMoKiosk('mtn');
  momoMarket.position.set(108, 0, -48);
  scene.add(momoMarket);
  obstacles.push({ type: 'box', x: 108, z: -48, halfWidth: 1.3, halfDepth: 1.3 });

  const moovMarket = createMoMoKiosk('moov');
  moovMarket.position.set(108, 0, -72);
  scene.add(moovMarket);
  obstacles.push({ type: 'box', x: 108, z: -72, halfWidth: 1.3, halfDepth: 1.3 });

  // ==========================================
  // 6. LANDMARK 4: CATHÉDRALE NOTRE-DAME-DE-MISÉRICORDE
  // Historic red and white striped twin-spire cathedral (at x = -48, z = 50)
  // ==========================================
  const cathPlazaGeo = new THREE.PlaneGeometry(36, 46);
  cathPlazaGeo.rotateX(-Math.PI / 2);
  const cathPlazaMat = new THREE.MeshStandardMaterial({ color: 0x94A3B8, roughness: 0.6 });
  const cathPlaza = new THREE.Mesh(cathPlazaGeo, cathPlazaMat);
  cathPlaza.position.set(-52, 0.035, 48);
  scene.add(cathPlaza);

  const cathedrale = createCathedraleCotonouMesh();
  cathedrale.position.set(-52, 0, 48);
  scene.add(cathedrale);
  obstacles.push({
    type: 'box',
    x: -52,
    z: 48,
    halfWidth: 12.0,
    halfDepth: 17.0,
    height: 38,
  });

  // ==========================================
  // 7. LANDMARK 5: PORT AUTONOME DE COTONOU
  // Logistics container zone at x = 145, z = 50
  // ==========================================
  const portBase = new THREE.Mesh(
    new THREE.PlaneGeometry(75, 75),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 })
  );
  portBase.rotateX(-Math.PI / 2);
  portBase.position.set(145, 0.038, 50);
  scene.add(portBase);

  // Stacked Cargo Containers with realistic shipping colors
  const containerColors = [0x0284C7, 0xEA580C, 0x16A34A, 0xFACC15, 0xDC2626];
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const cx = 130 + row * 10;
      const cz = 35 + col * 15;
      const colColor = containerColors[(row + col) % containerColors.length];
      const containerMat = new THREE.MeshStandardMaterial({
        color: colColor,
        roughness: 0.45,
        metalness: 0.65,
      });

      const c1 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.8, 8.0), containerMat);
      c1.position.set(cx, 1.4, cz);
      c1.castShadow = true;
      scene.add(c1);

      if ((row + col) % 2 === 0) {
        const c2 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 2.8, 8.0), containerMat);
        c2.position.set(cx, 4.2, cz);
        c2.castShadow = true;
        scene.add(c2);
      }

      obstacles.push({
        type: 'box',
        x: cx,
        z: cz,
        halfWidth: 1.6,
        halfDepth: 4.2,
        height: 5.6,
      });
    }
  }

  // ==========================================
  // 8. LANDMARK 6: FIDJROSSÈ PLAGE & ROUTE DES PÊCHES
  // Beach paillotes, coconut palms, and fishing pirogues on the sand
  // ==========================================
  // Beach Paillotes ("Chez Tata Tundé Plage" / Ganvié Beer)
  [-80, 40].forEach((pz) => {
    const paillote = createBeachPailloteMesh();
    paillote.position.set(-180, 0, pz);
    scene.add(paillote);
    obstacles.push({
      type: 'box',
      x: -180,
      z: pz,
      halfWidth: 5.2,
      halfDepth: 4.2,
      height: 5.5,
    });
  });

  // Fishing pirogues pulled up onto the golden beach sand
  [-110, -30, 80].forEach((pz, idx) => {
    const pirogue = createPirogueMesh();
    pirogue.position.set(-215, 0.08, pz);
    pirogue.rotation.y = idx % 2 === 0 ? 0.2 : -0.3;
    scene.add(pirogue);
    obstacles.push({ type: 'circle', x: -215, z: pz, radius: 2.8 });
  });

  // Coconut Palm Tree Rows along Fidjrossè and Route des Pêches
  for (let i = 0; i < 40; i++) {
    const px = -150 - Math.random() * 55;
    const pz = -160 + Math.random() * 320;
    // Don't spawn on top of paillotes
    if (Math.abs(px - (-180)) < 8 && (Math.abs(pz - (-80)) < 8 || Math.abs(pz - 40) < 8)) continue;
    const palm = createPalmTree();
    palm.position.set(px, 0, pz);
    scene.add(palm);
    obstacles.push({ type: 'circle', x: px, z: pz, radius: 0.9 });
  }

  // ==========================================
  // 9. AUTHENTIC MULTI-STORY COTONOU BUILDINGS
  // Haie Vive, Jonquet, Sikè-Fictif, Cadjehoun
  // Textured walls, Rotoplas water tanks, satellite dishes, shopfront awnings
  // Uses exact BoxObstacle colliders (NO phantom road collisions!)
  // ==========================================
  const buildingConfigs = [
    // Sikè-Fictif Northwest District
    { x: -52, z: -52, w: 28, d: 26, h: 16, color: 0xFDE047, tex: createNokoueSupermarketTexture(), hasAwning: true },
    { x: -52, z: -130, w: 26, d: 24, h: 18, color: 0xF8FAFC, tex: createKoboCashTexture(), hasAwning: true },
    { x: -140, z: -50, w: 24, d: 24, h: 14, color: 0xFDBA74, tex: createBeninTelTexture(), hasAwning: false },
    // Sikè-Fictif Southwest District (Ganhi & Haie Vive residential)
    { x: -62, z: 120, w: 26, d: 24, h: 15, color: 0xCBD5E1, tex: createTataTundeTexture(), hasAwning: true },
    // Northeast District (Commercial & Ganvié depot)
    { x: 52, z: -52, w: 28, d: 26, h: 18, color: 0x86EFAC, tex: createGanvieBeerTexture(), hasAwning: true },
    { x: 52, z: -130, w: 26, d: 24, h: 22, color: 0xFCA5A5, tex: createDahoFuelTexture(), hasAwning: false },
    // Southeast District (Haie Vive VIP & Jonquet)
    { x: 52, z: 52, w: 28, d: 26, h: 20, color: 0xFDE047, tex: createBeninTelTexture(), hasAwning: true },
    { x: 65, z: 120, w: 26, d: 24, h: 16, color: 0xFDBA74, tex: createGanvieBeerTexture(), hasAwning: true },
  ];

  buildingConfigs.forEach((cfg) => {
    const bld = createCotonouBuildingMesh(cfg.w, cfg.h, cfg.d, cfg.color, cfg.tex, cfg.hasAwning);
    bld.position.set(cfg.x, 0, cfg.z);
    scene.add(bld);

    // Exact AABB box collision
    obstacles.push({
      type: 'box',
      x: cfg.x,
      z: cfg.z,
      halfWidth: cfg.w / 2 + 0.4,
      halfDepth: cfg.d / 2 + 0.4,
      height: cfg.h,
    });
  });

  // ==========================================
  // 10. 3D GARAGE WORKSHOPS & TUNING ZONES
  // ==========================================
  GARAGE_LOCATIONS.forEach((gar) => {
    const garageMesh = createGarageMesh(gar.name);
    garageMesh.position.set(gar.x, 0, gar.z);
    scene.add(garageMesh);

    // Building box obstacle (driveway at +10 is open for entry)
    obstacles.push({
      type: 'box',
      x: gar.x,
      z: gar.z,
      halfWidth: 8.2,
      halfDepth: 7.2,
      height: 7.8,
    });
  });

  // ==========================================
  // 11. STREET FURNITURE, SPEED BUMPS & DISTRICT SIGNPOSTS
  // ==========================================
  // Streetlights along Boulevard de la Marina
  [-160, -110, -60, 60, 110, 160].forEach((lx) => {
    const lampNorth = createStreetLight();
    lampNorth.position.set(lx, 0, -10.5);
    lampNorth.rotation.y = -Math.PI / 2;
    scene.add(lampNorth);
    obstacles.push({ type: 'circle', x: lx, z: -10.5, radius: 0.8 });

    const lampSouth = createStreetLight();
    lampSouth.position.set(lx, 0, 10.5);
    lampSouth.rotation.y = Math.PI / 2;
    scene.add(lampSouth);
    obstacles.push({ type: 'circle', x: lx, z: 10.5, radius: 0.8 });
  });

  // Streetlights along Avenue Jean-Paul II
  [-160, -110, -60, 60, 110, 160].forEach((lz) => {
    const lampWest = createStreetLight();
    lampWest.position.set(-10.5, 0, lz);
    scene.add(lampWest);
    obstacles.push({ type: 'circle', x: -10.5, z: lz, radius: 0.8 });

    const lampEast = createStreetLight();
    lampEast.position.set(10.5, 0, lz);
    lampEast.rotation.y = Math.PI;
    scene.add(lampEast);
    obstacles.push({ type: 'circle', x: 10.5, z: lz, radius: 0.8 });
  });

  // Speed bumps ("Dos d'âne") on secondary avenue intersections
  const bumpSike = createSpeedBumpMesh(14);
  bumpSike.position.set(-100, 0, -45);
  scene.add(bumpSike);

  const bumpDantokpa = createSpeedBumpMesh(14);
  bumpDantokpa.position.set(100, 0, -25);
  scene.add(bumpDantokpa);

  // Authentic Cotonou Street Name Signposts
  const streetSigns = [
    { x: -30, z: -11, street: 'Bld de la Marina', district: 'Sikè-Fictif' },
    { x: 30, z: -11, street: 'Bld de la Marina', district: 'Haie Vive' },
    { x: -11, z: -30, street: 'Avenue Steinmetz', district: 'Ganhi' },
    { x: -11, z: 30, street: 'Avenue Jean-Paul II', district: 'Marina' },
    { x: 102, z: -32, street: 'Route de Dantokpa', district: 'Marché Dantokpa' },
    { x: -136, z: 20, street: 'Route des Pêches', district: 'Fidjrossè Plage' },
  ];

  streetSigns.forEach((s) => {
    const sign = createStreetSignPost(s.street, s.district);
    sign.position.set(s.x, 0, s.z);
    scene.add(sign);
    obstacles.push({ type: 'circle', x: s.x, z: s.z, radius: 0.6 });
  });

  return { obstacles, waterMesh: water };
}
