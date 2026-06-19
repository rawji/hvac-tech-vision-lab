import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function SpinningFan({ position = [0, 1.25, 0], active = true, radius = 0.6 }) {
  const bladesRef = useRef();
  const bladeSpan = radius * 2.2;

  useFrame((_, delta) => {
    if (!bladesRef.current || !active) return;
    bladesRef.current.rotation.y += delta * 5.5;
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[radius * 0.14, radius * 0.14, 0.06, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.45} />
      </mesh>
      <group ref={bladesRef} position={[0, 0.04, 0]}>
        {[0, Math.PI / 3, (Math.PI * 2) / 3].map((rotation) => (
          <mesh key={rotation} rotation={[0, rotation, 0]}>
            <boxGeometry args={[bladeSpan, 0.035, radius * 0.22]} />
            <meshStandardMaterial color="#64748b" metalness={0.45} roughness={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
