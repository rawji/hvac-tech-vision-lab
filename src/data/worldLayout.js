/** Shared world coordinates — keep interaction targets and scene groups aligned. */

export const LOT_SIZE = { width: 42, depth: 38 };

export const WORLD_BOUNDS = { minX: -18, maxX: 18, minZ: -9, maxZ: 15 };

export const DEFAULT_PLAYER_POSITION = [-1.5, 0, 11.5];

export const SCENE = {
  house: [-7.5, 0, 1.5],
  condenser: [11, 0, -1.5],
  airHandler: [-9, 0, -0.5],
  thermostat: [-6, 1.15, 4.6],
  van: [-1.5, 0, 12],
  disconnect: [8.8, 0.55, 1.2],
};

export const INTERACTION_POSITIONS = {
  thermostat: [-6, 0, 4.6],
  filter: [-9, 0, 0],
  airHandler: [-9, 0, -0.5],
  condenser: [11, 0, -1.5],
  condenserCoil: [11, 0, -0.55],
  capacitor: [10.5, 0, -1.1],
  compressor: [11.4, 0, -1.8],
  fanMotor: [11, 0, -1.5],
  contactor: [10.7, 0, -2],
  disconnect: [8.8, 0, 1.2],
  serviceVan: [-1.5, 0, 12],
};
