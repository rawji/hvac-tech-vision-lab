export const scanDefinitions = {
  thermostat: {
    id: 'thermostat',
    label: 'Thermostat',
    title: 'THERMOSTAT STATUS',
    fields: (health) => [
      { label: 'Call for cooling', value: health.thermostat === 'calling' ? 'Active' : 'Inactive', category: 'info' },
      { label: 'Setpoint', value: '72°F', category: 'info' },
      { label: 'Indoor temp', value: health.returnAirTemperature ?? '78°F', category: 'info' },
      { label: 'Signal', value: health.thermostat === 'calling' ? 'Cooling demand present' : 'No demand', category: 'info' },
    ],
    observedConditions: (health) =>
      health.thermostat === 'calling'
        ? [{ condition: 'Cooling demand active', possibleCauses: ['Normal call', 'Thermostat functioning'] }]
        : [{ condition: 'No cooling call', possibleCauses: ['Thermostat issue', 'System off'] }],
  },

  filter: {
    id: 'filter',
    label: 'Filter',
    title: 'FILTER STATUS',
    fields: () => [
      { label: 'Surface condition', value: 'Acceptable', category: 'normal' },
      { label: 'Restriction', value: 'Low', category: 'normal' },
      { label: 'Indoor airflow impact', value: 'Minimal', category: 'normal' },
    ],
    observedConditions: () => [
      { condition: 'Filter restriction low', possibleCauses: ['Recently replaced', 'Normal maintenance'] },
    ],
  },

  condenser: {
    id: 'condenser',
    label: 'Condenser Unit',
    title: 'CONDENSER UNIT STATUS',
    fields: (health) => [
      { label: 'Outdoor fan', value: health.condenserFan === 'good' ? 'Running' : 'Fault', category: health.condenserFan === 'good' ? 'normal' : 'fault' },
      { label: 'Contactor', value: health.contactor === 'closed' ? 'Closed — power applied' : 'Open', category: 'info' },
      { label: 'Runtime', value: 'Active', category: 'info' },
      { label: 'Outdoor airflow', value: health.outdoorAirflow === 'restricted' ? 'Restricted' : 'Normal', category: health.outdoorAirflow === 'restricted' ? 'warning' : 'normal' },
    ],
    observedConditions: (health) => [
      {
        condition: health.outdoorAirflow === 'restricted' ? 'Outdoor airflow restricted' : 'Outdoor airflow normal',
        possibleCauses: ['Outdoor coil fouling', 'Blocked outdoor coil', 'Fan airflow obstruction'],
      },
    ],
  },

  condenserCoil: {
    id: 'condenserCoil',
    label: 'Condenser Coil',
    title: 'CONDENSER COIL STATUS',
    fields: (health) => [
      { label: 'Surface condition', value: health.condenserCoil === 'dirty' ? 'Surface fouling detected' : 'Clean', category: health.condenserCoil === 'dirty' ? 'fault' : 'normal' },
      { label: 'Outdoor airflow', value: health.outdoorAirflow === 'restricted' ? 'Restricted' : 'Normal', category: health.outdoorAirflow === 'restricted' ? 'warning' : 'normal' },
      { label: 'Heat rejection', value: health.headPressure === 'high' ? 'Weak' : 'Normal', category: health.headPressure === 'high' ? 'warning' : 'normal' },
      { label: 'Head pressure trend', value: health.headPressure === 'high' ? 'Elevated' : 'Normal', category: health.headPressure === 'high' ? 'warning' : 'normal' },
    ],
    observedConditions: (health) => [
      {
        condition: 'Head pressure trend elevated',
        possibleCauses: ['Outdoor coil fouling', 'Overcharge', 'Outdoor airflow restriction'],
      },
      {
        condition: health.condenserCoil === 'dirty' ? 'Coil surface fouling detected' : 'Coil surface clean',
        possibleCauses: health.condenserCoil === 'dirty'
          ? ['Debris buildup', 'Lack of maintenance', 'Restricted airflow path']
          : ['Normal condition'],
      },
    ],
  },

  capacitor: {
    id: 'capacitor',
    label: 'Capacitor',
    title: 'CAPACITOR STATUS',
    fields: (health) => [
      { label: 'Start support', value: health.capacitor === 'good' ? 'Normal' : 'Weak', category: health.capacitor === 'good' ? 'normal' : 'warning' },
      { label: 'Measured condition', value: 'Within expected range', category: 'normal' },
      { label: 'Compressor start', value: 'Successful', category: 'normal' },
    ],
    observedConditions: () => [
      { condition: 'Capacitor functional', possibleCauses: ['Normal electrical support', 'No start assist failure'] },
    ],
  },

  compressor: {
    id: 'compressor',
    label: 'Compressor',
    title: 'COMPRESSOR STATUS',
    fields: (health) => [
      { label: 'Runtime', value: 'Active', category: 'info' },
      { label: 'Start condition', value: health.compressor === 'good' ? 'Normal' : 'Fault', category: health.compressor === 'good' ? 'normal' : 'fault' },
      { label: 'Load', value: health.dischargeTemperature === 'high' ? 'Elevated' : 'Normal', category: health.dischargeTemperature === 'high' ? 'warning' : 'normal' },
      { label: 'Discharge temperature', value: health.dischargeTemperature === 'high' ? 'High' : 'Normal', category: health.dischargeTemperature === 'high' ? 'warning' : 'normal' },
    ],
    observedConditions: (health) => [
      {
        condition: health.dischargeTemperature === 'high' ? 'Elevated discharge temperature' : 'Normal discharge temperature',
        possibleCauses: ['High head pressure', 'Condenser heat rejection issue', 'Overcharge'],
      },
      {
        condition: health.suctionPressure === 'normal' ? 'Suction pressure normal' : 'Suction pressure abnormal',
        possibleCauses: ['Refrigerant circuit issue', 'Metering device restriction', 'Low charge'],
      },
    ],
  },

  airHandler: {
    id: 'airHandler',
    label: 'Air Handler',
    title: 'AIR HANDLER STATUS',
    fields: (health) => [
      { label: 'Indoor blower', value: 'Running', category: 'normal' },
      { label: 'Filter condition', value: 'Acceptable', category: 'normal' },
      { label: 'Indoor airflow', value: health.indoorAirflow === 'normal' ? 'Normal' : 'Restricted', category: health.indoorAirflow === 'normal' ? 'normal' : 'warning' },
      { label: 'Supply air', value: health.temperatureSplit === 'weak' ? 'Warmer than expected' : 'Normal', category: health.temperatureSplit === 'weak' ? 'warning' : 'normal' },
    ],
    observedConditions: (health) => [
      {
        condition: health.temperatureSplit === 'weak' ? 'Weak temperature split' : 'Normal temperature split',
        possibleCauses: ['Poor heat transfer', 'Airflow problem', 'Refrigerant circuit issue'],
      },
    ],
  },

  fanMotor: {
    id: 'fanMotor',
    label: 'Fan Motor',
    title: 'FAN MOTOR STATUS',
    fields: (health) => [
      { label: 'Condenser fan', value: health.condenserFan === 'good' ? 'OK' : 'Fault', category: health.condenserFan === 'good' ? 'normal' : 'fault' },
      { label: 'Voltage', value: '240V', category: 'info' },
      { label: 'Temperature', value: 'Normal', category: 'normal' },
      { label: 'Runtime', value: '1.2 hrs', category: 'info' },
    ],
    observedConditions: () => [
      { condition: 'Fan motor operational', possibleCauses: ['Normal operation', 'Capacitor supporting start'] },
    ],
  },

  disconnect: {
    id: 'disconnect',
    label: 'Disconnect',
    title: 'DISCONNECT STATUS',
    fields: (health) => [
      { label: 'Handle position', value: health.contactor === 'closed' ? 'Pulled in — line power present' : 'Pulled out', category: 'info' },
      { label: 'Line voltage', value: '240V present', category: 'info' },
      { label: 'Outdoor unit power', value: health.contactor === 'closed' ? 'Energized' : 'Off', category: 'info' },
    ],
    observedConditions: () => [
      { condition: 'Outdoor disconnect supplying power', possibleCauses: ['Normal line power', 'Contactor downstream closed'] },
    ],
  },

  serviceVan: {
    id: 'serviceVan',
    label: 'Service Van',
    title: 'SERVICE VAN NOTES',
    fields: () => [
      { label: 'Work order', value: 'No cooling — weak temperature split', category: 'info' },
      { label: 'Customer report', value: 'System runs but house not cooling well', category: 'info' },
      { label: 'Priority', value: 'Same-day service', category: 'info' },
    ],
    observedConditions: () => [],
  },

  contactor: {
    id: 'contactor',
    label: 'Contactor',
    title: 'CONTACTOR STATUS',
    fields: (health) => [
      { label: 'Coil state', value: health.contactor === 'closed' ? 'Energized' : 'De-energized', category: 'info' },
      { label: 'Contacts', value: health.contactor === 'closed' ? 'Closed' : 'Open', category: 'info' },
      { label: 'Control voltage', value: '24V present', category: 'info' },
    ],
    observedConditions: () => [
      { condition: 'Contactor closed under cooling call', possibleCauses: ['Normal control sequence', 'Thermostat demand active'] },
    ],
  },
};

export function getScanDefinition(targetId) {
  return scanDefinitions[targetId] ?? null;
}

export function buildScanResult(targetId, equipmentHealth) {
  const def = getScanDefinition(targetId);
  if (!def) return null;

  return {
    id: def.id,
    label: def.label,
    title: def.title,
    fields: def.fields(equipmentHealth),
    observedConditions: def.observedConditions(equipmentHealth),
  };
}
