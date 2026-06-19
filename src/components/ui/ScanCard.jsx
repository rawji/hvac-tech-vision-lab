function FieldRow({ field }) {
  const typeLabel = field.type === 'visual' ? 'Visual' : field.type === 'measurement' ? 'Measurement' : 'Reading';

  return (
    <div className="scan-field">
      <span className="field-label">{field.label}</span>
      <span className="field-value">{field.value}</span>
      <span className="field-badge info">{typeLabel}</span>
    </div>
  );
}

export default function ScanCard({
  scanResult,
  interactionMode,
  onClose,
  techVisionEnabled,
  onScan,
  onViewNotes,
}) {
  if (!scanResult) return null;

  const isInspect = interactionMode === 'inspect';

  return (
    <div
      className="panel scan-card clipboard-card"
      role="dialog"
      aria-label={`${isInspect ? 'Inspection' : 'Field scan'} for ${scanResult.label}`}
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
          ? 'Visual inspection complete — enable Tech Vision and scan to record field measurements.'
          : 'Field scan complete — review recorded observations and measurements below.'}
      </p>

      <div className="scan-card-actions">
        {isInspect && (
          <button
            type="button"
            className={`btn btn-small ${techVisionEnabled ? 'btn-accent' : 'disabled'}`}
            onClick={() => (techVisionEnabled ? onScan?.(scanResult.id) : null)}
            disabled={!techVisionEnabled}
          >
            Scan
          </button>
        )}
        <button type="button" className="btn btn-small secondary" onClick={() => onViewNotes?.(scanResult.id)}>
          View Notes
        </button>
      </div>

      <div className="clipboard-divider" />

      <div className="scan-fields clipboard-fields">
        {scanResult.fields.map((field) => (
          <FieldRow key={field.label} field={field} />
        ))}
      </div>

      {scanResult.fieldNotes?.length > 0 && (
        <div className="observed-section clipboard-observed">
          <h4>Field Notes</h4>
          {scanResult.fieldNotes.map((note) => (
            <p key={note} className="observed-condition">
              {note}
            </p>
          ))}
        </div>
      )}

      <footer className="clipboard-footer">
        {isInspect
          ? 'Use Scan to log measurements for your service record.'
          : 'Observations recorded — compare readings before selecting a diagnosis.'}
      </footer>
    </div>
  );
}
