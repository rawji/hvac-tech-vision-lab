import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PALETTE } from '../../data/worldPalette.js';

export default function WindowGlow({ position, size = [1.3, 0.9, 0.08] }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 0.05 + Math.sin(state.clock.elapsedTime * 0.45) * 0.015;
    ref.current.material.emissiveIntensity = pulse;
  });

  return (
    <mesh ref={ref} position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={PALETTE.window}
        emissive={PALETTE.windowGlow}
        emissiveIntensity={0.05}
        roughness={0.12}
        metalness={0.04}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
