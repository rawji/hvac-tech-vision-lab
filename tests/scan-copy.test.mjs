import assert from 'node:assert/strict';
import test from 'node:test';
import { scanDefinitions, buildScanResult } from '../src/data/scanDefinitions.js';
import { getDefaultMission } from '../src/data/missions.js';
import { getFieldObservationsFromHealth } from '../src/logic/diagnosticRules.js';
import { getComponentReading } from '../src/logic/equipmentStatusMapper.js';

const BANNED_IN_GAMEPLAY = [
  /dirty condenser/i,
  /bad capacitor/i,
  /low refrigerant/i,
  /restricted airflow/i,
  /fault detected/i,
  /surface fouling/i,
  /likely cause/i,
  /root cause/i,
  /possible causes?/i,
  /\bfault\b/i,
  /\bdiagnos/i,
];

function collectStrings(value, bucket = []) {
  if (typeof value === 'string') {
    bucket.push(value);
    return bucket;
  }
  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, bucket));
    return bucket;
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach((item) => collectStrings(item, bucket));
  }
  return bucket;
}

test('scan results use neutral observations and measurements', () => {
  const { equipmentHealth, scanTargets } = getDefaultMission();

  for (const targetId of scanTargets) {
    const result = buildScanResult(targetId, equipmentHealth);
    assert.ok(result, `missing scan result for ${targetId}`);
    const strings = collectStrings({
      title: result.title,
      fields: result.fields,
      fieldNotes: result.fieldNotes,
    });

    for (const text of strings) {
      for (const pattern of BANNED_IN_GAMEPLAY) {
        assert.doesNotMatch(text, pattern, `leak in ${targetId}: "${text}"`);
      }
    }
  }
});

test('field observation rules avoid diagnostic conclusions', () => {
  const observations = getFieldObservationsFromHealth(getDefaultMission().equipmentHealth);
  assert.ok(observations.length > 0);
  for (const { condition } of observations) {
    for (const pattern of BANNED_IN_GAMEPLAY) {
      assert.doesNotMatch(condition, pattern, `leak in observation: "${condition}"`);
    }
  }
});

test('Tech Vision component tags show readings not fault labels', () => {
  const health = getDefaultMission().equipmentHealth;
  assert.equal(getComponentReading('condenserCoil', health), 'Debris on fin surface');
  assert.equal(getComponentReading('headPressure', health), '312 PSIG');
  assert.doesNotMatch(getComponentReading('condenserCoil', health), /fault/i);
});

test('scanDefinitions exports all mission targets', () => {
  const { scanTargets } = getDefaultMission();
  for (const id of scanTargets) {
    assert.ok(scanDefinitions[id], `missing definition for ${id}`);
  }
});
