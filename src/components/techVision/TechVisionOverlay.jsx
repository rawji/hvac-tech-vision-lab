import DiagnosticGrid from './DiagnosticGrid.jsx';
import { useTechVision } from './TechVisionProvider.jsx';

export default function TechVisionOverlay() {
  const { enabled, bootProgress } = useTechVision();

  return (
    <>
      <DiagnosticGrid size={14} position={[0, 0.03, 0]} />
      {enabled && (
        <fog attach="fog" args={['#0a1628', 14 + bootProgress * 4, 32 + bootProgress * 6]} />
      )}
    </>
  );
}
