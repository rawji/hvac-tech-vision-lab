import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTechVision } from './TechVisionProvider.jsx';

export default function DiagnosticGrid({ size = 14, position = [0, 0.03, 0] }) {
  const ref = useRef();
  const { enabled, bootProgress } = useTechVision();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.visible = enabled;
    if (!enabled) return;

    const sweep = bootProgress < 1 ? bootProgress : 1;
    const pulse = 0.12 + Math.sin(state.clock.elapsedTime * 2) * 0.04;
    ref.current.material.opacity = pulse * (0.35 + sweep * 0.65);
    ref.current.scale.set(0.6 + sweep * 0.4, 1, 0.6 + sweep * 0.4);
  });

  if (!enabled) return null;

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={[size, size, 20, 20]} />
      <meshBasicMaterial color="#38bdf8" wireframe transparent opacity={0.15} />
    </mesh>
  );
}
