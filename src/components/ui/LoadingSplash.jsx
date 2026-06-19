export default function LoadingSplash({ message = 'Preparing service-call environment...', progress = null }) {
  return (
    <div className="loading-splash" role="status" aria-live="polite">
      <div className="loading-card">
        <p className="loading-eyebrow">HVAC Tech Vision Lab</p>
        <h2>Loading Technician World</h2>
        <p className="loading-message">{message}</p>
        <div className="loading-bar" aria-hidden="true">
          <div
            className="loading-bar-fill"
            style={{ width: progress == null ? undefined : `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
