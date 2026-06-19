export default function CompactMissionBar({ mission, scannedCount, techVisionEnabled }) {
  if (!mission) return null;

  return (
    <div className="compact-mission-bar">
      <p className="compact-objective">{mission.objective}</p>
      <div className="compact-stats">
        <span className={techVisionEnabled ? 'vision-on' : ''}>
          Tech Vision {techVisionEnabled ? 'ON' : 'OFF'}
        </span>
        <span>Scans {scannedCount}/2+</span>
      </div>
    </div>
  );
}
