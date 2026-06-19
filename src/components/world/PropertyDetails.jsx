import { useMemo } from 'react';
import OutlinedBox from './OutlinedBox.jsx';
import ShrubSway from './ShrubSway.jsx';
import VanMarkerLight from './VanMarkerLight.jsx';
import { PALETTE } from '../../data/worldPalette.js';

const SHRUB_POSITIONS = [
  [-1.5, 0, 2.5],
  [-5.5, 0, 0.5],
  [1.5, 0, -3.5],
  [6.5, 0, 1.5],
];

const FENCE_SEGMENTS = [
  { pos: [-6, 0.4, 2], size: [0.15, 0.8, 4] },
  { pos: [-6, 0.4, -2], size: [0.15, 0.8, 4] },
  { pos: [-4, 0.4, 4], size: [4, 0.8, 0.15] },
];

export default function PropertyDetails() {
  const lineSetPoints = useMemo(
    () => [
      [-4.2, 0.8, -0.5],
      [-2, 0.55, -0.2],
      [0.5, 0.45, -0.5],
      [2.8, 0.35, -0.8],
      [4, 0.3, -1],
    ],
    []
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.015, 0.5]}>
        <planeGeometry args={[2.2, 7]} />
        <meshStandardMaterial color={PALETTE.path} roughness={0.9} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 4.5]}>
        <planeGeometry args={[3.5, 5]} />
        <meshStandardMaterial color={PALETTE.driveway} roughness={0.85} />
      </mesh>

      <group position={[-0.5, 0, 5.8]}>
        <OutlinedBox
          args={[2.2, 1.5, 4.2]}
          position={[0, 0.75, 0]}
          color={PALETTE.vanBody}
          roughness={0.6}
          castShadow
        />
        <OutlinedBox args={[2.3, 0.4, 4.4]} position={[0, 0.2, 0]} color={PALETTE.vanTrim} />
        <mesh position={[0.55, 1.05, 1.8]}>
          <boxGeometry args={[1.1, 0.7, 0.08]} />
          <meshStandardMaterial color="#93c5fd" emissive="#1e3a5f" emissiveIntensity={0.18} />
        </mesh>
        <VanMarkerLight position={[0, 1.55, 2.1]} />
      </group>

      <group position={[1.1, 0, 5.2]}>
        <OutlinedBox
          args={[0.55, 0.36, 0.35]}
          position={[0, 0.18, 0]}
          color="#78350f"
          castShadow
        />
        <mesh position={[0, 0.42, 0]}>
          <boxGeometry args={[0.5, 0.08, 0.3]} />
          <meshStandardMaterial color="#92400e" />
        </mesh>
        <mesh position={[0.15, 0.12, 0.2]} rotation={[0.3, 0.4, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.45, 6]} />
          <meshStandardMaterial color="#64748b" metalness={0.4} />
        </mesh>
      </group>

      {FENCE_SEGMENTS.map((seg) => (
        <OutlinedBox
          key={seg.pos.join('-')}
          args={seg.size}
          position={seg.pos}
          color={PALETTE.fence}
          roughness={0.95}
          castShadow
        />
      ))}

      {SHRUB_POSITIONS.map((pos) => (
        <ShrubSway key={pos.join('-')} position={pos} />
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
            <cylinderGeometry args={[0.04, 0.04, len, 6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#b45309' : '#cbd5e1'}
              metalness={0.3}
              roughness={0.5}
            />
          </mesh>
        );
      })}

      <OutlinedBox
        args={[0.35, 0.55, 0.2]}
        position={[3.2, 0.55, -0.2]}
        color="#f5f5f4"
        castShadow
      />
      <mesh position={[3.2, 0.55, -0.08]}>
        <boxGeometry args={[0.25, 0.4, 0.06]} />
        <meshStandardMaterial color="#44403c" />
      </mesh>

      <OutlinedBox args={[0.9, 1.5, 0.1]} position={[-4.8, 0.75, -1.8]} color="#57534e" roughness={0.8} />
    </group>
  );
}
