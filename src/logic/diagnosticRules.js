export const FIELD_OBSERVATIONS = {
  liquidLinePressureHigh: {
    condition: 'Liquid line pressure reads 312 PSIG at the outdoor service valve.',
  },
  temperatureSplitNarrow: {
    condition: 'Return air 78°F. Supply air 70°F. Temperature split 8°F.',
  },
  coilFaceAirVelocityLow: {
    condition: 'Air movement at the condenser coil face is lower than typical at full speed.',
  },
  condenserFinDebris: {
    condition: 'Condenser fins show visible debris accumulation on the air-entering side.',
  },
  dischargeLineTempHigh: {
    condition: 'Discharge line surface temperature reads 148°F.',
  },
  suctionPressureReading: {
    condition: 'Suction line pressure reads 118 PSIG.',
  },
  coolingCallActive: {
    condition: 'Thermostat Y1 output: 24V present. Space temperature above setpoint.',
  },
  disconnectOn: {
    condition: 'Disconnect ON. Line voltage present at outdoor unit lugs.',
  },
};

export function getFieldObservationsFromHealth(equipmentHealth) {
  const observations = [];

  if (equipmentHealth.headPressure === 'high') {
    observations.push(FIELD_OBSERVATIONS.liquidLinePressureHigh);
  }
  if (equipmentHealth.temperatureSplit === 'weak') {
    observations.push(FIELD_OBSERVATIONS.temperatureSplitNarrow);
  }
  if (equipmentHealth.outdoorAirflow === 'restricted') {
    observations.push(FIELD_OBSERVATIONS.coilFaceAirVelocityLow);
  }
  if (equipmentHealth.condenserCoil === 'dirty') {
    observations.push(FIELD_OBSERVATIONS.condenserFinDebris);
  }
  if (equipmentHealth.dischargeTemperature === 'high') {
    observations.push(FIELD_OBSERVATIONS.dischargeLineTempHigh);
  }
  if (equipmentHealth.suctionPressure === 'normal') {
    observations.push(FIELD_OBSERVATIONS.suctionPressureReading);
  }
  if (equipmentHealth.thermostat === 'calling') {
    observations.push(FIELD_OBSERVATIONS.coolingCallActive);
  }

  return observations;
}

/** @deprecated Use getFieldObservationsFromHealth — kept for imports during transition */
export function getDiagnosticCluesFromHealth(equipmentHealth) {
  return getFieldObservationsFromHealth(equipmentHealth);
}

export function mergeClues(existingClues, newClues) {
  const seen = new Set(existingClues.map((c) => c.condition));
  const merged = [...existingClues];
  for (const clue of newClues) {
    if (!seen.has(clue.condition)) {
      seen.add(clue.condition);
      merged.push(clue);
    }
  }
  return merged;
}
