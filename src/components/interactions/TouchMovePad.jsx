export default function TouchMovePad({ setDirection }) {
  const bind = (name) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setDirection(name, true);
    },
    onPointerUp: (e) => {
      e.preventDefault();
      setDirection(name, false);
    },
    onPointerLeave: (e) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        setDirection(name, false);
      }
    },
    onPointerCancel: () => setDirection(name, false),
  });

  return (
    <div className="touch-move-pad" aria-label="On-screen movement controls">
      <button type="button" className="touch-btn touch-up" aria-label="Move forward" {...bind('forward')}>
        ▲
      </button>
      <div className="touch-row">
        <button type="button" className="touch-btn touch-left" aria-label="Move left" {...bind('left')}>
          ◀
        </button>
        <button type="button" className="touch-btn touch-right" aria-label="Move right" {...bind('right')}>
          ▶
        </button>
      </div>
      <button type="button" className="touch-btn touch-down" aria-label="Move back" {...bind('back')}>
        ▼
      </button>
      <p className="touch-note">Touch controls · Desktop keyboard recommended</p>
    </div>
  );
}
