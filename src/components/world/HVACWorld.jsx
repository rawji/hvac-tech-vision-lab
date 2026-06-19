import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import HouseScene from './HouseScene.jsx';
import PropertyDetails from './PropertyDetails.jsx';
import CondenserUnit from './CondenserUnit.jsx';
import AirHandlerZone from './AirHandlerZone.jsx';
import ThermostatMarker from './ThermostatMarker.jsx';
import TechnicianAvatar from './TechnicianAvatar.jsx';
import FollowCamera from './FollowCamera.jsx';
import TechVisionOverlay from '../techVision/TechVisionOverlay.jsx';
import ScannerReticle from '../techVision/ScannerReticle.jsx';
import { TechVisionProvider } from '../techVision/TechVisionProvider.jsx';
import PlayerController from './PlayerController.jsx';
import { useProximityInteraction } from '../interactions/useProximityInteraction.js';
import { applyMovementDelta } from '../../logic/worldBounds.js';

const INTERACTION_TARGETS = [
  { id: 'thermostat', label: 'Thermostat', position: [-2.4, 0, 0.35] },
  { id: 'filter', label: 'Filter', position: [-4.5, 0, -0.5] },
  { id: 'airHandler', label: 'Air Handler', position: [-4.5, 0, -1] },
  { id: 'condenser', label: 'Condenser Unit', position: [4, 0, -1] },
  { id: 'condenserCoil', label: 'Condenser Coil', position: [4, 0, 0] },
  { id: 'capacitor', label: 'Capacitor', position: [3.5, 0, -0.6] },
  { id: 'compressor', label: 'Compressor', position: [4.4, 0, -1.3] },
  { id: 'fanMotor', label: 'Fan Motor', position: [4, 0, -1] },
  { id: 'contactor', label: 'Contactor', position: [3.7, 0, -1.5] },
];

const TARGET_POSITIONS = Object.fromEntries(
  INTERACTION_TARGETS.map((t) => [t.id, t.position])
);

const DEFAULT_CAMERA = { position: [0, 6.5, 8.5], fov: 48, near: 0.1, far: 100 };

function WorldContent({
  equipmentHealth,
  playerPosition,
  onMove,
  onNearbyChange,
  onInspect,
  onScan,
  techVisionEnabled,
  scannedTargets,
  scanPulseTarget,
  technician,
  appearance,
  cameraResetKey,
  onReady,
  cameraBasisRef,
}) {
  const posRef = useRef(playerPosition);
  const facingRef = useRef(0);
  const [facing, setFacing] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  posRef.current = playerPosition;

  const handleMove = useCallback(
    ([dx, dz]) => {
      if (Math.abs(dx) > 0.0001 || Math.abs(dz) > 0.0001) {
        facingRef.current = Math.atan2(dx, dz);
        setFacing(facingRef.current);
      }
      onMove(applyMovementDelta(posRef.current, dx, dz));
    },
    [onMove]
  );

  const handleFacingChange = useCallback((angle) => {
    facingRef.current = angle;
    setFacing(angle);
  }, []);

  const handleMovingChange = useCallback((moving) => {
    setIsMoving(moving);
  }, []);

  const nearby = useProximityInteraction(playerPosition, INTERACTION_TARGETS);

  useEffect(() => {
    onNearbyChange(nearby);
  }, [nearby, onNearbyChange]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

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
  const reticlePos = nearby
    ? [TARGET_POSITIONS[nearby.id][0], 1.3, TARGET_POSITIONS[nearby.id][2]]
    : [0, 1.3, 0];

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight castShadow position={[10, 14, 6]} intensity={1.15} shadow-mapSize={[1024, 1024]} />
      <hemisphereLight args={['#bae6fd', '#3f6f3a', 0.35]} />
      <Sky sunPosition={[100, 12, 80]} turbidity={0.4} rayleigh={0.8} mieCoefficient={0.005} />
      <HouseScene />
      <PropertyDetails />
      <CondenserUnit
        equipmentHealth={equipmentHealth}
        onSelect={onInspect}
        isNearby={nearbyId}
        isScanned={isScanned}
        scanPulseTarget={scanPulseTarget}
      />
      <AirHandlerZone
        equipmentHealth={equipmentHealth}
        onSelect={onInspect}
        isNearby={nearbyId}
        isScanned={isScanned}
        scanPulseTarget={scanPulseTarget}
      />
      <ThermostatMarker
        equipmentHealth={equipmentHealth}
        onSelect={onInspect}
        isNearby={nearbyId}
        isScanned={isScanned}
        scanPulseTarget={scanPulseTarget}
      />
      <TechnicianAvatar
        technician={technician}
        appearance={appearance}
        position={playerPosition}
        facing={facing}
        isMoving={isMoving}
      />
      <ScannerReticle position={reticlePos} active={Boolean(nearby && techVisionEnabled)} />
      <TechVisionOverlay />
      <PlayerController
        onMove={handleMove}
        onFacingChange={handleFacingChange}
        onMovingChange={handleMovingChange}
        cameraBasisRef={cameraBasisRef}
      />
      <FollowCamera
        playerPosition={playerPosition}
        playerFacing={facing}
        resetKey={cameraResetKey}
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
  scanPulseTarget,
  technician,
  appearance,
  cameraResetKey,
  onReady,
  cameraBasisRef,
}) {
  const canvasStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);

  return (
    <div className={`world-canvas ${techVisionEnabled ? 'tech-vision-active' : ''}`}>
      <TechVisionProvider enabled={techVisionEnabled}>
        <Canvas shadows camera={DEFAULT_CAMERA} style={canvasStyle}>
          <color attach="background" args={['#87CEEB']} />
          <fog attach="fog" args={['#b6d4ea', 22, 48]} />
          <WorldContent
            equipmentHealth={equipmentHealth}
            playerPosition={playerPosition}
            onMove={onMove}
            onNearbyChange={onNearbyChange}
            onInspect={onInspect}
            onScan={onScan}
            techVisionEnabled={techVisionEnabled}
            scannedTargets={scannedTargets}
            scanPulseTarget={scanPulseTarget}
            technician={technician}
            appearance={appearance}
            cameraResetKey={cameraResetKey}
            onReady={onReady}
            cameraBasisRef={cameraBasisRef}
          />
        </Canvas>
      </TechVisionProvider>
    </div>
  );
}
