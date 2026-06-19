import { DISCONNECT_TARGET, VAN_TARGET } from '../logic/navigation.js';

export const INTERACTION_TARGETS = [
  { id: 'thermostat', label: 'Thermostat', position: [-2.4, 0, 0.35] },
  { id: 'filter', label: 'Filter', position: [-4.5, 0, -0.5] },
  { id: 'airHandler', label: 'Air Handler', position: [-4.5, 0, -1] },
  { id: 'condenser', label: 'Condenser Unit', position: [4, 0, -1] },
  { id: 'condenserCoil', label: 'Condenser Coil', position: [4, 0, 0] },
  { id: 'capacitor', label: 'Capacitor', position: [3.5, 0, -0.6] },
  { id: 'compressor', label: 'Compressor', position: [4.4, 0, -1.3] },
  { id: 'fanMotor', label: 'Fan Motor', position: [4, 0, -1] },
  { id: 'contactor', label: 'Contactor', position: [3.7, 0, -1.5] },
  DISCONNECT_TARGET,
  VAN_TARGET,
];

export const NAVIGATION_TARGETS = INTERACTION_TARGETS;
