/**
 * GTA Cotonou: Vice Littoral - Interactive Economic Engine & Property System
 * Manages player cash, secure MTN MoMo / Moov bank funds, local business buyouts,
 * passive dividend accumulation, legal jobs, high-stakes heists, and fluctuating commodity markets.
 */

export interface BusinessProperty {
  id: string;
  name: string;
  district: string;
  priceFCFA: number;
  incomePerMinFCFA: number;
  description: string;
  worldX: number;
  worldZ: number;
  category: 'kiosk' | 'food' | 'logistics' | 'real_estate';
}

export const COTONOU_PROPERTIES: BusinessProperty[] = [
  {
    id: 'kiosk_sike',
    name: 'Kiosque MoMo Sikè-Fictif',
    district: 'Sikè-Fictif',
    priceFCFA: 150000,
    incomePerMinFCFA: 6000,
    description: 'Point relais Mobile Money très fréquenté par les étudiants et artisans.',
    worldX: -42,
    worldZ: -95,
    category: 'kiosk',
  },
  {
    id: 'maquis_tunde',
    name: 'Maquis Chez Tata Tundé',
    district: 'Sikè / Carrefour',
    priceFCFA: 450000,
    incomePerMinFCFA: 18000,
    description: 'Haut lieu de grillades, bière Ganvié fraîche et musique live le soir.',
    worldX: -65,
    worldZ: -70,
    category: 'food',
  },
  {
    id: 'dantokpa_logistics',
    name: 'Hangar Logistique Dantokpa',
    district: 'Grand Marché Dantokpa',
    priceFCFA: 1200000,
    incomePerMinFCFA: 48000,
    description: 'Entrepôt stratégique de stockage de tissus wax et d’épices au bord de la lagune.',
    worldX: 135,
    worldZ: -75,
    category: 'logistics',
  },
  {
    id: 'villa_fidjrosse',
    name: 'Villa Résidentielle Fidjrossè',
    district: 'Fidjrossè Plage',
    priceFCFA: 2500000,
    incomePerMinFCFA: 95000,
    description: 'Somptueuse villa en front de mer avec paillote privée et revenus locatifs VIP.',
    worldX: -140,
    worldZ: 175,
    category: 'real_estate',
  },
];

export interface EconomicJob {
  id: string;
  title: string;
  employer: string;
  rewardFCFA: number;
  wantedStarsOnStart: number;
  isIllegal: boolean;
  targetDistrict: string;
  targetX: number;
  targetZ: number;
  description: string;
  durationSec: number;
}

export const COTONOU_JOBS: EconomicJob[] = [
  {
    id: 'job_zem_driver',
    title: 'Course Zémidjan Express',
    employer: 'Association des Conducteurs de Sikè',
    rewardFCFA: 15000,
    wantedStarsOnStart: 0,
    isIllegal: false,
    targetDistrict: 'Étoile Rouge',
    targetX: 0,
    targetZ: 0,
    description: 'Transporter un commerçant pressé de Sikè jusqu’au rond-point de l’Étoile Rouge.',
    durationSec: 90,
  },
  {
    id: 'job_dantokpa_delivery',
    title: 'Livraison Urgente de Pagne Wax',
    employer: 'Boutique Maman Célestine',
    rewardFCFA: 35000,
    wantedStarsOnStart: 0,
    isIllegal: false,
    targetDistrict: 'Grand Marché Dantokpa',
    targetX: 145,
    targetZ: -60,
    description: 'Livrer un ballot de wax hollandais de première qualité au quai des pirogues.',
    durationSec: 100,
  },
  {
    id: 'job_beach_refresh',
    title: 'Ravitaillement Paillote Fidjrossè',
    employer: 'Plage Club Cocotier',
    rewardFCFA: 45000,
    wantedStarsOnStart: 0,
    isIllegal: false,
    targetDistrict: 'Fidjrossè Plage',
    targetX: -120,
    targetZ: 180,
    description: 'Acheminer 20 packs de Bière Ganvié fraîche pour la soirée au bord de l’océan.',
    durationSec: 110,
  },
  {
    id: 'heist_ministry_van',
    title: 'Braquage Fourgon Ministère des Finances',
    employer: 'Syndicat de la Lagune',
    rewardFCFA: 300000,
    wantedStarsOnStart: 4,
    isIllegal: true,
    targetDistrict: 'Quartier Administratif (Marina)',
    targetX: 55,
    targetZ: 85,
    description: 'Intercepter le convoi de fonds blindé stationné devant le Ministère des Finances. Risque maximal !',
    durationSec: 140,
  },
  {
    id: 'heist_port_customs',
    title: 'Détournement Conteneur High-Tech',
    employer: 'Réseau Ganhi Ouest',
    rewardFCFA: 180000,
    wantedStarsOnStart: 3,
    isIllegal: true,
    targetDistrict: 'Zone Portuaire / Dantokpa',
    targetX: 160,
    targetZ: -10,
    description: 'Subtiliser un conteneur scellé de smartphones de contrebande sous surveillance policière.',
    durationSec: 120,
  },
];

