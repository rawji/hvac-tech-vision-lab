export default function LabLanding({ onStart }) {
  return (
    <div className="screen landing-screen">
      <div className="landing-content">
        <p className="eyebrow">HVAC Technician World</p>
        <h1>HVAC Tech Vision Lab</h1>
        <p className="subtitle">
          Learn it in 2D. Practice it in 3D. Diagnose it with Tech Vision.
        </p>
        <p className="demo-notice">
          Desktop recommended for this early WebGL proof-of-concept. Mobile touch controls are experimental.
        </p>
        <p className="description">
          A compact WebGL training world for applied HVAC service-call practice.
          Walk the scene, inspect equipment, activate Tech Vision, scan diagnostic
          clues, and reason through real troubleshooting scenarios.
        </p>
        <ul className="feature-list">
          <li>Stylized residential service-call environment</li>
          <li>Tech Vision diagnostic overlay (press V)</li>
          <li>Component scanning and clue discovery</li>
          <li>Educational diagnosis feedback</li>
        </ul>
        <button type="button" className="btn btn-primary" onClick={onStart}>
          Enter Technician World
        </button>
        <p className="disclaimer">
          Separate experimental lab — not connected to the 2D HVAC/EPA curriculum.
        </p>
      </div>
    </div>
  );
}
