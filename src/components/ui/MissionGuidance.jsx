const STEPS = [
  {
    id: 1,
    label: 'Read the customer complaint',
    hint: 'Review the mission panel. Customer reports weak cooling.',
  },
  {
    id: 2,
    label: 'Walk to equipment',
    hint: 'Click the yard, path, or any equipment to walk there automatically.',
  },
  {
    id: 3,
    label: 'Inspect components',
    hint: 'When you arrive, the inspection card opens — use on-screen actions.',
  },
  {
    id: 4,
    label: 'Toggle Tech Vision',
    hint: 'Tap Tech Vision or the Diagnostic Scanner button for the overlay.',
  },
  {
    id: 5,
    label: 'Scan diagnostic clues',
    hint: 'With Tech Vision ON, choose Scan from the action menu near equipment.',
  },
  {
    id: 6,
    label: 'Choose diagnosis',
    hint: 'Scan at least two components, then submit your diagnosis.',
  },
];

function getCurrentStep(state) {
  if (state.missionCompleted || state.selectedDiagnosis) return 6;
  if (state.scannedTargets.length >= 2) return 6;
  if (state.scannedTargets.length >= 1 || state.techVisionEnabled) return 5;
  if (state.techVisionToggled) return 4;
  if (state.inspectedTargets.length >= 1) return 3;
  if (state.nearbyTarget) return 2;
  return 1;
}

function isStepComplete(stepId, state) {
  switch (stepId) {
    case 1:
      return state.phase === 'mission';
    case 2:
      return Boolean(state.nearbyTarget);
    case 3:
      return state.inspectedTargets.length >= 1;
    case 4:
      return state.techVisionToggled;
    case 5:
      return state.scannedTargets.length >= 2;
    case 6:
      return Boolean(state.selectedDiagnosis) || state.missionCompleted;
    default:
      return false;
  }
}

export default function MissionGuidance({ state }) {
  const currentStep = getCurrentStep(state);

  return (
    <div className="panel mission-guidance">
      <h3>Mission Progress</h3>
      <ol className="guidance-steps">
        {STEPS.map((step) => {
          const complete = isStepComplete(step.id, state);
          const active = step.id === currentStep && !complete;
          return (
            <li
              key={step.id}
              className={`guidance-step ${complete ? 'complete' : ''} ${active ? 'active' : ''}`}
            >
              <span className="step-num">Step {step.id}</span>
              <span className="step-label">{step.label}</span>
              {active && <span className="step-hint">{step.hint}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
