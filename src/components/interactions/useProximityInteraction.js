import { useMemo } from 'react';

export function useProximityInteraction(playerPosition, targets, radius = 2.2) {
  return useMemo(() => {
    const [px, , pz] = playerPosition;
    let nearest = null;
    let nearestDist = Infinity;

    for (const target of targets) {
      const [tx, , tz] = target.position;
      const dist = Math.hypot(px - tx, pz - tz);
      if (dist < radius && dist < nearestDist) {
        nearest = target;
        nearestDist = dist;
      }
    }

    return nearest;
  }, [playerPosition, targets, radius]);
}
