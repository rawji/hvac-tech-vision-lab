import MuteToggle from './MuteToggle.jsx';

export default function WorldControlsOverlay({
  techVisionEnabled,
  onToggleTechVision,
  onResetView,
  muted,
  onToggleMute,
  interactionNotice,
  isNavigating,
  activeTarget,
}) {
  const contextLabel = isNavigating
    ? 'Walking to destination…'
    : activeTarget?.inRange
      ? `At ${activeTarget.label}`
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

      {(contextLabel || interactionNotice) && (
        <div className="world-controls-context">
          {contextLabel && <p className="context-label">{contextLabel}</p>}
          {interactionNotice && <p className="context-notice">{interactionNotice}</p>}
        </div>
      )}
    </div>
  );
}
