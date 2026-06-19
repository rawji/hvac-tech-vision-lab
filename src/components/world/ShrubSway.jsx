import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PALETTE } from '../../data/worldPalette.js';

export default function ShrubSway({ position = [0, 0, 0], scale = 1, realistic = false }) {
  const ref = useRef();
  const phase = position[0] * 0.7 + position[2] * 0.5;
  const radius = 0.52 * scale;
  const height = 0.85 * scale;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9 + phase) * 0.04;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6 + phase) * 0.015;
  });

  return (
    <group ref={ref} position={position}>
      {!realistic && (
        <mesh position={[0, height * 0.5, 0]} scale={1.06}>
          <coneGeometry args={[radius, height, 8]} />
          <meshBasicMaterial color={PALETTE.outline} />
        </mesh>
      )}
      <mesh position={[0, height * 0.45, 0]} castShadow receiveShadow>
        <coneGeometry args={[radius, height * 0.9, 10]} />
        <meshStandardMaterial color={PALETTE.shrub} roughness={0.98} />
      </mesh>
      <mesh position={[0, height * 0.72, 0]} castShadow>
        <coneGeometry args={[radius * 0.72, height * 0.55, 8]} />
        <meshStandardMaterial color="#3f7a46" roughness={0.96} />
      </mesh>
    </group>
  );
}
