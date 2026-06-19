export default function LabLanding({ onStart }) {
  return (
    <div className="lab-landing">
      <div className="lab-landing-inner">
        <p className="lab-eyebrow">HVAC Technician World</p>
        <h1>On-the-Job Troubleshooting Simulator</h1>
        <p className="lab-lead">
          Respond to a service call, walk the property, inspect equipment on arrival, and record field
          measurements with Tech Vision. Compare readings, reason through the evidence, and submit your
          diagnosis when ready.
        </p>
        <ul className="lab-features">
          <li>Click-to-move field navigation</li>
          <li>Automatic inspection on arrival</li>
          <li>Tech Vision overlay for field scans</li>
          <li>Clipboard-style inspection and scan cards</li>
        </ul>
        <button type="button" className="btn btn-primary lab-start-btn" onClick={onStart}>
          Start Service Call
        </button>
      </div>
    </div>
  );
}
