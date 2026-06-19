import { DISCONNECT_TARGET, VAN_TARGET } from '../logic/navigation.js';
import { INTERACTION_POSITIONS } from './worldLayout.js';

export const INTERACTION_TARGETS = [
  { id: 'thermostat', label: 'Thermostat', position: INTERACTION_POSITIONS.thermostat },
  { id: 'filter', label: 'Filter', position: INTERACTION_POSITIONS.filter },
  { id: 'airHandler', label: 'Air Handler', position: INTERACTION_POSITIONS.airHandler },
  { id: 'condenser', label: 'Condenser Unit', position: INTERACTION_POSITIONS.condenser },
  { id: 'condenserCoil', label: 'Condenser Coil', position: INTERACTION_POSITIONS.condenserCoil },
  { id: 'capacitor', label: 'Capacitor', position: INTERACTION_POSITIONS.capacitor },
  { id: 'compressor', label: 'Compressor', position: INTERACTION_POSITIONS.compressor },
  { id: 'fanMotor', label: 'Fan Motor', position: INTERACTION_POSITIONS.fanMotor },
  { id: 'contactor', label: 'Contactor', position: INTERACTION_POSITIONS.contactor },
  DISCONNECT_TARGET,
  VAN_TARGET,
];

export const NAVIGATION_TARGETS = INTERACTION_TARGETS;
