import test from 'node:test';
import assert from 'node:assert/strict';
import {
  threeToGeo,
  geoToThree,
  COTONOU_ORIGIN_LNG,
  COTONOU_ORIGIN_LAT,
  convertOSMWayTo3DPath,
  calculateRoadLength,
} from './geoUtils.ts';

test('Origin Three.js (0, 0) maps exactly to Cotonou center', () => {
  const geo = threeToGeo(0, 0);
  assert.ok(Math.abs(geo.lng - COTONOU_ORIGIN_LNG) < 0.00001);
  assert.ok(Math.abs(geo.lat - COTONOU_ORIGIN_LAT) < 0.00001);

  const three = geoToThree(COTONOU_ORIGIN_LNG, COTONOU_ORIGIN_LAT);
  assert.ok(Math.abs(three.x) < 0.001);
  assert.ok(Math.abs(three.z) < 0.001);
});

test('Bidirectional round-trip conversion preserves coordinates', () => {
  const originalX = 45.5;
  const originalZ = -82.3;

  const geo = threeToGeo(originalX, originalZ);
  const back = geoToThree(geo.lng, geo.lat);

  assert.ok(Math.abs(back.x - originalX) < 0.001);
  assert.ok(Math.abs(back.z - originalZ) < 0.001);
});

test('convertOSMWayTo3DPath correctly transforms coordinates', () => {
  const coords: [number, number][] = [
    [COTONOU_ORIGIN_LNG, COTONOU_ORIGIN_LAT],
    [COTONOU_ORIGIN_LNG + 0.001, COTONOU_ORIGIN_LAT + 0.001],
  ];

  const path = convertOSMWayTo3DPath(coords);
  assert.equal(path.length, 2);
  assert.ok(Math.abs(path[0].x) < 0.001);
  assert.ok(Math.abs(path[0].z) < 0.001);
  assert.ok(path[1].x > 0);
  assert.ok(path[1].z < 0); // North in Three.js is -Z
});

test('calculateRoadLength computes metric distance accurately', () => {
  const points = [
    { x: 0, z: 0 },
    { x: 10, z: 0 }, // 10 units * 2.0 meters/unit = 20 meters
  ];
  const length = calculateRoadLength(points);
  assert.equal(Math.round(length), 20);
});
