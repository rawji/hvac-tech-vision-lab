import { useCallback, useEffect, useRef, useState } from 'react';
import {
  isAudioMuted,
  labSounds,
  setAudioMuted,
  setCondenserHumActive,
  unlockAudio,
} from '../logic/labAudio.js';

export function useLabAudio(active = true) {
  const [muted, setMutedState] = useState(isAudioMuted);
  const [unlocked, setUnlocked] = useState(false);
  const prevTechVision = useRef(null);
  const prevClueToast = useRef(null);
  const prevNearbyCondenser = useRef(false);

  const unlock = useCallback(async () => {
    const ok = await unlockAudio();
    if (ok) setUnlocked(true);
    return ok;
  }, []);

  const toggleMute = useCallback(() => {
    const next = !muted;
    setAudioMuted(next);
    setMutedState(next);
    if (next) {
      setCondenserHumActive(false);
    }
  }, [muted]);

  const playIfUnlocked = useCallback(
    (fn) => {
      if (muted || !unlocked) return;
      fn();
    },
    [muted, unlocked]
  );

  useEffect(() => {
    if (!active) return undefined;

    const onGesture = () => {
      unlock();
    };

    window.addEventListener('pointerdown', onGesture, { once: false });
    window.addEventListener('keydown', onGesture, { once: false });
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, [active, unlock]);

  return {
    muted,
    unlocked,
    unlock,
    toggleMute,
    playIfUnlocked,
    sounds: labSounds,
    prevTechVision,
    prevClueToast,
    prevNearbyCondenser,
  };
}
