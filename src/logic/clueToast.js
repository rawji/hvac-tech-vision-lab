export function getNewClueToastMessage(previousClues, newClues) {
  const seen = new Set(previousClues.map((c) => c.condition));
  const fresh = newClues.find((c) => !seen.has(c.condition));
  if (!fresh) return null;
  return `Clue logged: ${fresh.condition}`;
}

export function shouldDismissQuickStart(state) {
  return state.inspectedTargets.length >= 1 || state.techVisionToggled || state.scannedTargets.length >= 1;
}
