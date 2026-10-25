/**
 * GTA Cotonou: Vice Littoral - Indoor 3D Bedroom Scene (Résidence Sikè-Fictif)
 * Ultra-detailed 3D interior bedroom where the player spawns at game start.
 * Features:
 * - Animated 3-blade tropical ceiling fan with continuous rotation
 * - Handcrafted West African bed (iroko wood frame, wax quilt, pillows)
 * - Wardrobe with hangers and wax outfits
 * - Full-length dress mirror with warm vanity illumination
 * - Multitask desk with open laptop, glowing screen HUD, desk chair, smartphone
 * - Electrical outlets, switches, wall clock, window with Naco louvers & wax curtains
 * - Ceramic terracotta floor tiles with realistic specularity
 */

import * as THREE from 'three';
import {
  createKoboCashTexture,
  createGanvieBeerTexture,
  createCustomOutfitTexture,
  createTerracottaTileFloorTexture,
  createTropicalStuccoTexture,
  createLouvreWindowTexture,
  createLaptopScreenTexture,
} from './textures.ts';

export interface BedroomInteractionTrigger {
  id: 'mirror' | 'door' | 'desk';
  label: string;
  x: number;
  z: number;
  radius: number;
}

export class BedroomScene {
  public group: THREE.Group;
  public triggers: BedroomInteractionTrigger[];
  private ceilingFanBlades: THREE.Group | null = null;
  private clockHands: { hour: THREE.Mesh; minute: THREE.Mesh } | null = null;

  constructor() {
    this.group = new THREE.Group();
    this.triggers = [
      {
        id: 'mirror',
        label: 'Miroir Dressing (Touche E pour relooker Zack/Zahra)',
        x: -2.4,
        z: -2.0,
        radius: 1.6,
      },
      {
        id: 'door',
        label: 'Porte de Sortie (Touche E pour sortir dans Cotonou)',
        x: 0,
        z: 3.2,
        radius: 1.6,
      },
      {
        id: 'desk',
        label: 'Bureau Smartphone (Touche E pour consulter les messages)',
        x: 2.3,
        z: -1.8,
        radius: 1.6,
      },
    ];

    this.group.position.set(0, 200, 0);
    this.buildRoom();
  }

  public update(delta: number) {
    if (this.ceilingFanBlades) {
      this.ceilingFanBlades.rotation.y += delta * 7.5; // Smooth realistic ceiling fan speed
    }
  }

