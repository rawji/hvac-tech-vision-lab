import assert from 'node:assert/strict';
import test from 'node:test';
import { getDefaultMission } from '../src/data/missions.js';
import { resolveInteractionTarget } from '../src/logic/interactionTarget.js';
import { initialMissionState, missionReducer } from '../src/logic/missionState.js';

const TARGETS = [
  { id: 'thermostat', label: 'Thermostat', position: [-2.4, 0, 0.35] },
  { id: 'condenserCoil', label: 'Condenser Coil', position: [4, 0, 0] },
];

test('resolveInteractionTarget prefers proximity over selected target', () => {
  const result = resolveInteractionTarget({
    playerPosition: [-2.4, 0, 0.35],
    targets: TARGETS,
    proximityTarget: TARGETS[0],
    selectedTargetId: 'condenserCoil',
  });

  assert.equal(result.id, 'thermostat');
  assert.equal(result.inRange, true);
  assert.equal(result.source, 'proximity');
});

test('resolveInteractionTarget falls back to selected target in range', () => {
  const result = resolveInteractionTarget({
    playerPosition: [3.8, 0, 0.1],
    targets: TARGETS,
    proximityTarget: null,
    selectedTargetId: 'condenserCoil',
  });

  assert.equal(result.id, 'condenserCoil');
  assert.equal(result.inRange, true);
  assert.equal(result.source, 'selected');
});

test('SELECT_TARGET stores selected equipment id', () => {
  let state = missionReducer(initialMissionState, {
    type: 'SELECT_TARGET',
    targetId: 'compressor',
  });

  assert.equal(state.selectedTargetId, 'compressor');
});

test('INSPECT_TARGET sets inspect pulse target', () => {
  const mission = getDefaultMission();
  let state = missionReducer(initialMissionState, {
    type: 'INSPECT_TARGET',
    targetId: 'thermostat',
    equipmentHealth: mission.equipmentHealth,
  });

  assert.equal(state.inspectPulseTarget, 'thermostat');
});
