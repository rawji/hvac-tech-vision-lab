export default function DiagnosticScannerButton({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className={`btn scanner-btn ${enabled ? 'active' : ''}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Disable Tech Vision' : 'Enable Tech Vision'}
    >
      <span className="scanner-icon" aria-hidden="true">◎</span>
      {enabled ? 'Tech Vision ON' : 'Tech Vision'}
      <span className="key-hint">V</span>
    </button>
  );
}
