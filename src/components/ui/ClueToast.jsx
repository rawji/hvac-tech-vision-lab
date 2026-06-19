export default function ClueToast({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="clue-toast clue-toast-enter" role="status">
      <span className="clue-toast-icon" aria-hidden="true">◆</span>
      <span>{message}</span>
      <button type="button" className="btn-icon toast-dismiss" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
