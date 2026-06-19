import { Html } from '@react-three/drei';

export default function EquipmentZoneLabel({ label, position, accent = '#38bdf8' }) {
  return (
    <Html position={position} center distanceFactor={14} zIndexRange={[50, 0]}>
      <div className="zone-label" style={{ borderColor: accent }}>
        <span className="zone-label-text">{label}</span>
        <span className="zone-label-hint">Walk here to inspect</span>
      </div>
    </Html>
  );
}
