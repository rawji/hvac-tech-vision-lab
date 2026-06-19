export function evaluateDiagnosis(mission, selectedDiagnosis) {
  const isCorrect = selectedDiagnosis === mission.correctDiagnosis;

  return {
    isCorrect,
    selectedDiagnosis,
    correctDiagnosis: mission.correctDiagnosis,
    feedback: isCorrect ? mission.feedback.correct : mission.feedback.incorrect,
    relatedConcepts: mission.relatedConcepts,
  };
}

export function getDiagnosisHint(scannedCount) {
  if (scannedCount === 0) {
    return 'Inspect components in normal mode, then enable Tech Vision and scan at least two targets.';
  }
  if (scannedCount === 1) {
    return 'Scan one more component with Tech Vision ON to gather enough diagnostic clues.';
  }
  return 'Review your clues and select the most likely diagnosis.';
}
