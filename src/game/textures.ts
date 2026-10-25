/**
 * GTA Cotonou: Vice Littoral - Canvas PNG Texture Generator
 * Provides high-fidelity procedural PNG textures for authentic fictional Benin brands,
 * currency notes, billboards, license plates, and character badges.
 */

import * as THREE from 'three';

/**
 * 1. Fictional Brand Billboards & Signs
 */

// Kobo Cash - Transfert d'argent Mobile Money
export function createKoboCashTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Background gradient: Emerald green to Gold
  const grad = ctx.createLinearGradient(0, 0, 512, 256);
  grad.addColorStop(0, '#064E3B');
  grad.addColorStop(0.5, '#047857');
  grad.addColorStop(1, '#F59E0B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Border frame
  ctx.strokeStyle = '#FDE047';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 500, 244);

  // Logo icon: Money coin & phone wave
  ctx.fillStyle = '#FDE047';
  ctx.beginPath();
  ctx.arc(80, 128, 48, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#064E3B';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('K', 80, 128);

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'black 48px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('KOBO CASH', 150, 100);

  ctx.fillStyle = '#FDE047';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('Transfert & Mobile Money · 0% Frais', 150, 150);

  ctx.fillStyle = '#ECFDF5';
  ctx.font = 'italic 20px sans-serif';
  ctx.fillText('Agences à Sikè, Dantokpa & Akpakpa', 150, 190);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// BeninTel Mobile - Réseau 4G/5G
export function createBeninTelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Deep Navy to Cyan
  const grad = ctx.createLinearGradient(0, 0, 512, 256);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(1, '#0284C7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  // Signal waves pattern
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 6;
  for (let r = 30; r <= 90; r += 20) {
    ctx.beginPath();
    ctx.arc(80, 128, r, -Math.PI / 3, Math.PI / 3);
    ctx.stroke();
  }

  // Text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'extrabold 52px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('BENINTEL', 160, 105);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('4G+ Illimité Bénin', 160, 155);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '20px sans-serif';
  ctx.fillText('Le réseau numéro 1 à Cotonou', 160, 195);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Bière Ganvié - Brasserie de la Lagune
export function createGanvieBeerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Amber Golden Malt
  ctx.fillStyle = '#78350F';
  ctx.fillRect(0, 0, 512, 256);

  const grad = ctx.createRadialGradient(256, 128, 20, 256, 128, 240);
  grad.addColorStop(0, '#F59E0B');
  grad.addColorStop(1, '#B45309');
  ctx.fillStyle = grad;
  ctx.fillRect(12, 12, 488, 232);

  // Gold seal
  ctx.strokeStyle = '#FEF08A';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 472, 216);

  ctx.fillStyle = '#FEF08A';
  ctx.font = 'extrabold 54px serif';
  ctx.textAlign = 'center';
  ctx.fillText('BIÈRE GANVIÉ', 256, 100);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('La Fraîcheur Pure de la Lagune', 256, 150);

  ctx.fillStyle = '#FEF08A';
  ctx.font = 'italic 20px serif';
  ctx.fillText('100% Malt Béninois · 650 ml', 256, 195);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// DahoFuel - Carburant & Essence
export function createDahoFuelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#DC2626'; // Vibrant Red
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#111827';
  ctx.fillRect(0, 160, 512, 96);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'extrabold 56px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('DAHOFUEL', 256, 95);

  ctx.fillStyle = '#FACC15';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('Essence · Gasoil · Kérosène', 256, 210);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Chez Tata Tundé - Maquis & Grillades
export function createTataTundeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#9A3412'; // Rust Red/Brown
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#FDBA74';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, 492, 236);

  ctx.fillStyle = '#FED7AA';
  ctx.font = 'bold 46px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('MAQUIS TATA TUNDÉ', 256, 85);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '24px sans-serif';
  ctx.fillText('Poisson Braisé · Poulet Bicyclette · Akassa', 256, 145);

  ctx.fillStyle = '#FDBA74';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Ambiance Live & Bière Fraîche à Sikè', 256, 195);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Supermarché Nokoué
export function createNokoueSupermarketTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0284C7'; // Blue
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'extrabold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('SUPERMARCHÉ NOKOUÉ', 256, 90);

  ctx.fillStyle = '#BAE6FD';
  ctx.font = 'bold 24px sans-serif';
  ctx.fillText('Alimentation · Cosmétiques · Produits Locaux', 256, 150);

  ctx.fillStyle = '#FACC15';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('Ouvert 7j/7 de 8h à 22h · Cotonou Centre', 256, 195);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 2. FCFA Banknote Texture (10 000 FCFA & 5 000 FCFA Stack)
 */
export function createFCFABanknoteTexture(amount: number = 10000): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // BCEAO Blue/Purple for 10,000 FCFA or Green for 5,000 FCFA
  const is10k = amount === 10000;
  ctx.fillStyle = is10k ? '#1E1B4B' : '#064E3B';
  ctx.fillRect(0, 0, 256, 128);

  ctx.strokeStyle = is10k ? '#818CF8' : '#34D399';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 244, 116);

  // Decorative watermark circle
  ctx.strokeStyle = is10k ? '#C7D2FE' : '#A7F3D0';
  ctx.beginPath();
  ctx.arc(60, 64, 35, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BANQUE CENTRALE - BCEAO', 128, 26);

  ctx.fillStyle = is10k ? '#FDE047' : '#FEF08A';
  ctx.font = 'extrabold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${amount.toLocaleString('fr-FR')} FCFA`, 140, 72);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '10px monospace';
  ctx.fillText('BÉNIN · COTONOU', 140, 102);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 3. License Plate Textures
 */
export function createBeninLicensePlateTexture(text: string = '2B 9876 RB'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 256, 64);

  // Blue strip on left
  ctx.fillStyle = '#0284C7';
  ctx.fillRect(0, 0, 36, 64);

  // BJ country code
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 16px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BJ', 18, 40);

  // Black border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 252, 60);

  // Plate text
  ctx.fillStyle = '#000000';
  ctx.font = 'black 28px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, 146, 42);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 4. Character Outfit Textures (Wax, Streetwear, Swag, Chic)
 */
export function createCustomOutfitTexture(
  style: 'wax' | 'streetwear' | 'swag' | 'chic',
  baseColorHex: string = '#E65100'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 256, 256);

  if (style === 'wax') {
    // African Wax Print (Floral Circles & Geometric Motifs)
    ctx.fillStyle = '#FDD835'; // Gold accent
    for (let x = 32; x < 256; x += 64) {
      for (let y = 32; y < 256; y += 64) {
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1A237E'; // Navy center
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#B71C1C';
        ctx.fillRect(x - 3, y - 3, 6, 6);
        ctx.fillStyle = '#FDD835';
      }
    }
  } else if (style === 'streetwear') {
    // Camo / Graffiti lines
    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('COTONOU', 20, 80);
    ctx.fillText('VICE 229', 100, 160);

    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(10, 110);
    ctx.lineTo(240, 110);
    ctx.stroke();
  } else if (style === 'swag') {
    // Diamond lattice pattern
    ctx.strokeStyle = '#E0E7FF';
    ctx.lineWidth = 4;
    for (let i = -256; i < 512; i += 32) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 256, 256);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i, 256);
      ctx.lineTo(i + 256, 0);
      ctx.stroke();
    }
  } else if (style === 'chic') {
    // Elegant silk subtle pinstripes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    for (let x = 16; x < 256; x += 16) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 256);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

/**
 * 6. Procedural Textures for Architecture & Interior
 */

// Tropical Plaster / Stucco Texture with sand grain and weathered patina
export function createTropicalStuccoTexture(baseColor: string = '#E2E8F0'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, 512, 512);

  // Micro-sand grain noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 28;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Weathering and rain wash subtle streaks
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  for (let s = 0; s < 40; s++) {
    const sx = Math.random() * 512;
    const sw = 4 + Math.random() * 12;
    const sh = 60 + Math.random() * 180;
    ctx.fillRect(sx, 0, sw, sh);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// Corrugated galvanized iron sheet roof (Tôles ondulées)
export function createCorrugatedRoofTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Base zinc metallic grey
  ctx.fillStyle = '#64748B';
  ctx.fillRect(0, 0, 256, 256);

  // Corrugation ridges (horizontal fluting with light and shadow)
  for (let y = 0; y < 256; y += 16) {
    // Crest (bright highlight)
    const ridgeGrad = ctx.createLinearGradient(0, y, 0, y + 16);
    ridgeGrad.addColorStop(0, '#94A3B8');
    ridgeGrad.addColorStop(0.3, '#E2E8F0');
    ridgeGrad.addColorStop(0.7, '#475569');
    ridgeGrad.addColorStop(1, '#334155');
    ctx.fillStyle = ridgeGrad;
    ctx.fillRect(0, y, 256, 16);

    // Weathered rust speckles
    if (Math.random() > 0.4) {
      ctx.fillStyle = 'rgba(180, 83, 9, 0.35)';
      ctx.fillRect(Math.random() * 200, y + 2, 20 + Math.random() * 30, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// Naco Louvre Window (Jalousies en verre et montants aluminium)
export function createLouvreWindowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Outer aluminium frame
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, 246, 246);

  // Vertical central divider
  ctx.fillStyle = '#64748B';
  ctx.fillRect(123, 5, 10, 246);

  // Horizontal glass louvers (lames Naco)
  const bladeHeight = 18;
  for (let y = 14; y < 240; y += bladeHeight + 4) {
    // Left pane
    const glassGradL = ctx.createLinearGradient(15, y, 118, y + bladeHeight);
    glassGradL.addColorStop(0, '#0F172A');
    glassGradL.addColorStop(0.5, '#38BDF8');
    glassGradL.addColorStop(1, '#0284C7');
    ctx.fillStyle = glassGradL;
    ctx.fillRect(15, y, 103, bladeHeight);

    // Right pane
    const glassGradR = ctx.createLinearGradient(138, y, 241, y + bladeHeight);
    glassGradR.addColorStop(0, '#0F172A');
    glassGradR.addColorStop(0.5, '#7DD3FC');
    glassGradR.addColorStop(1, '#0369A1');
    ctx.fillStyle = glassGradR;
    ctx.fillRect(138, y, 103, bladeHeight);

    // Glass blade highlight line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(15, y + 2);
    ctx.lineTo(118, y + 2);
    ctx.moveTo(138, y + 2);
    ctx.lineTo(241, y + 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Terracotta Ceramic Floor Tile Texture with dark grout lines
export function createTerracottaTileFloorTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Dark grout background
  ctx.fillStyle = '#292524';
  ctx.fillRect(0, 0, 512, 512);

  const tileSize = 120;
  const gap = 8;
  const rows = 4;
  const cols = 4;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = gap / 2 + c * (tileSize + gap);
      const y = gap / 2 + r * (tileSize + gap);

      // Tile gradient with subtle baked clay variance
      const grad = ctx.createRadialGradient(x + 60, y + 60, 10, x + 60, y + 60, 80);
      const toneVariation = (Math.random() - 0.5) * 20;
      const red = Math.round(180 + toneVariation);
      const green = Math.round(83 + toneVariation * 0.5);
      grad.addColorStop(0, `rgb(${red + 25}, ${green + 15}, 30)`);
      grad.addColorStop(1, `rgb(${red}, ${green}, 15)`);
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, tileSize, tileSize);

      // Tile bevel edge highlight
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

// Outdoor Split AC Compressor Unit Texture
export function createACUnitTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Enamel white casing
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 252, 124);

  // Circular fan grille on left
  ctx.fillStyle = '#0F172A';
  ctx.beginPath();
  ctx.arc(64, 64, 46, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 2;
  for (let r = 12; r <= 42; r += 8) {
    ctx.beginPath();
    ctx.arc(64, 64, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  // Fan hub
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.arc(64, 64, 10, 0, Math.PI * 2);
  ctx.fill();

  // Air vent cooling slits on right
  ctx.fillStyle = '#334155';
  for (let y = 24; y < 104; y += 8) {
    ctx.fillRect(130, y, 106, 4);
  }

  // Brand Badge
  ctx.fillStyle = '#0284C7';
  ctx.font = 'bold 13px sans-serif';
  ctx.fillText('AURA COOL', 130, 18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Striped Fabric Awning Texture
export function createStripedAwningTexture(c1: string = '#DC2626', c2: string = '#FEF08A'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  const stripeW = 32;
  for (let x = 0; x < 256; x += stripeW * 2) {
    ctx.fillStyle = c1;
    ctx.fillRect(x, 0, stripeW, 64);
    ctx.fillStyle = c2;
    ctx.fillRect(x + stripeW, 0, stripeW, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

// Laptop Screen HUD Texture
export function createLaptopScreenTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Dark terminal/desktop background
  ctx.fillStyle = '#090D16';
  ctx.fillRect(0, 0, 256, 160);

  // Top header bar
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, 256, 18);
  ctx.fillStyle = '#10B981';
  ctx.beginPath();
  ctx.arc(10, 9, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#94A3B8';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('TERMINAL // COTONOU-NET 4G', 22, 13);

  // Code lines & GPS map wireframe
  ctx.fillStyle = '#38BDF8';
  ctx.font = '9px monospace';
  ctx.fillText('> SYSTEM: ACTIVE', 12, 38);
  ctx.fillText('> GPS: LITTORAL 6.367°N, 2.425°E', 12, 52);

  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 1;
  ctx.strokeRect(12, 62, 120, 80);
  ctx.fillStyle = 'rgba(2, 132, 199, 0.2)';
  ctx.fillRect(12, 62, 120, 80);

  // Mini grid map
  ctx.strokeStyle = '#38BDF8';
  ctx.beginPath();
  ctx.moveTo(30, 62); ctx.lineTo(30, 142);
  ctx.moveTo(70, 62); ctx.lineTo(70, 142);
  ctx.moveTo(110, 62); ctx.lineTo(110, 142);
  ctx.moveTo(12, 90); ctx.lineTo(132, 90);
  ctx.moveTo(12, 120); ctx.lineTo(132, 120);
  ctx.stroke();

  // Status stats
  ctx.fillStyle = '#FBBF24';
  ctx.fillText('MISSIONS: 8 DISPO', 142, 80);
  ctx.fillStyle = '#34D399';
  ctx.fillText('SIGNAL: 100%', 142, 100);
  ctx.fillStyle = '#F87171';
  ctx.fillText('POLICE: 0★', 142, 120);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
