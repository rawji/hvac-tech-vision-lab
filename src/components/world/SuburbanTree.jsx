import { PALETTE } from '../../data/worldPalette.js';

export default function SuburbanTree({ position = [0, 0, 0], scale = 1 }) {
  const trunkHeight = 1.4 * scale;
  const crownRadius = 1.35 * scale;

  return (
    <group position={position}>
      <mesh position={[0, trunkHeight / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14 * scale, 0.2 * scale, trunkHeight, 8]} />
        <meshStandardMaterial color="#5c4033" roughness={0.95} />
      </mesh>
      <mesh position={[0, trunkHeight + crownRadius * 0.55, 0]} castShadow receiveShadow>
        <sphereGeometry args={[crownRadius, 10, 10]} />
        <meshStandardMaterial color="#2f6b3a" roughness={0.92} />
      </mesh>
      <mesh position={[0, trunkHeight + crownRadius * 0.95, 0]} castShadow>
        <sphereGeometry args={[crownRadius * 0.72, 8, 8]} />
        <meshStandardMaterial color="#3d7a45" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function MulchBed({ position = [0, 0, 0], radius = 0.9 }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[position[0], 0.02, position[2]]} receiveShadow>
      <circleGeometry args={[radius, 20]} />
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
