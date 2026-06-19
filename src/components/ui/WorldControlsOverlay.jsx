import MuteToggle from './MuteToggle.jsx';

export default function WorldControlsOverlay({
  activeTarget,
  selectedTargetId,
  techVisionEnabled,
  onToggleTechVision,
  onInspect,
  onScan,
  onResetView,
  muted,
  onToggleMute,
  interactionNotice,
}) {
  const targetLabel = activeTarget?.label ?? (selectedTargetId ? 'Selected equipment' : null);
  const inRange = Boolean(activeTarget?.inRange);
  const canScan = inRange && techVisionEnabled;
  const canInspect = inRange;

  const primaryAction = activeTarget
    ? techVisionEnabled
      ? {
          label: canScan ? `Scan ${activeTarget.label}` : `Move closer to scan`,
          action: () => (canScan ? onScan(activeTarget.id) : null),
          variant: 'accent',
          disabled: !canScan,
        }
      : {
          label: canInspect ? `Inspect ${activeTarget.label}` : `Move closer to inspect`,
          action: () => (canInspect ? onInspect(activeTarget.id) : null),
          variant: 'primary',
          disabled: !canInspect,
        }
    : selectedTargetId
      ? {
          label: 'Move closer to interact',
          action: () => {},
          variant: 'primary',
          disabled: true,
        }
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

      {(targetLabel || interactionNotice) && (
        <div className="world-controls-context">
          {targetLabel && (
            <p className="context-label">
              {inRange ? 'Ready:' : 'Selected:'} {activeTarget?.label ?? targetLabel}
              {!inRange && selectedTargetId ? ' — move closer' : ''}
            </p>
          )}
          {interactionNotice && <p className="context-notice">{interactionNotice}</p>}
          {activeTarget && inRange && (
            <div className="context-actions">
              <button
                type="button"
                className="btn world-action-btn"
                onClick={() => onInspect(activeTarget.id)}
              >
                Inspect
              </button>
              <button
                type="button"
                className={`btn world-action-btn accent ${techVisionEnabled ? '' : 'disabled'}`}
                onClick={() => (techVisionEnabled ? onScan(activeTarget.id) : null)}
                disabled={!techVisionEnabled}
                title={techVisionEnabled ? 'Scan with Tech Vision' : 'Enable Tech Vision to scan'}
              >
                Scan
              </button>
            </div>
          )}
        </div>
      )}

      {primaryAction && (
        <button
          type="button"
          className={`btn world-primary-action ${primaryAction.variant} ${primaryAction.disabled ? 'disabled' : ''}`}
          onClick={primaryAction.action}
          disabled={primaryAction.disabled}
        >
          {primaryAction.label}
        </button>
      )}
    </div>
  );
}
