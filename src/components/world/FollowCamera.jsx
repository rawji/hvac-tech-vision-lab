import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DISTANCE = 8.5;
const HEIGHT = 6.5;
const LOOK_AT_HEIGHT = 1.1;
const DRAG_SENSITIVITY = 0.004;
const MAX_DRAG = 1.0;

export default function FollowCamera({
  playerPosition,
  playerFacing = 0,
  resetKey,
  focusPosition = null,
  enabled = true,
}) {
  const { camera, gl } = useThree();
  const yaw = useRef(Math.PI);
  const dragOffset = useRef(0);
  const dragging = useRef(false);
  const lastPointerX = useRef(0);
  const lookTarget = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());
  const focusVec = useRef(new THREE.Vector3());

  useEffect(() => {
    dragOffset.current = 0;
    yaw.current = playerFacing + Math.PI;
    lookTarget.current.set(playerPosition[0], LOOK_AT_HEIGHT, playerPosition[2]);
    updateCameraPosition();
    camera.lookAt(lookTarget.current);
  }, [resetKey, camera]);

  function updateCameraPosition() {
    const effectiveYaw = yaw.current + dragOffset.current;
    desiredPos.current.set(
      playerPosition[0] + Math.sin(effectiveYaw) * DISTANCE,
      HEIGHT,
      playerPosition[2] + Math.cos(effectiveYaw) * DISTANCE
    );
  }

  useFrame((_, delta) => {
    if (!enabled) return;

    const targetYaw = playerFacing + Math.PI;
    const followStrength = dragging.current ? 0 : 1 - Math.exp(-5 * delta);
    yaw.current += (targetYaw - yaw.current) * followStrength;

    const playerLook = new THREE.Vector3(playerPosition[0], LOOK_AT_HEIGHT, playerPosition[2]);

    if (focusPosition) {
      focusVec.current.set(focusPosition[0], LOOK_AT_HEIGHT + 0.15, focusPosition[2]);
      lookTarget.current.copy(playerLook).lerp(focusVec.current, 0.22);
    } else {
      lookTarget.current.copy(playerLook);
    }

    updateCameraPosition();

    const damp = 1 - Math.exp(-7 * delta);
    camera.position.lerp(desiredPos.current, damp);
    camera.lookAt(lookTarget.current);
  });

  useEffect(() => {
    if (!enabled) return undefined;
    const canvas = gl.domElement;

    const onContextMenu = (e) => e.preventDefault();

    const onPointerDown = (e) => {
      if (e.button !== 2) return;
      dragging.current = true;
      lastPointerX.current = e.clientX;
    };

    const onPointerMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      dragOffset.current -= dx * DRAG_SENSITIVITY;
      dragOffset.current = THREE.MathUtils.clamp(dragOffset.current, -MAX_DRAG, MAX_DRAG);
    };

    const onPointerUp = (e) => {
      if (e.button === 2) dragging.current = false;
    };

    canvas.addEventListener('contextmenu', onContextMenu);
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [enabled, gl.domElement]);

  return null;
}
