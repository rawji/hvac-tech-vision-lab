export default function QuickStartPanel() {
  return (
    <div className="panel quick-start-panel">
      <h3>Quick Start</h3>
      <ol className="quick-start-list">
        <li>
          <strong>Mission:</strong> Customer reports weak cooling — investigate and find the likely cause.
        </li>
        <li>
          <strong>Move:</strong> <kbd>WASD</kbd> or arrow keys toward the house or outdoor condenser.
        </li>
        <li>
          <strong>Inspect:</strong> Stand near equipment and press <kbd>E</kbd>.
        </li>
        <li>
          <strong>Tech Vision:</strong> Press <kbd>V</kbd> or use the Diagnostic Scanner button.
        </li>
        <li>
          <strong>Scan:</strong> With Tech Vision ON, stand near a component and press <kbd>F</kbd>.
        </li>
        <li>
          <strong>Diagnose:</strong> Scan at least two components, choose a cause, and submit.
        </li>
      </ol>
    </div>
  );
}
