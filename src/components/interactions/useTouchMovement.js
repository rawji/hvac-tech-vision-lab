import { useEffect, useRef } from 'react';
import { MOVE_SPEED } from '../../logic/worldBounds.js';

const DIRECTIONS = {
  forward: [0, -1],
  back: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

export function useTouchMovement(onMove, enabled = true) {
  const activeRef = useRef(new Set());

  const setDirection = (name, active) => {
    if (active) activeRef.current.add(name);
    else activeRef.current.delete(name);
  };

  useEffect(() => {
    if (!enabled) return undefined;

    let frameId;
    let lastTime = performance.now();

    const tick = (time) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      let dx = 0;
      let dz = 0;
      for (const name of activeRef.current) {
        const [ddx, ddz] = DIRECTIONS[name];
        dx += ddx;
        dz += ddz;
      }

      if (dx !== 0 || dz !== 0) {
        const len = Math.hypot(dx, dz) || 1;
        onMove([(dx / len) * MOVE_SPEED * delta, (dz / len) * MOVE_SPEED * delta]);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, onMove]);

  return { setDirection };
}
