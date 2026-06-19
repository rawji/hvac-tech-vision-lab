export default function ResetViewButton({ onReset }) {
  return (
    <button
      type="button"
      className="btn btn-secondary reset-view-btn"
      onClick={onReset}
      aria-label="Reset player position and camera view"
    >
      Reset View
    </button>
  );
}
