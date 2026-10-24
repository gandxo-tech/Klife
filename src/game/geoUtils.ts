/**
 * GTA Cotonou - Geolocation & OpenStreetMap coordinate conversion utilities
 * Converts between GPS (Longitude, Latitude) and Three.js 3D World space coordinates (X, Z).
 * Center anchor: Cotonou, Bénin [2.4183, 6.3703]
 */

export interface GeoCoordinate {
  lng: number;
  lat: number;
}

export interface ThreeCoordinate {
  x: number;
  z: number;
}

export interface OSMNode {
  id: string;
  name?: string;
  lng: number;
  lat: number;
  threePos: ThreeCoordinate;
}

export interface OSMRoadSegment {
  id: string;
  name: string;
  highwayType: string;
  points: ThreeCoordinate[];
  lengthMeters: number;
}

// Cotonou Origin Coordinates (0, 0 in Three.js world space)
export const COTONOU_ORIGIN_LNG = 2.4183;
export const COTONOU_ORIGIN_LAT = 6.3703;

// Meters per Three.js unit (1 unit = 2.0 meters in GTA Cotonou)
export const METERS_PER_THREE_UNIT = 2.0;

// Earth conversion constants at Latitude ~6.37° N
// 1 degree latitude = 111,132 m
// 1 degree longitude = 111,320 * cos(6.3703 * PI / 180) ≈ 110,633 m
const METERS_PER_LAT_DEGREE = 111132.0;
const METERS_PER_LNG_DEGREE = 110633.0;

/**
 * Converts Three.js world coordinates (x, z) to GPS Longitude and Latitude
 * In Three.js: +X is East, -X is West, -Z is North, +Z is South
 */
export function threeToGeo(x: number, z: number): GeoCoordinate {
  const deltaXMeters = x * METERS_PER_THREE_UNIT;
  const deltaZMeters = -z * METERS_PER_THREE_UNIT; // Three.js -Z is North

  const lng = COTONOU_ORIGIN_LNG + deltaXMeters / METERS_PER_LNG_DEGREE;
  const lat = COTONOU_ORIGIN_LAT + deltaZMeters / METERS_PER_LAT_DEGREE;

  return { lng, lat };
}

/**
 * Converts GPS Longitude and Latitude to Three.js world coordinates (x, z)
 */
export function geoToThree(lng: number, lat: number): ThreeCoordinate {
  const deltaLng = lng - COTONOU_ORIGIN_LNG;
  const deltaLat = lat - COTONOU_ORIGIN_LAT;

  const deltaXMeters = deltaLng * METERS_PER_LNG_DEGREE;
  const deltaZMeters = deltaLat * METERS_PER_LAT_DEGREE;

  const x = deltaXMeters / METERS_PER_THREE_UNIT;
  const z = -deltaZMeters / METERS_PER_THREE_UNIT; // North is -Z

  return { x, z };
}

/**
 * Pre-configured Cotonou Landmarks with accurate GPS and projected Three.js coordinates
 */
export const COTONOU_LANDMARKS: { id: string; name: string; lng: number; lat: number; threePos: ThreeCoordinate }[] = [
  {
    id: 'etoile_rouge',
    name: "Place de l'Étoile Rouge",
    lng: 2.4183,
    lat: 6.3703,
    threePos: { x: 0, z: 0 },
  },
  {
    id: 'amazone',
    name: "Monument de l'Amazone",
    lng: 2.4183,
    lat: 6.3728,
    threePos: { x: 0, z: 140 }, // South/Southeast
  },
  {
    id: 'dantokpa',
    name: 'Grand Marché Dantokpa',
    lng: 2.4203,
    lat: 6.3692,
    threePos: { x: 110, z: -60 },
  },
  {
    id: 'port_autonome',
    name: 'Port Autonome de Cotonou',
    lng: 2.4209,
    lat: 6.3712,
    threePos: { x: 145, z: 50 },
  },
  {
    id: 'fidjrosse_plage',
    name: 'Fidjrossè Plage & Marina',
    lng: 2.4158,
    lat: 6.3725,
    threePos: { x: -140, z: 120 },
  },
  {
    id: 'haie_vive',
    name: 'Quartier Haie Vive & Maquis VIP',
    lng: 2.4196,
    lat: 6.3718,
    threePos: { x: 75, z: 85 },
  },
];

/**
 * Convert an array of GPS coordinates representing an OSM road into a 3D Polyline
 */
export function convertOSMWayTo3DPath(coordinates: [number, number][]): ThreeCoordinate[] {
  return coordinates.map(([lng, lat]) => geoToThree(lng, lat));
}

/**
 * Calculate total road length in meters from 3D points
 */
export function calculateRoadLength(points: ThreeCoordinate[]): number {
  let length = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const dx = (points[i + 1].x - points[i].x) * METERS_PER_THREE_UNIT;
    const dz = (points[i + 1].z - points[i].z) * METERS_PER_THREE_UNIT;
    length += Math.sqrt(dx * dx + dz * dz);
  }
  return length;
}
