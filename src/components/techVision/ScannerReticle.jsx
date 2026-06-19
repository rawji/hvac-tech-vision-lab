import { useTechVision } from './TechVisionProvider.jsx';

export default function ScannerReticle({ position = [0, 1.2, 0], active = false }) {
  const { enabled, bootProgress } = useTechVision();
  if (!enabled || !active || bootProgress < 0.5) return null;

  const scale = 0.8 + bootProgress * 0.2;

  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.45, 0.52, 32]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.22, 4]} />
        <meshBasicMaterial color="#7dd3fc" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}
