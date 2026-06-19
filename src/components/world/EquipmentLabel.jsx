import { Text } from '@react-three/drei';

export default function EquipmentLabel({ label, visible, accent = '#38bdf8', y = 0.85 }) {
  if (!visible || !label) return null;

  return (
    <Text
      position={[0, y, 0]}
      fontSize={0.18}
      color={accent}
      anchorX="center"
      anchorY="bottom"
      outlineWidth={0.015}
      outlineColor="#0f172a"
      maxWidth={2.2}
    >
      {label}
    </Text>
  );
}
