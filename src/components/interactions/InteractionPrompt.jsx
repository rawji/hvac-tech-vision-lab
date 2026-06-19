export default function InteractionPrompt({
  target,
  onInspect,
  onScan,
  techVisionEnabled,
}) {
  if (!target) return null;

  return (
    <div className="interaction-prompt desktop-only">
      <p>
        <strong>{target.label}</strong> nearby
      </p>
      <div className="prompt-actions">
        <button type="button" className="btn btn-small" onClick={() => onInspect(target.id)}>
          Inspect (E)
        </button>
        {techVisionEnabled ? (
          <button type="button" className="btn btn-small btn-accent" onClick={() => onScan(target.id)}>
            Scan (F)
          </button>
        ) : (
          <span className="prompt-hint-inline">Enable Tech Vision to scan</span>
        )}
      </div>
    </div>
  );
}
