import assert from 'node:assert/strict';
import test from 'node:test';
import { getDefaultMission } from '../src/data/missions.js';
import { initialMissionState, missionReducer } from '../src/logic/missionState.js';

test('INSPECT_TARGET records inspection without adding scans', () => {
  const mission = getDefaultMission();
  let state = { ...initialMissionState };

  state = missionReducer(state, {
    type: 'INSPECT_TARGET',
    targetId: 'condenserCoil',
    equipmentHealth: mission.equipmentHealth,
  });

  assert.equal(state.inspectedTargets.length, 1);
  assert.equal(state.scannedTargets.length, 0);
  assert.equal(state.interactionMode, 'inspect');
  assert.ok(state.activeScanResult);
});

test('SCAN_TARGET records field scan and observations', () => {
  const mission = getDefaultMission();
  let state = { ...initialMissionState, techVisionEnabled: true };

  state = missionReducer(state, {
    type: 'SCAN_TARGET',
    targetId: 'condenserCoil',
    equipmentHealth: mission.equipmentHealth,
  });

  assert.equal(state.scannedTargets.length, 1);
  assert.equal(state.interactionMode, 'scan');
  assert.ok(state.discoveredClues.length > 0);
});

test('SCAN_TARGET records observation toast for new field notes', () => {
  const mission = getDefaultMission();
  let state = { ...initialMissionState, techVisionEnabled: true };

  state = missionReducer(state, {
    type: 'SCAN_TARGET',
    targetId: 'condenserCoil',
    equipmentHealth: mission.equipmentHealth,
  });

  assert.ok(state.clueToast);
  assert.match(state.clueToast, /Observation logged:/);
  assert.equal(state.scanPulseTarget, 'condenserCoil');
});

test('RESET_VIEW restores default player position and increments camera key', () => {
  let state = {
    ...initialMissionState,
    playerPosition: [5, 0, 5],
    cameraResetKey: 0,
  };

  state = missionReducer(state, { type: 'RESET_VIEW' });

  assert.deepEqual(state.playerPosition, [-1.5, 0, 11.5]);
  assert.equal(state.cameraResetKey, 1);
});