export interface MarketCommodities {
  fuelPriceFCFA: number; // Base ~ 680 F
  fuelTrendPercent: number; // e.g. +3.2%
  waxIndexFCFA: number; // Base ~ 18 000 F
  waxTrendPercent: number;
  koboCashStockFCFA: number; // Base ~ 250 F
  koboStockTrendPercent: number;
}

export interface PlayerEconomyState {
  cashFCFA: number;
  bankMoMoFCFA: number;
  ownedPropertyIds: string[];
  accumulatedDividendsFCFA: number;
  lastDividendTimestamp: number;
  commodities: MarketCommodities;
}

export function createInitialEconomy(initialCash: number = 50000): PlayerEconomyState {
  return {
    cashFCFA: initialCash,
    bankMoMoFCFA: 150000,
    ownedPropertyIds: [],
    accumulatedDividendsFCFA: 0,
    lastDividendTimestamp: Date.now(),
    commodities: {
      fuelPriceFCFA: 680,
      fuelTrendPercent: 1.5,
      waxIndexFCFA: 18500,
      waxTrendPercent: -0.8,
      koboCashStockFCFA: 245,
      koboStockTrendPercent: 4.2,
    },
  };
}

/**
 * Deposits cash into secure Mobile Money bank account (sheltered from police confiscation)
 */
export function depositToMoMo(
  state: PlayerEconomyState,
  amountFCFA: number
): { success: boolean; state: PlayerEconomyState; message: string } {
  if (amountFCFA <= 0) {
    return { success: false, state, message: 'Montant invalide.' };
  }
  if (state.cashFCFA < amountFCFA) {
    return { success: false, state, message: 'Fonds en espèces insuffisants.' };
  }

  const nextState: PlayerEconomyState = {
    ...state,
    cashFCFA: state.cashFCFA - amountFCFA,
    bankMoMoFCFA: state.bankMoMoFCFA + amountFCFA,
  };
  return {
    success: true,
    state: nextState,
    message: `${amountFCFA.toLocaleString('fr-FR')} FCFA déposés sur votre compte MoMo sécurisé.`,
  };
}

/**
 * Withdraws funds from MoMo bank account to cash in hand
 */
export function withdrawFromMoMo(
  state: PlayerEconomyState,
  amountFCFA: number
): { success: boolean; state: PlayerEconomyState; message: string } {
  if (amountFCFA <= 0) {
    return { success: false, state, message: 'Montant invalide.' };
  }
  if (state.bankMoMoFCFA < amountFCFA) {
    return { success: false, state, message: 'Solde MoMo insuffisant.' };
  }

  const nextState: PlayerEconomyState = {
    ...state,
    cashFCFA: state.cashFCFA + amountFCFA,
    bankMoMoFCFA: state.bankMoMoFCFA - amountFCFA,
  };
  return {
    success: true,
    state: nextState,
    message: `${amountFCFA.toLocaleString('fr-FR')} FCFA retirés en espèces.`,
  };
}

/**
 * Purchases a local business property (can use combination of cash and MoMo)
 */
