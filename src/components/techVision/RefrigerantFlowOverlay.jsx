import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTechVision } from './TechVisionProvider.jsx';

const FLOW_PATH = [
  [0, 0.5, 0],
  [1.5, 0.5, 0],
  [3, 0.5, 0],
  [4.5, 0.5, 0],
];

export default function RefrigerantFlowOverlay({ inefficient = false, position = [0, 0, 0] }) {
  const groupRef = useRef();
  const { enabled } = useTechVision();

  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        offset: i / 8,
        speed: inefficient ? 0.15 : 0.35,
      })),
    [inefficient]
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.visible = enabled;
    if (!enabled) return;

    groupRef.current.children.forEach((child, i) => {
      const p = particles[i];
      const t = (state.clock.elapsedTime * p.speed + p.offset) % 1;
      const idx = Math.floor(t * (FLOW_PATH.length - 1));
      const next = Math.min(idx + 1, FLOW_PATH.length - 1);
      const localT = (t * (FLOW_PATH.length - 1)) % 1;
      const from = FLOW_PATH[idx];
      const to = FLOW_PATH[next];
      child.position.set(
        from[0] + (to[0] - from[0]) * localT,
        from[1] + (to[1] - from[1]) * localT,
        from[2] + (to[2] - from[2]) * localT
      );
    });
  });

  if (!enabled) return null;

  return (
    <group ref={groupRef} position={position}>
      {particles.map((p) => (
        <mesh key={p.offset}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color={inefficient ? '#facc15' : '#60a5fa'} />
        </mesh>
      ))}
    </group>
  );
}
