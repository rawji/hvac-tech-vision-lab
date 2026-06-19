export default function ClueToast({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="clue-toast" role="status">
      <span>{message}</span>
      <button type="button" className="btn-icon toast-dismiss" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
