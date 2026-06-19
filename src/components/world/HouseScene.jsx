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
        <meshStandardMaterial color={PALETTE.ground} roughness={1} />
      </mesh>

      <LawnPatch position={[hx + 2, 0.008, hz - 4]} size={[8, 6]} />
      <LawnPatch position={[14, 0.008, -2]} size={[7, 10]} color={PALETTE.ground} />
      <LawnPatch position={[-14, 0.008, 2]} size={[6, 12]} color={PALETTE.groundDark} />

      <group position={SCENE.house}>
        <OutlinedBox
          args={[8.4, 3.1, 5.6]}
          position={[0, 1.55, 0]}
          color={PALETTE.houseBody}
          realistic
          castShadow
          receiveShadow
        />
        <OutlinedBox
          args={[8.6, 0.22, 5.8]}
          position={[0, 0.11, 0]}
          color={PALETTE.houseTrim}
          realistic
          receiveShadow
        />
        <OutlinedBox
          args={[3.6, 2.6, 3.8]}
          position={[5.2, 1.3, -0.4]}
          color={PALETTE.houseGarage}
          realistic
          castShadow
          receiveShadow
        />
        <OutlinedBox
          args={[3.2, 2.2, 0.14]}
          position={[5.2, 1.15, 1.48]}
          color="#b8b0a4"
          realistic
        />
        <OutlinedCone
          args={[6.2, 2.2, 4]}
          position={[0, 4.2, 0]}
          rotation={[0, Math.PI / 4, 0]}
          color={PALETTE.roof}
          realistic
          castShadow
        />
        <OutlinedCone
          args={[3.4, 1.2, 4]}
          position={[5.2, 3.35, -0.4]}
          rotation={[0, 0, 0]}
          color={PALETTE.roof}
          realistic
          castShadow
        />
        <OutlinedBox
          args={[4.2, 0.1, 1.6]}
          position={[-0.4, 0.55, 2.95]}
          color={PALETTE.path}
          realistic
          receiveShadow
        />
        <OutlinedBox
          args={[3.8, 0.14, 1.4]}
          position={[-0.4, 0.62, 2.95]}
          color={PALETTE.porch}
          realistic
          castShadow
        />
        <OutlinedBox
          args={[1.05, 2.05, 0.12]}
          position={[-0.4, 1.05, 3.25]}
          color={PALETTE.door}
          realistic
        />
        <OutlinedBox
          args={[0.12, 2.1, 1.1]}
          position={[-2.35, 1.05, 3.25]}
          color={PALETTE.houseTrim}
          realistic
        />

        <WindowGlow position={[-1.8, 1.85, 2.85]} size={[1.45, 1.05, 0.06]} />
        <WindowGlow position={[1.6, 1.85, 2.85]} size={[1.45, 1.05, 0.06]} />
        <WindowGlow position={[-1.8, 1.85, -2.05]} size={[1.35, 1.05, 0.06]} />
        <WindowGlow position={[5.2, 1.55, 1.52]} size={[2.4, 0.55, 0.06]} />

        <OutlinedBox
          args={[0.55, 0.45, 0.06]}
          position={[-3.2, 1.15, 2.78]}
          color={PALETTE.houseTrim}
          realistic
        />
      </group>
    </group>
  );
}
