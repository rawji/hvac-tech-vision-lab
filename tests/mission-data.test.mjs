import assert from 'node:assert/strict';
import test from 'node:test';
import { getDefaultMission, getMissionById } from '../src/data/missions.js';

test('getDefaultMission returns dirty condenser mission', () => {
  const mission = getDefaultMission();
  assert.equal(mission.id, 'dirty-condenser-001');
  assert.equal(mission.correctDiagnosis, 'Dirty condenser coil');
  assert.ok(mission.scanTargets.includes('condenserCoil'));
  assert.ok(mission.diagnosisOptions.length >= 5);
});

test('getMissionById finds mission by id', () => {
  const mission = getMissionById('dirty-condenser-001');
  assert.ok(mission);
  assert.equal(mission.title, 'No Cooling Call: Dirty Condenser Coil');
});

test('mission equipmentHealth has required diagnostic fields', () => {
  const { equipmentHealth } = getDefaultMission();
  assert.equal(equipmentHealth.condenserCoil, 'dirty');
  assert.equal(equipmentHealth.headPressure, 'high');
  assert.equal(equipmentHealth.outdoorAirflow, 'restricted');
});
