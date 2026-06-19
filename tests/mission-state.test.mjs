import assert from 'node:assert/strict';
import test from 'node:test';
import { getDefaultMission } from '../src/data/missions.js';
import { initialMissionState, missionReducer } from '../src/logic/missionState.js';

test('INSPECT_TARGET records inspection without adding diagnostic scans', () => {
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

test('SCAN_TARGET records diagnostic scan and clues', () => {
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

test('SCAN_TARGET records clue toast for new conditions', () => {
  const mission = getDefaultMission();
  let state = { ...initialMissionState, techVisionEnabled: true };

  state = missionReducer(state, {
    type: 'SCAN_TARGET',
    targetId: 'condenserCoil',
    equipmentHealth: mission.equipmentHealth,
  });

  assert.ok(state.clueToast);
  assert.match(state.clueToast, /Clue logged:/);
  assert.equal(state.scanPulseTarget, 'condenserCoil');
});

test('RESET_VIEW restores default player position and increments camera key', () => {
  let state = {
    ...initialMissionState,
    playerPosition: [5, 0, 5],
    cameraResetKey: 0,
  };

  state = missionReducer(state, { type: 'RESET_VIEW' });

  assert.deepEqual(state.playerPosition, [0, 0, 4]);
  assert.equal(state.cameraResetKey, 1);
});
