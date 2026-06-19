import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function SpinningFan({ position = [0, 1.25, 0], active = true }) {
  const ref = useRef();

  useFrame((_, delta) => {
    if (!ref.current || !active) return;
    ref.current.rotation.y += delta * 4;
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
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
  );
}
