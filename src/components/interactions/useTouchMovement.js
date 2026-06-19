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
  const velocityRef = useRef({ x: 0, z: 0 });

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

      const hasInput = ix !== 0 || iz !== 0;
      let mx = 0;
      let mz = 0;

      if (hasInput) {
        const basis = cameraBasisRef?.current;
        mx = ix;
        mz = iz;
        if (basis) {
          mx = basis.right[0] * ix + basis.forward[0] * (-iz);
          mz = basis.right[1] * ix + basis.forward[1] * (-iz);
        }
        const len = Math.hypot(mx, mz) || 1;
        mx /= len;
        mz /= len;
      }

      const accel = hasInput ? 14 : 18;
      velocityRef.current.x += (mx * (hasInput ? 1 : 0) - velocityRef.current.x) * Math.min(accel * delta, 1);
      velocityRef.current.z += (mz * (hasInput ? 1 : 0) - velocityRef.current.z) * Math.min(accel * delta, 1);

      const speed = Math.hypot(velocityRef.current.x, velocityRef.current.z);
      if (speed > 0.02) {
        onMove([
          velocityRef.current.x * MOVE_SPEED * delta,
          velocityRef.current.z * MOVE_SPEED * delta,
        ]);
      } else if (!hasInput) {
        velocityRef.current.x = 0;
        velocityRef.current.z = 0;
      }

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [enabled, onMove, cameraBasisRef]);

  return { setDirection };
}
