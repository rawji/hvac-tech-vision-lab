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

export function getHighlightColor(category) {
  return STATUS_CATEGORIES[category]?.color ?? STATUS_CATEGORIES.info.color;
}
