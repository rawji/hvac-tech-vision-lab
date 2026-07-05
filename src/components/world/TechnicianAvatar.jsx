import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { shadeColor } from '../../data/worldPalette.js';

const SKIN = { light: '#ddb896', dark: '#5c3d28' };
const SHIRT = '#1a365d';
const SHIRT_ACCENT = '#234e82';
const PANTS = '#2d3748';
const BOOT = '#1a1714';
const BELT = '#3d3428';
const POUCH = '#4a4034';
const CLIPBOARD = '#cbd5e1';

function StylizedPart({
  geometry,
  args,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  color,
  roughness = 0.82,
  metalness = 0.04,
  castShadow = false,
  rim = true,
}) {
  const rimColor = shadeColor(color, 0.14);

  return (
    <group position={position} rotation={rotation}>
      {rim && (
        <mesh scale={1.018}>
          {geometry === 'box' ? <boxGeometry args={args} /> : <cylinderGeometry args={args} />}
          <meshStandardMaterial color={rimColor} roughness={1} />
        </mesh>
      )}
      <mesh castShadow={castShadow}>
        {geometry === 'box' ? <boxGeometry args={args} /> : <cylinderGeometry args={args} />}
        <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
      </mesh>
    </group>
  );
}

export default function TechnicianAvatar({
  technician = 'male',
  appearance = 'light',
  position = [0, 0, 0],
  facing = 0,
  isMoving = false,
}) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const isFemale = technician === 'female';
  const skinColor = SKIN[appearance] ?? SKIN.light;

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    groupRef.current.position.x += (position[0] - groupRef.current.position.x) * Math.min(delta * 11, 1);
    groupRef.current.position.z += (position[2] - groupRef.current.position.z) * Math.min(delta * 11, 1);
    groupRef.current.rotation.y += (facing - groupRef.current.rotation.y) * Math.min(delta * 13, 1);

    const t = state.clock.elapsedTime;
    const bob = isMoving ? Math.sin(t * 11) * 0.025 : Math.sin(t * 1.4) * 0.004;
    if (bodyRef.current) bodyRef.current.position.y = 0.88 + bob;

    const swing = isMoving ? Math.sin(t * 11) * 0.22 : 0;
    const armSwing = isMoving ? Math.sin(t * 11) * 0.12 : 0;
    if (leftLegRef.current) leftLegRef.current.rotation.x = swing;
    if (rightLegRef.current) rightLegRef.current.rotation.x = -swing;
    if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
    if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;
  });

  return (
    <group ref={groupRef} position={[position[0], 0, position[2]]} rotation={[0, facing, 0]}>
      <group ref={leftLegRef} position={[-0.1, 0.42, 0]}>
        <StylizedPart geometry="box" args={[0.13, 0.44, 0.14]} color={PANTS} roughness={0.9} />
        <StylizedPart geometry="box" args={[0.14, 0.1, 0.24]} position={[0, -0.28, 0.04]} color={BOOT} roughness={0.78} metalness={0.08} />
      </group>
      <group ref={rightLegRef} position={[0.1, 0.42, 0]}>
        <StylizedPart geometry="box" args={[0.13, 0.44, 0.14]} color={PANTS} roughness={0.9} />
        <StylizedPart geometry="box" args={[0.14, 0.1, 0.24]} position={[0, -0.28, 0.04]} color={BOOT} roughness={0.78} metalness={0.08} />
      </group>

      <group ref={bodyRef} position={[0, 0.88, 0]}>
        <StylizedPart geometry="box" args={[0.34, 0.52, 0.2]} color={SHIRT} castShadow />
        <StylizedPart geometry="box" args={[0.36, 0.08, 0.21]} position={[0, 0.22, 0]} color={SHIRT_ACCENT} roughness={0.88} />
        <StylizedPart geometry="box" args={[0.38, 0.06, 0.22]} position={[0, -0.18, 0]} color={BELT} roughness={0.92} />
        <StylizedPart geometry="box" args={[0.08, 0.1, 0.08]} position={[-0.16, -0.18, 0.1]} color={POUCH} roughness={0.9} />
        <StylizedPart geometry="box" args={[0.08, 0.09, 0.07]} position={[0.16, -0.18, 0.1]} color={POUCH} roughness={0.9} />
        <StylizedPart geometry="box" args={[0.06, 0.08, 0.04]} position={[0.2, -0.1, 0.12]} color="#64748b" metalness={0.25} roughness={0.55} />

        <StylizedPart geometry="box" args={[0.18, 0.18, 0.18]} position={[0, 0.38, 0]} color={skinColor} roughness={0.92} castShadow />
        {isFemale ? (
          <StylizedPart geometry="box" args={[0.16, 0.12, 0.14]} position={[0, 0.52, -0.04]} color="#3d2914" roughness={0.95} />
        ) : (
          <StylizedPart geometry="box" args={[0.2, 0.06, 0.18]} position={[0, 0.5, 0]} color="#1c1917" roughness={0.88} />
        )}

        <group ref={leftArmRef} position={[-0.24, 0.08, 0]}>
          <StylizedPart geometry="box" args={[0.1, 0.34, 0.1]} color={SHIRT} roughness={0.86} />
          <StylizedPart geometry="box" args={[0.09, 0.09, 0.09]} position={[0, -0.2, 0]} color={skinColor} roughness={0.92} />
        </group>
        <group ref={rightArmRef} position={[0.24, 0.08, 0]}>
          <StylizedPart geometry="box" args={[0.1, 0.34, 0.1]} color={SHIRT} roughness={0.86} />
          <StylizedPart geometry="box" args={[0.09, 0.09, 0.09]} position={[0, -0.2, 0]} color={skinColor} roughness={0.92} />
          <StylizedPart geometry="box" args={[0.14, 0.18, 0.02]} position={[0, -0.14, 0.1]} rotation={[0.15, 0, 0]} color={CLIPBOARD} roughness={0.55} metalness={0.05} />
        </group>
      </group>
    </group>
  );
}
