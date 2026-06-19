export const missions = [
  {
    id: 'no-cool-001',
    title: 'Service Call: No Cooling Reported',
    customerComplaint: 'The system runs, but the house is not cooling well.',
    objective:
      'Document field observations and measurements. Inspect available equipment, record readings, and select your diagnosis after sufficient evidence.',
    equipmentHealth: {
      compressor: 'good',
      condenserFan: 'good',
      capacitor: 'good',
      refrigerantLevel: 'normal',
      airflow: 'restricted',
      condenserCoil: 'dirty',
      evaporatorCoil: 'normal',
      thermostat: 'calling',
      contactor: 'closed',
      temperatureSplit: 'weak',
      headPressure: 'high',
      suctionPressure: 'normal',
      outdoorAirflow: 'restricted',
      indoorAirflow: 'normal',
      dischargeTemperature: 'high',
      returnAirTemperature: '78°F',
      supplyAirTemperature: '70°F',
    },
    scanTargets: [
      'thermostat',
      'filter',
      'condenser',
      'condenserCoil',
      'capacitor',
      'compressor',
      'airHandler',
      'fanMotor',
      'contactor',
      'disconnect',
    ],
    diagnosisOptions: [
      'Outdoor coil airflow restriction',
      'Refrigerant undercharge',
      'Thermostat control issue',
      'Indoor blower airflow problem',
      'Compressor not pumping',
    ],
    correctDiagnosis: 'Outdoor coil airflow restriction',
    relatedConcepts: [
      'Heat rejection',
      'Condenser operation',
      'Outdoor airflow',
      'Head pressure',
      'Temperature split',
      'Refrigeration cycle basics',
    ],
    feedback: {
      correct:
        'Your diagnosis matches the field pattern. The recorded readings — elevated liquid line pressure, ' +
        'visible debris on the condenser fin surface, reduced air movement at the coil face, narrow temperature ' +
        'split, and relatively normal suction pressure — are consistent with restricted outdoor coil airflow ' +
        'limiting heat rejection.',
      incorrect:
        'Your selected diagnosis does not best fit the measurements you recorded. Compare liquid line pressure, ' +
        'suction pressure, temperature split, condenser fin condition, and air movement at the coil face before ' +
        'choosing again.',
    },
  },
];

export function getMissionById(id) {
  if (id === LEGACY_MISSION_ID || id === missions[0].id) {
    return missions[0];
  }
  return missions.find((m) => m.id === id) ?? null;
}

export function getDefaultMission() {
  return missions[0];
}

// Legacy id alias for bookmarks and tests
export const LEGACY_MISSION_ID = 'dirty-condenser-001';
