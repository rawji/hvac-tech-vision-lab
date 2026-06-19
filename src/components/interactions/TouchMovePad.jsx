export default function TouchMovePad({ setDirection }) {
  const bind = (name) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      e.stopPropagation();
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
    <div className="touch-move-pad" aria-label="Movement pad">
      <button type="button" className="touch-btn touch-up" aria-label="Move forward" {...bind('forward')}>
        ▲
      </button>
      <div className="touch-row">
        <button type="button" className="touch-btn touch-left" aria-label="Move left" {...bind('left')}>
          ◀
        </button>
        <div className="touch-center" aria-hidden="true" />
        <button type="button" className="touch-btn touch-right" aria-label="Move right" {...bind('right')}>
          ▶
        </button>
      </div>
      <button type="button" className="touch-btn touch-down" aria-label="Move back" {...bind('back')}>
        ▼
      </button>
    </div>
  );
}
