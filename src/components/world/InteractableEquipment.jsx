import { useRef } from 'react';

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
}) {
  const meshRef = useRef();
  const [w, h, d] = size;
  const ringScale = Math.max(w, d) * 0.55;

  return (
    <group position={position}>
      {showMarker && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -(h / 2) + 0.02, 0]}>
          <ringGeometry args={[ringScale * 0.85, ringScale, 32]} />
          <meshBasicMaterial
            color={isNearby ? '#38bdf8' : isScanned ? '#4ade80' : '#64748b'}
            transparent
            opacity={isNearby ? 0.9 : isScanned ? 0.55 : 0.35}
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
          emissive={isNearby ? '#2563eb' : isScanned ? '#166534' : '#1e293b'}
          emissiveIntensity={isNearby ? 0.35 : isScanned ? 0.15 : 0.08}
        />
      </mesh>
    </group>
  );
}
