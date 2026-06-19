import { useRef } from 'react';

import { useFrame } from '@react-three/fiber';

import { useTechVision } from './TechVisionProvider.jsx';



export default function ScannerReticle({ position = [0, 1.2, 0], active = false, lockOn = false }) {

  const outerRef = useRef();

  const innerRef = useRef();

  const bracketRef = useRef();

  const { enabled, bootProgress } = useTechVision();



  useFrame((state) => {

    if (!outerRef.current || !enabled || !active || bootProgress < 0.5) return;



    const t = state.clock.elapsedTime;

    const lockPulse = lockOn ? 0.85 + Math.sin(t * 6) * 0.15 : 0.65;

    const spin = t * (lockOn ? 1.8 : 0.9);



    outerRef.current.rotation.z = spin;

    innerRef.current.rotation.z = -spin * 1.4;



    const scale = (0.85 + bootProgress * 0.15) * (lockOn ? 1 + Math.sin(t * 8) * 0.04 : 1);

    outerRef.current.scale.setScalar(scale);

    innerRef.current.scale.setScalar(scale * 0.55);



    if (outerRef.current.material) {

      outerRef.current.material.opacity = 0.55 + lockPulse * 0.35;

    }

    if (innerRef.current.material) {

      innerRef.current.material.opacity = lockOn ? 0.95 : 0.75;

    }

    if (bracketRef.current) {

      bracketRef.current.rotation.y = Math.sin(t * 3) * 0.08;

    }

  });



  if (!enabled || !active || bootProgress < 0.5) return null;



  const scale = 0.85 + bootProgress * 0.15;



  return (

    <group position={position} scale={[scale, scale, scale]} ref={bracketRef}>

      <mesh ref={outerRef} rotation={[Math.PI / 2, 0, 0]}>

        <ringGeometry args={[0.48, 0.56, 32]} />

        <meshBasicMaterial color={lockOn ? '#22d3ee' : '#38bdf8'} transparent opacity={0.85} />

      </mesh>

      <mesh ref={innerRef} rotation={[Math.PI / 2, 0, 0]}>

        <ringGeometry args={[0.18, 0.22, 4]} />

        <meshBasicMaterial color={lockOn ? '#a5f3fc' : '#7dd3fc'} transparent opacity={0.9} />

      </mesh>

      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle) => (

        <mesh key={angle} rotation={[Math.PI / 2, angle, 0]} position={[Math.cos(angle) * 0.62, 0, Math.sin(angle) * 0.62]}>

          <boxGeometry args={[0.08, 0.02, 0.14]} />

          <meshBasicMaterial color={lockOn ? '#22d3ee' : '#38bdf8'} transparent opacity={0.9} />

        </mesh>

      ))}

    </group>

  );

}

