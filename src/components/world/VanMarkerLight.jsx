import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PALETTE } from '../../data/worldPalette.js';

export default function VanMarkerLight({ position = [0, 0, 0] }) {
  const ref = useRef();

  useFrame((state) => {
    if (!ref.current?.material) return;
    ref.current.material.emissiveIntensity = 0.18 + Math.sin(state.clock.elapsedTime * 2.4) * 0.08;
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={[0.22, 0.06, 0.08]} />
        <meshStandardMaterial color={PALETTE.vanAccent} emissive={PALETTE.vanAccent} emissiveIntensity={0.22} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.06, 8]} />
        <meshStandardMaterial color="#475569" metalness={0.35} roughness={0.5} />
      </mesh>
    </group>
  );
}
