import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DEFAULT_DISTANCE = 8.5;
const MIN_DISTANCE = 5.5;
const MAX_DISTANCE = 14;
const HEIGHT = 6.5;
const LOOK_AT_HEIGHT = 1.1;
const DRAG_SENSITIVITY = 0.004;
const MAX_DRAG = 1.2;
const DRAG_THRESHOLD = 8;
const ZOOM_SENSITIVITY = 0.55;

const SWING_YAW_MAX = 0.25;
const SWING_PITCH_MAX = 0.08;
const SWING_DELTA_SENSITIVITY = 0.0011;
const SWING_PITCH_RATIO = 0.32;
const SWING_DECAY = 3.2;
const SWING_SMOOTH = 7.5;
const SWING_IDLE_MS = 140;
const UI_STABLE_DECAY = 6.5;

export default function FollowCamera({
  playerPosition,
  playerFacing = 0,
  resetKey,
  focusPosition = null,
  enabled = true,
  pointerDragRef,
  uiStable = false,
}) {
  const { camera, gl } = useThree();
  const yaw = useRef(Math.PI);
  const dragOffset = useRef(0);
  const distance = useRef(DEFAULT_DISTANCE);
  const dragging = useRef(false);
  const pointerDownOnCanvas = useRef(false);
  const pointerOverCanvas = useRef(false);
  const lastPointerX = useRef(0);
  const lastSwingX = useRef(0);
  const lastSwingY = useRef(0);
  const lastMouseMoveTime = useRef(0);
  const swingTargetYaw = useRef(0);
  const swingTargetPitch = useRef(0);
  const swingYaw = useRef(0);
  const swingPitch = useRef(0);
  const uiStableRef = useRef(uiStable);
  const lookTarget = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());
  const focusVec = useRef(new THREE.Vector3());
  const pinchStart = useRef(null);

  uiStableRef.current = uiStable;

  useEffect(() => {
    dragOffset.current = 0;
    distance.current = DEFAULT_DISTANCE;
    swingTargetYaw.current = 0;
    swingTargetPitch.current = 0;
    swingYaw.current = 0;
    swingPitch.current = 0;
    yaw.current = playerFacing + Math.PI;
    lookTarget.current.set(playerPosition[0], LOOK_AT_HEIGHT, playerPosition[2]);
    updateCameraPosition();
    camera.lookAt(lookTarget.current);
  }, [resetKey, camera]);

  function updateCameraPosition() {
    const effectiveYaw = yaw.current + dragOffset.current + swingYaw.current;
    desiredPos.current.set(
      playerPosition[0] + Math.sin(effectiveYaw) * distance.current,
      HEIGHT + swingPitch.current * 2.2,
      playerPosition[2] + Math.cos(effectiveYaw) * distance.current
    );
  }

  function applySwingFromDelta(dx, dy) {
    if (uiStableRef.current) return;

    swingTargetYaw.current = THREE.MathUtils.clamp(
      swingTargetYaw.current + dx * SWING_DELTA_SENSITIVITY,
      -SWING_YAW_MAX,
      SWING_YAW_MAX
    );
    swingTargetPitch.current = THREE.MathUtils.clamp(
      swingTargetPitch.current - dy * SWING_DELTA_SENSITIVITY * SWING_PITCH_RATIO,
      -SWING_PITCH_MAX,
      SWING_PITCH_MAX
    );
    lastMouseMoveTime.current = performance.now();
  }

  useFrame((_, delta) => {
    if (!enabled) return;

    const targetYaw = playerFacing + Math.PI;
    const followStrength = dragging.current ? 0 : 1 - Math.exp(-5 * delta);
    yaw.current += (targetYaw - yaw.current) * followStrength;

    if (!dragging.current) {
      dragOffset.current += (0 - dragOffset.current) * (1 - Math.exp(-3 * delta));
    }

    const swingAllowed = !dragging.current && !pointerDownOnCanvas.current;
    const idle =
      performance.now() - lastMouseMoveTime.current > SWING_IDLE_MS || uiStableRef.current;
    const decayRate = uiStableRef.current ? UI_STABLE_DECAY : SWING_DECAY;

    if (idle && swingAllowed) {
      swingTargetYaw.current += (0 - swingTargetYaw.current) * (1 - Math.exp(-decayRate * delta));
      swingTargetPitch.current +=
        (0 - swingTargetPitch.current) * (1 - Math.exp(-decayRate * delta));
    }

    const swingInfluence = swingAllowed && !uiStableRef.current ? 1 : 0;
    const smooth = 1 - Math.exp(-SWING_SMOOTH * delta);
    swingYaw.current += (swingTargetYaw.current * swingInfluence - swingYaw.current) * smooth;
    swingPitch.current += (swingTargetPitch.current * swingInfluence - swingPitch.current) * smooth;

    const playerLook = new THREE.Vector3(playerPosition[0], LOOK_AT_HEIGHT, playerPosition[2]);

    if (focusPosition) {
      focusVec.current.set(focusPosition[0], LOOK_AT_HEIGHT + 0.15, focusPosition[2]);
      lookTarget.current.copy(playerLook).lerp(focusVec.current, 0.22);
    } else {
      lookTarget.current.copy(playerLook);
    }

    lookTarget.current.y += swingPitch.current * 1.4;

    updateCameraPosition();

    const damp = 1 - Math.exp(-7 * delta);
    camera.position.lerp(desiredPos.current, damp);
    camera.lookAt(lookTarget.current);
  });

  useEffect(() => {
    if (!enabled) return undefined;
    const canvas = gl.domElement;
    const dragRef = pointerDragRef?.current;

    const onContextMenu = (e) => e.preventDefault();

    const onPointerEnter = () => {
      pointerOverCanvas.current = true;
    };

    const onPointerLeave = () => {
      pointerOverCanvas.current = false;
      lastMouseMoveTime.current = 0;
    };

    const onPointerDown = (e) => {
      if (e.button !== 0) return;
      if (e.target !== canvas) return;
      if (dragRef) {
        dragRef.pointerDown = true;
        dragRef.didDrag = false;
        dragRef.startX = e.clientX;
        dragRef.startY = e.clientY;
      }
      pointerDownOnCanvas.current = true;
      dragging.current = true;
      lastPointerX.current = e.clientX;
      lastSwingX.current = e.clientX;
      lastSwingY.current = e.clientY;
    };

    const onPointerMove = (e) => {
      if (dragRef?.pointerDown) {
        const dx = e.clientX - dragRef.startX;
        const dy = e.clientY - dragRef.startY;
        if (Math.hypot(dx, dy) > (dragRef.dragThreshold ?? DRAG_THRESHOLD)) {
          dragRef.didDrag = true;
        }
      }

      const isMouse = e.pointerType === 'mouse';

      if (isMouse && pointerOverCanvas.current && !dragging.current) {
        const sdx = e.clientX - lastSwingX.current;
        const sdy = e.clientY - lastSwingY.current;
        if (sdx !== 0 || sdy !== 0) {
          applySwingFromDelta(sdx, sdy);
        }
      }
      lastSwingX.current = e.clientX;
      lastSwingY.current = e.clientY;

      if (!dragging.current) return;
      const dx = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      dragOffset.current -= dx * DRAG_SENSITIVITY;
      dragOffset.current = THREE.MathUtils.clamp(dragOffset.current, -MAX_DRAG, MAX_DRAG);
    };

    const onPointerUp = (e) => {
      if (e.button === 0) {
        dragging.current = false;
        pointerDownOnCanvas.current = false;
        if (dragRef) dragRef.pointerDown = false;
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      distance.current = THREE.MathUtils.clamp(
        distance.current + e.deltaY * 0.012 * ZOOM_SENSITIVITY,
        MIN_DISTANCE,
        MAX_DISTANCE
      );
    };

    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        const [a, b] = e.touches;
        pinchStart.current = {
          distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
          camDistance: distance.current,
        };
      } else if (e.touches.length === 1) {
        dragging.current = true;
        lastPointerX.current = e.touches[0].clientX;
        if (dragRef) {
          dragRef.pointerDown = true;
          dragRef.didDrag = false;
          dragRef.startX = e.touches[0].clientX;
          dragRef.startY = e.touches[0].clientY;
        }
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length === 2 && pinchStart.current) {
        e.preventDefault();
        const [a, b] = e.touches;
        const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        const scale = dist / pinchStart.current.distance;
        distance.current = THREE.MathUtils.clamp(
          pinchStart.current.camDistance / scale,
          MIN_DISTANCE,
          MAX_DISTANCE
        );
        return;
      }
      if (e.touches.length === 1 && dragging.current) {
        const touch = e.touches[0];
        if (dragRef?.pointerDown) {
          const dx = touch.clientX - dragRef.startX;
          const dy = touch.clientY - dragRef.startY;
          if (Math.hypot(dx, dy) > (dragRef.dragThreshold ?? DRAG_THRESHOLD)) {
            dragRef.didDrag = true;
          }
        }
        const dx = touch.clientX - lastPointerX.current;
        lastPointerX.current = touch.clientX;
        dragOffset.current -= dx * DRAG_SENSITIVITY;
        dragOffset.current = THREE.MathUtils.clamp(dragOffset.current, -MAX_DRAG, MAX_DRAG);
      }
    };

    const onTouchEnd = () => {
      dragging.current = false;
      pointerDownOnCanvas.current = false;
      pinchStart.current = null;
      if (dragRef) dragRef.pointerDown = false;
    };

    canvas.addEventListener('contextmenu', onContextMenu);
    canvas.addEventListener('pointerenter', onPointerEnter);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('pointerenter', onPointerEnter);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, [enabled, gl.domElement, pointerDragRef]);

  return null;
}
