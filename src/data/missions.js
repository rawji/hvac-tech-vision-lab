export const missions = [
  {
    id: 'dirty-condenser-001',
    title: 'No Cooling Call: Dirty Condenser Coil',
    customerComplaint: 'The system runs, but the house is not cooling well.',
    objective:
      'Investigate the system, gather diagnostic clues, and identify the likely cause of weak cooling.',
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
      returnAirTemperature: '78F',
      supplyAirTemperature: '70F',
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
    ],
    diagnosisOptions: [
      'Dirty condenser coil',
      'Low refrigerant',
      'Bad thermostat',
      'Bad blower motor',
      'Bad compressor',
    ],
    correctDiagnosis: 'Dirty condenser coil',
    relatedConcepts: [
      'Heat rejection',
      'Condenser operation',
      'Outdoor airflow',
      'High head pressure',
      'Temperature split',
      'Refrigeration cycle basics',
    ],
    feedback: {
      correct:
        'Correct. The condenser coil is dirty, restricting outdoor airflow and reducing heat rejection. ' +
        'This raises head pressure while suction pressure stays relatively normal. The compressor runs ' +
        'under elevated load, discharge temperature rises, and the temperature split weakens even though ' +
        'indoor airflow and refrigerant charge appear acceptable.',
      incorrect:
        'That diagnosis does not fully match the clues you gathered. Review scan data for head pressure, ' +
        'outdoor airflow, condenser coil condition, and temperature split. The observed pattern points toward ' +
        'a condenser-side heat rejection problem rather than the cause you selected.',
    },
  },
];

export function getMissionById(id) {
  return missions.find((m) => m.id === id) ?? null;
}

export function getDefaultMission() {
  return missions[0];
}
