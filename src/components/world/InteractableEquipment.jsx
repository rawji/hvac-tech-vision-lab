import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import EquipmentLabel from './EquipmentLabel.jsx';

export default function InteractableEquipment({
  id,
  label,
  position,
  size,
  color,
  onSelect,
  pointerDragRef,
  isNearby = false,
  isSelected = false,
  isInspected = false,
  isScanned = false,
  techVisionEnabled = false,
  showMarker = true,
  isPulsing = false,
  isInspectPulsing = false,
}) {
  const meshRef = useRef();
  const outlineRef = useRef();
  const pulseRef = useRef(0);
  const inspectPulseRef = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [w, h, d] = size;
  const ringScale = Math.max(w, d) * 0.62;
  const showLabel = isNearby || isSelected || hovered;
  const highlighted = isNearby || isSelected || hovered;

  useFrame((_, delta) => {
    if (isPulsing) {
      pulseRef.current = Math.min(pulseRef.current + delta * 5, 1);
    } else {
      pulseRef.current = Math.max(pulseRef.current - delta * 2.5, 0);
    }

    if (isInspectPulsing) {
      inspectPulseRef.current = Math.min(inspectPulseRef.current + delta * 6, 1);
    } else {
      inspectPulseRef.current = Math.max(inspectPulseRef.current - delta * 4, 0);
    }

    const pulse = pulseRef.current;
    const inspectPulse = inspectPulseRef.current;
    const scale = 1 + Math.sin(pulse * Math.PI) * 0.12 * pulse + inspectPulse * 0.04;

    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale);
    }
    if (outlineRef.current) {
      const outlineScale = 1.04 + (highlighted ? 0.02 : 0) + pulse * 0.06;
      outlineRef.current.scale.set(outlineScale, outlineScale * (h / w), outlineScale);
    }
  });

  const ringColor = isPulsing
    ? '#22d3ee'
    : isSelected
      ? '#fbbf24'
      : isNearby
        ? '#38bdf8'
        : isScanned
          ? '#4ade80'
          : '#64748b';

  const ringOpacity = highlighted ? 0.95 : isScanned || isInspected ? 0.55 : 0.28;

  const emissive = isPulsing
    ? '#38bdf8'
    : isInspectPulsing
      ? '#a78bfa'
      : isSelected
        ? '#f59e0b'
        : isNearby
          ? '#2563eb'
          : isScanned
            ? '#166534'
            : '#1e293b';

  const emissiveIntensity = isPulsing
    ? 0.5
    : isInspectPulsing
      ? 0.35
      : highlighted
        ? 0.38
        : isScanned
          ? 0.2
          : 0.06;

  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = '';
  };

  const handleClick = (e) => {
    if (pointerDragRef?.current?.didDrag) return;
    e.stopPropagation();
    onSelect?.(id);
  };

  return (
    <group position={position}>
      {showMarker && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -(h / 2) + 0.02, 0]}>
          <ringGeometry args={[ringScale * 0.82, ringScale, 32]} />
          <meshBasicMaterial color={ringColor} transparent opacity={ringOpacity} depthWrite={false} />
        </mesh>
      )}

      <mesh scale={[1.03, 1.03, 1.03]} raycast={() => null}>
        <boxGeometry args={size} />
        <meshBasicMaterial
          color={highlighted || isScanned ? ringColor : '#1c1917'}
          transparent
          opacity={highlighted ? 0.55 : isScanned ? 0.35 : 0.28}
          depthWrite={false}
        />
      </mesh>

      {(isSelected || isNearby || isPulsing) && (
        <mesh ref={outlineRef} position={[0, 0, 0]} raycast={() => null}>
          <boxGeometry args={size} />
          <meshBasicMaterial
            color={isSelected ? '#fbbf24' : '#38bdf8'}
            transparent
            opacity={isSelected ? 0.22 : 0.14}
            depthWrite={false}
          />
        </mesh>
      )}

      <mesh
        ref={meshRef}
        castShadow
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        userData={{ id, label, interactable: true }}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={emissiveIntensity}
          roughness={0.72}
          metalness={0.08}
        />
      </mesh>

      <EquipmentLabel
        label={
          isSelected
            ? `${label} · click to go`
            : techVisionEnabled && isNearby
              ? `${label} · scannable`
              : label
        }
        visible={showLabel}
        accent={isSelected ? '#fbbf24' : isNearby ? '#38bdf8' : '#94a3b8'}
        y={h / 2 + 0.35}
      />
    </group>
  );
}
