export default function DiagnosisPanel({
  options,
  selectedDiagnosis,
  onSelect,
  onSubmit,
  canSubmit,
  hint,
}) {
  return (
    <div className="panel diagnosis-panel">
      <h3>Choose Diagnosis</h3>
      <p className="hint">{hint}</p>
      <div className="diagnosis-options" role="radiogroup" aria-label="Diagnosis options">
        {options.map((option) => (
          <label key={option} className={`diagnosis-option ${selectedDiagnosis === option ? 'selected' : ''}`}>
            <input
              type="radio"
              name="diagnosis"
              value={option}
              checked={selectedDiagnosis === option}
              onChange={() => onSelect(option)}
            />
            {option}
          </label>
        ))}
      </div>
      <button
        type="button"
        className="btn btn-primary"
        disabled={!canSubmit || !selectedDiagnosis}
        onClick={onSubmit}
      >
        Submit Diagnosis
      </button>
    </div>
  );
}
