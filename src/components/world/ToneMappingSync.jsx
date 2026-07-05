import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { TONE_MAPPING } from '../../data/worldPalette.js';

export default function ToneMappingSync({ techVisionEnabled }) {
  const { gl } = useThree();

  useEffect(() => {
    gl.toneMappingExposure = techVisionEnabled
      ? TONE_MAPPING.techVisionExposure
      : TONE_MAPPING.normalExposure;
  }, [techVisionEnabled, gl]);

  return null;
}
