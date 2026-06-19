import WindowGlow from './WindowGlow.jsx';

export default function HouseScene() {
  return (
    <group>
      {/* Ground / yard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#3f6f3a" roughness={1} />
      </mesh>

      {/* House main body */}
      <mesh position={[-3.8, 1.35, -1.5]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 2.7, 4.5]} />
        <meshStandardMaterial color="#d6cfc4" roughness={0.85} />
      </mesh>

      {/* Garage bump-out */}
      <mesh position={[-1.2, 1, -2.8]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2, 2.2]} />
        <meshStandardMaterial color="#c9bfb3" roughness={0.85} />
      </mesh>

      {/* Roof main */}
      <mesh position={[-3.8, 3.35, -1.5]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[4.2, 1.6, 4]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.9} />
      </mesh>

      {/* Porch overhang */}
      <mesh position={[-3.8, 1.85, 0.85]} castShadow>
        <boxGeometry args={[3.2, 0.12, 1.2]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>

      {/* Front door */}
      <mesh position={[-3.8, 0.95, 0.35]}>
        <boxGeometry args={[1, 1.9, 0.12]} />
        <meshStandardMaterial color="#5c4033" roughness={0.8} />
      </mesh>

      {/* Windows with warm interior glow */}
      <WindowGlow position={[-2.1, 1.55, 0.32]} size={[1.3, 0.9, 0.08]} />
      <WindowGlow position={[-5.2, 1.55, 0.32]} size={[1.1, 0.9, 0.08]} />

      {/* Thermostat wall section */}
      <mesh position={[-2.4, 1.15, 0.28]}>
        <boxGeometry args={[0.6, 0.5, 0.06]} />
        <meshStandardMaterial color="#e7e5e4" />
      </mesh>
    </group>
  );
}
