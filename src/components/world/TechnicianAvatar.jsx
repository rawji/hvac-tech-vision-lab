import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const SKIN = { light: '#e8b896', dark: '#6b4423' };
const UNIFORM = '#1d4ed8';
const PANTS = '#1e293b';
const BOOT = '#292524';

export default function TechnicianAvatar({
  technician = 'male',
  appearance = 'light',
  position = [0, 0, 0],
  facing = 0,
  isMoving = false,
}) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const isFemale = technician === 'female';
  const skinColor = SKIN[appearance] ?? SKIN.light;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.x += (position[0] - groupRef.current.position.x) * Math.min(delta * 12, 1);
    groupRef.current.position.z += (position[2] - groupRef.current.position.z) * Math.min(delta * 12, 1);
    groupRef.current.rotation.y += (facing - groupRef.current.rotation.y) * Math.min(delta * 14, 1);

    const bob = isMoving ? Math.sin(state.clock.elapsedTime * 12) * 0.04 : 0;
    if (bodyRef.current) bodyRef.current.position.y = 0.75 + bob;

    const swing = isMoving ? Math.sin(state.clock.elapsedTime * 12) * 0.18 : 0;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
  });

  return (
    <group ref={groupRef} position={[position[0], 0, position[2]]} rotation={[0, facing, 0]}>
      <group ref={bodyRef} position={[0, 0.75, 0]}>
        {/* Torso */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[0.48, 0.72, 0.32]} />
          <meshStandardMaterial color={UNIFORM} roughness={0.75} />
        </mesh>
        {/* Shoulders */}
        <mesh position={[0, 0.28, 0]}>
          <boxGeometry args={[0.58, 0.18, 0.34]} />
          <meshStandardMaterial color={UNIFORM} roughness={0.75} />
        </mesh>
        {/* Hard hat */}
        <mesh position={[0, 0.62, 0]}>
          <boxGeometry args={[0.38, 0.14, 0.36]} />
          <meshStandardMaterial color="#facc15" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.68, 0]}>
          <boxGeometry args={[0.42, 0.04, 0.4]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
          <meshStandardMaterial color={skinColor} roughness={0.9} />
        </mesh>
        {/* Hair */}
        <mesh position={[0, isFemale ? 0.58 : 0.54, 0]}>
          <boxGeometry args={[isFemale ? 0.32 : 0.3, isFemale ? 0.1 : 0.07, 0.3]} />
          <meshStandardMaterial color={isFemale ? '#4a3728' : '#1c1917'} />
        </mesh>
        {/* Tool belt */}
        <mesh position={[0, -0.18, 0.17]}>
          <boxGeometry args={[0.46, 0.1, 0.08]} />
          <meshStandardMaterial color="#78350f" roughness={0.8} />
        </mesh>
        {/* Gauge pocket */}
        <mesh position={[0.18, -0.05, 0.18]}>
          <boxGeometry args={[0.1, 0.14, 0.06]} />
          <meshStandardMaterial color="#44403c" />
        </mesh>
      </group>

      {/* Legs */}
      <group ref={leftLegRef} position={[-0.12, 0.25, 0]}>
        <mesh>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color={PANTS} />
        </mesh>
        <mesh position={[0, -0.28, 0.02]}>
          <boxGeometry args={[0.16, 0.08, 0.22]} />
          <meshStandardMaterial color={BOOT} />
        </mesh>
      </group>
      <group ref={rightLegRef} position={[0.12, 0.25, 0]}>
        <mesh>
          <boxGeometry args={[0.15, 0.5, 0.15]} />
          <meshStandardMaterial color={PANTS} />
        </mesh>
        <mesh position={[0, -0.28, 0.02]}>
          <boxGeometry args={[0.16, 0.08, 0.22]} />
          <meshStandardMaterial color={BOOT} />
        </mesh>
      </group>
    </group>
  );
}
