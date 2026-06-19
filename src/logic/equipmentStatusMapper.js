export const STATUS_CATEGORIES = {
  normal: { color: '#4ade80', label: 'Normal', cssClass: 'status-normal' },
  warning: { color: '#facc15', label: 'Warning', cssClass: 'status-warning' },
  fault: { color: '#f87171', label: 'Fault', cssClass: 'status-fault' },
  info: { color: '#60a5fa', label: 'Info', cssClass: 'status-info' },
};

const VALUE_CATEGORY_MAP = {
  good: 'normal',
  normal: 'normal',
  acceptable: 'normal',
  clean: 'normal',
  closed: 'info',
  calling: 'info',
  dirty: 'fault',
  restricted: 'warning',
  weak: 'warning',
  high: 'warning',
  elevated: 'warning',
  fault: 'fault',
  failed: 'fault',
  low: 'warning',
  unknown: 'info',
};

const COMPONENT_READINGS = {
  condenserCoil: (health) =>
    health.condenserCoil === 'dirty' ? 'Debris on fin surface' : 'Fins clear at visible areas',
  headPressure: (health) => (health.headPressure === 'high' ? '312 PSIG' : '248 PSIG'),
  suctionPressure: (health) => (health.suctionPressure === 'normal' ? '118 PSIG' : '95 PSIG'),
  outdoorAirflow: (health) =>
    health.outdoorAirflow === 'restricted' ? 'Reduced coil-face velocity' : 'Typical coil-face velocity',
  temperatureSplit: (health) => (health.temperatureSplit === 'weak' ? '8°F split' : '18°F split'),
  dischargeTemperature: (health) => (health.dischargeTemperature === 'high' ? '148°F' : '118°F'),
  thermostat: (health) => (health.thermostat === 'calling' ? 'Y1: 24V' : 'Y1: 0V'),
  contactor: (health) => (health.contactor === 'closed' ? 'Contacts closed' : 'Contacts open'),
  compressor: (health) => (health.compressor === 'good' ? 'Running' : 'Not running'),
  condenserFan: (health) => (health.condenserFan === 'good' ? 'Running' : 'Not running'),
  capacitor: (health) => (health.capacitor === 'good' ? '44.8 µF' : '12.4 µF'),
  indoorAirflow: (health) =>
    health.indoorAirflow === 'normal' ? 'Supply velocity typical at grille' : 'Reduced supply velocity at grille',
  returnAirTemperature: (health) => health.returnAirTemperature ?? '78°F',
  supplyAirTemperature: (health) => health.supplyAirTemperature ?? '70°F',
};

export function mapValueToCategory(value) {
  if (!value) return 'info';
  const key = String(value).toLowerCase();
  return VALUE_CATEGORY_MAP[key] ?? 'info';
}

export function mapEquipmentHealthToStatuses(equipmentHealth) {
  const entries = Object.entries(equipmentHealth ?? {});
  return entries.reduce((acc, [key, value]) => {
    const category = mapValueToCategory(value);
    acc[key] = {
      value,
      category,
      ...STATUS_CATEGORIES[category],
    };
    return acc;
  }, {});
}

export function getComponentVisualStatus(componentKey, equipmentHealth) {
  const value = equipmentHealth?.[componentKey];
  const category = mapValueToCategory(value);
  return {
    key: componentKey,
    value,
    category,
    ...STATUS_CATEGORIES[category],
  };
}

export function getComponentReading(componentKey, equipmentHealth) {
  const reader = COMPONENT_READINGS[componentKey];
  if (reader) return reader(equipmentHealth ?? {});
  const value = equipmentHealth?.[componentKey];
  if (value == null || value === '') return '—';
  return String(value);
}

export function getHighlightColor(category) {
  return STATUS_CATEGORIES[category]?.color ?? STATUS_CATEGORIES.info.color;
}
