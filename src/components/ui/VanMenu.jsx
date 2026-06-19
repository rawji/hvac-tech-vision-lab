export default function VanMenu({ onClose, onViewNotes, mission }) {
  return (
    <div className="panel van-menu" role="dialog" aria-label="Service van menu">
      <div className="van-menu-header">
        <h3>Service Van</h3>
        <button type="button" className="btn-icon" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <p className="van-menu-copy">Tools staged and work order loaded for today&apos;s call.</p>
      <ul className="van-menu-list">
        <li>
          <strong>Mission:</strong> {mission?.title ?? 'Service call'}
        </li>
        <li>
          <strong>Complaint:</strong> {mission?.customerComplaint ?? 'No cooling reported'}
        </li>
        <li>
          <strong>Dispatch:</strong> {mission?.objective ?? 'Document on-site observations and measurements.'}
        </li>
      </ul>
      <div className="van-menu-actions">
        <button type="button" className="btn" onClick={() => onViewNotes('serviceVan')}>
          View Work Order Notes
        </button>
        <button type="button" className="btn secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
