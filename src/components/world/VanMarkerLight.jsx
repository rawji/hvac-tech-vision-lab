import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function VanMarkerLight({ position = [0, 0, 0] }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current?.material) return;
    ref.current.material.emissiveIntensity = 0.25 + Math.sin(state.clock.elapsedTime * 3.2) * 0.18;
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.3} />
    </mesh>
  );
}
