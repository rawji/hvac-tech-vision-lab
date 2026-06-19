import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function WindowGlow({ position, size = [1.3, 0.9, 0.08] }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 0.1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04;
    ref.current.material.emissiveIntensity = pulse;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#bae6fd" emissive="#fbbf24" emissiveIntensity={0.1} />
    </mesh>
  );
}
