/**
 * GTA Cotonou: Garage System & Vehicle Customization Options
 */

import { GarageLocation, VehicleCustomization } from './types.ts';

export const GARAGE_LOCATIONS: GarageLocation[] = [
  {
    id: 'garage_sike',
    name: 'Garage Auto Sikè',
    district: 'Sikè-Fictif',
    x: -40,
    z: -80,
    radius: 7.0,
    description: 'Garage principal du quartier Sikè. Spécialiste mécanique Zémidjan & Taxis.',
  },
  {
    id: 'garage_dantokpa',
    name: 'Garage Express Dantokpa',
    district: 'Grand Marché Dantokpa',
    x: 75,
    z: -30,
    radius: 7.0,
    description: 'Garage rapide au cœur du marché. Pièces détachées d’origine et tuning express.',
  },
  {
    id: 'garage_fidjrosse',
    name: 'Garage Prestige Fidjrossè',
    district: 'Fidjrossè Plage',
    x: -110,
    z: 60,
    radius: 7.0,
    description: 'Atelier haut de gamme en bord de mer. Préparation moteurs lourds et néons VIP.',
  },
];

export const PAINT_PRESETS = [
  { name: 'Jaune Zémidjan', hex: '#FDD835', price: 0 },
  { name: 'Jaune MoMo MTN', hex: '#FFCC00', price: 15000 },
  { name: 'Vert Ganvié', hex: '#2E7D32', price: 20000 },
  { name: 'Rouge Cotonou', hex: '#D32F2F', price: 25000 },
  { name: 'Or Sikè VIP', hex: '#FFB300', price: 40000 },
  { name: 'Bleu Atlantique', hex: '#0288D1', price: 30000 },
  { name: 'Noir Ébène Mat', hex: '#212121', price: 50000 },
  { name: 'Blanc Ivoire', hex: '#FAFAFA', price: 20000 },
  { name: 'Orange DahoFuel', hex: '#E65100', price: 35000 },
];

export const ENGINE_UPGRADES = [
  { level: 0, label: 'Moteur d’Origine (Stock)', boost: '+0%', price: 0 },
  { level: 1, label: 'Stage 1 - Kit Carburateur DahoFuel', boost: '+15% Vitesse', price: 35000 },
  { level: 2, label: 'Stage 2 - Injecteurs Sport & Pot Libre', boost: '+30% Vitesse', price: 85000 },
  { level: 3, label: 'Stage 3 - Turbo Compresseur Cotonou', boost: '+50% Vitesse', price: 180000 },
];

export const ARMOR_UPGRADES = [
  { level: 0, label: 'Série Standard', boost: '100% Santé', price: 0 },
  { level: 1, label: 'Renfort Pare-Chocs Acier', boost: '125% Santé', price: 25000 },
  { level: 2, label: 'Plaques Blindées Jonquet', boost: '150% Santé', price: 60000 },
  { level: 3, label: 'Blindage Lourd Police Républicaine', boost: '200% Santé', price: 140000 },
];

export const NEON_COLORS = [
  { name: 'Aucun Néon', hex: null, price: 0 },
  { name: 'Néon Vert Ganvié', hex: '#00FF66', price: 45000 },
  { name: 'Néon Bleu Fidjrossè', hex: '#00CCFF', price: 45000 },
  { name: 'Néon Rouge Étoile', hex: '#FF0055', price: 45000 },
  { name: 'Néon Jaune Kobo', hex: '#FFEB3B', price: 45000 },
  { name: 'Néon Violet Maquis', hex: '#D500F9', price: 55000 },
];

export function createDefaultCustomization(vehicleType: string, colorHex?: string): VehicleCustomization {
  const plateNum = Math.floor(1000 + Math.random() * 9000);
  return {
    colorHex: colorHex || '#FDD835',
    engineLevel: 0,
    armorLevel: 0,
    neonColorHex: null,
    licensePlate: `RB-${plateNum}-CT`,
  };
}
