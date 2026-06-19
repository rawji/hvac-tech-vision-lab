import { useEffect, useRef } from 'react';
import { MOVE_SPEED } from '../../logic/worldBounds.js';

const DIRECTIONS = {
  forward: [0, -1],
  back: [0, 1],
  left: [-1, 0],
  right: [1, 0],
};

export function useTouchMovement(onMove, enabled = true, cameraBasisRef) {
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

      let ix = 0;
      let iz = 0;
      for (const name of activeRef.current) {
        const [dx, dz] = DIRECTIONS[name];
        ix += dx;
        iz += dz;
      }

      if (ix !== 0 || iz !== 0) {
        const basis = cameraBasisRef?.current;
        let mx = ix;
        let mz = iz;
        if (basis) {
          mx = basis.right[0] * ix + basis.forward[0] * (-iz);
          mz = basis.right[1] * ix + basis.forward[1] * (-iz);
        }
        const len = Math.hypot(mx, mz) || 1;
        onMove([(mx / len) * MOVE_SPEED * delta, (mz / len) * MOVE_SPEED * delta]);
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, onMove, cameraBasisRef]);

  return { setDirection };
}
