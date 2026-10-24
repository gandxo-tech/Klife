/**
 * GTA Cotonou: Vice Littoral - Indoor 3D Bedroom Scene (Résidence Sikè-Fictif)
 * Creates a cozy 3D interior bedroom where the player spawns at game start.
 * Features:
 * - Wardrobe & Mirror for character customization
 * - Desk with phone/laptop
 * - Exit door leading out to Cotonou street
 * - Benin posters (Bière Ganvié, Kobo Cash, BeninTel)
 */

import * as THREE from 'three';
import {
  createKoboCashTexture,
  createBeninTelTexture,
  createGanvieBeerTexture,
  createCustomOutfitTexture,
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

  constructor() {
    this.group = new THREE.Group();
    this.triggers = [
      {
        id: 'mirror',
        label: 'Miroir Dressing (Touche E pour relooker Zack/Zahra)',
        x: -2.4,
        z: -2.2,
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
        z: -2.0,
        radius: 1.6,
      },
    ];

    this.buildRoom();
  }

  private buildRoom() {
    // Room Dimensions: Width 7.0m, Height 3.2m, Depth 7.0m
    const roomWidth = 7.0;
    const roomHeight = 3.2;
    const roomDepth = 7.0;

    // 1. Tiled Floor with Patterned Carpet
    const floorGeo = new THREE.PlaneGeometry(roomWidth, roomDepth);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xCBD5E1, // Light ceramic tile
      roughness: 0.25,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    this.group.add(floor);

    // African Wax Pattern Carpet
    const rugGeo = new THREE.PlaneGeometry(3.5, 2.5);
    rugGeo.rotateX(-Math.PI / 2);
    const rugMat = new THREE.MeshStandardMaterial({
      map: createCustomOutfitTexture('wax', '#D97706'),
      roughness: 0.8,
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0, 0.01, 0);
    rug.receiveShadow = true;
    this.group.add(rug);

    // 2. Walls (Warm Terracotta / Sikè Beige)
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.8 });

    // Back Wall (z = -3.5)
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), wallMat);
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    this.group.add(backWall);

    // Front Wall with Doorway cutout (z = 3.5)
    const frontWallL = new THREE.Mesh(new THREE.PlaneGeometry(2.5, roomHeight), wallMat);
    frontWallL.position.set(-2.25, roomHeight / 2, roomDepth / 2);
    frontWallL.rotateY(Math.PI);

    const frontWallR = new THREE.Mesh(new THREE.PlaneGeometry(2.5, roomHeight), wallMat);
    frontWallR.position.set(2.25, roomHeight / 2, roomDepth / 2);
    frontWallR.rotateY(Math.PI);

    const frontWallTop = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.8), wallMat);
    frontWallTop.position.set(0, roomHeight - 0.4, roomDepth / 2);
    frontWallTop.rotateY(Math.PI);

    this.group.add(frontWallL, frontWallR, frontWallTop);

    // Left Wall (x = -3.5)
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    leftWall.rotateY(Math.PI / 2);
    this.group.add(leftWall);

    // Right Wall (x = 3.5)
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(roomDepth, roomHeight), wallMat);
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    rightWall.rotateY(-Math.PI / 2);
    this.group.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomDepth), wallMat);
    ceiling.position.set(0, roomHeight, 0);
    ceiling.rotateX(Math.PI / 2);
    this.group.add(ceiling);

    // 3. Furniture: Bed with Wax Blanket
    const bedGroup = new THREE.Group();
    bedGroup.position.set(0, 0, -2.5);

    // Wooden bed frame
    const bedFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.4, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.7 })
    );
    bedFrame.position.y = 0.2;
    bedFrame.castShadow = true;
    bedGroup.add(bedFrame);

    // Mattress
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 0.35, 2.3),
      new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 })
    );
    mattress.position.y = 0.55;
    bedGroup.add(mattress);

    // Wax Quilt
    const quilt = new THREE.Mesh(
      new THREE.BoxGeometry(2.12, 0.08, 1.6),
      new THREE.MeshStandardMaterial({
        map: createCustomOutfitTexture('wax', '#E65100'),
        roughness: 0.6,
      })
    );
    quilt.position.set(0, 0.74, 0.3);
    bedGroup.add(quilt);

    // Pillows
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0xFEF08A, roughness: 0.8 });
    const pillowL = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.5), pillowMat);
    pillowL.position.set(-0.55, 0.75, -0.7);
    const pillowR = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.15, 0.5), pillowMat);
    pillowR.position.set(0.55, 0.75, -0.7);
    bedGroup.add(pillowL, pillowR);

    this.group.add(bedGroup);

    // 4. Mirror & Wardrobe (Left side)
    const wardrobeGroup = new THREE.Group();
    wardrobeGroup.position.set(-2.8, 0, -1.8);

    const wardrobeMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 2.6, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x451A03, roughness: 0.6 })
    );
    wardrobeMesh.position.y = 1.3;
    wardrobeMesh.castShadow = true;
    wardrobeGroup.add(wardrobeMesh);

    // Glass Mirror Panel
    const mirrorGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 2.0),
      new THREE.MeshStandardMaterial({
        color: 0xE2E8F0,
        metalness: 0.95,
        roughness: 0.05,
      })
    );
    mirrorGlass.position.set(0.51, 1.4, 0);
    mirrorGlass.rotateY(Math.PI / 2);
    wardrobeGroup.add(mirrorGlass);

    // Mirror Glow Frame
    const mirrorLight = new THREE.PointLight(0xFDE047, 1.5, 4);
    mirrorLight.position.set(0.6, 2.2, 0);
    wardrobeGroup.add(mirrorLight);

    this.group.add(wardrobeGroup);

    // 5. Desk & Laptop (Right side)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(2.7, 0, -1.8);

    const deskTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.1, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.4 })
    );
    deskTop.position.y = 0.8;
    deskGroup.add(deskTop);

    // Laptop
    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.02, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.8, roughness: 0.2 })
    );
    laptopBase.position.set(-0.1, 0.86, 0);
    deskGroup.add(laptopBase);

    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.28, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x0284C7, emissive: 0x0284C7, emissiveIntensity: 0.8 })
    );
    laptopScreen.position.set(-0.1, 1.0, -0.14);
    laptopScreen.rotateX(0.2);
    deskGroup.add(laptopScreen);

    this.group.add(deskGroup);

    // 6. Posters on Wall (Bière Ganvié & Kobo Cash)
    const poster1 = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.9),
      new THREE.MeshBasicMaterial({ map: createGanvieBeerTexture() })
    );
    poster1.position.set(-1.8, 2.0, -3.48);
    this.group.add(poster1);

    const poster2 = new THREE.Mesh(
      new THREE.PlaneGeometry(1.4, 0.9),
      new THREE.MeshBasicMaterial({ map: createKoboCashTexture() })
    );
    poster2.position.set(1.8, 2.0, -3.48);
    this.group.add(poster2);

    // 7. Exit Door (z = 3.4)
    const doorGroup = new THREE.Group();
    doorGroup.position.set(0, 0, 3.48);

    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 2.5, 0.15),
      new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5 })
    );
    doorFrame.position.y = 1.25;
    doorGroup.add(doorFrame);

    const doorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 2.35, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xB45309, roughness: 0.7 })
    );
    doorPanel.position.set(0, 1.2, -0.02);
    doorGroup.add(doorPanel);

    // Door knob
    const knob = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xFDE047, metalness: 0.9, roughness: 0.1 })
    );
    knob.position.set(-0.55, 1.1, -0.08);
    doorGroup.add(knob);

    this.group.add(doorGroup);

    // 8. Ceiling Light
    const roomLight = new THREE.PointLight(0xFFFBEB, 2.2, 12);
    roomLight.position.set(0, 2.9, 0);
    roomLight.castShadow = true;
    this.group.add(roomLight);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
    this.group.add(ambientLight);
  }
}
