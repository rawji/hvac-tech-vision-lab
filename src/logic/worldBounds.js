import { DEFAULT_PLAYER_POSITION, WORLD_BOUNDS } from '../data/worldLayout.js';

export { DEFAULT_PLAYER_POSITION, WORLD_BOUNDS };
export const MOVE_SPEED = 4.5;

export function clampPosition(x, z) {
  return [
    Math.max(WORLD_BOUNDS.minX, Math.min(WORLD_BOUNDS.maxX, x)),
    0,
    Math.max(WORLD_BOUNDS.minZ, Math.min(WORLD_BOUNDS.maxZ, z)),
  ];
}

export function applyMovementDelta(position, dx, dz) {
  const [x, , z] = position;
  return clampPosition(x + dx, z + dz);
}
