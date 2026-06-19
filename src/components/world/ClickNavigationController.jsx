import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MOVE_SPEED } from '../../logic/worldBounds.js';
import { ARRIVAL_THRESHOLD, getFaceAngle } from '../../logic/navigation.js';

const velocity = new THREE.Vector2();

export default function ClickNavigationController({
  destination,
  faceTarget = null,
  playerPosition,
  onMove,
  onFacingChange,
  onMovingChange,
  onArrived,
  enabled = true,
  arrivalThreshold = ARRIVAL_THRESHOLD,
}) {
  const posRef = useRef(playerPosition);
  const movingRef = useRef(false);
  const arrivedRef = useRef(false);
  const facingRef = useRef(0);

  posRef.current = playerPosition;

  useEffect(() => {
    arrivedRef.current = false;
  }, [destination?.[0], destination?.[1], faceTarget?.[0], faceTarget?.[2]]);

  useFrame((_, delta) => {
    if (!enabled) return;

    if (!destination) {
      velocity.x += (0 - velocity.x) * Math.min(18 * delta, 1);
      velocity.y += (0 - velocity.y) * Math.min(18 * delta, 1);
      if (Math.hypot(velocity.x, velocity.y) < 0.02) {
        velocity.set(0, 0);
        if (movingRef.current) {
          movingRef.current = false;
          onMovingChange?.(false);
        }
      }
      return;
    }

    const [px, , pz] = posRef.current;
    const [destX, destZ] = destination;
    const toX = destX - px;
    const toZ = destZ - pz;
    const dist = Math.hypot(toX, toZ);

    if (dist <= arrivalThreshold) {
      velocity.set(0, 0);
      if (!arrivedRef.current) {
        arrivedRef.current = true;
        if (movingRef.current) {
          movingRef.current = false;
          onMovingChange?.(false);
        }
        if (faceTarget) {
          const angle = getFaceAngle(posRef.current, faceTarget);
          facingRef.current = angle;
          onFacingChange?.(angle);
        }
        onArrived?.();
      }
      return;
    }

    const dirX = toX / dist;
    const dirZ = toZ / dist;
    const targetSpeed = 1;
    const accel = 14;

    velocity.x += (dirX * targetSpeed - velocity.x) * Math.min(accel * delta, 1);
    velocity.y += (dirZ * targetSpeed - velocity.y) * Math.min(accel * delta, 1);

    const dx = velocity.x * MOVE_SPEED * delta;
    const dz = velocity.y * MOVE_SPEED * delta;

    if (Math.abs(dx) > 0.0001 || Math.abs(dz) > 0.0001) {
      const moveAngle = Math.atan2(dx, dz);
      facingRef.current += (moveAngle - facingRef.current) * Math.min(12 * delta, 1);
      onFacingChange?.(facingRef.current);
    }

    if (!movingRef.current) {
      movingRef.current = true;
      onMovingChange?.(true);
    }

    onMove([dx, dz]);
  });

  return null;
}
