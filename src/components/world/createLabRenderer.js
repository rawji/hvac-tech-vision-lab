import * as THREE from 'three';

/**
 * R3F defaults to powerPreference: 'high-performance', which often fails in Firefox.
 * Try progressively simpler contexts until one works.
 */
export function createLabRenderer(canvas) {
  const attempts = [
    {
      powerPreference: 'default',
      antialias: true,
      alpha: true,
      failIfMajorPerformanceCaveat: false,
    },
    {
      powerPreference: 'low-power',
      antialias: false,
      alpha: true,
      failIfMajorPerformanceCaveat: false,
    },
    {
      antialias: false,
      alpha: true,
      failIfMajorPerformanceCaveat: false,
    },
  ];

  let lastError;
  for (const parameters of attempts) {
    try {
      return new THREE.WebGLRenderer({ canvas, ...parameters });
    } catch (error) {
      lastError = error;
    }
  }

  const attrs = { antialias: false, alpha: true, failIfMajorPerformanceCaveat: false };
  const context =
    canvas.getContext('webgl2', attrs) ||
    canvas.getContext('webgl', attrs) ||
    canvas.getContext('experimental-webgl', attrs);

  if (context) {
    return new THREE.WebGLRenderer({ canvas, context, antialias: false, alpha: true });
  }

  throw lastError || new Error('Error creating WebGL context.');
}
