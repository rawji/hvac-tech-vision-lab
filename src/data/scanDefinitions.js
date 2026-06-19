export const scanDefinitions = {
  thermostat: {
    id: 'thermostat',
    label: 'Thermostat',
    title: 'THERMOSTAT FIELD READINGS',
    fields: (health) => [
      { label: 'Mode', value: 'Cool', type: 'reading' },
      { label: 'Setpoint', value: '72°F', type: 'measurement' },
      { label: 'Space temperature', value: health.returnAirTemperature ?? '78°F', type: 'measurement' },
      { label: 'Y1 output', value: health.thermostat === 'calling' ? '24V present' : '0V', type: 'reading' },
      { label: 'Display', value: health.thermostat === 'calling' ? 'COOL ON' : 'Idle', type: 'reading' },
    ],
    fieldNotes: (health) =>
      health.thermostat === 'calling'
        ? ['Thermostat is calling for cooling. Indoor space reads warmer than setpoint.']
        : ['Thermostat is not presently calling for cooling.'],
  },

  filter: {
    id: 'filter',
    label: 'Filter',
    title: 'FILTER FIELD READINGS',
    fields: () => [
      { label: 'Visual condition', value: 'Light dust layer on media face', type: 'visual' },
      { label: 'Static pressure drop', value: '0.08 in. w.c.', type: 'measurement' },
      { label: 'Date stamp', value: 'Installed 90 days ago', type: 'reading' },
    ],
    fieldNotes: () => ['Filter media is present and seated in the rack.'],
  },

  condenser: {
    id: 'condenser',
    label: 'Condenser Unit',
    title: 'CONDENSER UNIT FIELD READINGS',
    fields: (health) => [
      { label: 'Outdoor fan', value: health.condenserFan === 'good' ? 'Running' : 'Not running', type: 'reading' },
      { label: 'Contactor', value: health.contactor === 'closed' ? 'Contacts closed' : 'Contacts open', type: 'reading' },
      { label: 'Line voltage at unit', value: '240V', type: 'measurement' },
      { label: 'Discharge line surface temp', value: health.dischargeTemperature === 'high' ? '148°F' : '118°F', type: 'measurement' },
      {
        label: 'Air entering coil face',
        value: health.outdoorAirflow === 'restricted' ? 'Reduced velocity at coil face' : 'Steady velocity at coil face',
        type: 'visual',
      },
    ],
    fieldNotes: (health) => [
      health.outdoorAirflow === 'restricted'
        ? 'Air movement at the condenser coil face is lower than typical for this unit at full speed.'
        : 'Air movement at the condenser coil face appears typical for this unit at full speed.',
    ],
  },

  condenserCoil: {
    id: 'condenserCoil',
    label: 'Condenser Coil',
    title: 'CONDENSER COIL FIELD READINGS',
    fields: (health) => [
      {
        label: 'Fin surface (visual)',
        value:
          health.condenserCoil === 'dirty'
            ? 'Visible debris accumulation on air-entering fin surface'
            : 'Fin surface appears clear at visible areas',
        type: 'visual',
      },
      { label: 'Liquid line pressure', value: health.headPressure === 'high' ? '312 PSIG' : '248 PSIG', type: 'measurement' },
      { label: 'Suction line pressure', value: health.suctionPressure === 'normal' ? '118 PSIG' : '95 PSIG', type: 'measurement' },
      { label: 'Liquid line temp', value: health.headPressure === 'high' ? '108°F' : '96°F', type: 'measurement' },
      { label: 'Suction line temp', value: '52°F', type: 'measurement' },
      { label: 'Calculated superheat', value: '12°F', type: 'measurement' },
      { label: 'Calculated subcooling', value: health.headPressure === 'high' ? '6°F' : '10°F', type: 'measurement' },
    ],
    fieldNotes: (health) => [
      health.condenserCoil === 'dirty'
        ? 'Condenser fins show visible debris accumulation on the air-entering side.'
        : 'Condenser fins appear clear in accessible viewing areas.',
      health.headPressure === 'high'
        ? 'Liquid line pressure reads 312 PSIG at the outdoor service valve.'
        : 'Liquid line pressure reads 248 PSIG at the outdoor service valve.',
    ],
  },

  capacitor: {
    id: 'capacitor',
    label: 'Capacitor',
    title: 'CAPACITOR FIELD READINGS',
    fields: (health) => [
      {
        label: 'Measured capacitance',
        value: health.capacitor === 'good' ? '44.8 µF' : '12.4 µF',
        type: 'measurement',
      },
      { label: 'Rated capacitance', value: '45 µF', type: 'reading' },
      { label: 'Case condition', value: 'No bulging observed', type: 'visual' },
      { label: 'Compressor start attempt', value: health.capacitor === 'good' ? 'Compressor starts' : 'Compressor hums, does not start', type: 'reading' },
    ],
    fieldNotes: (health) => [
      health.capacitor === 'good'
        ? 'Capacitor microfarad reading is near nameplate rating.'
        : 'Capacitor microfarad reading is below nameplate rating.',
    ],
  },

  compressor: {
    id: 'compressor',
    label: 'Compressor',
    title: 'COMPRESSOR FIELD READINGS',
    fields: (health) => [
      { label: 'Contactor', value: health.contactor === 'closed' ? 'Pulled in' : 'Open', type: 'reading' },
      { label: 'Line voltage at contactor', value: '240V present', type: 'measurement' },
      { label: 'Compressor state', value: health.compressor === 'good' ? 'Running' : 'Not running', type: 'reading' },
      { label: 'Discharge line temp', value: health.dischargeTemperature === 'high' ? '148°F' : '118°F', type: 'measurement' },
      { label: 'Suction line pressure', value: health.suctionPressure === 'normal' ? '118 PSIG' : '92 PSIG', type: 'measurement' },
      { label: 'Liquid line pressure', value: health.headPressure === 'high' ? '312 PSIG' : '248 PSIG', type: 'measurement' },
    ],
    fieldNotes: (health) => [
      health.compressor === 'good'
        ? ['Compressor is running with contactor pulled in and line voltage present.']
        : ['Compressor does not start. Contactor is pulled in. Line voltage present.'],
    ],
  },

  airHandler: {
    id: 'airHandler',
    label: 'Air Handler',
    title: 'AIR HANDLER FIELD READINGS',
    fields: (health) => [
      { label: 'Return air temperature', value: health.returnAirTemperature ?? '78°F', type: 'measurement' },
      { label: 'Supply air temperature', value: health.supplyAirTemperature ?? '70°F', type: 'measurement' },
      {
        label: 'Temperature split',
        value: health.temperatureSplit === 'weak' ? '8°F' : '18°F',
        type: 'measurement',
      },
      { label: 'Indoor blower', value: 'Running', type: 'reading' },
      { label: 'Blower amperage', value: '4.2A', type: 'measurement' },
    ],
    fieldNotes: (health) => [
      health.temperatureSplit === 'weak'
        ? ['Return air 78°F. Supply air 70°F. Temperature split 8°F.']
        : ['Return air and supply air readings recorded at grilles.'],
    ],
  },

  fanMotor: {
    id: 'fanMotor',
    label: 'Fan Motor',
    title: 'FAN MOTOR FIELD READINGS',
    fields: (health) => [
      { label: 'Fan blade rotation', value: health.condenserFan === 'good' ? 'Observed running' : 'Not rotating', type: 'reading' },
      { label: 'Fan motor voltage', value: '240V', type: 'measurement' },
      { label: 'Fan motor amperage', value: '1.1A', type: 'measurement' },
      { label: 'Motor case temp (IR)', value: '102°F', type: 'measurement' },
    ],
    fieldNotes: () => ['Outdoor fan motor readings taken at unit disconnect with fan commanded on.'],
  },

  disconnect: {
    id: 'disconnect',
    label: 'Disconnect',
    title: 'DISCONNECT FIELD READINGS',
    fields: (health) => [
      { label: 'Handle position', value: health.contactor === 'closed' ? 'ON' : 'OFF', type: 'reading' },
      { label: 'Line voltage at lugs', value: '240V present', type: 'measurement' },
      { label: 'Load side voltage', value: health.contactor === 'closed' ? '240V present' : '0V', type: 'measurement' },
      { label: 'Visual condition', value: 'Cover intact. Terminals seated.', type: 'visual' },
    ],
    fieldNotes: () => ['Disconnect is ON. Line voltage is present at the outdoor unit lugs.'],
  },

  serviceVan: {
    id: 'serviceVan',
    label: 'Service Van',
    title: 'WORK ORDER NOTES',
    fields: () => [
      { label: 'Customer report', value: 'System runs but the house is not cooling well.', type: 'reading' },
      { label: 'Service address', value: 'Residential — single family', type: 'reading' },
      { label: 'Call type', value: 'Same-day no-cool', type: 'reading' },
    ],
    fieldNotes: () => ['No equipment conclusions recorded on dispatch — verify on site.'],
  },

  contactor: {
    id: 'contactor',
    label: 'Contactor',
    title: 'CONTACTOR FIELD READINGS',
    fields: (health) => [
      { label: 'Coil voltage', value: health.contactor === 'closed' ? '24V present' : '0V', type: 'measurement' },
      { label: 'Contact state', value: health.contactor === 'closed' ? 'Closed' : 'Open', type: 'reading' },
      { label: 'Line side voltage', value: '240V', type: 'measurement' },
      { label: 'Load side voltage', value: health.contactor === 'closed' ? '240V at compressor terminals' : '0V at compressor terminals', type: 'measurement' },
    ],
    fieldNotes: (health) => [
      health.contactor === 'closed'
        ? ['Contactor is pulled in with 24V coil voltage present.']
        : ['Contactor is open. Coil voltage not present.'],
    ],
  },
};

export function getScanDefinition(targetId) {
  return scanDefinitions[targetId] ?? null;
}

export function buildScanResult(targetId, equipmentHealth) {
  const def = getScanDefinition(targetId);
  if (!def) return null;

  const fieldNotes = def.fieldNotes?.(equipmentHealth) ?? [];
  const observedConditions = fieldNotes.map((note) => ({ condition: note }));

  return {
    id: def.id,
    label: def.label,
    title: def.title,
    fields: def.fields(equipmentHealth),
    fieldNotes,
    observedConditions,
  };
}
