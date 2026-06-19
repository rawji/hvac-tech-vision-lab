function AsciiHeader({ title }) {
  const bar = '|||||||||||||';
  return (
    <div className="ascii-header" aria-hidden="true">
      <pre>{bar}</pre>
      <pre>{`|| ${title} ||`}</pre>
      <pre>{bar}</pre>
    </div>
  );
}

function FieldRow({ field }) {
  return (
    <div className={`scan-field ${field.category}`}>
      <span className="field-label">{field.label}:</span>
      <span className="field-value">{field.value}</span>
      <span className={`field-badge ${field.category}`}>{field.category}</span>
    </div>
  );
}

export default function ScanCard({ scanResult, interactionMode, onClose }) {
  if (!scanResult) return null;

  const isInspect = interactionMode === 'inspect';

  return (
    <div className="panel scan-card" role="dialog" aria-label={`${isInspect ? 'Inspection' : 'Scan'} results for ${scanResult.label}`}>
      <div className="scan-card-header">
        <h3>{scanResult.title}</h3>
        <button type="button" className="btn-icon" onClick={onClose} aria-label="Close scan card">
          ×
        </button>
      </div>

      {isInspect ? (
        <p className="scan-mode-note inspect-note">
          Inspection reading — enable Tech Vision and scan to record diagnostic clues.
        </p>
      ) : (
        <p className="scan-mode-note scan-note">
          Diagnostic scan — clues recorded. Tech Vision shows symptoms, not the final answer.
        </p>
      )}

      <AsciiHeader title={scanResult.label.toUpperCase()} />

      <div className="scan-fields">
        {scanResult.fields.map((field) => (
          <FieldRow key={field.label} field={field} />
        ))}
      </div>

      {scanResult.observedConditions?.length > 0 && (
        <div className="observed-section">
          <h4>Observed Conditions</h4>
          {scanResult.observedConditions.map((item) => (
            <div key={item.condition} className="observed-item">
              <p className="observed-condition">{item.condition}</p>
              <p className="possible-label">Possible Causes:</p>
              <ul>
                {item.possibleCauses.map((cause) => (
                  <li key={cause}>{cause}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
