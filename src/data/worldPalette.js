/** Premium stylized diorama palette — warm residential normal mode, cool diagnostic Tech Vision. */
export const PALETTE = {
  outline: '#2a2520',
  outlineSoft: '#3d3832',
  sky: '#9eb8d9',
  fog: '#c5d4c8',
  sun: '#fff4e8',
  ground: '#3f6844',
  groundDark: '#325538',
  groundLight: '#4a7550',
  mulch: '#4a3728',
  path: '#c2c6cc',
  driveway: '#565d68',
  drivewayEdge: '#6b7280',
  houseBody: '#ddd6cb',
  houseTrim: '#c8bfb3',
  houseShadow: '#b8aea2',
  houseGarage: '#cfc8bc',
  roof: '#4a5058',
  roofHighlight: '#5c636b',
  porch: '#7a6548',
  door: '#3f2f22',
  window: '#9fd4ef',
  windowGlow: '#fde68a',
  condenserBody: '#7d848c',
  condenserPad: '#6b7280',
  vanBody: '#eef0f3',
  vanTrim: '#2f3640',
  vanAccent: '#d97706',
  shrub: '#3a6840',
  shrubHighlight: '#4a7a50',
  fence: '#9a8878',
  wood: '#8a7760',
};

export const TECH_VISION = {
  fog: '#060e1a',
  ambient: 0.32,
  keyLight: '#b8dcff',
  fillLight: '#1e3a5f',
  rimLight: '#38bdf8',
  accent: '#38bdf8',
  accentBright: '#7dd3fc',
  accentDim: '#0ea5e9',
  wireframe: '#60a5fa',
  flow: '#38bdf8',
  tagBorder: '#38bdf8',
  tagLabel: '#cbd5e1',
  tagReading: '#e0f2fe',
  thermalCool: '#2563eb',
  thermalMid: '#a855f7',
  thermalWarm: '#f97316',
};

export const NORMAL_LIGHT = {
  ambient: 0.42,
  keyLight: '#ffe8cc',
  keyIntensity: 1.45,
  fillLight: '#ffd6a8',
  fillIntensity: 0.38,
  rimLight: '#fff8ef',
  rimIntensity: 0.28,
  hemiSky: '#d4e8ff',
  hemiGround: '#3a6340',
  hemiIntensity: 0.48,
};

export const TONE_MAPPING = {
  normalExposure: 1.06,
  techVisionExposure: 0.92,
};

/** Darken a hex color by amount 0–1 for stylized rim/shadow passes. */
export function shadeColor(hex, amount = 0.14) {
  const parse = (value) => [
    parseInt(value.slice(1, 3), 16),
    parseInt(value.slice(3, 5), 16),
    parseInt(value.slice(5, 7), 16),
  ];
  const [r, g, b] = parse(hex);
  const shade = (channel) => Math.max(0, Math.round(channel * (1 - amount)));
  return `#${[shade(r), shade(g), shade(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export function temperatureToThermalColor(tempF) {
  const t = Math.max(70, Math.min(160, tempF ?? 90));
  const norm = (t - 70) / 90;

  if (norm <= 0.5) {
    const local = norm / 0.5;
    return lerpColor(TECH_VISION.thermalCool, TECH_VISION.thermalMid, local);
  }

  const local = (norm - 0.5) / 0.5;
  return lerpColor(TECH_VISION.thermalMid, TECH_VISION.thermalWarm, local);
}

function lerpColor(from, to, amount) {
  const parse = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
  const [r1, g1, b1] = parse(from);
  const [r2, g2, b2] = parse(to);
  const mix = (a, b) => Math.round(a + (b - a) * amount);
  return `#${[mix(r1, r2), mix(g1, g2), mix(b1, b2)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
