export default function ControlsHelpPanel() {
  return (
    <details className="panel controls-help-panel">
      <summary>Controls &amp; Help</summary>
      <ul className="controls-list">
        <li><kbd>WASD</kbd> / <kbd>Arrow keys</kbd> — move technician</li>
        <li><kbd>E</kbd> — inspect nearby equipment (normal mode)</li>
        <li><kbd>F</kbd> — diagnostic scan when Tech Vision is ON</li>
        <li><kbd>V</kbd> — toggle Tech Vision</li>
        <li>Diagnostic Scanner button — toggle Tech Vision</li>
        <li>Reset View — restore player position and camera</li>
        <li>On-screen arrows — experimental touch movement</li>
      </ul>
      <div className="help-callout">
        <p><strong>Inspect vs Scan</strong></p>
        <p>Inspect works anytime and shows component readings.</p>
        <p>Scan with Tech Vision ON records diagnostic clues toward your diagnosis.</p>
        <p>Tech Vision reveals clues and possible causes — not the final answer.</p>
      </div>
    </details>
  );
}
