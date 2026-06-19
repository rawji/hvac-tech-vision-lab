import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTechVision } from './TechVisionProvider.jsx';

export default function WireframeHighlight({ children, color = '#60a5fa', active = true }) {
  const groupRef = useRef();
  const { enabled } = useTechVision();

  useFrame((state) => {
    if (!groupRef.current || !enabled || !active) return;
    groupRef.current.visible = enabled;
    const pulse = 0.85 + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    groupRef.current.scale.setScalar(pulse);
  });

  if (!enabled || !active) return null;

  return (
    <group ref={groupRef}>
      <mesh>
        {children}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
