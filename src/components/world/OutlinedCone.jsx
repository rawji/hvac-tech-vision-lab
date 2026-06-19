export default function OutlinedCone({
  args,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  outlineColor = '#1c1917',
  outlineScale = 1.05,
  roughness = 0.9,
  castShadow = false,
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh scale={outlineScale}>
        <coneGeometry args={args} />
        <meshBasicMaterial color={outlineColor} />
      </mesh>
      <mesh castShadow={castShadow}>
        <coneGeometry args={args} />
        <meshStandardMaterial color={color} roughness={roughness} />
      </mesh>
    </group>
  );
}
