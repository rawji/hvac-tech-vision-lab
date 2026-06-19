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
import NavigationGround from './NavigationGround.jsx';
import ClickNavigationController from './ClickNavigationController.jsx';
import TechVisionOverlay from '../techVision/TechVisionOverlay.jsx';
import ScannerReticle from '../techVision/ScannerReticle.jsx';
import { TechVisionProvider } from '../techVision/TechVisionProvider.jsx';
import { useProximityInteraction } from '../interactions/useProximityInteraction.js';
import { applyMovementDelta, clampPosition } from '../../logic/worldBounds.js';
import { resolveInteractionTarget, getTargetById } from '../../logic/interactionTarget.js';
import { INTERACTION_TARGETS, NAVIGATION_TARGETS } from '../../data/interactionTargets.js';
import {
  getApproachPosition,
  getNavigationTargetById,
  POINT_ARRIVAL_THRESHOLD,
} from '../../logic/navigation.js';
import { PALETTE, NORMAL_LIGHT, TECH_VISION } from '../../data/worldPalette.js';

export { INTERACTION_TARGETS, NAVIGATION_TARGETS } from '../../data/interactionTargets.js';

const TARGET_POSITIONS = Object.fromEntries(
  INTERACTION_TARGETS.map((t) => [t.id, t.position])
);

const DEFAULT_CAMERA = { position: [0, 6.5, 8.5], fov: 48, near: 0.1, far: 100 };

