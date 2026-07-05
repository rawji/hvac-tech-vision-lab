import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PALETTE } from '../../data/worldPalette.js';

export default function ShrubSway({ position = [0, 0, 0], scale = 1, realistic = false, stylized = false }) {
  const ref = useRef();
  const phase = position[0] * 0.7 + position[2] * 0.5;
  const radius = 0.48 * scale;
  const height = 0.78 * scale;
  const premium = realistic || stylized;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.75 + phase) * 0.03;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + phase) * 0.012;
  });

  return (
    <group ref={ref} position={position}>
      {!premium && (
        <mesh position={[0, height * 0.5, 0]} scale={1.06}>
          <coneGeometry args={[radius, height, 8]} />
          <meshBasicMaterial color={PALETTE.outline} />
        </mesh>
      )}
      <mesh position={[0, height * 0.42, 0]} castShadow receiveShadow>
        <coneGeometry args={[radius, height * 0.88, 12]} />
        <meshStandardMaterial color={PALETTE.shrub} roughness={0.98} />
      </mesh>
      <mesh position={[0, height * 0.68, 0]} castShadow>
        <coneGeometry args={[radius * 0.68, height * 0.5, 10]} />
        <meshStandardMaterial color={PALETTE.shrubHighlight} roughness={0.96} />
      </mesh>
    </group>
  );
}
