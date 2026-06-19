export default function LabLanding({ onStart }) {
  return (
    <div className="screen landing-screen">
      <div className="landing-content">
        <p className="eyebrow">HVAC Technician World</p>
        <h1>Service Call Practice</h1>
        <p className="subtitle">
          A compact browser-native neighborhood scene for HVAC field-service practice.
        </p>
        <p className="demo-notice">
          Click to move and inspect — mouse on desktop, touch on mobile. No keyboard required.
        </p>
        <p className="description">
          You are the technician on a living service call. Click the yard or equipment to walk
          there, inspect systems as you arrive, enable Tech Vision to log diagnostic clues, and
          reason through the call like you would in the field.
        </p>
        <ul className="feature-list">
          <li>Handcrafted residential service-call diorama</li>
          <li>Click-to-move navigation and contextual inspection</li>
          <li>Tech Vision diagnostic overlay for field scans</li>
          <li>Clipboard-style readouts and service reasoning</li>
        </ul>
        <button type="button" className="btn btn-primary" onClick={onStart}>
          Start Service Call
        </button>
        <p className="disclaimer">
          Standalone practice world — separate from the 2D HVAC/EPA curriculum app.
        </p>
      </div>
    </div>
  );
}
