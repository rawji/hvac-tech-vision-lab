import { useTechVision } from './TechVisionProvider.jsx';

export default function ScannerReticle({ position = [0, 1.2, 0], active = false }) {
  const { enabled } = useTechVision();
  if (!enabled || !active) return null;

  return (
    <mesh position={position} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.4, 0.5, 32]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0.7} />
    </mesh>
  );
}
