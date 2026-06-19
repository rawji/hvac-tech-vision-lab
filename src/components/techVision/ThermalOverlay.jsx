import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTechVision } from './TechVisionProvider.jsx';
import { temperatureToThermalColor } from '../../data/worldPalette.js';

export default function ThermalOverlay({ position, scale = [1, 1, 1], temperatureF = 90 }) {
  const ref = useRef();
  const { enabled } = useTechVision();
  const color = temperatureToThermalColor(temperatureF);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.visible = enabled;
    if (enabled) {
      ref.current.material.opacity = 0.28 + Math.sin(state.clock.elapsedTime * 2) * 0.06;
    }
  });

  if (!enabled) return null;

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.32} />
    </mesh>
  );
}
