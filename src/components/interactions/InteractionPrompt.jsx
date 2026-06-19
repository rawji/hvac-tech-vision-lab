export default function InteractionPrompt({
  target,
  onInspect,
  onScan,
  techVisionEnabled,
}) {
  if (!target) return null;

  const inRange = target.inRange !== false;

  return (
    <div className="interaction-prompt desktop-only">
      <p>
        <strong>{target.label}</strong>
        {inRange ? ' ready' : ' selected — move closer'}
      </p>
      <div className="prompt-actions">
        <button
          type="button"
          className="btn btn-small"
          onClick={() => onInspect(target.id)}
          disabled={!inRange}
        >
          Inspect (E)
        </button>
        {techVisionEnabled ? (
          <button
            type="button"
            className="btn btn-small btn-accent"
            onClick={() => onScan(target.id)}
            disabled={!inRange}
          >
            Scan (F)
          </button>
        ) : (
          <span className="prompt-hint-inline">Enable Tech Vision to scan</span>
        )}
      </div>
    </div>
  );
}
