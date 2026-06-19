export const INTERACTION_RADIUS = 2.2;
export const SELECTION_RANGE = 3.8;

export function distanceToTarget(playerPosition, targetPosition) {
  const [px, , pz] = playerPosition;
  const [tx, , tz] = targetPosition;
  return Math.hypot(px - tx, pz - tz);
}

export function findNearestTarget(playerPosition, targets, radius = INTERACTION_RADIUS) {
  let nearest = null;
  let nearestDist = Infinity;

  for (const target of targets) {
    const dist = distanceToTarget(playerPosition, target.position);
    if (dist < radius && dist < nearestDist) {
      nearest = target;
      nearestDist = dist;
    }
  }

  return nearest;
}

/**
 * Resolve the active interaction target for prompts and keyboard actions.
 * Priority: proximity → pointer/selection → persisted selection (if still reachable).
 */
export function resolveInteractionTarget({
  playerPosition,
  targets,
  proximityTarget,
  selectedTargetId,
  radius = INTERACTION_RADIUS,
  selectionRange = SELECTION_RANGE,
}) {
  if (proximityTarget) {
    return {
      ...proximityTarget,
      inRange: true,
      source: 'proximity',
    };
  }

  if (selectedTargetId) {
    const selected = targets.find((t) => t.id === selectedTargetId);
    if (selected) {
      const dist = distanceToTarget(playerPosition, selected.position);
      if (dist <= selectionRange) {
        return {
          ...selected,
          inRange: dist <= radius,
          source: 'selected',
        };
      }
    }
  }

  return null;
}

export function getTargetById(targets, id) {
  return targets.find((t) => t.id === id) ?? null;
}
