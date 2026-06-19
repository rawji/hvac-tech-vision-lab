import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { SCENE } from '../../data/worldLayout.js';

const ORIGIN = [SCENE.condenser[0], 0.85, SCENE.condenser[2] + 1.9];

export default function CondenserAmbient({ active = true }) {
  const groupRef = useRef();
  const offsets = useMemo(() => Array.from({ length: 8 }, (_, i) => i * 0.22), []);

  useFrame((state) => {
    if (!groupRef.current || !active) return;
    const t = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, i) => {
      const phase = (t * 0.55 + offsets[i]) % 1;
      child.position.set(
        ORIGIN[0] + Math.sin(t * 0.7 + i) * 0.25,
        ORIGIN[1] + phase * 0.9,
        ORIGIN[2] + Math.cos(t * 0.5 + i) * 0.12
      );
      child.material.opacity = 0.06 + (1 - phase) * 0.1 + Math.sin(t * 2 + i) * 0.02;
      child.scale.setScalar(0.6 + (1 - phase) * 0.5);
    });
  });

  if (!active) return null;

  return (
    <group ref={groupRef}>
      {offsets.map((offset) => (
        <mesh key={offset} position={ORIGIN}>
          <coneGeometry args={[0.06, 0.14, 4]} />
          <meshBasicMaterial color="#cbd5e1" transparent opacity={0.08} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
