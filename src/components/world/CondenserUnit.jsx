import { PALETTE } from '../../data/worldPalette.js';
import { SCENE } from '../../data/worldLayout.js';
import ComponentTag from '../techVision/ComponentTag.jsx';
import ThermalOverlay from '../techVision/ThermalOverlay.jsx';
import AirflowOverlay from '../techVision/AirflowOverlay.jsx';
import RefrigerantFlowOverlay from '../techVision/RefrigerantFlowOverlay.jsx';
import DiagnosticTextCard from '../techVision/DiagnosticTextCard.jsx';
import WireframeHighlight from '../techVision/WireframeHighlight.jsx';
import EquipmentZoneLabel from './EquipmentZoneLabel.jsx';
import InteractableEquipment from './InteractableEquipment.jsx';
import SpinningFan from './SpinningFan.jsx';
import CondenserAmbient from './CondenserAmbient.jsx';

const FIN_COUNT = 14;

export default function CondenserUnit({
  equipmentHealth,
  onSelect,
  equipmentState,
  proximityId,
}) {
  const atCondenser = ['condenser', 'condenserCoil', 'compressor', 'capacitor', 'fanMotor', 'contactor'].includes(proximityId);
  const atCoil = proximityId === 'condenserCoil';
  const coilSurfaceTempF = equipmentHealth.headPressure === 'high' ? 108 : 92;
  const airflowVelocity = equipmentHealth.outdoorAirflow === 'restricted' ? 0.45 : 1;
  const refrigerantFlowRate = equipmentHealth.headPressure === 'high' ? 0.55 : 1;
  const ids = ['condenser', 'condenserCoil', 'fanMotor', 'compressor', 'capacitor', 'contactor'];

  return (
    <group position={SCENE.condenser}>
      <EquipmentZoneLabel label="Outdoor Condenser" position={[0, 2.85, 0]} accent="#94a3b8" />

      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.1, 3.2]} />
        <meshStandardMaterial color={PALETTE.condenserPad} roughness={0.98} />
      </mesh>
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[2.9, 0.06, 2.9]} />
        <meshStandardMaterial color="#6b7280" roughness={0.95} />
      </mesh>

      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 1.35, 2.2]} />
        <meshStandardMaterial color={PALETTE.condenserBody} roughness={0.62} metalness={0.18} />
      </mesh>
      <mesh position={[0, 0.72, 1.08]} castShadow>
        <boxGeometry args={[2.05, 1.15, 0.08]} />
        <meshStandardMaterial color="#6b7280" roughness={0.55} metalness={0.25} />
      </mesh>

      {Array.from({ length: FIN_COUNT }, (_, i) => {
        const x = -0.95 + (i * 1.9) / (FIN_COUNT - 1);
        return (
          <mesh key={`fin-${i}`} position={[x, 0.72, 1.12]} castShadow>
            <boxGeometry args={[0.05, 1.05, 0.02]} />
            <meshStandardMaterial color="#9ca3af" roughness={0.45} metalness={0.35} />
          </mesh>
        );
      })}

      <mesh position={[0, 1.52, 0]} castShadow>
        <cylinderGeometry args={[1.05, 1.05, 0.06, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.35} />
      </mesh>

      {ids.map((id) => {
        const props = equipmentState(id);
        const configs = {
          condenser: { label: 'Condenser Unit', position: [0, 0.72, 0], size: [2.2, 1.35, 2.2], color: PALETTE.condenserBody },
          condenserCoil: { label: 'Condenser Coil', position: [0, 0.72, 1.05], size: [2, 1.1, 0.12], color: '#6b7280' },
          fanMotor: { label: 'Fan Motor', position: [0, 1.48, 0], size: [1.6, 0.06, 1.6], color: '#475569', showMarker: false },
          compressor: { label: 'Compressor', position: [0.45, 0.42, -0.35], size: [0.55, 0.5, 0.55], color: '#1e293b', showMarker: false },
          capacitor: { label: 'Capacitor', position: [-0.55, 0.62, 0.45], size: [0.22, 0.38, 0.22], color: '#94a3b8', showMarker: false },
          contactor: { label: 'Contactor', position: [-0.35, 0.52, -0.55], size: [0.28, 0.16, 0.22], color: '#334155', showMarker: false },
        };
        const cfg = configs[id];
        return (
          <InteractableEquipment
            key={id}
            id={id}
            label={cfg.label}
            position={cfg.position}
            size={cfg.size}
            color={cfg.color}
            onSelect={onSelect}
            showMarker={cfg.showMarker !== false}
            {...props}
          />
        );
      })}

      <SpinningFan position={[0, 1.5, 0]} active radius={0.95} />
      <CondenserAmbient active />

      {atCoil && (
        <>
          <ThermalOverlay
            position={[0, 0.72, 1.05]}
            scale={[2.05, 1.1, 0.14]}
            temperatureF={coilSurfaceTempF}
          />
          <WireframeHighlight active>
            <boxGeometry args={[2.15, 1.15, 0.16]} />
          </WireframeHighlight>
        </>
      )}

      {atCondenser && (
        <>
          <AirflowOverlay
            velocityFactor={airflowVelocity}
            position={[0, 1, 1.35]}
            direction={[0, 0, 1]}
          />
          <RefrigerantFlowOverlay flowRate={refrigerantFlowRate} position={[-0.55, 0.45, 0]} />
        </>
      )}

      <ComponentTag
        label="Condenser Coil"
        componentKey="condenserCoil"
        equipmentHealth={equipmentHealth}
        position={[0, 1.85, 1.35]}
        visible={atCoil}
      />
      <ComponentTag
        label="Liquid Line"
        componentKey="headPressure"
        equipmentHealth={equipmentHealth}
        position={[0.9, 1.55, 0.2]}
        visible={atCoil}
      />

      {atCoil && (
        <DiagnosticTextCard
          title="FIELD READOUT"
          lines={[
            equipmentHealth.headPressure === 'high' ? 'LIQ PRESS: 312 PSIG' : 'LIQ PRESS: 248 PSIG',
            equipmentHealth.suctionPressure === 'normal' ? 'SUCT PRESS: 118 PSIG' : 'SUCT PRESS: 95 PSIG',
            equipmentHealth.outdoorAirflow === 'restricted'
              ? 'COIL FACE: REDUCED VELOCITY'
              : 'COIL FACE: TYPICAL VELOCITY',
          ]}
          position={[0, 2.35, 0.55]}
        />
      )}
    </group>
  );
}
