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
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh scale={outlineScale}>
        <boxGeometry args={args} />
        <meshBasicMaterial color={outlineColor} />
      </mesh>
      <mesh castShadow={castShadow} receiveShadow={receiveShadow}>
        <boxGeometry args={args} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          emissive={emissive ?? '#000000'}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
}
