import ComponentTag from '../techVision/ComponentTag.jsx';
import EquipmentZoneLabel from './EquipmentZoneLabel.jsx';
import InteractableEquipment from './InteractableEquipment.jsx';
import ThermostatScreen from './ThermostatScreen.jsx';
import { SCENE } from '../../data/worldLayout.js';

export default function ThermostatMarker({ equipmentHealth, onSelect, equipmentState, proximityId }) {
  return (
    <group position={SCENE.thermostat}>
      <EquipmentZoneLabel label="Thermostat" position={[0, 0.55, 0]} accent="#94a3b8" />
      <InteractableEquipment
        id="thermostat"
        label="Thermostat"
        position={[0, 0, 0]}
        size={[0.38, 0.38, 0.08]}
        color="#e2e8f0"
        onSelect={onSelect}
        {...equipmentState('thermostat')}
      />
      <ThermostatScreen />
      <ComponentTag
        label="Thermostat"
        componentKey="thermostat"
        equipmentHealth={equipmentHealth}
        position={[0, 0.45, 0]}
        visible={proximityId === 'thermostat'}
      />
    </group>
  );
}
