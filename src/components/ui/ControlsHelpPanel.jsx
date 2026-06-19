export default function ControlsHelpPanel() {
  return (
    <details className="panel controls-help-panel">
      <summary>Controls &amp; Help</summary>
      <ul className="controls-list">
        <li>Click ground or path — walk to that spot</li>
        <li>Click equipment — walk over and open inspection</li>
        <li>Drag — rotate camera</li>
        <li>Scroll / pinch — zoom camera</li>
        <li>Tap actions — Inspect, Scan, View Notes</li>
        <li>Tech Vision button — enable diagnostic scanning</li>
        <li><kbd>Esc</kbd> — close panels</li>
      </ul>
      <div className="help-callout">
        <p><strong>Optional keyboard shortcuts</strong></p>
        <p><kbd>V</kbd> toggle Tech Vision · <kbd>E</kbd> inspect · <kbd>F</kbd> scan when nearby</p>
        <p>Inspect shows component readings. Scan with Tech Vision ON records diagnostic clues.</p>
      </div>
    </details>
  );
}
