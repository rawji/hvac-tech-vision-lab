import assert from 'node:assert/strict';
import test from 'node:test';
import {
  mapValueToCategory,
  getHighlightColor,
  getComponentVisualStatus,
} from '../src/logic/equipmentStatusMapper.js';

test('mapValueToCategory maps HVAC statuses correctly', () => {
  assert.equal(mapValueToCategory('good'), 'normal');
  assert.equal(mapValueToCategory('dirty'), 'fault');
  assert.equal(mapValueToCategory('restricted'), 'warning');
  assert.equal(mapValueToCategory('calling'), 'info');
});

test('getHighlightColor returns hex colors', () => {
  assert.equal(getHighlightColor('normal'), '#4ade80');
  assert.equal(getHighlightColor('fault'), '#f87171');
});

test('getComponentVisualStatus returns structured status', () => {
  const status = getComponentVisualStatus('condenserCoil', { condenserCoil: 'dirty' });
  assert.equal(status.category, 'fault');
  assert.equal(status.value, 'dirty');
});
