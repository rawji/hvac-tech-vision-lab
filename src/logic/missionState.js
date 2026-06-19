import { buildScanResult } from '../data/scanDefinitions.js';
import { DEFAULT_PLAYER_POSITION } from '../data/worldLayout.js';
import { mergeClues } from './diagnosticRules.js';
import { getNewClueToastMessage } from './clueToast.js';

export const APP_PHASE = {
  LANDING: 'landing',
  TECHNICIAN_SELECT: 'technician_select',
  MISSION: 'mission',
  COMPLETE: 'complete',
};

export const initialMissionState = {
  phase: APP_PHASE.LANDING,
  selectedTechnician: null,
  selectedAppearance: null,
  currentMissionId: null,
  playerPosition: [...DEFAULT_PLAYER_POSITION],
  nearbyTarget: null,
  selectedTargetId: null,
  selectedScanTarget: null,
  activeScanResult: null,
  interactionMode: null,
  techVisionEnabled: false,
  techVisionToggled: false,
  discoveredClues: [],
  inspectedTargets: [],
  scannedTargets: [],
  selectedDiagnosis: null,
  missionCompleted: false,
  feedback: null,
  cameraResetKey: 0,
  clueToast: null,
  scanPulseTarget: null,
  inspectPulseTarget: null,
  interactionNotice: null,
};

export function missionReducer(state, action) {
  switch (action.type) {
    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'SELECT_TECHNICIAN':
      return {
        ...state,
        selectedTechnician: action.technician,
        selectedAppearance: action.appearance,
        phase: APP_PHASE.MISSION,
        currentMissionId: action.missionId,
      };

    case 'SET_PLAYER_POSITION':
      return { ...state, playerPosition: action.position };

    case 'SET_NEARBY_TARGET':
      return { ...state, nearbyTarget: action.target };

    case 'SELECT_TARGET':
      return {
        ...state,
        selectedTargetId: action.targetId,
        interactionNotice: null,
      };

    case 'SHOW_INTERACTION_NOTICE':
      return { ...state, interactionNotice: action.message };

    case 'CLEAR_INTERACTION_NOTICE':
      return { ...state, interactionNotice: null };

    case 'TOGGLE_TECH_VISION': {
      const enabled = action.enabled ?? !state.techVisionEnabled;
      return {
        ...state,
        techVisionEnabled: enabled,
        techVisionToggled: state.techVisionToggled || enabled,
      };
    }

    case 'INSPECT_TARGET': {
      const scanResult = buildScanResult(action.targetId, action.equipmentHealth);
      if (!scanResult) return state;

      const inspectedTargets = state.inspectedTargets.includes(action.targetId)
        ? state.inspectedTargets
        : [...state.inspectedTargets, action.targetId];

      return {
        ...state,
        selectedScanTarget: action.targetId,
        selectedTargetId: action.targetId,
        activeScanResult: scanResult,
        interactionMode: 'inspect',
        inspectedTargets,
        inspectPulseTarget: action.targetId,
      };
    }

    case 'SCAN_TARGET': {
      const scanResult = buildScanResult(action.targetId, action.equipmentHealth);
      if (!scanResult) return state;

      const scannedTargets = state.scannedTargets.includes(action.targetId)
        ? state.scannedTargets
        : [...state.scannedTargets, action.targetId];

      const discoveredClues = mergeClues(state.discoveredClues, scanResult.observedConditions);
      const clueToast = getNewClueToastMessage(state.discoveredClues, discoveredClues);

      return {
        ...state,
        selectedScanTarget: action.targetId,
        selectedTargetId: action.targetId,
        activeScanResult: scanResult,
        interactionMode: 'scan',
        scannedTargets,
        discoveredClues,
        clueToast: clueToast ?? state.clueToast,
        scanPulseTarget: action.targetId,
      };
    }

    case 'CLEAR_INSPECT_PULSE':
      return { ...state, inspectPulseTarget: null };

    case 'CLEAR_CLUE_TOAST':
      return { ...state, clueToast: null };

    case 'CLEAR_SCAN_PULSE':
      return { ...state, scanPulseTarget: null };

    case 'CLEAR_SCAN':
      return {
        ...state,
        selectedScanTarget: null,
        activeScanResult: null,
        interactionMode: null,
      };

    case 'RESET_VIEW':
      return {
        ...state,
        playerPosition: [...DEFAULT_PLAYER_POSITION],
        cameraResetKey: state.cameraResetKey + 1,
      };

    case 'SELECT_DIAGNOSIS':
      return { ...state, selectedDiagnosis: action.diagnosis };

    case 'SUBMIT_DIAGNOSIS':
      return {
        ...state,
        missionCompleted: true,
        feedback: action.feedback,
        phase: APP_PHASE.COMPLETE,
      };

    case 'RESET_MISSION':
      return {
        ...initialMissionState,
        phase: APP_PHASE.LANDING,
      };

    default:
      return state;
  }
}

export function canSubmitDiagnosis(state) {
  return state.scannedTargets.length >= 2 && !state.missionCompleted;
}
