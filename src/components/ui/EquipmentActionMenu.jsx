import { getNavigationTargetById } from '../../logic/navigation.js';
import { INTERACTION_TARGETS } from '../../data/interactionTargets.js';

export default function EquipmentActionMenu({
  targetId,
  techVisionEnabled,
  onInspect,
  onScan,
  onViewNotes,
  onClose,
}) {
  if (!targetId) return null;

  const target = getNavigationTargetById(INTERACTION_TARGETS, targetId);
  if (!target || target.interactionType === 'van') return null;

  const inspectLabel =
    targetId === 'thermostat'
      ? 'Read Thermostat'
      : targetId === 'disconnect'
        ? 'Inspect Disconnect'
        : 'Inspect';

  return (
    <div className="equipment-action-menu" role="toolbar" aria-label={`Actions for ${target.label}`}>
      <p className="action-menu-title">{target.label}</p>
      <div className="action-menu-buttons">
        <button type="button" className="btn action-menu-btn" onClick={() => onInspect(targetId)}>
          {inspectLabel}
        </button>
        <button
          type="button"
          className={`btn action-menu-btn accent ${techVisionEnabled ? '' : 'disabled'}`}
          onClick={() => (techVisionEnabled ? onScan(targetId) : null)}
          disabled={!techVisionEnabled}
          title={techVisionEnabled ? 'Run diagnostic scan' : 'Enable Tech Vision to scan'}
        >
          Scan
        </button>
        <button type="button" className="btn action-menu-btn secondary" onClick={() => onViewNotes(targetId)}>
          View Notes
        </button>
        <button type="button" className="btn-icon action-menu-close" onClick={onClose} aria-label="Dismiss actions">
          ×
        </button>
      </div>
    </div>
  );
}
