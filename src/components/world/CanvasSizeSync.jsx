import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Firefox sometimes mounts the R3F canvas before the flex layout has a real size,
 * leaving a blank clear-color view until a manual resize. Force a remeasure on mount.
 */
export default function CanvasSizeSync() {
  const { gl, setSize } = useThree();

  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent || typeof ResizeObserver === 'undefined') return undefined;

    const sync = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      if (width > 0 && height > 0) {
        setSize(width, height);
      }
    };

    sync();
    const frame = requestAnimationFrame(sync);
    const observer = new ResizeObserver(sync);
    observer.observe(parent);
    window.addEventListener('resize', sync);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [gl, setSize]);

  return null;
}
