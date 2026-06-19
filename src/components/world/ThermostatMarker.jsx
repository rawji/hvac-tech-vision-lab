import ComponentTag from '../techVision/ComponentTag.jsx';
import EquipmentZoneLabel from './EquipmentZoneLabel.jsx';
import InteractableEquipment from './InteractableEquipment.jsx';

export default function ThermostatMarker({ equipmentHealth, onSelect, isNearby, isScanned }) {
  return (
    <group position={[-2, 1.2, 0.15]}>
      <EquipmentZoneLabel label="Thermostat" position={[0, 0.65, 0]} accent="#a78bfa" />
      <InteractableEquipment
        id="thermostat"
        label="Thermostat"
        position={[0, 0, 0]}
        size={[0.35, 0.35, 0.08]}
        color="#e2e8f0"
        onSelect={onSelect}
        isNearby={isNearby === 'thermostat'}
        isScanned={isScanned('thermostat')}
      />
      <ComponentTag
        label="Thermostat"
        componentKey="thermostat"
        equipmentHealth={equipmentHealth}
        position={[0, 0.5, 0]}
        visible={isNearby === 'thermostat'}
      />
    </group>
  );
}
