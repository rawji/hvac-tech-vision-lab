import { Html } from '@react-three/drei';
import { useTechVision } from './TechVisionProvider.jsx';
import { getComponentReading } from '../../logic/equipmentStatusMapper.js';
import { TECH_VISION } from '../../data/worldPalette.js';

export default function ComponentTag({ label, componentKey, equipmentHealth, position, visible = true }) {
  const { enabled } = useTechVision();
  if (!enabled || !visible) return null;

  const reading = getComponentReading(componentKey, equipmentHealth);

  return (
    <Html position={position} center distanceFactor={12} zIndexRange={[100, 0]}>
      <div className="component-tag tech-vision-tag" style={{ borderColor: TECH_VISION.tagBorder }}>
        <span className="tag-label" style={{ color: TECH_VISION.tagLabel }}>
          {label}
        </span>
        <span className="tag-status" style={{ color: TECH_VISION.tagReading }}>
          {reading}
        </span>
      </div>
    </Html>
  );
}
