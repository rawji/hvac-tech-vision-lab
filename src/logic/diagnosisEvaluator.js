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
    return 'Inspect equipment on site, then enable Tech Vision and scan at least two targets to record measurements.';
  }
  if (scannedCount === 1) {
    return 'Scan one more component with Tech Vision ON to gather additional field readings.';
  }
  return 'Review your recorded observations and select your diagnosis.';
}
