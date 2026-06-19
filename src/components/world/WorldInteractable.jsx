import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import EquipmentLabel from './EquipmentLabel.jsx';

export default function WorldInteractable({
  id,
  label,
  position,
  size,
  color = '#94a3b8',
  onNavigate,
  pointerDragRef,
  isSelected = false,
  isNearby = false,
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [w, h, d] = size;
  const highlighted = isSelected || isNearby || hovered;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const pulse = highlighted ? 1 + Math.sin(Date.now() * 0.004) * 0.015 : 1;
    meshRef.current.scale.setScalar(pulse);
  });

  const handleClick = (e) => {
    if (pointerDragRef?.current?.didDrag) return;
    e.stopPropagation();
    onNavigate?.(id);
  };

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        castShadow
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = '';
        }}
        userData={{ id, label, interactable: true }}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={highlighted ? '#2563eb' : '#1e293b'}
          emissiveIntensity={highlighted ? 0.35 : 0.06}
          roughness={0.72}
        />
      </mesh>

      {highlighted && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[w * 1.06, h * 1.06, d * 1.06]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.18} depthWrite={false} />
        </mesh>
      )}

      <EquipmentLabel
        label={label}
        visible={highlighted}
        accent={isSelected ? '#fbbf24' : '#38bdf8'}
        y={h / 2 + 0.35}
      />
    </group>
  );
}
