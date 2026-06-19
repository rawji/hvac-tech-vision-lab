import { useEffect, useRef } from 'react';
import { MOVE_SPEED } from '../../logic/worldBounds.js';
const KEYS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
};

export function useKeyboardControls(onMove, enabled = true) {
  const keysRef = useRef(new Set());

  useEffect(() => {
    if (!enabled) return undefined;

    const onKeyDown = (e) => {
      if (e.code === 'KeyV') return;
      keysRef.current.add(e.code);
    };

    const onKeyUp = (e) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return undefined;

    let frameId;
    let lastTime = performance.now();

    const tick = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      const keys = keysRef.current;
      let dx = 0;
      let dz = 0;

      if (KEYS.forward.some((k) => keys.has(k))) dz -= 1;
      if (KEYS.back.some((k) => keys.has(k))) dz += 1;
      if (KEYS.left.some((k) => keys.has(k))) dx -= 1;
      if (KEYS.right.some((k) => keys.has(k))) dx += 1;

      if (dx !== 0 || dz !== 0) {
        const len = Math.hypot(dx, dz) || 1;
        onMove([(dx / len) * MOVE_SPEED * delta, (dz / len) * MOVE_SPEED * delta]);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, onMove]);
}

export function useTechVisionToggle(onToggle, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;

    const onKeyDown = (e) => {
      if (e.code === 'KeyV' && !e.repeat) {
        e.preventDefault();
        onToggle();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled, onToggle]);
}
