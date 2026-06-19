export default function CompactMissionBar({
  mission,
  scannedCount,
  techVisionEnabled,
  activeTarget,
  selectedTargetId,
}) {
  if (!mission) return null;

  const selectionHint = activeTarget?.inRange
    ? activeTarget.label
    : selectedTargetId
      ? 'Walk to selected equipment'
      : null;

  return (
    <div className="compact-mission-bar">
      <p className="compact-objective">{mission.objective}</p>
      <div className="compact-stats">
        {selectionHint && <span className="compact-selection">{selectionHint}</span>}
        <span className={techVisionEnabled ? 'vision-on' : ''}>
          Tech Vision {techVisionEnabled ? 'ON' : 'OFF'}
        </span>
        <span>Scans {scannedCount}/2+</span>
      </div>
    </div>
  );
}
