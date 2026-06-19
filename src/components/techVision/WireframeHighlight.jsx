import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTechVision } from './TechVisionProvider.jsx';
import { TECH_VISION } from '../../data/worldPalette.js';

export default function WireframeHighlight({ children, color = TECH_VISION.wireframe, active = true }) {
  const groupRef = useRef();
  const { enabled } = useTechVision();

  useFrame((state) => {
    if (!groupRef.current || !enabled || !active) return;
    groupRef.current.visible = enabled;
    const pulse = 0.92 + Math.sin(state.clock.elapsedTime * 2.2) * 0.06;
    groupRef.current.scale.setScalar(pulse);
  });

  if (!enabled || !active) return null;

  return (
    <group ref={groupRef}>
      <mesh>
        {children}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.45} />
      </mesh>
    </group>
  );
}
