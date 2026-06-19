import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { MOVE_SPEED } from '../../logic/worldBounds.js';

const KEYS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
};

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const up = new THREE.Vector3(0, 1, 0);
const velocity = new THREE.Vector2();

export default function PlayerController({
  onMove,
  onFacingChange,
  onMovingChange,
  cameraBasisRef,
  enabled = true,
}) {
  const keysRef = useRef(new Set());
  const movingRef = useRef(false);
  const facingRef = useRef(0);
  const { camera } = useThree();

  useEffect(() => {
    if (!enabled) return undefined;

    const onKeyDown = (e) => {
      if (['KeyV', 'KeyE', 'KeyF', 'Escape'].includes(e.code)) return;
      keysRef.current.add(e.code);
    };
    const onKeyUp = (e) => keysRef.current.delete(e.code);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [enabled]);

  useFrame((_, delta) => {
    if (!enabled) return;

    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() < 0.0001) {
      forward.set(0, 0, -1);
    } else {
      forward.normalize();
    }
    right.crossVectors(forward, up).normalize();

    if (cameraBasisRef) {
      cameraBasisRef.current = {
        forward: [forward.x, forward.z],
        right: [right.x, right.z],
      };
    }

    let mx = 0;
    let mz = 0;
    const keys = keysRef.current;

    if (KEYS.forward.some((k) => keys.has(k))) {
      mx += forward.x;
      mz += forward.z;
    }
    if (KEYS.back.some((k) => keys.has(k))) {
      mx -= forward.x;
      mz -= forward.z;
    }
    if (KEYS.left.some((k) => keys.has(k))) {
      mx -= right.x;
      mz -= right.z;
    }
    if (KEYS.right.some((k) => keys.has(k))) {
      mx += right.x;
      mz += right.z;
    }

    const hasInput = mx !== 0 || mz !== 0;
    const targetSpeed = hasInput ? 1 : 0;

    if (hasInput) {
      const len = Math.hypot(mx, mz) || 1;
      mx /= len;
      mz /= len;
    }

    const accel = hasInput ? 14 : 18;
    velocity.x += (mx * targetSpeed - velocity.x) * Math.min(accel * delta, 1);
    velocity.y += (mz * targetSpeed - velocity.y) * Math.min(accel * delta, 1);

    const speed = Math.hypot(velocity.x, velocity.y);
    if (speed < 0.02 && !hasInput) {
      velocity.set(0, 0);
      if (movingRef.current) {
        movingRef.current = false;
        onMovingChange?.(false);
      }
      return;
    }

    const dx = velocity.x * MOVE_SPEED * delta;
    const dz = velocity.y * MOVE_SPEED * delta;
    const moveAngle = Math.atan2(dx, dz);

    facingRef.current += (moveAngle - facingRef.current) * Math.min(12 * delta, 1);
    onFacingChange?.(facingRef.current);

    if (!movingRef.current) {
      movingRef.current = true;
      onMovingChange?.(true);
    }
    onMove([dx, dz]);
  });

  return null;
}

export function applyCameraRelativeDelta([ix, iz], cameraYaw) {
  const sin = Math.sin(cameraYaw);
  const cos = Math.cos(cameraYaw);
  const forwardX = sin;
  const forwardZ = cos;
  const rightX = cos;
  const rightZ = -sin;

  const mx = ix * rightX + iz * forwardX;
  const mz = ix * rightZ + iz * forwardZ;
  const len = Math.hypot(mx, mz) || 1;
  return [mx / len, mz / len];
}
