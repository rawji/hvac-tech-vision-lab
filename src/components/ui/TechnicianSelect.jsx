const TECHNICIANS = [
  { id: 'male', label: 'Male Technician' },
  { id: 'female', label: 'Female Technician' },
];

const APPEARANCES = [
  { id: 'light', label: 'Light appearance' },
  { id: 'dark', label: 'Dark appearance' },
];

export default function TechnicianSelect({ onSelect, onBack }) {
  return (
    <div className="screen select-screen">
      <div className="select-content">
        <h2>Select Your Technician</h2>
        <p>Choose a character for the service call training mission.</p>

        <div className="select-group">
          <h3>Technician</h3>
          <div className="option-grid">
            {TECHNICIANS.map((tech) => (
              APPEARANCES.map((appearance) => (
                <button
                  key={`${tech.id}-${appearance.id}`}
                  type="button"
                  className="option-card"
                  onClick={() => onSelect(tech.id, appearance.id)}
                >
                  <div className={`avatar-preview ${tech.id} ${appearance.id}`} aria-hidden="true" />
                  <span className="option-title">{tech.label}</span>
                  <span className="option-sub">{appearance.label}</span>
                </button>
              ))
            ))}
          </div>
        </div>

        <button type="button" className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
}
