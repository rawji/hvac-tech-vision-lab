import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const SKIN = { light: '#e8b896', dark: '#6b4423' };
const SHIRT = '#2563eb';
const PANTS = '#1e293b';

export default function TechnicianAvatar({ technician = 'male', appearance = 'light', position = [0, 0, 0] }) {
  const groupRef = useRef();
  const isFemale = technician === 'female';
  const skinColor = SKIN[appearance] ?? SKIN.light;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.position.x += (position[0] - groupRef.current.position.x) * Math.min(delta * 10, 1);
    groupRef.current.position.z += (position[2] - groupRef.current.position.z) * Math.min(delta * 10, 1);
  });

  return (
    <group ref={groupRef} position={[position[0], 0, position[2]]}>
      {/* Body */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[0.45, 0.7, 0.3]} />
        <meshStandardMaterial color={SHIRT} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[0.32, 0.32, 0.32]} />
        <meshStandardMaterial color={skinColor} />
      </mesh>
      {/* Hair */}
      <mesh position={[0, isFemale ? 1.48 : 1.45, 0]}>
        <boxGeometry args={[isFemale ? 0.36 : 0.34, isFemale ? 0.12 : 0.08, 0.34]} />
        <meshStandardMaterial color={isFemale ? '#4a3728' : '#2d2d2d'} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.1, 0.25, 0]}>
        <boxGeometry args={[0.14, 0.5, 0.14]} />
        <meshStandardMaterial color={PANTS} />
      </mesh>
      <mesh position={[0.1, 0.25, 0]}>
        <boxGeometry args={[0.14, 0.5, 0.14]} />
        <meshStandardMaterial color={PANTS} />
      </mesh>
      {/* Tool belt hint */}
      <mesh position={[0, 0.55, 0.16]}>
        <boxGeometry args={[0.42, 0.08, 0.06]} />
        <meshStandardMaterial color="#854d0e" />
      </mesh>
    </group>
  );
}
