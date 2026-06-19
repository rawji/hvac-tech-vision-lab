export function getNewClueToastMessage(previousClues, newClues) {
  const seen = new Set(previousClues.map((c) => c.condition));
  const fresh = newClues.find((c) => !seen.has(c.condition));
  if (!fresh) return null;
  return `Observation logged: ${fresh.condition}`;
}

import { DEFAULT_PLAYER_POSITION } from '../data/worldLayout.js';

const QUICK_START_ORIGIN = [...DEFAULT_PLAYER_POSITION];

export function shouldDismissQuickStart(state) {
  const [x, , z] = state.playerPosition;
  const movedFromStart = Math.hypot(x - QUICK_START_ORIGIN[0], z - QUICK_START_ORIGIN[2]) > 1.2;

  return (
    movedFromStart ||
    state.inspectedTargets.length >= 1 ||
    state.techVisionToggled ||
    state.scannedTargets.length >= 1
  );
}
