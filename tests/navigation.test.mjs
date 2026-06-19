import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getApproachPosition,
  getFaceAngle,
  isAtDestination,
  APPROACH_STANDOFF,
} from '../src/logic/navigation.js';

test('getApproachPosition stops at standoff distance from target', () => {
  const player = [-1.5, 0, 11.5];
  const target = [11, 0, -1.5];
  const approach = getApproachPosition(player, target);

  const dist = Math.hypot(approach[0] - target[0], approach[2] - target[2]);
  assert.ok(Math.abs(dist - APPROACH_STANDOFF) < 0.05);
});

test('getFaceAngle points from player toward target', () => {
  const angle = getFaceAngle([-1.5, 0, 11.5], [11, 0, -1.5]);
  assert.ok(angle > -Math.PI && angle <= Math.PI);
});

test('isAtDestination returns true within threshold', () => {
  assert.equal(isAtDestination([1, 0, 1], [1.1, 1.1], 0.32), true);
  assert.equal(isAtDestination([1, 0, 1], [3, 3], 0.32), false);
});
