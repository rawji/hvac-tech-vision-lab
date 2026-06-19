import WindowGlow from './WindowGlow.jsx';
import OutlinedBox from './OutlinedBox.jsx';
import OutlinedCone from './OutlinedCone.jsx';
import { PALETTE } from '../../data/worldPalette.js';

export default function HouseScene() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color={PALETTE.ground} roughness={1} />
      </mesh>

      <OutlinedBox
        args={[5.2, 2.7, 4.5]}
        position={[-3.8, 1.35, -1.5]}
        color={PALETTE.houseBody}
        castShadow
        receiveShadow
      />
      <OutlinedBox
        args={[2.2, 2, 2.2]}
        position={[-1.2, 1, -2.8]}
        color={PALETTE.houseGarage}
        castShadow
        receiveShadow
      />
      <OutlinedCone
        args={[4.2, 1.6, 4]}
        position={[-3.8, 3.35, -1.5]}
        rotation={[0, Math.PI / 4, 0]}
        color={PALETTE.roof}
        castShadow
      />
      <OutlinedBox
        args={[3.2, 0.12, 1.2]}
        position={[-3.8, 1.85, 0.85]}
        color={PALETTE.porch}
        castShadow
      />
      <OutlinedBox
        args={[1, 1.9, 0.12]}
        position={[-3.8, 0.95, 0.35]}
        color={PALETTE.door}
        roughness={0.8}
      />

      <WindowGlow position={[-2.1, 1.55, 0.32]} size={[1.3, 0.9, 0.08]} />
      <WindowGlow position={[-5.2, 1.55, 0.32]} size={[1.1, 0.9, 0.08]} />

      <OutlinedBox
        args={[0.6, 0.5, 0.06]}
        position={[-2.4, 1.15, 0.28]}
        color="#e7e5e4"
        outlineScale={1.08}
      />
    </group>
  );
}
