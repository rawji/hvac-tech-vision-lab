export default function InteractionPrompt({
  target,
  onInspect,
  onScan,
  techVisionEnabled,
}) {
  if (!target) return null;

  return (
    <div className="interaction-prompt">
      <p>
        <strong>{target.label}</strong> nearby
      </p>
      <p className="prompt-detail">
        <strong>Inspect (E)</strong> — view component readings in normal mode.
      </p>
      <p className="prompt-detail">
        <strong>Scan (F)</strong> — record diagnostic clues when Tech Vision is ON.
      </p>
      {!techVisionEnabled && (
        <p className="prompt-hint">Toggle Tech Vision before scanning for full diagnostic clues.</p>
      )}
      <div className="prompt-actions">
        <button type="button" className="btn btn-small" onClick={() => onInspect(target.id)}>
          Inspect (E)
        </button>
        <button
          type="button"
          className="btn btn-small btn-accent"
          onClick={() => onScan(target.id)}
          disabled={!techVisionEnabled}
          title={techVisionEnabled ? 'Run diagnostic scan' : 'Enable Tech Vision to scan'}
        >
          Scan (F)
        </button>
      </div>
    </div>
  );
}
