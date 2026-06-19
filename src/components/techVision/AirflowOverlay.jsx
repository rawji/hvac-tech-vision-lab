import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTechVision } from './TechVisionProvider.jsx';

export default function AirflowOverlay({ restricted = false, position = [0, 0.5, 0], direction = [1, 0, 0] }) {
  const groupRef = useRef();
  const { enabled } = useTechVision();

  const particles = useMemo(() => Array.from({ length: 6 }, (_, i) => i * 0.15), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.visible = enabled;
    if (!enabled) return;

    const speed = restricted ? 0.4 : 1.2;
    groupRef.current.children.forEach((child, i) => {
      const t = (state.clock.elapsedTime * speed + particles[i]) % 1;
      child.position.set(
        position[0] + direction[0] * t * 2,
        position[1] + Math.sin(t * Math.PI) * 0.1,
        position[2] + direction[2] * t * 2
      );
      child.material.opacity = restricted ? 0.5 : 0.8;
    });
  });

  if (!enabled) return null;

  return (
    <group ref={groupRef}>
      {particles.map((offset) => (
        <mesh key={offset} position={position}>
          <coneGeometry args={[0.05, 0.15, 4]} />
          <meshBasicMaterial color={restricted ? '#facc15' : '#4ade80'} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}
