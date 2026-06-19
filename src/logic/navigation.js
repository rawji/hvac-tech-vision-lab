import { clampPosition } from './worldBounds.js';

export const APPROACH_STANDOFF = 1.85;
export const ARRIVAL_THRESHOLD = 0.32;
export const POINT_ARRIVAL_THRESHOLD = 0.28;

export function getApproachPosition(playerPosition, targetPosition, standoff = APPROACH_STANDOFF) {
  const [px, , pz] = playerPosition;
  const [tx, , tz] = targetPosition;

  let dirX = px - tx;
  let dirZ = pz - tz;
  const dist = Math.hypot(dirX, dirZ);

  if (dist < 0.05) {
    dirX = 0;
    dirZ = 1;
  } else {
    dirX /= dist;
    dirZ /= dist;
  }

  return clampPosition(tx + dirX * standoff, tz + dirZ * standoff);
}

export function getFaceAngle(fromPosition, targetPosition) {
  const [fx, , fz] = fromPosition;
  const [tx, , tz] = targetPosition;
  return Math.atan2(tx - fx, tz - fz);
}

export function isAtDestination(playerPosition, destination, threshold = ARRIVAL_THRESHOLD) {
  const [px, , pz] = playerPosition;
  const [dx, dz] = destination;
  return Math.hypot(px - dx, pz - dz) <= threshold;
}

export const VAN_TARGET = {
  id: 'serviceVan',
  label: 'Service Van',
  position: [-0.5, 0, 5.5],
  interactionType: 'van',
};

export const DISCONNECT_TARGET = {
  id: 'disconnect',
  label: 'Disconnect',
  position: [3.2, 0, -0.2],
  interactionType: 'equipment',
};

export function getNavigationTargetById(targets, id) {
  return targets.find((t) => t.id === id) ?? null;
}
