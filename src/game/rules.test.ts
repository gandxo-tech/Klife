import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatFCFA,
  calculateDistance,
  checkStageCompletion,
  updateWantedState,
  applyCrimeWanted,
  worldToMinimapCoords,
  stepVehiclePhysics,
  VEHICLE_CONFIGS,
} from './rules.ts';
import { COTONOU_TRAFFIC_PATHS } from './trafficSystem.ts';

test('formatFCFA properly groups thousands with spaces', () => {
  assert.equal(formatFCFA(1500000), '1 500 000 FCFA');
  assert.equal(formatFCFA(25000), '25 000 FCFA');
  assert.equal(formatFCFA(0), '0 FCFA');
  assert.equal(formatFCFA(-100), '0 FCFA');
});

test('calculateDistance computes Euclidean distance accurately', () => {
  assert.equal(calculateDistance(0, 0, 3, 4), 5);
  assert.equal(calculateDistance(10, 20, 10, 20), 0);
});

test('checkStageCompletion checks radius and vehicle requirements', () => {
  // Within radius without vehicle requirement
  assert.equal(checkStageCompletion(10, 10, 12, 11, 5, null), true);
  // Outside radius
  assert.equal(checkStageCompletion(10, 10, 50, 50, 5, null), false);
  // Within radius but wrong vehicle
  assert.equal(checkStageCompletion(10, 10, 10, 10, 5, 'taxi505', 'zemidjan'), false);
  // Within radius with correct vehicle
  assert.equal(checkStageCompletion(10, 10, 10, 10, 5, 'zemidjan', 'zemidjan'), true);
});

test('applyCrimeWanted increments stars up to cap 5', () => {
  const result1 = applyCrimeWanted(0, 2);
  assert.equal(result1.stars, 2);
  assert.ok(result1.progress > 0);

  const result2 = applyCrimeWanted(4, 2);
  assert.equal(result2.stars, 5);
});

test('updateWantedState handles cooldown decay when hiding', () => {
  // When chasing, stars do not drop
  const chasing = updateWantedState(2, 20, true, 1.0);
  assert.equal(chasing.stars, 2);

  // When hiding, timer decays and star drops when <= 0
  const decayed = updateWantedState(1, 2, false, 1.0);
  assert.equal(decayed.stars, 0);
});

test('worldToMinimapCoords translates world coords into radar space', () => {
  const radar = worldToMinimapCoords(0, 50, 0, 0, 0, 100, 160);
  assert.ok(radar.x >= 0 && radar.x <= 160);
  assert.ok(radar.y >= 0 && radar.y <= 160);
  assert.equal(radar.inBounds, true);
});

test('stepVehiclePhysics accelerates and limits maxSpeed', () => {
  const config = VEHICLE_CONFIGS.zemidjan;
  const initial = stepVehiclePhysics(0, 0, 1.0, 0, config, 0.1);
  assert.ok(initial.speed > 0);
  assert.ok(initial.deltaZ > 0);

  // Exceeding max speed clamped
  const maxed = stepVehiclePhysics(config.maxSpeed + 10, 0, 1.0, 0, config, 0.1);
  assert.equal(maxed.speed, config.maxSpeed);
});

test('COTONOU_TRAFFIC_PATHS contains valid waypoint loops', () => {
  assert.ok(COTONOU_TRAFFIC_PATHS.length >= 4);
  COTONOU_TRAFFIC_PATHS.forEach((path: any) => {
    assert.ok(path.length >= 3);
    path.forEach((wp: any) => {
      assert.equal(typeof wp.x, 'number');
      assert.equal(typeof wp.z, 'number');
    });
  });
});
