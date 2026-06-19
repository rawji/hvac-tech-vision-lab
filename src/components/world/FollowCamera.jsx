import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const DISTANCE = 8.5;
const HEIGHT = 6.5;
const LOOK_AT_HEIGHT = 1.1;
const DRAG_SENSITIVITY = 0.004;

export default function FollowCamera({
  playerPosition,
  playerFacing = 0,
  resetKey,
  onCameraYaw,
  enabled = true,
}) {
  const { camera, gl } = useThree();
  const yaw = useRef(Math.PI);
  const dragOffset = useRef(0);
  const dragging = useRef(false);
  const lastPointerX = useRef(0);
  const lookTarget = useRef(new THREE.Vector3());
  const desiredPos = useRef(new THREE.Vector3());

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
    const followStrength = dragging.current ? 0 : 1 - Math.exp(-4 * delta);
    yaw.current += (targetYaw - yaw.current) * followStrength;

    lookTarget.current.set(playerPosition[0], LOOK_AT_HEIGHT, playerPosition[2]);
    updateCameraPosition();

    const damp = 1 - Math.exp(-6 * delta);
    camera.position.lerp(desiredPos.current, damp);
    camera.lookAt(lookTarget.current);

    onCameraYaw?.(yaw.current + dragOffset.current);
  });

  useEffect(() => {
    if (!enabled) return undefined;
    const canvas = gl.domElement;

    const onPointerDown = (e) => {
      if (e.button !== 2) return;
      dragging.current = true;
      lastPointerX.current = e.clientX;
      e.preventDefault();
    };

    const onPointerMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      dragOffset.current -= dx * DRAG_SENSITIVITY;
      dragOffset.current = THREE.MathUtils.clamp(dragOffset.current, -1.2, 1.2);
    };

    const onPointerUp = () => {
      dragging.current = false;
    };

    const onWheel = (e) => {
      /* zoom reserved — keep distance fixed for readable service-call framing */
      e.preventDefault();
    };

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
    };
  }, [enabled, gl.domElement]);

  return null;
}
