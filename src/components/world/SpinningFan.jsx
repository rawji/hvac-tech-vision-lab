import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function SpinningFan({ position = [0, 1.25, 0], active = true }) {
  const bladesRef = useRef();

  useFrame((_, delta) => {
    if (!bladesRef.current || !active) return;
    bladesRef.current.rotation.y += delta * 5.5;
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.5} />
      </mesh>
      <group ref={bladesRef} position={[0, 0.04, 0]}>
        <mesh>
          <boxGeometry args={[1.2, 0.04, 0.15]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} />
        </mesh>
        <mesh rotation={[0, Math.PI / 3, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.15]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} />
        </mesh>
        <mesh rotation={[0, (Math.PI * 2) / 3, 0]}>
          <boxGeometry args={[1.2, 0.04, 0.15]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} />
        </mesh>
      </group>
    </group>
  );
}