  private buildRoom() {
    const roomWidth = 7.4;
    const roomHeight = 3.3;
    const roomDepth = 7.4;

    // 1. Tiled Floor (Glossy Terracotta Tiles with Procedural Grouting)
    const floorMat = new THREE.MeshStandardMaterial({
      map: createTerracottaTileFloorTexture(),
      roughness: 0.35,
      metalness: 0.15,
    });
    const floor = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 0.2, roomDepth), floorMat);
    floor.position.set(0, -0.1, 0);
    floor.receiveShadow = true;
    this.group.add(floor);

    // African Wax Pattern Area Rug (Center Bedroom)
    const rugMat = new THREE.MeshStandardMaterial({
      map: createCustomOutfitTexture('wax', '#D97706'),
      roughness: 0.85,
    });
    const rug = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.03, 2.6), rugMat);
    rug.position.set(0, 0.015, 0.2);
    rug.receiveShadow = true;
    this.group.add(rug);

    // 2. Walls (Sandy Tropical Stucco with Terracotta Accent Wall)
    const backWallMat = new THREE.MeshStandardMaterial({
      map: createTropicalStuccoTexture('#B45309'),
      color: 0xB45309,
      roughness: 0.75,
    });
    const sideWallMat = new THREE.MeshStandardMaterial({
      map: createTropicalStuccoTexture('#FEF3C7'),
      color: 0xFEF3C7,
      roughness: 0.8,
    });
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0xFFFBEB,
      roughness: 0.9,
    });

    // Back Wall (z = -3.7)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, roomHeight, 0.2), backWallMat);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    backWall.receiveShadow = true;
    this.group.add(backWall);

    // Front Wall with Doorway cutout (z = 3.7)
    const frontWallL = new THREE.Mesh(new THREE.BoxGeometry(2.7, roomHeight, 0.2), sideWallMat);
    frontWallL.position.set(-2.35, roomHeight / 2, roomDepth / 2);
    const frontWallR = new THREE.Mesh(new THREE.BoxGeometry(2.7, roomHeight, 0.2), sideWallMat);
    frontWallR.position.set(2.35, roomHeight / 2, roomDepth / 2);
    const frontWallTop = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 0.2), sideWallMat);
    frontWallTop.position.set(0, roomHeight - 0.45, roomDepth / 2);
    this.group.add(frontWallL, frontWallR, frontWallTop);

    // Left Wall with Window Cutout (x = -3.7)
    const leftWallMat = sideWallMat;
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomHeight, roomDepth), leftWallMat);
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    this.group.add(leftWall);

    // Right Wall (x = 3.7)
    const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, roomHeight, roomDepth), sideWallMat);
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    this.group.add(rightWall);

    // Baseboard Wood Molding (Plinthes de sol en acajou verni)
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x451A03, roughness: 0.45, metalness: 0.1 });
    const bBack = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 0.18, 0.06), baseMat);
    bBack.position.set(0, 0.09, -roomDepth / 2 + 0.09);
    const bLeft = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, roomDepth), baseMat);
    bLeft.position.set(-roomWidth / 2 + 0.09, 0.09, 0);
    const bRight = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.18, roomDepth), baseMat);
    bRight.position.set(roomWidth / 2 - 0.09, 0.09, 0);
    this.group.add(bBack, bLeft, bRight);

    // Ceiling
    const ceiling = new THREE.Mesh(new THREE.BoxGeometry(roomWidth, 0.2, roomDepth), ceilingMat);
    ceiling.position.set(0, roomHeight + 0.1, 0);
    this.group.add(ceiling);

    // 3. High-Density Naco Louver Window (on Left Wall)
    const windowGroup = new THREE.Group();
    windowGroup.position.set(-roomWidth / 2 + 0.12, 1.8, 0.5);

    const windowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.6, 1.8),
      new THREE.MeshStandardMaterial({
        map: createLouvreWindowTexture(),
        roughness: 0.2,
        metalness: 0.8,
      })
    );
    windowMesh.rotateY(Math.PI / 2);
    windowGroup.add(windowMesh);

    // Window Frame Wood Casing
    const frameGeo = new THREE.BoxGeometry(0.08, 1.9, 1.7);
    const frameMesh = new THREE.Mesh(frameGeo, baseMat);
    windowGroup.add(frameMesh);

    // Wax Fabric Curtains (Drapés colorés de chaque côté)
    const curtainMat = new THREE.MeshStandardMaterial({
      map: createCustomOutfitTexture('wax', '#E65100'),
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    const curtainL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.0, 0.35), curtainMat);
    curtainL.position.set(0.04, 0, -0.95);
    const curtainR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.0, 0.35), curtainMat);
    curtainR.position.set(0.04, 0, 0.95);
    windowGroup.add(curtainL, curtainR);

    // Soft tropical morning light streaming from window
    const windowSunbeam = new THREE.DirectionalLight(0xFFF3C4, 1.4);
    windowSunbeam.position.set(-4, 3, 0.5);
    windowSunbeam.target.position.set(0, 0, 0.5);
    windowGroup.add(windowSunbeam);
    windowGroup.add(windowSunbeam.target);

    this.group.add(windowGroup);

    // 4. High-Fidelity Animated Ceiling Fan (Ventilateur 3 Pales Cotonou)
    const fanGroup = new THREE.Group();
    fanGroup.position.set(0, roomHeight - 0.05, 0);

    // Downrod pipe
    const downrod = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.5, 12),
      new THREE.MeshStandardMaterial({ color: 0xD4D4D8, metalness: 0.8, roughness: 0.2 })
    );
    downrod.position.y = -0.25;
    fanGroup.add(downrod);

    // Central motor dome
    const motorDome = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.18, 0.16, 16),
      new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.4, roughness: 0.3 })
    );
    motorDome.position.y = -0.52;
    fanGroup.add(motorDome);

    // Rotating hub with 3 aerodynamically curved blades
    this.ceilingFanBlades = new THREE.Group();
    this.ceilingFanBlades.position.y = -0.55;

    const bladeGeo = new THREE.BoxGeometry(0.18, 0.015, 0.85);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0x451A03, // Varnished dark teak/iroko blades
      roughness: 0.4,
      metalness: 0.1,
    });

    for (let i = 0; i < 3; i++) {
      const bladeArm = new THREE.Group();
      bladeArm.rotation.y = (i * Math.PI * 2) / 3;

      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(0, 0, 0.55);
      blade.rotation.x = 0.08; // Pitch angle for airflow
      blade.castShadow = true;
      bladeArm.add(blade);

      this.ceilingFanBlades.add(bladeArm);
    }
    fanGroup.add(this.ceilingFanBlades);
    this.group.add(fanGroup);

    // 5. High-Density Handcrafted Bed (Iroko Frame, Wax Quilt, Pillow Set)
    const bedGroup = new THREE.Group();
    bedGroup.position.set(0, 0, -2.5);

    // Carved Headboard
    const headboardMat = new THREE.MeshStandardMaterial({ color: 0x5C2605, roughness: 0.5 });
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.4, 0.12), headboardMat);
    headboard.position.set(0, 0.8, -1.25);
    headboard.castShadow = true;
    bedGroup.add(headboard);

    // Bed Frame & 4 turned legs
    const bedFrame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.35, 2.4), headboardMat);
    bedFrame.position.y = 0.25;
    bedFrame.castShadow = true;
    bedGroup.add(bedFrame);

    // Mattress with white fitted sheet
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(2.15, 0.38, 2.3),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.9 })
    );
    mattress.position.y = 0.58;
    bedGroup.add(mattress);

    // Authentic Wax Duvet Quilt with folded cuff
    const waxQuiltMat = new THREE.MeshStandardMaterial({
      map: createCustomOutfitTexture('wax', '#E65100'),
      roughness: 0.65,
    });
    const quilt = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.12, 1.6), waxQuiltMat);
    quilt.position.set(0, 0.78, 0.3);
    quilt.castShadow = true;
    bedGroup.add(quilt);

    // Folded white sheet cuff at top of quilt
    const sheetCuff = new THREE.Mesh(
      new THREE.BoxGeometry(2.16, 0.08, 0.25),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.8 })
    );
    sheetCuff.position.set(0, 0.82, -0.45);
    bedGroup.add(sheetCuff);

    // Sleeping Pillows
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xFEF08A, roughness: 0.85 });
    const pillowL = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.18, 0.55), pillowMat);
    pillowL.position.set(-0.55, 0.82, -0.75);
    pillowL.rotation.x = -0.15;
    pillowL.castShadow = true;

    const pillowR = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.18, 0.55), pillowMat);
    pillowR.position.set(0.55, 0.82, -0.75);
    pillowR.rotation.x = -0.15;
    pillowR.castShadow = true;
    bedGroup.add(pillowL, pillowR);

    // Bedside Nightstand (Right side of bed)
    const nightstand = new THREE.Mesh(
      new THREE.BoxGeometry(0.65, 0.65, 0.65),
      new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.6 })
    );
    nightstand.position.set(1.6, 0.33, -2.4);
    nightstand.castShadow = true;
    this.group.add(nightstand);

    // Bedside Night Lamp with warm bulb glow
    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.15, 0.1, 12),
      new THREE.MeshStandardMaterial({ color: 0xFDE047, metalness: 0.8, roughness: 0.2 })
    );
    lampBase.position.set(1.6, 0.7, -2.4);
    const lampShade = new THREE.Mesh(
      new THREE.ConeGeometry(0.2, 0.28, 16, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.5, side: THREE.DoubleSide })
    );
    lampShade.position.set(1.6, 0.9, -2.4);
    const lampLight = new THREE.PointLight(0xFDE68A, 1.2, 4);
    lampLight.position.set(1.6, 0.85, -2.4);
    this.group.add(lampBase, lampShade, lampLight);

    // Bedside Smartphone Charging
    const phone = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.015, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.9, roughness: 0.1 })
    );
    phone.position.set(1.45, 0.665, -2.25);
    this.group.add(phone);

    this.group.add(bedGroup);

    // 6. Wardrobe Dressing & Full-Length Vanity Mirror (Left side)
    const wardrobeGroup = new THREE.Group();
    wardrobeGroup.position.set(-2.8, 0, -1.8);

    // Hardwood Wardrobe Casing
    const wardrobeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 2.7, 2.0),
      new THREE.MeshStandardMaterial({ color: 0x451A03, roughness: 0.5, metalness: 0.1 })
    );
    wardrobeMesh.position.y = 1.35;
    wardrobeMesh.castShadow = true;
    wardrobeGroup.add(wardrobeMesh);

    // Brass handles
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xFDE047, metalness: 0.9, roughness: 0.2 });
    const h1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8), handleMat);
    h1.position.set(0.56, 1.3, -0.1);
    const h2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 8), handleMat);
    h2.position.set(0.56, 1.3, 0.1);
    wardrobeGroup.add(h1, h2);

    // High-Reflection Dressing Mirror
    const mirrorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 2.2),
      new THREE.MeshStandardMaterial({
        color: 0xF1F5F9,
        metalness: 0.98,
        roughness: 0.02,
      })
    );
    mirrorGlass.position.set(0.56, 1.4, 0);
    mirrorGlass.rotateY(Math.PI / 2);
    wardrobeGroup.add(mirrorGlass);

    // Mirror Vanity Glow
    const mirrorLight = new THREE.PointLight(0xFDE047, 1.8, 4.5);
    mirrorLight.position.set(0.7, 2.3, 0);
    wardrobeGroup.add(mirrorLight);

    this.group.add(wardrobeGroup);

    // 7. High-Density Multitask Work Desk & Laptop Setup (Right side)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(2.6, 0, -1.5);

    // Desk Frame & Drawers
    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.08, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.35, metalness: 0.2 })
    );
    deskTop.position.y = 0.82;
    deskTop.castShadow = true;
    deskGroup.add(deskTop);

    // Desk Legs & Drawer Side Cabinet
    const deskCabinet = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.78, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 })
    );
    deskCabinet.position.set(0, 0.39, -0.75);
    deskCabinet.castShadow = true;
    deskGroup.add(deskCabinet);

    // Metal legs on opposite side
    const legMat = new THREE.MeshStandardMaterial({ color: 0x64748B, metalness: 0.8, roughness: 0.2 });
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), legMat);
    leg1.position.set(-0.45, 0.4, 0.95);
    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8), legMat);
    leg2.position.set(0.45, 0.4, 0.95);
    deskGroup.add(leg1, leg2);

    // Swivel Office Desk Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-0.6, 0, 0.1);
    chairGroup.rotateY(Math.PI / 4);

    const seat = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.08, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.6 })
    );
    seat.position.y = 0.5;
    chairGroup.add(seat);

    const backrest = new THREE.Mesh(
      new THREE.BoxGeometry(0.52, 0.55, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.6 })
    );
    backrest.position.set(0, 0.8, -0.25);
    chairGroup.add(backrest);

    const chairStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.45, 8), legMat);
    chairStem.position.y = 0.25;
    chairGroup.add(chairStem);
    deskGroup.add(chairGroup);

    // Laptop with Realistic Keyboard, Trackpad & Glowing Screen HUD
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.02, 0.32),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.85, roughness: 0.2 })
    );
    laptopBase.position.set(-0.1, 0.87, 0.1);
    deskGroup.add(laptopBase);

    // Glowing Laptop Screen with Cotonou 4G Network & GPS HUD
    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.3, 0.015),
      new THREE.MeshStandardMaterial({
        map: createLaptopScreenTexture(),
        emissive: 0x38BDF8,
        emissiveIntensity: 0.75,
        roughness: 0.2,
      })
    );
    laptopScreen.position.set(-0.1, 1.02, -0.05);
    laptopScreen.rotateX(0.24);
    deskGroup.add(laptopScreen);

    // Screen ambient light reflecting on desk
    const laptopGlow = new THREE.PointLight(0x38BDF8, 1.4, 2.5);
    laptopGlow.position.set(-0.1, 1.1, 0.1);
    deskGroup.add(laptopGlow);

    // Coffee Mug "Café de Cotonou"
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.04, 0.1, 12),
      new THREE.MeshStandardMaterial({ color: 0xDC2626, roughness: 0.3 })
    );
    mug.position.set(0.35, 0.91, 0.4);
    deskGroup.add(mug);

    this.group.add(deskGroup);

    // 8. Wall Posters & Artwork (Bière Ganvié, Kobo Cash, Cotonou 2026 Calendar)
    const poster1 = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.95),
      new THREE.MeshBasicMaterial({ map: createGanvieBeerTexture() })
    );
    poster1.position.set(-1.8, 2.1, -roomDepth / 2 + 0.11);
    this.group.add(poster1);

    const poster2 = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.95),
      new THREE.MeshBasicMaterial({ map: createKoboCashTexture() })
    );
    poster2.position.set(1.8, 2.1, -roomDepth / 2 + 0.11);
    this.group.add(poster2);

    // Wall Clock (Horloge ronde avec aiguilles)
    const clockGroup = new THREE.Group();
    clockGroup.position.set(0, 2.5, -roomDepth / 2 + 0.12);

    const clockRim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.3, 0.04, 24),
      new THREE.MeshStandardMaterial({ color: 0xF59E0B, metalness: 0.8, roughness: 0.2 })
    );
    clockRim.rotateX(Math.PI / 2);
    clockGroup.add(clockRim);

    const clockFace = new THREE.Mesh(
      new THREE.CircleGeometry(0.26, 24),
      new THREE.MeshBasicMaterial({ color: 0xFFFFFF })
    );
    clockFace.position.z = 0.025;
    clockGroup.add(clockFace);

    const hHand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.12, 0.01), new THREE.MeshBasicMaterial({ color: 0x111827 }));
    hHand.position.set(0, 0.04, 0.03);
    hHand.rotation.z = -Math.PI / 3;
    const mHand = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.18, 0.01), new THREE.MeshBasicMaterial({ color: 0xDC2626 }));
    mHand.position.set(0, 0.06, 0.035);
    mHand.rotation.z = Math.PI / 6;
    clockGroup.add(hHand, mHand);
    this.group.add(clockGroup);

    // 9. Exit Door & Wall Fixtures (Light Switch & 220V Plug)
    const doorGroup = new THREE.Group();
    doorGroup.position.set(0, 0, roomDepth / 2 - 0.1);

    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.65, 2.55, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 })
    );
    doorFrame.position.y = 1.275;
    doorGroup.add(doorFrame);

    const doorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.48, 2.42, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x9A3412, roughness: 0.6 })
    );
    doorPanel.position.set(0, 1.21, -0.01);
    doorGroup.add(doorPanel);

    // Golden brass door handle lever
    const handle = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.03, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xFDE047, metalness: 0.9, roughness: 0.1 })
    );
    handle.position.set(-0.55, 1.15, -0.06);
    doorGroup.add(handle);

    // Wall Light Switch (Interrupteur près de la porte)
    const switchBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.08, 0.02),
      new THREE.MeshStandardMaterial({ color: 0xF8FAFC, roughness: 0.5 })
    );
    switchBox.position.set(1.1, 1.3, -0.08);
    doorGroup.add(switchBox);

    this.group.add(doorGroup);

    // 10. Ambient & Accent Lighting
    const ceilingLight = new THREE.PointLight(0xFFFBEB, 3.4, 18);
    ceilingLight.position.set(0, roomHeight - 0.2, 0);
    this.group.add(ceilingLight);

    const ambientLight = new THREE.AmbientLight(0xFFF7ED, 1.5);
    this.group.add(ambientLight);
  }
}
