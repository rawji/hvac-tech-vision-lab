import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTechVision } from './TechVisionProvider.jsx';
import { getHighlightColor, mapValueToCategory } from '../../logic/equipmentStatusMapper.js';

export default function ThermalOverlay({ position, scale = [1, 1, 1], condition = 'normal' }) {
  const ref = useRef();
  const { enabled } = useTechVision();
  const category = mapValueToCategory(condition === 'dirty' ? 'fault' : condition);
  const color = getHighlightColor(category);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.visible = enabled;
    if (enabled && condition === 'dirty') {
      ref.current.material.opacity = 0.35 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });

  if (!enabled) return null;

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={condition === 'dirty' ? 0.4 : 0.2} />
    </mesh>
  );
}
