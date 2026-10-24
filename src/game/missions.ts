/**
 * GTA Cotonou: Missions and Objectives
 */

import { Mission } from './types.ts';

export const MISSIONS: Mission[] = [
  {
    id: 'mission_1',
    title: 'Le Premier Zémidjan',
    bossName: 'Séverin Tokpa',
    locationName: 'Carrefour Vêdoko',
    description: 'Enfourche un Zémidjan jaune, récupère le sac de Wax précieux au Grand Marché Dantokpa et livre-le à Akpakpa avant la fin du compte à rebours !',
    audioPrompt: 'Eh mon petit ! C’est Séverin. Prends la moto Zémidjan, file à toute vitesse à Dantokpa chercher le Wax et amène-le à Akpakpa sans traîner !',
    rewardFCFA: 250000,
    timeLimitSec: 100,
    stages: [
      {
        instruction: 'Monte sur un Zémidjan (Touche E ou F près d’une moto)',
        targetX: 10,
        targetZ: 15,
        targetRadius: 18,
        requiresVehicleType: 'zemidjan',
      },
      {
        instruction: 'Fonce au Grand Marché Dantokpa pour charger la marchandise',
        targetX: 110,
        targetZ: -60,
        targetRadius: 16,
      },
      {
        instruction: 'Livre le colis au dépôt secret d’Akpakpa !',
        targetX: -120,
        targetZ: -100,
        targetRadius: 18,
      },
    ],
  },
  {
    id: 'mission_2',
    title: 'L’Amazone Mécanique',
    bossName: 'Madame Da Silva',
    locationName: 'Haie Vive',
    description: 'La Police Républicaine surveille l’Esplanade de l’Amazone. Dérobe le bolide 4x4 diplomatique noir et fonce sur le Boulevard de la Marina jusqu’à Fidjrossè Plage !',
    audioPrompt: 'Ici Madame Da Silva. Un SUV diplomatique de grande valeur est garé devant le Monument de l’Amazone. Récupère-le et ramène-le à Fidjrossè Plage avant qu’on ne te bloque !',
    rewardFCFA: 600000,
    timeLimitSec: 120,
    stages: [
      {
        instruction: 'Rends-toi devant le Monument majestueux de l’Amazone',
        targetX: 0,
        targetZ: 140,
        targetRadius: 20,
      },
      {
        instruction: 'Vole le SUV 4x4 noir garé sur l’Esplanade',
        targetX: 8,
        targetZ: 150,
        targetRadius: 15,
        requiresVehicleType: 'gwagon',
        spawnPoliceStars: 2,
      },
      {
        instruction: 'Sème les patrouilles et livre le bolide à Fidjrossè Plage !',
        targetX: -140,
        targetZ: 120,
        targetRadius: 22,
      },
    ],
  },
  {
    id: 'mission_3',
    title: 'Braquage du Maquis VIP',
    bossName: 'Koffi le Bandit',
    locationName: 'Jonquet',
    description: 'Le Maquis VIP brasse les recettes illégales du quartier. Fonce dans l’enceinte, empare-toi de la caisse et échappe aux barrages de police !',
    audioPrompt: 'Frangin, c’est Koffi ! Le patron du Maquis VIP a caché les liasses dans sa cour. Défonce la barrière, prends les FCFA et sème la brigade !',
    rewardFCFA: 1500000,
    timeLimitSec: 130,
    stages: [
      {
        instruction: 'Trouve un véhicule rapide et rejoins le Maquis VIP à Haie Vive',
        targetX: 75,
        targetZ: 85,
        targetRadius: 18,
      },
      {
        instruction: 'Défonce la barrière et empare-toi du magot au Maquis VIP !',
        targetX: 85,
        targetZ: 95,
        targetRadius: 12,
        spawnPoliceStars: 3,
      },
      {
        instruction: 'Sème la Police Républicaine (3 étoiles) et rejoins la planque à Ganhi',
        targetX: -70,
        targetZ: -20,
        targetRadius: 18,
      },
    ],
  },
  {
    id: 'mission_4',
    title: 'Rodéo à l’Étoile Rouge',
    bossName: 'Titi Nitro',
    locationName: 'Rond-Point Étoile Rouge',
    description: 'Le carrefour le plus mythique de Cotonou devient une arène ! Fais 3 tours complets à haute vitesse en franchissant les checkpoints sans détruire ton taxi !',
    audioPrompt: 'Bienvenue au grand rond-point de l’Étoile Rouge ! Montre à tout Cotonou qui est le vrai roi du bitume. Passe chaque borne sans te crasher !',
    rewardFCFA: 800000,
    timeLimitSec: 90,
    stages: [
      {
        instruction: 'Rejoins la ligne de départ à la Place de l’Étoile Rouge',
        targetX: 0,
        targetZ: 0,
        targetRadius: 22,
      },
      {
        instruction: 'Franchis le checkpoint Nord (Avenue Steinmetz)',
        targetX: 0,
        targetZ: -45,
        targetRadius: 18,
      },
      {
        instruction: 'Franchis le checkpoint Est (Boulevard Saint-Michel)',
        targetX: 45,
        targetZ: 0,
        targetRadius: 18,
      },
      {
        instruction: 'Franchis le checkpoint Sud (Avenue Jean-Paul II)',
        targetX: 0,
        targetZ: 45,
        targetRadius: 18,
      },
      {
        instruction: 'Passe la ligne d’arrivée sous le monument de l’Étoile Rouge !',
        targetX: -45,
        targetZ: 0,
        targetRadius: 20,
      },
    ],
  },
  {
    id: 'mission_5',
    title: 'Le Grand Coup du Port Autonome',
    bossName: 'Le Parrain de Ganhi',
    locationName: 'Port Autonome de Cotonou',
    description: 'Le cargo accoste avec les lingots. Infiltre les quais de déchargement, charge le fourgon blindé et repousse les forces spéciales jusqu’au pont !',
    audioPrompt: 'C’est le coup du siècle ! Tout le Port de Cotonou est en état d’alerte. Récupère le chargement d’or et traverse le grand pont jusqu’à la frontière !',
    rewardFCFA: 5000000,
    timeLimitSec: 160,
    stages: [
      {
        instruction: 'Infiltre le quai Nord du Port Autonome de Cotonou',
        targetX: 130,
        targetZ: 40,
        targetRadius: 20,
      },
      {
        instruction: 'Récupère le container d’or au milieu des grues portuaires',
        targetX: 155,
        targetZ: 60,
        targetRadius: 15,
        spawnPoliceStars: 4,
      },
      {
        instruction: 'Traverse le Pont Martin Luther King sous haute surveillance !',
        targetX: -40,
        targetZ: -140,
        targetRadius: 24,
      },
      {
        instruction: 'Livre le butin au QG secret d’Abomey-Calavi ! Tu es le Roi de Cotonou !',
        targetX: -150,
        targetZ: -160,
        targetRadius: 25,
      },
    ],
  },
];

export const RADIO_STATIONS = [
  { id: 'tokpa', name: 'Radio Tokpa 104.3 FM', freq: '104.3 FM', genre: 'Afrobeat & Coupé Décalé' },
  { id: 'cotonou_vibe', name: 'Cotonou Vibe FM', freq: '98.5 FM', genre: 'Amapiano & Rap Béninois' },
  { id: 'culture_benin', name: 'Radio Bénin Culture', freq: '92.1 FM', genre: 'Traditionnel Agbadja & Salsa' },
  { id: 'police_scanner', name: 'Ondes Police Républicaine', freq: 'FREQ 117', genre: 'Interventions Cotonou Centre' },
];
