import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PALETTE } from '../../data/worldPalette.js';

export default function WindowGlow({ position, size = [1.3, 0.9, 0.08] }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 0.06 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    ref.current.material.emissiveIntensity = pulse;
  });

  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={PALETTE.window}
        emissive="#fde68a"
        emissiveIntensity={0.06}
        roughness={0.15}
        metalness={0.05}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}
