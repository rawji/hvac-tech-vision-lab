import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTechVision } from './TechVisionProvider.jsx';
import { TECH_VISION } from '../../data/worldPalette.js';

export default function AirflowOverlay({
  velocityFactor = 1,
  position = [0, 0.5, 0],
  direction = [1, 0, 0],
}) {
  const groupRef = useRef();
  const { enabled } = useTechVision();
  const clampedVelocity = Math.max(0.25, Math.min(1.5, velocityFactor));
  const particleCount = clampedVelocity < 0.7 ? 4 : 6;

  const particles = useMemo(
    () => Array.from({ length: particleCount }, (_, i) => i * 0.15),
    [particleCount]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.visible = enabled;
    if (!enabled) return;

    const speed = 0.35 + clampedVelocity * 0.85;
    groupRef.current.children.forEach((child, i) => {
      const t = (state.clock.elapsedTime * speed + particles[i]) % 1;
      child.position.set(
        position[0] + direction[0] * t * 2,
        position[1] + Math.sin(t * Math.PI) * 0.1,
        position[2] + direction[2] * t * 2
      );
      child.material.opacity = 0.45 + clampedVelocity * 0.25;
    });
  });

  if (!enabled) return null;

  return (
    <group ref={groupRef}>
      {particles.map((offset) => (
        <mesh key={offset} position={position}>
          <coneGeometry args={[0.05, 0.15, 4]} />
          <meshBasicMaterial color={TECH_VISION.flow} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}
