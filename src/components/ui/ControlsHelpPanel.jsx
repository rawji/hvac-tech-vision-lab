export default function ControlsHelpPanel() {
  return (
    <div className="panel controls-help">
      <h3>Controls</h3>
      <ul>
        <li>Click / tap — walk to ground or equipment</li>
        <li>Drag — rotate camera (360°)</li>
        <li>Scroll / pinch — zoom</li>
        <li>Tech Vision button — enable field measurement overlay</li>
        <li>E / F — inspect or scan nearby equipment (keyboard)</li>
        <li>V — toggle Tech Vision (keyboard)</li>
      </ul>
      <div className="controls-help-note">
        <p>Inspect shows visual observations and available readings. Scan with Tech Vision ON records field measurements.</p>
      </div>
    </div>
  );
}
