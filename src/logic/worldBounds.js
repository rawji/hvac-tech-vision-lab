export const WORLD_BOUNDS = { minX: -7, maxX: 7, minZ: -6, maxZ: 7 };
export const DEFAULT_PLAYER_POSITION = [0, 0, 4];
export const MOVE_SPEED = 4;

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
