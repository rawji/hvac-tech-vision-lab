import { useMemo } from 'react';

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
      {/* Guided path toward condenser */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.5, 0.015, 0.5]}>
        <planeGeometry args={[2.2, 7]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>

      {/* Driveway extension */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 4.5]}>
        <planeGeometry args={[3.5, 5]} />
        <meshStandardMaterial color="#78716c" roughness={0.85} />
      </mesh>

      {/* Service van silhouette */}
      <group position={[-0.5, 0, 5.8]}>
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[2.2, 1.5, 4.2]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[2.3, 0.4, 4.4]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <mesh position={[0.55, 1.05, 1.8]}>
          <boxGeometry args={[1.1, 0.7, 0.08]} />
          <meshStandardMaterial color="#93c5fd" emissive="#1e3a5f" emissiveIntensity={0.15} />
        </mesh>
      </group>

      {/* Fence */}
      {FENCE_SEGMENTS.map((seg) => (
        <mesh key={`${seg.pos.join('-')}`} position={seg.pos} castShadow>
          <boxGeometry args={seg.size} />
          <meshStandardMaterial color="#a8a29e" roughness={0.95} />
        </mesh>
      ))}

      {/* Shrubs */}
      {SHRUB_POSITIONS.map((pos) => (
        <mesh key={pos.join('-')} position={[pos[0], 0.35, pos[2]]} castShadow>
          <coneGeometry args={[0.45, 0.7, 6]} />
          <meshStandardMaterial color="#2d5a27" roughness={1} />
        </mesh>
      ))}

      {/* Line set — suction/liquid lines */}
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
            <meshStandardMaterial color={i % 2 === 0 ? '#b45309' : '#cbd5e1'} metalness={0.3} roughness={0.5} />
          </mesh>
        );
      })}

      {/* Outdoor disconnect */}
      <mesh position={[3.2, 0.55, -0.2]} castShadow>
        <boxGeometry args={[0.35, 0.55, 0.2]} />
        <meshStandardMaterial color="#f5f5f4" roughness={0.7} />
      </mesh>
      <mesh position={[3.2, 0.55, -0.08]}>
        <boxGeometry args={[0.25, 0.4, 0.06]} />
        <meshStandardMaterial color="#44403c" />
      </mesh>

      {/* Utility closet exterior door */}
      <mesh position={[-4.8, 0.75, -1.8]}>
        <boxGeometry args={[0.9, 1.5, 0.1]} />
        <meshStandardMaterial color="#57534e" roughness={0.8} />
      </mesh>
    </group>
  );
}
