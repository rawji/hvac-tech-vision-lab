export default function ControlsHelpPanel() {
  return (
    <details className="panel controls-help-panel">
      <summary>Controls &amp; Help</summary>
      <ul className="controls-list">
        <li><kbd>WASD</kbd> / <kbd>Arrow keys</kbd> — move technician (camera-relative)</li>
        <li><kbd>Right-drag</kbd> — gently adjust camera angle</li>
        <li>Click equipment — select / focus target</li>
        <li><kbd>E</kbd> — inspect nearby or selected equipment</li>
        <li><kbd>F</kbd> — diagnostic scan when Tech Vision is ON</li>
        <li><kbd>V</kbd> — toggle Tech Vision</li>
        <li><kbd>Esc</kbd> — close scan card or hide mission details</li>
        <li>Touch pad — move on mobile (camera-relative)</li>
        <li>Reset View — restore player position and camera</li>
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