function WorldContent({
  equipmentHealth,
  playerPosition,
  onMove,
  onActiveTargetChange,
  onSelectTarget,
  onInspect,
  onScan,
  onScanBlocked,
  onVanArrival,
  onArrivedAtTarget,
  techVisionEnabled,
  scannedTargets,
  inspectedTargets,
  selectedTargetId,
  scanPulseTarget,
  inspectPulseTarget,
  technician,
  appearance,
  cameraResetKey,
  onReady,
  onNavigatingChange,
  uiStable = false,
}) {
  const posRef = useRef(playerPosition);
  const facingRef = useRef(0);
  const navigationRef = useRef(null);
  const pointerDragRef = useRef({
    pointerDown: false,
    didDrag: false,
    startX: 0,
    startY: 0,
    dragThreshold: 8,
  });

  const [facing, setFacing] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [navigation, setNavigation] = useState(null);

  posRef.current = playerPosition;
  navigationRef.current = navigation;

  const handleMove = useCallback(
    ([dx, dz]) => {
      onMove(applyMovementDelta(posRef.current, dx, dz));
    },
    [onMove]
  );

  const handleFacingChange = useCallback((angle) => {
    facingRef.current = angle;
    setFacing(angle);
  }, []);

  const handleMovingChange = useCallback(
    (moving) => {
      setIsMoving(moving);
      onNavigatingChange?.(moving || Boolean(navigationRef.current));
    },
    [onNavigatingChange]
  );

  const startNavigation = useCallback(
    (nextNav) => {
      setNavigation(nextNav);
      onNavigatingChange?.(true);
    },
    [onNavigatingChange]
  );

  const handleNavigateToTarget = useCallback(
    (targetId) => {
      if (pointerDragRef.current.didDrag) return;

      const target = getNavigationTargetById(NAVIGATION_TARGETS, targetId);
      if (!target) return;

      onSelectTarget(targetId);
      const approach = getApproachPosition(playerPosition, target.position);
      const arrivalAction =
        target.interactionType === 'van'
          ? 'van'
          : target.interactionType === 'equipment' || !target.interactionType
            ? 'inspect'
            : 'none';

      startNavigation({
        destination: [approach[0], approach[2]],
        targetId,
        faceTarget: target.position,
        arrivalAction,
      });
    },
    [playerPosition, onSelectTarget, startNavigation]
  );

  const handleNavigateToPoint = useCallback(
    ([x, z]) => {
      if (pointerDragRef.current.didDrag) return;
      onSelectTarget(null);
      const clamped = clampPosition(x, z);
      startNavigation({
        destination: [clamped[0], clamped[2]],
        targetId: null,
        faceTarget: null,
        arrivalAction: 'none',
      });
    },
    [onSelectTarget, startNavigation]
  );

  const handleArrival = useCallback(() => {
    const nav = navigationRef.current;
    if (!nav) return;

    setNavigation(null);
    onNavigatingChange?.(false);

    if (nav.arrivalAction === 'inspect' && nav.targetId) {
      onInspect(nav.targetId);
      onArrivedAtTarget?.(nav.targetId);
    } else if (nav.arrivalAction === 'van') {
      onVanArrival?.();
    }
  }, [onInspect, onVanArrival, onArrivedAtTarget, onNavigatingChange]);

  const proximityTarget = useProximityInteraction(playerPosition, INTERACTION_TARGETS);

  const activeTarget = useMemo(
    () =>
      resolveInteractionTarget({
        playerPosition,
        targets: INTERACTION_TARGETS,
        proximityTarget,
        selectedTargetId,
      }),
    [playerPosition, proximityTarget, selectedTargetId]
  );

  useEffect(() => {
    onActiveTargetChange(activeTarget, proximityTarget);
  }, [activeTarget, proximityTarget, onActiveTargetChange]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.repeat) return;
      if (e.code === 'KeyE' && activeTarget?.inRange) onInspect(activeTarget.id);
      if (e.code === 'KeyF') {
        if (!techVisionEnabled) {
          onScanBlocked?.();
          return;
        }
        if (activeTarget?.inRange) onScan(activeTarget.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTarget, onInspect, onScan, onScanBlocked, techVisionEnabled]);

  const isScanned = useCallback((id) => scannedTargets.includes(id), [scannedTargets]);
  const isInspected = useCallback((id) => inspectedTargets.includes(id), [inspectedTargets]);

  const equipmentState = useCallback(
    (id) => ({
      isNearby: proximityTarget?.id === id,
      isSelected: selectedTargetId === id,
      isInspected: isInspected(id),
      isScanned: isScanned(id),
      isPulsing: scanPulseTarget === id,
      isInspectPulsing: inspectPulseTarget === id,
      techVisionEnabled,
    }),
    [
      proximityTarget,
      selectedTargetId,
      isInspected,
      isScanned,
      scanPulseTarget,
      inspectPulseTarget,
      techVisionEnabled,
    ]
  );

  const focusTarget = activeTarget?.inRange
    ? getTargetById(INTERACTION_TARGETS, activeTarget.id)
    : selectedTargetId
      ? getTargetById(INTERACTION_TARGETS, selectedTargetId)
      : null;

  const reticleTarget = activeTarget?.inRange ? activeTarget : null;
  const reticlePos = reticleTarget
    ? [TARGET_POSITIONS[reticleTarget.id][0], 1.3, TARGET_POSITIONS[reticleTarget.id][2]]
    : [0, 1.3, 0];

  const sharedProps = {
    equipmentHealth,
    onSelect: handleNavigateToTarget,
    equipmentState,
    pointerDragRef,
  };

  return (
    <>
      <ambientLight intensity={techVisionEnabled ? TECH_VISION.ambient : NORMAL_LIGHT.ambient} />
      <directionalLight
        castShadow
        position={[10, 14, 6]}
        intensity={techVisionEnabled ? 1.05 : 1.2}
        color={techVisionEnabled ? TECH_VISION.keyLight : NORMAL_LIGHT.keyLight}
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight
        args={[
          techVisionEnabled ? '#93c5fd' : NORMAL_LIGHT.hemiSky,
          techVisionEnabled ? '#1e293b' : NORMAL_LIGHT.hemiGround,
          techVisionEnabled ? 0.32 : 0.42,
        ]}
      />
      <Sky
        sunPosition={[100, 14, 80]}
        turbidity={techVisionEnabled ? 0.55 : 0.35}
        rayleigh={techVisionEnabled ? 1.1 : 0.65}
        mieCoefficient={0.005}
      />

      <HouseScene />
      <NavigationGround onNavigate={handleNavigateToPoint} pointerDragRef={pointerDragRef} />
      <PropertyDetails
        onNavigate={handleNavigateToTarget}
        pointerDragRef={pointerDragRef}
        equipmentState={equipmentState}
        selectedTargetId={selectedTargetId}
        proximityId={proximityTarget?.id}
      />
      <CondenserUnit {...sharedProps} proximityId={proximityTarget?.id} />
      <AirHandlerZone {...sharedProps} proximityId={proximityTarget?.id} />
      <ThermostatMarker {...sharedProps} proximityId={proximityTarget?.id} />

      <TechnicianAvatar
        technician={technician}
        appearance={appearance}
        position={playerPosition}
        facing={facing}
        isMoving={isMoving}
      />

      <ScannerReticle
        position={reticlePos}
        active={Boolean(reticleTarget && techVisionEnabled)}
        lockOn={Boolean(reticleTarget && techVisionEnabled)}
      />

      <TechVisionOverlay />

      <ClickNavigationController
        destination={navigation?.destination ?? null}
        faceTarget={navigation?.faceTarget ?? null}
        playerPosition={playerPosition}
        onMove={handleMove}
        onFacingChange={handleFacingChange}
        onMovingChange={handleMovingChange}
        onArrived={handleArrival}
        arrivalThreshold={
          navigation?.arrivalAction === 'none' ? POINT_ARRIVAL_THRESHOLD : undefined
        }
      />

      <FollowCamera
        playerPosition={playerPosition}
        playerFacing={facing}
        resetKey={cameraResetKey}
        focusPosition={focusTarget?.position ?? null}
        pointerDragRef={pointerDragRef}
        uiStable={uiStable}
      />
    </>
  );
}

