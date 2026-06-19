import { useMemo } from 'react';
import OutlinedBox from './OutlinedBox.jsx';
import ShrubSway from './ShrubSway.jsx';
import SuburbanTree, { MulchBed } from './SuburbanTree.jsx';
import VanMarkerLight from './VanMarkerLight.jsx';
import WorldInteractable from './WorldInteractable.jsx';
import { PALETTE } from '../../data/worldPalette.js';
import { SCENE } from '../../data/worldLayout.js';
import { DISCONNECT_TARGET, VAN_TARGET } from '../../logic/navigation.js';

const SHRUB_POSITIONS = [
  [-3, 0, 7.5],
  [-11, 0, 4],
  [-11, 0, -1],
  [4, 0, 7],
  [15, 0, 3],
  [15, 0, -5],
];

const FENCE_SEGMENTS = [
  { pos: [-17, 0.55, 0], size: [0.12, 1.05, 28] },
  { pos: [17, 0.55, 0], size: [0.12, 1.05, 28] },
  { pos: [0, 0.55, -8.5], size: [34, 1.05, 0.12] },
  { pos: [-12, 0.55, 14], size: [12, 1.05, 0.12] },
  { pos: [8, 0.55, 14], size: [18, 1.05, 0.12] },
];

const TREE_POSITIONS = [
  [-15, 0, -4],
  [-14, 0, 8],
  [16, 0, 6],
  [14, 0, -6],
];

export default function PropertyDetails({
  onNavigate,
  pointerDragRef,
  equipmentState,
  selectedTargetId,
  proximityId,
}) {
  const lineSetPoints = useMemo(
    () => [
      [-8.5, 0.55, 1.2],
      [-4, 0.45, 1.4],
      [0, 0.35, 1.2],
      [4.5, 0.32, 1.1],
      [8.8, 0.3, 1.2],
      [11, 0.28, -0.2],
    ],
    []
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5.5, 0.016, 5.5]}>
        <planeGeometry args={[2.4, 9]} />
        <meshStandardMaterial color={PALETTE.path} roughness={0.92} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.014, 10.5]}>
        <planeGeometry args={[4.5, 14]} />
        <meshStandardMaterial color={PALETTE.driveway} roughness={0.88} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, 14.2]}>
        <planeGeometry args={[36, 3.2]} />
        <meshStandardMaterial color="#4b5563" roughness={0.95} />
      </mesh>

      <group position={SCENE.van}>
        <OutlinedBox
          args={[2.4, 1.65, 5]}
          position={[0, 0.82, 0]}
          color={PALETTE.vanBody}
          realistic
          roughness={0.55}
          castShadow
        />
        <OutlinedBox args={[2.5, 0.45, 5.1]} position={[0, 0.22, 0]} color={PALETTE.vanTrim} realistic />
        <mesh position={[0.6, 1.15, 2.15]}>
          <boxGeometry args={[1.2, 0.75, 0.08]} />
          <meshStandardMaterial color="#93c5fd" roughness={0.2} metalness={0.15} />
        </mesh>
        <VanMarkerLight position={[0, 1.65, 2.4]} />
        <WorldInteractable
          id={VAN_TARGET.id}
          label={VAN_TARGET.label}
          position={[0, 0.9, 0]}
          size={[2.6, 2, 5.2]}
          color={PALETTE.vanBody}
          onNavigate={onNavigate}
          pointerDragRef={pointerDragRef}
          isSelected={selectedTargetId === VAN_TARGET.id}
          isNearby={proximityId === VAN_TARGET.id}
        />
      </group>

      <group position={[2.5, 0, 11]}>
        <OutlinedBox args={[0.65, 0.42, 0.4]} position={[0, 0.21, 0]} color="#78350f" realistic castShadow />
        <mesh position={[0, 0.48, 0]}>
          <boxGeometry args={[0.58, 0.08, 0.34]} />
          <meshStandardMaterial color="#92400e" roughness={0.9} />
        </mesh>
      </group>

      {FENCE_SEGMENTS.map((seg) => (
        <OutlinedBox
          key={seg.pos.join('-')}
          args={seg.size}
          position={seg.pos}
          color={PALETTE.fence}
          realistic
          roughness={0.96}
          castShadow
        />
      ))}

      {TREE_POSITIONS.map((pos) => (
        <SuburbanTree key={pos.join('-')} position={pos} scale={pos[0] > 0 ? 1.05 : 0.95} />
      ))}

      {SHRUB_POSITIONS.map((pos) => (
        <group key={pos.join('-')}>
          <MulchBed position={pos} radius={0.75} />
          <ShrubSway position={pos} scale={1.15} realistic />
        </group>
      ))}

      {lineSetPoints.slice(0, -1).map((from, i) => {
        const to = lineSetPoints[i + 1];
        const mx = (from[0] + to[0]) / 2;
        const my = (from[1] + to[1]) / 2;
        const mz = (from[2] + to[2]) / 2;
        const dx = to[0] - from[0];
        const dy = to[1] - from[1];
        const dz = to[2] - from[2];
        const len = Math.hypot(dx, dy, dz);
        const rotY = Math.atan2(dx, dz);
        const rotX = Math.asin(dy / len);
        return (
          <mesh key={`line-${i}`} position={[mx, my, mz]} rotation={[rotX, rotY, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, len, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#a16207' : '#94a3b8'}
              metalness={0.45}
              roughness={0.42}
            />
          </mesh>
        );
      })}

      <WorldInteractable
        id={DISCONNECT_TARGET.id}
        label={DISCONNECT_TARGET.label}
        position={SCENE.disconnect}
        size={[0.38, 0.58, 0.22]}
        color="#e7e5e4"
        onNavigate={onNavigate}
        pointerDragRef={pointerDragRef}
        isSelected={selectedTargetId === DISCONNECT_TARGET.id}
        isNearby={proximityId === DISCONNECT_TARGET.id}
      />

      <OutlinedBox
        args={[1.1, 1.65, 0.12]}
        position={[-11.5, 0.82, -1.5]}
        color="#57534e"
        realistic
        roughness={0.85}
      />
    </group>
  );
}
