import { shadeColor } from '../../data/worldPalette.js';

export default function OutlinedCone({
  args,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  outlineColor = '#1c1917',
  outlineScale = 1.05,
  roughness = 0.9,
  castShadow = false,
  receiveShadow = false,
  realistic = false,
  stylized = false,
}) {
  const usePremium = realistic || stylized;
  const rimColor = shadeColor(color, 0.16);

  return (
    <group position={position} rotation={rotation}>
      {!usePremium && (
        <mesh scale={outlineScale}>
          <coneGeometry args={args} />
          <meshBasicMaterial color={outlineColor} />
        </mesh>
      )}
      {stylized && (
        <mesh scale={1.015} receiveShadow>
          <coneGeometry args={args} />
          <meshStandardMaterial color={rimColor} roughness={1} />
        </mesh>
      )}
      <mesh castShadow={castShadow} receiveShadow={receiveShadow}>
        <coneGeometry args={args} />
        <meshStandardMaterial color={color} roughness={usePremium ? 0.96 : roughness} metalness={0.04} />
      </mesh>
    </group>
  );
}
