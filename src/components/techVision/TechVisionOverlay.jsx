import DiagnosticGrid from './DiagnosticGrid.jsx';

export default function TechVisionOverlay() {
  return (
    <>
      <DiagnosticGrid size={14} position={[0, 0.03, 0]} />
      <fog attach="fog" args={['#0a1628', 18, 35]} />
    </>
  );
}
