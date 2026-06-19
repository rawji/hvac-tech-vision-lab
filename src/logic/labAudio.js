const STORAGE_KEY = 'hvac-lab-audio-muted';
const DEFAULT_VOLUME = 0.22;

let audioContext = null;
let masterGain = null;
let condenserHum = null;
let muted = false;

function readMutedPreference() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

muted = readMutedPreference();

function ensureContext() {
  if (audioContext) return audioContext;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;

  audioContext = new Ctx();
  masterGain = audioContext.createGain();
  masterGain.gain.value = muted ? 0 : DEFAULT_VOLUME;
  masterGain.connect(audioContext.destination);
  return audioContext;
}

export function isAudioMuted() {
  return muted;
}

export function setAudioMuted(nextMuted) {
  muted = nextMuted;
  try {
    localStorage.setItem(STORAGE_KEY, String(nextMuted));
  } catch {
    /* ignore storage failures */
  }
  if (masterGain) {
    masterGain.gain.value = nextMuted ? 0 : DEFAULT_VOLUME;
  }
  if (nextMuted) {
    stopCondenserHum();
  }
}

export async function unlockAudio() {
  const ctx = ensureContext();
  if (!ctx) return false;
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
  return ctx.state === 'running';
}

function canPlay() {
  return !muted && audioContext && audioContext.state === 'running';
}

function playTone({
  frequency,
  duration = 0.12,
  type = 'sine',
  volume = 1,
  attack = 0.01,
  release = 0.08,
  frequencyEnd,
}) {
  if (!canPlay()) return;

  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  if (frequencyEnd) {
    osc.frequency.exponentialRampToValueAtTime(frequencyEnd, now + duration);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0001), now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + release);

  osc.connect(gain);
  gain.connect(masterGain);
  osc.start(now);
  osc.stop(now + duration + release + 0.02);
}

function playSequence(steps) {
  if (!canPlay()) return;
  steps.forEach(({ at, ...opts }) => {
    setTimeout(() => playTone(opts), at * 1000);
  });
}

export const labSounds = {
  techVisionOn() {
    playSequence([
      { at: 0, frequency: 520, frequencyEnd: 880, duration: 0.14, type: 'triangle', volume: 0.35 },
      { at: 0.08, frequency: 880, duration: 0.06, type: 'sine', volume: 0.2 },
    ]);
  },

  techVisionOff() {
    playSequence([
      { at: 0, frequency: 720, frequencyEnd: 420, duration: 0.12, type: 'triangle', volume: 0.28 },
    ]);
  },

  scanComplete() {
    playSequence([
      { at: 0, frequency: 660, duration: 0.08, type: 'sine', volume: 0.3 },
      { at: 0.07, frequency: 880, duration: 0.1, type: 'sine', volume: 0.25 },
    ]);
  },

  scanLock() {
    playTone({ frequency: 740, duration: 0.05, type: 'square', volume: 0.12, release: 0.04 });
  },

  clueLogged() {
    playSequence([
      { at: 0, frequency: 540, duration: 0.07, type: 'triangle', volume: 0.28 },
      { at: 0.09, frequency: 680, duration: 0.09, type: 'triangle', volume: 0.22 },
    ]);
  },

  diagnosisSubmit() {
    playSequence([
      { at: 0, frequency: 420, duration: 0.1, type: 'sine', volume: 0.25 },
      { at: 0.1, frequency: 560, duration: 0.12, type: 'sine', volume: 0.22 },
    ]);
  },

  diagnosisCorrect() {
    playSequence([
      { at: 0, frequency: 523, duration: 0.1, type: 'triangle', volume: 0.3 },
      { at: 0.12, frequency: 659, duration: 0.1, type: 'triangle', volume: 0.28 },
      { at: 0.24, frequency: 784, duration: 0.16, type: 'triangle', volume: 0.32 },
    ]);
  },

  diagnosisIncorrect() {
    playSequence([
      { at: 0, frequency: 330, duration: 0.14, type: 'sawtooth', volume: 0.18 },
      { at: 0.16, frequency: 260, duration: 0.18, type: 'sawtooth', volume: 0.16 },
    ]);
  },
};

export function startCondenserHum() {
  if (!canPlay() || condenserHum) return;
  const ctx = ensureContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.value = 58;
  filter.type = 'lowpass';
  filter.frequency.value = 140;
  gain.gain.value = 0.035;

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  osc.start();

  condenserHum = { osc, gain };
}

export function stopCondenserHum() {
  if (!condenserHum) return;
  const { osc, gain } = condenserHum;
  const now = audioContext?.currentTime ?? 0;
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  osc.stop(now + 0.3);
  condenserHum = null;
}

export function setCondenserHumActive(active) {
  if (active && !muted) {
    unlockAudio().then(() => {
      if (!muted) startCondenserHum();
    });
  } else {
    stopCondenserHum();
  }
}
