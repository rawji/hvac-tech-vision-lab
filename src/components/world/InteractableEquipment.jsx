import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function InteractableEquipment({
  id,
  label,
  position,
  size,
  color,
  onSelect,
  isNearby,
  isScanned,
  showMarker = true,
  isPulsing = false,
}) {
  const meshRef = useRef();
  const pulseRef = useRef(0);
  const [w, h, d] = size;
  const ringScale = Math.max(w, d) * 0.55;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (isPulsing) {
      pulseRef.current = Math.min(pulseRef.current + delta * 5, 1);
    } else {
      pulseRef.current = Math.max(pulseRef.current - delta * 2.5, 0);
    }
    const pulse = pulseRef.current;
    const scale = 1 + Math.sin(pulse * Math.PI) * 0.12 * pulse;
    meshRef.current.scale.setScalar(scale);
  });

  return (
    <group position={position}>
      {showMarker && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -(h / 2) + 0.02, 0]}>
          <ringGeometry args={[ringScale * 0.85, ringScale, 32]} />
          <meshBasicMaterial
            color={isNearby ? '#38bdf8' : isScanned ? '#4ade80' : '#64748b'}
            transparent
            opacity={isNearby ? 0.95 : isScanned ? 0.6 : 0.35}
          />
        </mesh>
      )}
      <mesh
        ref={meshRef}
        castShadow
        onClick={() => onSelect?.(id)}
        userData={{ id, label }}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={isPulsing ? '#38bdf8' : isNearby ? '#2563eb' : isScanned ? '#166534' : '#1e293b'}
          emissiveIntensity={isPulsing ? 0.45 : isNearby ? 0.35 : isScanned ? 0.18 : 0.06}
          roughness={0.75}
        />
      </mesh>
    </group>
  );
}
