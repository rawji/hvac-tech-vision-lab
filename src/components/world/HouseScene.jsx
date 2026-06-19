export default function HouseScene() {
  return (
    <group>
      {/* Ground / yard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#3d6b3d" />
      </mesh>
      {/* Driveway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5]}>
        <planeGeometry args={[4, 6]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      {/* House base */}
      <mesh position={[-3, 1.2, -2]} castShadow receiveShadow>
        <boxGeometry args={[5, 2.4, 4]} />
        <meshStandardMaterial color="#c4b5a0" />
      </mesh>
      {/* Roof */}
      <mesh position={[-3, 2.8, -2]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[3.6, 1.4, 4]} />
        <meshStandardMaterial color="#7c2d12" />
      </mesh>
      {/* Door */}
      <mesh position={[-3, 0.9, 0.01]}>
        <boxGeometry args={[0.9, 1.8, 0.1]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
      {/* Window */}
      <mesh position={[-1.2, 1.4, 0.01]}>
        <boxGeometry args={[1.2, 0.8, 0.08]} />
        <meshStandardMaterial color="#93c5fd" emissive="#1e3a5f" emissiveIntensity={0.2} />
      </mesh>
      {/* Utility closet marker (indoor) */}
      <mesh position={[-4.5, 0.5, -1]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#64748b" />
      </mesh>
    </group>
  );
}
