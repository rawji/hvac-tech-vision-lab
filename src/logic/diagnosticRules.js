export const OBSERVED_CONDITION_RULES = {
  highHeadPressure: {
    condition: 'Head pressure trend elevated',
    possibleCauses: ['Outdoor coil fouling', 'Overcharge', 'Outdoor airflow restriction'],
  },
  weakTemperatureSplit: {
    condition: 'Weak Temperature Split',
    possibleCauses: ['Poor heat transfer', 'Airflow problem', 'Refrigerant circuit issue'],
  },
  restrictedOutdoorAirflow: {
    condition: 'Outdoor airflow restricted',
    possibleCauses: ['Outdoor coil fouling', 'Blocked outdoor coil', 'Fan airflow obstruction'],
  },
  dirtyCondenserCoil: {
    condition: 'Coil surface fouling detected',
    possibleCauses: ['Debris buildup', 'Lack of maintenance', 'Restricted airflow path'],
  },
  elevatedDischargeTemp: {
    condition: 'Elevated Discharge Temperature',
    possibleCauses: ['High head pressure', 'Condenser heat rejection issue', 'Overcharge'],
  },
  normalSuctionPressure: {
    condition: 'Suction Pressure Normal',
    possibleCauses: ['Charge likely adequate', 'No severe low-side restriction indicated'],
  },
  coolingDemandActive: {
    condition: 'Cooling Demand Active',
    possibleCauses: ['Thermostat functioning', 'Control circuit engaged'],
  },
};

export function getDiagnosticCluesFromHealth(equipmentHealth) {
  const clues = [];

  if (equipmentHealth.headPressure === 'high') {
    clues.push(OBSERVED_CONDITION_RULES.highHeadPressure);
  }
  if (equipmentHealth.temperatureSplit === 'weak') {
    clues.push(OBSERVED_CONDITION_RULES.weakTemperatureSplit);
  }
  if (equipmentHealth.outdoorAirflow === 'restricted') {
    clues.push(OBSERVED_CONDITION_RULES.restrictedOutdoorAirflow);
  }
  if (equipmentHealth.condenserCoil === 'dirty') {
    clues.push(OBSERVED_CONDITION_RULES.dirtyCondenserCoil);
  }
  if (equipmentHealth.dischargeTemperature === 'high') {
    clues.push(OBSERVED_CONDITION_RULES.elevatedDischargeTemp);
  }
  if (equipmentHealth.suctionPressure === 'normal') {
    clues.push(OBSERVED_CONDITION_RULES.normalSuctionPressure);
  }
  if (equipmentHealth.thermostat === 'calling') {
    clues.push(OBSERVED_CONDITION_RULES.coolingDemandActive);
  }

  return clues;
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
