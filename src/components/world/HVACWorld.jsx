import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
import HouseScene from './HouseScene.jsx';
import CondenserUnit from './CondenserUnit.jsx';
import AirHandlerZone from './AirHandlerZone.jsx';
import ThermostatMarker from './ThermostatMarker.jsx';
import TechnicianAvatar from './TechnicianAvatar.jsx';
import TechVisionOverlay from '../techVision/TechVisionOverlay.jsx';
import { TechVisionProvider } from '../techVision/TechVisionProvider.jsx';
import { useKeyboardControls } from '../interactions/useKeyboardControls.js';
import { useProximityInteraction } from '../interactions/useProximityInteraction.js';
import { applyMovementDelta } from '../../logic/worldBounds.js';

const INTERACTION_TARGETS = [
  { id: 'thermostat', label: 'Thermostat', position: [-2, 0, 0.15] },
  { id: 'filter', label: 'Filter', position: [-4.5, 0, -0.5] },
  { id: 'airHandler', label: 'Air Handler', position: [-4.5, 0, -1] },
  { id: 'condenser', label: 'Condenser Unit', position: [4, 0, -1] },
  { id: 'condenserCoil', label: 'Condenser Coil', position: [4, 0, 0] },
  { id: 'capacitor', label: 'Capacitor', position: [3.5, 0, -0.6] },
  { id: 'compressor', label: 'Compressor', position: [4.4, 0, -1.3] },
  { id: 'fanMotor', label: 'Fan Motor', position: [4, 0, -1] },
  { id: 'contactor', label: 'Contactor', position: [3.7, 0, -1.5] },
];

const DEFAULT_CAMERA = { position: [0, 8, 10], fov: 50 };

function CameraReset({ resetKey, playerPosition }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(...DEFAULT_CAMERA.position);
    camera.lookAt(playerPosition[0], 0, playerPosition[2]);
  }, [resetKey, camera, playerPosition]);

  return null;
}

function WorldContent({
  equipmentHealth,
  playerPosition,
  onMove,
  onNearbyChange,
  onInspect,
  onScan,
  techVisionEnabled,
  scannedTargets,
  technician,
  appearance,
  cameraResetKey,
}) {
  const posRef = useRef(playerPosition);
  const controlsRef = useRef();
  posRef.current = playerPosition;

  const handleMove = useCallback(
    ([dx, dz]) => {
      onMove(applyMovementDelta(posRef.current, dx, dz));
    },
    [onMove]
  );

  useKeyboardControls(handleMove, true);

  const nearby = useProximityInteraction(playerPosition, INTERACTION_TARGETS);

  useEffect(() => {
    onNearbyChange(nearby);
  }, [nearby, onNearbyChange]);

  useEffect(() => {
    controlsRef.current?.reset();
  }, [cameraResetKey]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      if (e.code === 'KeyE' && nearby) onInspect(nearby.id);
      if (e.code === 'KeyF' && nearby && techVisionEnabled) onScan(nearby.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nearby, onInspect, onScan, techVisionEnabled]);

  const isScanned = useCallback((id) => scannedTargets.includes(id), [scannedTargets]);
  const nearbyId = nearby?.id ?? null;

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[8, 12, 4]} intensity={1.1} shadow-mapSize={[512, 512]} />
      <Sky sunPosition={[100, 20, 100]} turbidity={0.1} rayleigh={0.5} />
      <HouseScene />
      <CondenserUnit
        equipmentHealth={equipmentHealth}
        onSelect={onInspect}
        isNearby={nearbyId}
        isScanned={isScanned}
      />
      <AirHandlerZone
        equipmentHealth={equipmentHealth}
        onSelect={onInspect}
        isNearby={nearbyId}
        isScanned={isScanned}
      />
      <ThermostatMarker
        equipmentHealth={equipmentHealth}
        onSelect={onInspect}
        isNearby={nearbyId}
        isScanned={isScanned}
      />
      <TechnicianAvatar
        technician={technician}
        appearance={appearance}
        position={playerPosition}
      />
      <TechVisionOverlay />
      <CameraReset resetKey={cameraResetKey} playerPosition={playerPosition} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={6}
        maxDistance={16}
        target={[playerPosition[0], 0, playerPosition[2]]}
      />
    </>
  );
}

export default function HVACWorld({
  equipmentHealth,
  playerPosition,
  onMove,
  onNearbyChange,
  onInspect,
  onScan,
  techVisionEnabled,
  scannedTargets,
  technician,
  appearance,
  cameraResetKey,
}) {
  const canvasStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);

  return (
    <div className="world-canvas">
      <TechVisionProvider enabled={techVisionEnabled}>
        <Canvas shadows camera={DEFAULT_CAMERA} style={canvasStyle}>
          <color attach="background" args={['#87CEEB']} />
          <WorldContent
            equipmentHealth={equipmentHealth}
            playerPosition={playerPosition}
            onMove={onMove}
            onNearbyChange={onNearbyChange}
            onInspect={onInspect}
            onScan={onScan}
            techVisionEnabled={techVisionEnabled}
            scannedTargets={scannedTargets}
            technician={technician}
            appearance={appearance}
            cameraResetKey={cameraResetKey}
          />
        </Canvas>
      </TechVisionProvider>
    </div>
  );
}
