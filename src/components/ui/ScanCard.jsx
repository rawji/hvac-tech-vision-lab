function FieldRow({ field }) {
  return (
    <div className={`scan-field ${field.category}`}>
      <span className="field-label">{field.label}</span>
      <span className="field-value">{field.value}</span>
      <span className={`field-badge ${field.category}`}>{field.category}</span>
    </div>
  );
}

export default function ScanCard({ scanResult, interactionMode, onClose }) {
  if (!scanResult) return null;

  const isInspect = interactionMode === 'inspect';

  return (
    <div
      className="panel scan-card clipboard-card"
      role="dialog"
      aria-label={`${isInspect ? 'Inspection' : 'Scan'} results for ${scanResult.label}`}
    >
      <div className="clipboard-tab">{isInspect ? 'INSPECTION' : 'FIELD SCAN'}</div>

      <div className="scan-card-header">
        <div className="clipboard-heading">
          <p className="clipboard-meta">Technician readout · {scanResult.label}</p>
          <h3>{scanResult.title}</h3>
        </div>
        <button type="button" className="btn-icon clipboard-close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <p className={`scan-mode-note ${isInspect ? 'inspect-note' : 'scan-note'}`}>
        {isInspect
          ? 'Visual inspection — enable Tech Vision and scan to log diagnostic clues.'
          : 'Diagnostic scan logged — review symptoms and possible causes below.'}
      </p>

      <div className="clipboard-divider" />

      <div className="scan-fields clipboard-fields">
        {scanResult.fields.map((field) => (
          <FieldRow key={field.label} field={field} />
        ))}
      </div>

      {scanResult.observedConditions?.length > 0 && (
        <div className="observed-section clipboard-observed">
          <h4>Observed Conditions</h4>
          {scanResult.observedConditions.map((item) => (
            <div key={item.condition} className="observed-item">
              <p className="observed-condition">{item.condition}</p>
              <p className="possible-label">Possible causes</p>
              <ul>
                {item.possibleCauses.map((cause) => (
                  <li key={cause}>{cause}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <footer className="clipboard-footer">
        {isInspect ? 'Record notes before scanning.' : 'Clue candidates recorded — reason before final diagnosis.'}
      </footer>
    </div>
  );
}
