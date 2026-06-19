export default function DiagnosticScannerButton({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className={`btn scanner-btn ${enabled ? 'active' : ''}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Disable Tech Vision diagnostic scanner' : 'Enable Tech Vision diagnostic scanner'}
    >
      <span className="scanner-icon" aria-hidden="true">◎</span>
      {enabled ? 'Tech Vision ON' : 'Diagnostic Scanner'}
      <span className="key-hint">V</span>
    </button>
  );
}
