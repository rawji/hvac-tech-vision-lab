import ComponentTag from '../techVision/ComponentTag.jsx';
import EquipmentZoneLabel from './EquipmentZoneLabel.jsx';
import InteractableEquipment from './InteractableEquipment.jsx';

export default function ThermostatMarker({ equipmentHealth, onSelect, isNearby, isScanned, scanPulseTarget }) {
  return (
    <group position={[-2.4, 1.15, 0.35]}>
      <EquipmentZoneLabel label="Thermostat" position={[0, 0.55, 0]} accent="#a78bfa" />
      <InteractableEquipment
        id="thermostat"
        label="Thermostat"
        position={[0, 0, 0]}
        size={[0.35, 0.35, 0.08]}
        color="#e2e8f0"
        onSelect={onSelect}
        isNearby={isNearby === 'thermostat'}
        isScanned={isScanned('thermostat')}
        isPulsing={scanPulseTarget === 'thermostat'}
      />
      <ComponentTag
        label="Thermostat"
        componentKey="thermostat"
        equipmentHealth={equipmentHealth}
        position={[0, 0.45, 0]}
        visible={isNearby === 'thermostat'}
      />
    </group>
  );
}
