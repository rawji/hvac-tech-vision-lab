import MuteToggle from './MuteToggle.jsx';

export default function WorldControlsOverlay({
  nearbyTarget,
  techVisionEnabled,
  onToggleTechVision,
  onInspect,
  onScan,
  onResetView,
  muted,
  onToggleMute,
}) {
  const primaryAction = nearbyTarget
    ? techVisionEnabled
      ? { label: `Scan ${nearbyTarget.label}`, action: () => onScan(nearbyTarget.id), variant: 'accent' }
      : { label: `Inspect ${nearbyTarget.label}`, action: () => onInspect(nearbyTarget.id), variant: 'primary' }
    : null;

  return (
    <div className="world-controls-overlay">
      <div className="world-controls-top">
        <MuteToggle muted={muted} onToggle={onToggleMute} />
        <button
          type="button"
          className={`btn world-btn ${techVisionEnabled ? 'active' : ''}`}
          onClick={onToggleTechVision}
          aria-pressed={techVisionEnabled}
        >
          {techVisionEnabled ? 'Tech Vision ON' : 'Tech Vision'}
        </button>
        <button type="button" className="btn world-btn secondary" onClick={onResetView}>
          Reset View
        </button>
      </div>

      {nearbyTarget && (
        <div className="world-controls-context">
          <p className="context-label">Near: {nearbyTarget.label}</p>
          <div className="context-actions">
            <button
              type="button"
              className="btn world-action-btn"
              onClick={() => onInspect(nearbyTarget.id)}
            >
              Inspect
            </button>
            {techVisionEnabled && (
              <button
                type="button"
                className="btn world-action-btn accent"
                onClick={() => onScan(nearbyTarget.id)}
              >
                Scan
              </button>
            )}
          </div>
        </div>
      )}

      {primaryAction && (
        <button
          type="button"
          className={`btn world-primary-action ${primaryAction.variant}`}
          onClick={primaryAction.action}
        >
          {primaryAction.label}
        </button>
      )}
    </div>
  );
}
