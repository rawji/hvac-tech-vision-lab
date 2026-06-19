import DiagnosticGrid from './DiagnosticGrid.jsx';
import { useTechVision } from './TechVisionProvider.jsx';
import { TECH_VISION } from '../../data/worldPalette.js';

export default function TechVisionOverlay() {
  const { enabled, bootProgress } = useTechVision();

  return (
    <>
      <DiagnosticGrid size={14} position={[0, 0.03, 0]} />
      {enabled && (
        <fog attach="fog" args={[TECH_VISION.fog, 12 + bootProgress * 5, 30 + bootProgress * 8]} />
      )}
    </>
  );
}
