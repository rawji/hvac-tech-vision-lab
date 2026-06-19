import assert from 'node:assert/strict';
import test from 'node:test';
import { getDefaultMission, getMissionById, LEGACY_MISSION_ID } from '../src/data/missions.js';

test('getDefaultMission returns no-cool mission with symptom-only start', () => {
  const mission = getDefaultMission();
  assert.equal(mission.id, 'no-cool-001');
  assert.equal(mission.correctDiagnosis, 'Outdoor coil airflow restriction');
  assert.ok(mission.scanTargets.includes('condenserCoil'));
  assert.ok(mission.diagnosisOptions.length >= 5);
  assert.match(mission.customerComplaint, /not cooling/i);
});

test('getMissionById finds mission by id and legacy alias', () => {
  const mission = getMissionById('no-cool-001');
  assert.ok(mission);
  assert.equal(mission.title, 'Service Call: No Cooling Reported');

  const legacy = getMissionById(LEGACY_MISSION_ID);
  assert.ok(legacy);
  assert.equal(legacy.id, 'no-cool-001');
});

test('mission equipmentHealth has required sim state fields', () => {
  const { equipmentHealth } = getDefaultMission();
  assert.equal(equipmentHealth.condenserCoil, 'dirty');
  assert.equal(equipmentHealth.headPressure, 'high');
  assert.equal(equipmentHealth.outdoorAirflow, 'restricted');
});
