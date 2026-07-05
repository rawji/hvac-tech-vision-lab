import { shadeColor } from '../../data/worldPalette.js';

export default function OutlinedBox({
  args,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  outlineColor = '#1c1917',
  outlineScale = 1.045,
  roughness = 0.82,
  metalness = 0,
  castShadow = false,
  receiveShadow = false,
  emissive,
  emissiveIntensity = 0,
  realistic = false,
  stylized = false,
}) {
  const usePremium = realistic || stylized;
  const rimColor = shadeColor(color, stylized ? 0.18 : 0.12);

  return (
    <group position={position} rotation={rotation}>
      {!usePremium && (
        <mesh scale={outlineScale}>
          <boxGeometry args={args} />
          <meshBasicMaterial color={outlineColor} />
        </mesh>
      )}
      {stylized && (
        <mesh scale={1.012} receiveShadow={receiveShadow}>
          <boxGeometry args={args} />
          <meshStandardMaterial color={rimColor} roughness={1} metalness={0} />
        </mesh>
      )}
      <mesh castShadow={castShadow} receiveShadow={receiveShadow}>
        <boxGeometry args={args} />
        <meshStandardMaterial
          color={color}
          roughness={usePremium ? Math.min(roughness + 0.1, 0.98) : roughness}
          metalness={usePremium ? metalness * 0.35 : metalness}
          emissive={emissive ?? '#000000'}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}
