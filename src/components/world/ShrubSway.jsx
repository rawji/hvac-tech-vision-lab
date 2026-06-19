import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PALETTE } from '../../data/worldPalette.js';

export default function ShrubSway({ position = [0, 0, 0] }) {
  const ref = useRef();
  const phase = position[0] * 0.7 + position[2] * 0.5;

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.9 + phase) * 0.05;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6 + phase) * 0.02;
  });

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.35, 0]} scale={1.06}>
        <coneGeometry args={[0.45, 0.7, 6]} />
        <meshBasicMaterial color={PALETTE.outline} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow>
        <coneGeometry args={[0.45, 0.7, 6]} />
        <meshStandardMaterial color={PALETTE.shrub} roughness={1} />
      </mesh>
    </group>
  );
}
