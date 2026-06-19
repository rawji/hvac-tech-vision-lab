import ComponentTag from '../techVision/ComponentTag.jsx';
import EquipmentZoneLabel from './EquipmentZoneLabel.jsx';
import InteractableEquipment from './InteractableEquipment.jsx';
import OutlinedBox from './OutlinedBox.jsx';
import { SCENE } from '../../data/worldLayout.js';

export default function AirHandlerZone({ equipmentHealth, onSelect, equipmentState, proximityId }) {
  const atHandler = ['airHandler', 'filter'].includes(proximityId);

  return (
    <group position={SCENE.airHandler}>
      <EquipmentZoneLabel label="Air Handler — Garage" position={[0, 2.1, 0]} accent="#64748b" />
      <OutlinedBox
        args={[1.15, 0.08, 1.05]}
        position={[0, 0.04, 0]}
        color="#78716c"
        realistic
        receiveShadow
      />
      <InteractableEquipment
        id="airHandler"
        label="Air Handler"
        position={[0, 0.72, 0]}
        size={[1.05, 1.35, 1]}
        color="#64748b"
        onSelect={onSelect}
        {...equipmentState('airHandler')}
      />
      <InteractableEquipment
        id="filter"
        label="Filter"
        position={[0, 1.05, 0.55]}
        size={[0.85, 0.08, 0.55]}
        color="#d4d4d8"
        onSelect={onSelect}
        showMarker={false}
        {...equipmentState('filter')}
      />
      <ComponentTag
        label="Indoor Airflow"
        componentKey="indoorAirflow"
        equipmentHealth={equipmentHealth}
        position={[0, 1.65, 0]}
        visible={atHandler}
      />
      <ComponentTag
        label="Temp Split"
        componentKey="temperatureSplit"
        equipmentHealth={equipmentHealth}
        position={[0.65, 1.35, 0.55]}
        visible={atHandler}
      />
    </group>
  );
}