export default function HVACWorld({
  equipmentHealth,
  playerPosition,
  onMove,
  onActiveTargetChange,
  onSelectTarget,
  onInspect,
  onScan,
  onScanBlocked,
  onVanArrival,
  onArrivedAtTarget,
  techVisionEnabled,
  scannedTargets,
  inspectedTargets,
  selectedTargetId,
  scanPulseTarget,
  inspectPulseTarget,
  technician,
  appearance,
  cameraResetKey,
  onReady,
  onNavigatingChange,
  uiStable = false,
}) {
  const canvasStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);

  return (
    <div className={`world-canvas ${techVisionEnabled ? 'tech-vision-active' : ''}`}>
      <TechVisionProvider enabled={techVisionEnabled}>
        <Canvas shadows camera={DEFAULT_CAMERA} style={canvasStyle}>
          <color attach="background" args={[PALETTE.sky]} />
          {!techVisionEnabled && <fog attach="fog" args={[PALETTE.fog, 22, 50]} />}

          <WorldContent
            equipmentHealth={equipmentHealth}
            playerPosition={playerPosition}
            onMove={onMove}
            onActiveTargetChange={onActiveTargetChange}
            onSelectTarget={onSelectTarget}
            onInspect={onInspect}
            onScan={onScan}
            onScanBlocked={onScanBlocked}
            onVanArrival={onVanArrival}
            onArrivedAtTarget={onArrivedAtTarget}
            techVisionEnabled={techVisionEnabled}
            scannedTargets={scannedTargets}
            inspectedTargets={inspectedTargets}
            selectedTargetId={selectedTargetId}
            scanPulseTarget={scanPulseTarget}
            inspectPulseTarget={inspectPulseTarget}
            technician={technician}
            appearance={appearance}
            cameraResetKey={cameraResetKey}
            onReady={onReady}
            onNavigatingChange={onNavigatingChange}
            uiStable={uiStable}
          />
        </Canvas>
      </TechVisionProvider>
    </div>
  );
}
