import WindowGlow from './WindowGlow.jsx';
import OutlinedBox from './OutlinedBox.jsx';
import OutlinedCone from './OutlinedCone.jsx';
import { LawnPatch } from './SuburbanTree.jsx';
import { PALETTE } from '../../data/worldPalette.js';
import { LOT_SIZE, SCENE } from '../../data/worldLayout.js';

export default function HouseScene() {
  const [hx, , hz] = SCENE.house;

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[LOT_SIZE.width, LOT_SIZE.depth]} />
        <meshStandardMaterial color={PALETTE.ground} roughness={0.98} />
      </mesh>

      <LawnPatch position={[hx + 1.5, 0.008, hz - 3]} size={[7.5, 5.5]} color={PALETTE.groundLight} />
      <LawnPatch position={[14, 0.008, -2]} size={[7, 10]} color={PALETTE.ground} />
      <LawnPatch position={[-14, 0.008, 2]} size={[6, 12]} color={PALETTE.groundDark} />

      <group position={SCENE.house}>
        <OutlinedBox
          args={[8.2, 0.18, 5.4]}
          position={[0, 0.09, 0]}
          color={PALETTE.houseShadow}
          stylized
          receiveShadow
        />
        <OutlinedBox
          args={[8, 3, 5.2]}
          position={[0, 1.5, 0]}
          color={PALETTE.houseBody}
          stylized
          castShadow
          receiveShadow
        />
        <OutlinedBox args={[8.15, 0.08, 5.35]} position={[0, 0.55, 0]} color={PALETTE.houseTrim} stylized />
        <OutlinedBox args={[8.15, 0.08, 5.35]} position={[0, 1.85, 0]} color={PALETTE.houseTrim} stylized />
        <OutlinedBox
          args={[3.4, 2.5, 3.6]}
          position={[5, 1.25, -0.3]}
          color={PALETTE.houseGarage}
          stylized
          castShadow
          receiveShadow
        />
        <OutlinedBox args={[3.1, 2.05, 0.12]} position={[5, 1.1, 1.42]} color={PALETTE.houseShadow} stylized />
        <OutlinedBox args={[2.8, 0.06, 2.6]} position={[5, 2.05, 1.38]} color={PALETTE.roofHighlight} stylized />

        <OutlinedCone
          args={[5.8, 2.05, 4]}
          position={[0, 4.05, 0]}
          rotation={[0, Math.PI / 4, 0]}
          color={PALETTE.roof}
          stylized
          castShadow
        />
        <OutlinedBox args={[5.6, 0.1, 5]} position={[0, 3.15, 0]} color={PALETTE.roofHighlight} stylized />
        <OutlinedCone
          args={[3.2, 1.05, 4]}
          position={[5, 3.2, -0.3]}
          color={PALETTE.roof}
          stylized
          castShadow
        />

        <OutlinedBox args={[3.6, 0.08, 1.5]} position={[-0.3, 0.52, 2.85]} color={PALETTE.path} stylized receiveShadow />
        <OutlinedBox args={[3.2, 0.12, 1.3]} position={[-0.3, 0.58, 2.85]} color={PALETTE.porch} stylized castShadow />
        <OutlinedBox args={[0.1, 1.2, 0.1]} position={[-1.35, 0.72, 2.55]} color={PALETTE.houseTrim} stylized />
        <OutlinedBox args={[0.1, 1.2, 0.1]} position={[0.75, 0.72, 2.55]} color={PALETTE.houseTrim} stylized />
        <OutlinedBox args={[1, 2, 0.1]} position={[-0.3, 1.02, 3.05]} color={PALETTE.door} stylized />

        <WindowGlow position={[-1.7, 1.8, 2.75]} size={[1.35, 1, 0.05]} />
        <WindowGlow position={[1.5, 1.8, 2.75]} size={[1.35, 1, 0.05]} />
        <WindowGlow position={[-1.7, 1.8, -1.95]} size={[1.25, 1, 0.05]} />
        <WindowGlow position={[5, 1.5, 1.46]} size={[2.2, 0.5, 0.05]} />

        <OutlinedBox args={[0.5, 0.4, 0.05]} position={[-3, 1.1, 2.68]} color={PALETTE.houseTrim} stylized />
      </group>
    </group>
  );
}
