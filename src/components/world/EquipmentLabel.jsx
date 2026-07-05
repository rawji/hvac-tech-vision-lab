import { Text } from '@react-three/drei';

export default function EquipmentLabel({ label, visible, accent = '#94a3b8', y = 0.85 }) {
  if (!visible || !label) return null;

  return (
    <Text
      position={[0, y, 0]}
      fontSize={0.16}
      color="#e8edf4"
      anchorX="center"
      anchorY="bottom"
      outlineWidth={0.01}
      outlineColor="#0f172a"
      maxWidth={2.4}
    >
      {label}
    </Text>
  );
}
