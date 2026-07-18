import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Remeasure after layout settles. Avoids blank views when the flex parent
 * reports 0×0 on the first frame (seen more often in Firefox).
 */
export default function CanvasSizeSync() {
  const gl = useThree((s) => s.gl);
  const setSize = useThree((s) => s.setSize);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const parent = gl?.domElement?.parentElement;
    if (!parent || typeof setSize !== 'function') return undefined;

    const sync = () => {
      const width = parent.clientWidth;
      const height = parent.clientHeight;
      if (width < 2 || height < 2) return;
      try {
        setSize(width, height);
        invalidate();
      } catch {
        // Ignore resize races during unmount.
      }
    };

    sync();
    const frame = requestAnimationFrame(sync);
    const timer = setTimeout(sync, 100);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(sync) : null;
    observer?.observe(parent);
    window.addEventListener('resize', sync);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer?.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, [gl, setSize, invalidate]);

  return null;
}
