import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTechVision } from './TechVisionProvider.jsx';

export default function DiagnosticGrid({ size = 8, position = [0, 0.02, 0] }) {
  const ref = useRef();
  const { enabled } = useTechVision();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.visible = enabled;
    if (enabled) {
      ref.current.material.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  if (!enabled) return null;

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={[size, size, 16, 16]} />
      <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.15} />
    </mesh>
  );
}
