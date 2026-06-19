import ComponentTag from '../techVision/ComponentTag.jsx';
import ThermalOverlay from '../techVision/ThermalOverlay.jsx';
import AirflowOverlay from '../techVision/AirflowOverlay.jsx';
import RefrigerantFlowOverlay from '../techVision/RefrigerantFlowOverlay.jsx';
import DiagnosticTextCard from '../techVision/DiagnosticTextCard.jsx';
import WireframeHighlight from '../techVision/WireframeHighlight.jsx';
import EquipmentZoneLabel from './EquipmentZoneLabel.jsx';
import InteractableEquipment from './InteractableEquipment.jsx';

export default function CondenserUnit({ equipmentHealth, onSelect, isNearby, isScanned }) {
  const isDirty = equipmentHealth.condenserCoil === 'dirty';
  const atCondenser = ['condenser', 'condenserCoil', 'compressor', 'capacitor', 'fanMotor', 'contactor'].includes(isNearby);
  const atCoil = isNearby === 'condenserCoil';

  return (
    <group position={[4, 0, -1]}>
      <EquipmentZoneLabel label="Outdoor Condenser" position={[0, 2.4, 0]} accent="#f59e0b" />

      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.1, 2.2]} />
        <meshStandardMaterial color="#525252" />
      </mesh>

      <InteractableEquipment
        id="condenser"
        label="Condenser Unit"
        position={[0, 0.6, 0]}
        size={[1.8, 1.2, 1.8]}
        color="#94a3b8"
        onSelect={onSelect}
        isNearby={isNearby === 'condenser'}
        isScanned={isScanned('condenser')}
      />
      <InteractableEquipment
        id="condenserCoil"
        label="Condenser Coil"
        position={[0, 0.5, 0.95]}
        size={[1.6, 1, 0.15]}
        color="#78716c"
        onSelect={onSelect}
        isNearby={isNearby === 'condenserCoil'}
        isScanned={isScanned('condenserCoil')}
      />
      <InteractableEquipment
        id="fanMotor"
        label="Fan Motor"
        position={[0, 1.25, 0]}
        size={[1.4, 0.08, 1.4]}
        color="#475569"
        onSelect={onSelect}
        isNearby={isNearby === 'fanMotor'}
        isScanned={isScanned('fanMotor')}
        showMarker={false}
      />
      <InteractableEquipment
        id="compressor"
        label="Compressor"
        position={[0.4, 0.35, -0.3]}
        size={[0.5, 0.45, 0.5]}
        color="#1e293b"
        onSelect={onSelect}
        isNearby={isNearby === 'compressor'}
        isScanned={isScanned('compressor')}
        showMarker={false}
      />
      <InteractableEquipment
        id="capacitor"
        label="Capacitor"
        position={[-0.5, 0.55, 0.4]}
        size={[0.2, 0.35, 0.2]}
        color="#dc2626"
        onSelect={onSelect}
        isNearby={isNearby === 'capacitor'}
        isScanned={isScanned('capacitor')}
        showMarker={false}
      />
      <InteractableEquipment
        id="contactor"
        label="Contactor"
        position={[-0.3, 0.45, -0.5]}
        size={[0.25, 0.15, 0.2]}
        color="#334155"
        onSelect={onSelect}
        isNearby={isNearby === 'contactor'}
        isScanned={isScanned('contactor')}
        showMarker={false}
      />

      {atCoil && (
        <>
          <ThermalOverlay position={[0, 0.55, 0.95]} scale={[1.6, 1, 0.2]} condition={isDirty ? 'dirty' : 'normal'} />
          <WireframeHighlight active={isDirty}>
            <boxGeometry args={[1.7, 1.1, 0.2]} />
          </WireframeHighlight>
        </>
      )}

      {atCondenser && (
        <>
          <AirflowOverlay restricted={equipmentHealth.outdoorAirflow === 'restricted'} position={[0, 0.8, 1.2]} direction={[0, 0, 1]} />
          <RefrigerantFlowOverlay inefficient={equipmentHealth.headPressure === 'high'} position={[-0.5, 0.4, 0]} />
        </>
      )}

      <ComponentTag
        label="Condenser Coil"
        componentKey="condenserCoil"
        equipmentHealth={equipmentHealth}
        position={[0, 1.6, 1.2]}
        visible={atCoil}
      />
      <ComponentTag
        label="Head Pressure"
        componentKey="headPressure"
        equipmentHealth={equipmentHealth}
        position={[0.8, 1.4, 0]}
        visible={atCoil}
      />

      {atCoil && (
        <DiagnosticTextCard
          title="SCAN READOUT"
          lines={[
            'PRESS: ELEVATED',
            'AIRFLOW: RESTRICTED',
            'Use scan card for full clues',
          ]}
          position={[0, 2.1, 0.5]}
        />
      )}
    </group>
  );
}
