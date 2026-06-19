import { Html } from '@react-three/drei';
import { useTechVision } from './TechVisionProvider.jsx';
import { getComponentVisualStatus } from '../../logic/equipmentStatusMapper.js';

export default function ComponentTag({ label, componentKey, equipmentHealth, position, visible = true }) {
  const { enabled } = useTechVision();
  if (!enabled || !visible) return null;

  const status = getComponentVisualStatus(componentKey, equipmentHealth);

  return (
    <Html position={position} center distanceFactor={12} zIndexRange={[100, 0]}>
      <div className="component-tag" style={{ borderColor: status.color }}>
        <span className="tag-label">{label}</span>
        <span className="tag-status" style={{ color: status.color }}>
          {status.label}
        </span>
      </div>
    </Html>
  );
}
