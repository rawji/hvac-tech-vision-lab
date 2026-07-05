import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PALETTE, shadeColor } from '../../data/worldPalette.js';

export default function SuburbanTree({ position = [0, 0, 0], scale = 1 }) {
  const crownRef = useRef();
  const trunkHeight = 1.35 * scale;
  const crownRadius = 1.25 * scale;
  const phase = position[0] * 0.3 + position[2] * 0.4;

  useFrame((state) => {
    if (!crownRef.current) return;
    crownRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35 + phase) * 0.015;
  });

  return (
    <group position={position}>
      <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12 * scale, 0.18 * scale, trunkHeight, 10]} />
        <meshStandardMaterial color="#5c4033" roughness={0.96} />
      </mesh>
      <group ref={crownRef} position={[0, trunkHeight + crownRadius * 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[crownRadius, 12, 12]} />
          <meshStandardMaterial color={shadeColor(PALETTE.shrub, 0.08)} roughness={0.94} />
        </mesh>
        <mesh position={[0, crownRadius * 0.38, 0]} castShadow>
          <sphereGeometry args={[crownRadius * 0.68, 10, 10]} />
          <meshStandardMaterial color={PALETTE.shrubHighlight} roughness={0.92} />
        </mesh>
      </group>
    </group>
  );
}

export function MulchBed({ position = [0, 0, 0], radius = 0.9 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], 0.02, position[2]]} receiveShadow>
      <circleGeometry args={[radius, 24]} />
      <meshStandardMaterial color={PALETTE.mulch} roughness={1} />
    </mesh>
  );
}

export function LawnPatch({ position, size, color = PALETTE.groundDark }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
  );
}
