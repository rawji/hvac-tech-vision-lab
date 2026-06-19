/** Suburban residential palette — muted, natural tones for normal mode. */
export const PALETTE = {
  outline: '#1c1917',
  outlineSoft: '#44403c',
  sky: '#87aecf',
  fog: '#b8c9bc',
  sun: '#fff8f0',
  ground: '#3f6f45',
  groundDark: '#345c39',
  mulch: '#5c4033',
  path: '#b8bcc2',
  driveway: '#5c6370',
  houseBody: '#d8d2c8',
  houseTrim: '#c4bdb2',
  houseGarage: '#ccc6bb',
  roof: '#52565c',
  porch: '#8b7355',
  door: '#4a3728',
  window: '#8ecae6',
  condenserBody: '#8b9199',
  condenserPad: '#78716c',
  vanBody: '#e8eaed',
  vanTrim: '#3d4450',
  shrub: '#356b3a',
  fence: '#a89888',
  wood: '#9a856c',
};

export const TECH_VISION = {
  fog: '#0a1628',
  ambient: 0.38,
  keyLight: '#cfe8ff',
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

/** Map a surface temperature (°F) to a thermal-camera style color — observation, not fault. */
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
  const r = mix(r1, r2);
  const g = mix(g1, g2);
  const b = mix(b1, b2);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export const NORMAL_LIGHT = {
  ambient: 0.48,
  keyLight: '#fff1e0',
  hemiSky: '#c9dff5',
  hemiGround: '#3d6644',
};
