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

const FENCE_POSTS = [
  [-17, 0, -6],
  [-17, 0, 0],
  [-17, 0, 6],
  [17, 0, -4],
  [17, 0, 4],
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
        <planeGeometry args={[2.2, 9]} />
        <meshStandardMaterial color={PALETTE.path} roughness={0.94} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2, 0.014, 10.5]}>
        <planeGeometry args={[4.2, 14]} />
        <meshStandardMaterial color={PALETTE.driveway} roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.2, 0.015, 10.5]}>
        <planeGeometry args={[0.12, 13.5]} />
        <meshStandardMaterial color={PALETTE.drivewayEdge} roughness={0.85} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.013, 14.2]}>
        <planeGeometry args={[36, 3]} />
        <meshStandardMaterial color="#4b5563" roughness={0.96} />
      </mesh>

      <group position={SCENE.van}>
        <OutlinedBox args={[2.35, 0.12, 4.9]} position={[0, 0.06, 0]} color={PALETTE.vanTrim} stylized receiveShadow />
        <OutlinedBox
          args={[2.3, 1.6, 4.85]}
          position={[0, 0.86, 0]}
          color={PALETTE.vanBody}
          stylized
          roughness={0.62}
          castShadow
        />
        <OutlinedBox args={[0.08, 1.55, 4.9]} position={[-0.55, 0.86, 0]} color={PALETTE.vanAccent} stylized />
        <OutlinedBox args={[2.35, 0.14, 4.95]} position={[0, 0.18, 0]} color={PALETTE.vanTrim} stylized />
        <OutlinedBox args={[2.4, 0.08, 0.15]} position={[0, 1.62, 2.35]} color="#475569" stylized metalness={0.2} />
        <mesh position={[0.55, 1.08, 2.05]}>
          <boxGeometry args={[1.1, 0.68, 0.06]} />
          <meshStandardMaterial color="#a8c8e8" roughness={0.18} metalness={0.12} transparent opacity={0.92} />
        </mesh>
        <VanMarkerLight position={[0, 1.68, 2.35]} />
        <WorldInteractable
          id={VAN_TARGET.id}
          label={VAN_TARGET.label}
          position={[0, 0.9, 0]}
          size={[2.55, 1.95, 5.05]}
          color={PALETTE.vanBody}
          onNavigate={onNavigate}
          pointerDragRef={pointerDragRef}
          isSelected={selectedTargetId === VAN_TARGET.id}
          isNearby={proximityId === VAN_TARGET.id}
        />
      </group>

      {FENCE_POSTS.map((pos) => (
        <OutlinedBox
          key={pos.join('-')}
          args={[0.14, 1.1, 0.14]}
          position={[pos[0], 0.55, pos[2]]}
          color={PALETTE.wood}
          stylized
          castShadow
        />
      ))}

      <OutlinedBox args={[34, 0.06, 0.08]} position={[0, 0.48, -8.5]} color={PALETTE.fence} stylized />
      <OutlinedBox args={[0.08, 0.06, 28]} position={[-17, 0.48, 0]} color={PALETTE.fence} stylized />
      <OutlinedBox args={[0.08, 0.06, 28]} position={[17, 0.48, 0]} color={PALETTE.fence} stylized />
      <OutlinedBox args={[12, 0.06, 0.08]} position={[-12, 0.48, 14]} color={PALETTE.fence} stylized />
      <OutlinedBox args={[18, 0.06, 0.08]} position={[8, 0.48, 14]} color={PALETTE.fence} stylized />

      {TREE_POSITIONS.map((pos) => (
        <SuburbanTree key={pos.join('-')} position={pos} scale={pos[0] > 0 ? 1.05 : 0.95} />
      ))}

      {SHRUB_POSITIONS.map((pos) => (
        <group key={pos.join('-')}>
          <MulchBed position={pos} radius={0.7} />
          <ShrubSway position={pos} scale={1.05} stylized />
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
            <cylinderGeometry args={[0.032, 0.032, len, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#92702a' : '#8fa0ad'}
              metalness={0.48}
              roughness={0.38}
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
        args={[1.05, 1.55, 0.1]}
        position={[-11.5, 0.78, -1.5]}
        color="#57534e"
        stylized
        roughness={0.88}
      />
    </group>
  );
}
