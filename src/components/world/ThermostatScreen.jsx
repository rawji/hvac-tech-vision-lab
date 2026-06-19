import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function ThermostatScreen() {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current?.material) return;
    ref.current.material.emissiveIntensity = 0.18 + Math.sin(state.clock.elapsedTime * 2.4) * 0.14;
  });

  return (
    <mesh ref={ref} position={[0, 0.02, 0.05]}>
      <boxGeometry args={[0.22, 0.14, 0.02]} />
      <meshStandardMaterial color="#0c4a6e" emissive="#0284c7" emissiveIntensity={0.2} roughness={0.4} />
    </mesh>
  );
}
