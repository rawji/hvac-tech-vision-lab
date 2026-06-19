import ComponentTag from '../techVision/ComponentTag.jsx';
import EquipmentZoneLabel from './EquipmentZoneLabel.jsx';
import InteractableEquipment from './InteractableEquipment.jsx';

export default function AirHandlerZone({ equipmentHealth, onSelect, equipmentState, proximityId }) {
  const atHandler = ['airHandler', 'filter'].includes(proximityId);

  return (
    <group position={[-4.5, 0, -1]}>
      <EquipmentZoneLabel label="Air Handler" position={[0, 1.9, 0]} accent="#38bdf8" />
      <InteractableEquipment
        id="airHandler"
        label="Air Handler"
        position={[0, 0.6, 0]}
        size={[0.9, 1.2, 0.9]}
        color="#64748b"
        onSelect={onSelect}
        {...equipmentState('airHandler')}
      />
      <InteractableEquipment
        id="filter"
        label="Filter"
        position={[0, 0.9, 0.5]}
        size={[0.7, 0.08, 0.5]}
        color="#fbbf24"
        onSelect={onSelect}
        showMarker={false}
        {...equipmentState('filter')}
      />
      <ComponentTag
        label="Indoor Airflow"
        componentKey="indoorAirflow"
        equipmentHealth={equipmentHealth}
        position={[0, 1.5, 0]}
        visible={atHandler}
      />
      <ComponentTag
        label="Temp Split"
        componentKey="temperatureSplit"
        equipmentHealth={equipmentHealth}
        position={[0.6, 1.2, 0.5]}
        visible={atHandler}
      />
    </group>
  );
}
