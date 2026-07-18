import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import HouseScene from './HouseScene.jsx';
import PropertyDetails from './PropertyDetails.jsx';
import CondenserUnit from './CondenserUnit.jsx';
import AirHandlerZone from './AirHandlerZone.jsx';
import ThermostatMarker from './ThermostatMarker.jsx';
import TechnicianAvatar from './TechnicianAvatar.jsx';
import FollowCamera from './FollowCamera.jsx';
import NavigationGround from './NavigationGround.jsx';
import ClickNavigationController from './ClickNavigationController.jsx';
import ToneMappingSync from './ToneMappingSync.jsx';
import CanvasSizeSync from './CanvasSizeSync.jsx';
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
import { PALETTE, NORMAL_LIGHT, TECH_VISION, TONE_MAPPING } from '../../data/worldPalette.js';
import { getInitialPlayerFacing } from '../../data/worldLayout.js';

const CANVAS_GL = {
  antialias: true,
  alpha: false,
  // Firefox often fails "high-performance" contexts; default is more reliable.
  powerPreference: 'default',
  failIfMajorPerformanceCaveat: false,
  stencil: false,
  depth: true,
};

function WebGlFallback() {
  return (
    <div className="world-error" role="alert">
      <p className="eyebrow">HVAC Technician World</p>
      <h2>3D view could not start</h2>
      <p>
        WebGL failed in this browser. In Firefox: turn on hardware acceleration (Settings → General →
        Performance), disable canvas/fingerprint blockers for this site, then reload. Edge or Chrome
        also work.
      </p>
    </div>
  );
}

export { INTERACTION_TARGETS, NAVIGATION_TARGETS } from '../../data/interactionTargets.js';

const TARGET_POSITIONS = Object.fromEntries(
  INTERACTION_TARGETS.map((t) => [t.id, t.position])
);

const DEFAULT_CAMERA = { position: [-4, 10, 14], fov: 44, near: 0.1, far: 120 };

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
  const facingRef = useRef(getInitialPlayerFacing());
  const navigationRef = useRef(null);
  const pointerDragRef = useRef({
    pointerDown: false,
    didDrag: false,
    startX: 0,
    startY: 0,
    dragThreshold: 8,
  });

  const [facing, setFacing] = useState(getInitialPlayerFacing);
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
      <CanvasSizeSync />
      <ToneMappingSync techVisionEnabled={techVisionEnabled} />
      <ambientLight intensity={techVisionEnabled ? TECH_VISION.ambient : NORMAL_LIGHT.ambient} />
      <directionalLight
        castShadow
        position={[12, 22, 8]}
        intensity={techVisionEnabled ? 1.1 : NORMAL_LIGHT.keyIntensity}
        color={techVisionEnabled ? TECH_VISION.keyLight : NORMAL_LIGHT.keyLight}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00015}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight
        position={[-10, 14, 6]}
        intensity={techVisionEnabled ? 0.22 : NORMAL_LIGHT.fillIntensity}
        color={techVisionEnabled ? TECH_VISION.fillLight : NORMAL_LIGHT.fillLight}
      />
      <directionalLight
        position={[0, 10, -16]}
        intensity={techVisionEnabled ? 0.45 : NORMAL_LIGHT.rimIntensity}
        color={techVisionEnabled ? TECH_VISION.rimLight : NORMAL_LIGHT.rimLight}
      />
      <hemisphereLight
        args={[
          techVisionEnabled ? '#7cb8ff' : NORMAL_LIGHT.hemiSky,
          techVisionEnabled ? '#0f172a' : NORMAL_LIGHT.hemiGround,
          techVisionEnabled ? 0.28 : NORMAL_LIGHT.hemiIntensity,
        ]}
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
  const canvasStyle = useMemo(
    () => ({ width: '100%', height: '100%', display: 'block', touchAction: 'none' }),
    []
  );
  const handleCanvasCreated = useCallback(
    ({ gl }) => {
      try {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = techVisionEnabled
          ? TONE_MAPPING.techVisionExposure
          : TONE_MAPPING.normalExposure;
        gl.setClearColor(techVisionEnabled ? '#0b1524' : PALETTE.sky, 1);
        // Soft shadows can fail on constrained Firefox contexts; keep basic shadows.
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFShadowMap;
      } catch (error) {
        console.warn('WebGL renderer setup warning:', error);
      }
    },
    [techVisionEnabled]
  );

  return (
    <div className={`world-canvas ${techVisionEnabled ? 'tech-vision-active' : ''}`}>
      <TechVisionProvider enabled={techVisionEnabled}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={CANVAS_GL}
          camera={DEFAULT_CAMERA}
          style={canvasStyle}
          onCreated={handleCanvasCreated}
          fallback={<WebGlFallback />}
        >
          <color attach="background" args={[techVisionEnabled ? '#0b1524' : PALETTE.sky]} />
          {!techVisionEnabled && <fog attach="fog" args={[PALETTE.fog, 48, 110]} />}
          {techVisionEnabled && <fog attach="fog" args={[TECH_VISION.fog, 28, 75]} />}

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