export function buyBusinessProperty(
  state: PlayerEconomyState,
  propertyId: string
): { success: boolean; state: PlayerEconomyState; message: string } {
  if (state.ownedPropertyIds.includes(propertyId)) {
    return { success: false, state, message: 'Vous possédez déjà ce commerce.' };
  }

  const prop = COTONOU_PROPERTIES.find((p) => p.id === propertyId);
  if (!prop) {
    return { success: false, state, message: 'Commerce introuvable.' };
  }

  const totalFunds = state.cashFCFA + state.bankMoMoFCFA;
  if (totalFunds < prop.priceFCFA) {
    const missing = prop.priceFCFA - totalFunds;
    return {
      success: false,
      state,
      message: `Fonds insuffisants. Il vous manque ${missing.toLocaleString('fr-FR')} FCFA.`,
    };
  }

  // Deduct from cash first, then remainder from MoMo
  let remainingCost = prop.priceFCFA;
  let newCash = state.cashFCFA;
  let newMoMo = state.bankMoMoFCFA;

  if (newCash >= remainingCost) {
    newCash -= remainingCost;
    remainingCost = 0;
  } else {
    remainingCost -= newCash;
    newCash = 0;
    newMoMo -= remainingCost;
    remainingCost = 0;
  }

  const nextState: PlayerEconomyState = {
    ...state,
    cashFCFA: newCash,
    bankMoMoFCFA: newMoMo,
    ownedPropertyIds: [...state.ownedPropertyIds, propertyId],
  };

  return {
    success: true,
    state: nextState,
    message: `Félicitations ! Vous êtes le nouveau propriétaire de ${prop.name} (+${prop.incomePerMinFCFA.toLocaleString('fr-FR')} F/min) !`,
  };
}

/**
 * Calculates and accumulates passive dividends based on owned businesses
 */
export function updatePassiveDividends(
  state: PlayerEconomyState,
  nowTimestamp: number = Date.now()
): PlayerEconomyState {
  if (state.ownedPropertyIds.length === 0) {
    return { ...state, lastDividendTimestamp: nowTimestamp };
  }

  const elapsedMinutes = Math.max(0, (nowTimestamp - state.lastDividendTimestamp) / 60000);
  if (elapsedMinutes <= 0) return state;

  let totalIncomePerMin = 0;
  for (const id of state.ownedPropertyIds) {
    const prop = COTONOU_PROPERTIES.find((p) => p.id === id);
    if (prop) totalIncomePerMin += prop.incomePerMinFCFA;
  }

  const newlyGenerated = Math.round(totalIncomePerMin * elapsedMinutes);

  return {
    ...state,
    accumulatedDividendsFCFA: state.accumulatedDividendsFCFA + newlyGenerated,
    lastDividendTimestamp: nowTimestamp,
  };
}

/**
 * Collects accumulated dividends directly into MoMo bank
 */
export function collectDividends(
  state: PlayerEconomyState
): { state: PlayerEconomyState; collectedAmount: number } {
  const amount = state.accumulatedDividendsFCFA;
  if (amount <= 0) {
    return { state, collectedAmount: 0 };
  }

  const nextState: PlayerEconomyState = {
    ...state,
    bankMoMoFCFA: state.bankMoMoFCFA + amount,
    accumulatedDividendsFCFA: 0,
  };

  return { state: nextState, collectedAmount: amount };
}

/**
 * Fluctuates market commodities (oil, wax, Kobo shares) for interactive economic realism
 */
export function simulateMarketFluctuation(state: PlayerEconomyState): PlayerEconomyState {
  const randomShift = (range: number) => (Math.random() - 0.48) * range;

  const fuelChange = Math.round(randomShift(15));
  const newFuel = Math.min(850, Math.max(590, state.commodities.fuelPriceFCFA + fuelChange));
  const fuelTrend = Math.round((fuelChange / (state.commodities.fuelPriceFCFA || 680)) * 1000) / 10;

  const waxChange = Math.round(randomShift(600));
  const newWax = Math.min(26000, Math.max(14000, state.commodities.waxIndexFCFA + waxChange));
  const waxTrend = Math.round((waxChange / (state.commodities.waxIndexFCFA || 18000)) * 1000) / 10;

  const koboChange = Math.round(randomShift(12));
  const newKobo = Math.min(420, Math.max(120, state.commodities.koboCashStockFCFA + koboChange));
  const koboTrend = Math.round((koboChange / (state.commodities.koboCashStockFCFA || 240)) * 1000) / 10;

  return {
    ...state,
    commodities: {
      fuelPriceFCFA: newFuel,
      fuelTrendPercent: fuelTrend,
      waxIndexFCFA: newWax,
      waxTrendPercent: waxTrend,
      koboCashStockFCFA: newKobo,
      koboStockTrendPercent: koboTrend,
    },
  };
}

/**
 * Police confiscation penalty on arrest (loses 40% of cash on hand; MoMo bank is 100% protected)
 */
export function applyArrestConfiscation(state: PlayerEconomyState): {
  state: PlayerEconomyState;
  lostCash: number;
} {
  const lostCash = Math.round(state.cashFCFA * 0.4);
  const nextState: PlayerEconomyState = {
    ...state,
    cashFCFA: Math.max(0, state.cashFCFA - lostCash),
  };
  return { state: nextState, lostCash };
}
