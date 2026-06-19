import { useMemo } from 'react';

export function useScannerTarget(nearbyTarget, techVisionEnabled) {
  return useMemo(() => {
    if (!techVisionEnabled || !nearbyTarget) return null;
    return nearbyTarget;
  }, [nearbyTarget, techVisionEnabled]);
}
