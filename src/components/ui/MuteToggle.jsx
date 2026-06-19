export default function MuteToggle({ muted, onToggle }) {
  return (
    <button
      type="button"
      className={`btn world-btn mute-toggle ${muted ? 'muted' : ''}`}
      onClick={onToggle}
      aria-pressed={muted}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      title={muted ? 'Sound off — click to unmute' : 'Sound on — click to mute'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  );
}
