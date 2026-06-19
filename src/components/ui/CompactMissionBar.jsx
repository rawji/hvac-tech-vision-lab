export default function CompactMissionBar({
  mission,
  scannedCount,
  techVisionEnabled,
  activeTarget,
  selectedTargetId,
  isNavigating,
}) {
  if (!mission) return null;

  const selectionHint = isNavigating
    ? 'Walking…'
    : activeTarget?.inRange
      ? activeTarget.label
      : selectedTargetId
        ? 'Heading to equipment'
        : 'Click equipment or ground to move';

  return (
    <div className="compact-mission-bar">
      <div className="compact-mission-copy">
        <p className="compact-objective">{mission.title}</p>
        <p className="compact-subline">{mission.objective}</p>
      </div>
      <div className="compact-stats">
        <span className="compact-selection">{selectionHint}</span>
        <span className={techVisionEnabled ? 'vision-on' : ''}>
          Tech Vision {techVisionEnabled ? 'ON' : 'OFF'}
        </span>
        <span>Scans {scannedCount}/2+</span>
      </div>
    </div>
  );
}
