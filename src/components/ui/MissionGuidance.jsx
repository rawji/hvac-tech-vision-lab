const STEPS = [
  {
    id: 'move',
    label: 'Walk the property',
    hint: 'Click ground or equipment to move. Inspection runs when you arrive.',
  },
  {
    id: 'inspect',
    label: 'Inspect equipment',
    hint: 'Review the inspection card for visual observations and available readings.',
  },
  {
    id: 'techVision',
    label: 'Enable Tech Vision',
    hint: 'Tap Tech Vision or the scanner button for the field overlay.',
  },
  {
    id: 'scan',
    label: 'Scan and record readings',
    hint: 'Scan components with Tech Vision ON to log measurements.',
  },
  {
    id: 'diagnose',
    label: 'Submit diagnosis',
    hint: 'Scan at least two components, compare readings, then submit your diagnosis.',
  },
];

function stepIndex(state) {
  if (state.missionCompleted || state.selectedDiagnosis) return 6;
  if (state.scannedTargets.length >= 2) return 4;
  if (state.scannedTargets.length >= 1) return 3;
  if (state.techVisionEnabled) return 2;
  if (state.inspectedTargets.length >= 1) return 1;
  return 0;
}

function isStepComplete(stepId, state) {
  switch (stepId) {
    case 'move':
      return state.inspectedTargets.length >= 1 || state.techVisionToggled;
    case 'inspect':
      return state.inspectedTargets.length >= 1;
    case 'techVision':
      return state.techVisionEnabled;
    case 'scan':
      return state.scannedTargets.length >= 2;
    case 'diagnose':
      return Boolean(state.selectedDiagnosis) || state.missionCompleted;
    default:
      return false;
  }
}

export default function MissionGuidance({ state }) {
  const current = stepIndex(state);

  return (
    <div className="panel mission-guidance">
      <h3>Field Workflow</h3>
      <ol className="guidance-steps">
        {STEPS.map((step, index) => {
          const done = isStepComplete(step.id, state);
          const active = index === current;
          return (
            <li key={step.id} className={`guidance-step ${done ? 'done' : ''} ${active ? 'active' : ''}`}>
              <span className="step-label">{step.label}</span>
              {active && <span className="step-hint">{step.hint}</span>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
