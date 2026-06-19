export default function ModeHUD({ techVisionEnabled, scannedCount, nearbyTarget, discoveredCount }) {
  return (
    <div className="mode-hud">
      <div className={`hud-badge ${techVisionEnabled ? 'vision-on' : 'vision-off'}`}>
        Tech Vision: {techVisionEnabled ? 'ON' : 'OFF'}
      </div>
      <div className="hud-badge">Scanned: {scannedCount}</div>
      <div className="hud-badge">Clues: {discoveredCount}</div>
      {nearbyTarget && (
        <div className="hud-badge nearby">Near: {nearbyTarget.label}</div>
      )}
    </div>
  );
}
