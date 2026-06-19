import { useEffect, useRef, useState } from 'react';
import { createContext, useContext } from 'react';

const TechVisionContext = createContext({
  enabled: false,
  bootProgress: 0,
  isBooting: false,
});

const BOOT_MS = 420;

export function TechVisionProvider({ enabled, children }) {
  const [bootProgress, setBootProgress] = useState(enabled ? 1 : 0);
  const [isBooting, setIsBooting] = useState(false);
  const prevEnabled = useRef(enabled);

  useEffect(() => {
    if (enabled === prevEnabled.current) return undefined;

    if (enabled) {
      setIsBooting(true);
      setBootProgress(0);
      const start = performance.now();
      let frameId;

      const tick = (now) => {
        const progress = Math.min((now - start) / BOOT_MS, 1);
        setBootProgress(progress);
        if (progress < 1) {
          frameId = requestAnimationFrame(tick);
        } else {
          setIsBooting(false);
        }
      };

      frameId = requestAnimationFrame(tick);
      prevEnabled.current = enabled;
      return () => cancelAnimationFrame(frameId);
    }

    setIsBooting(true);
    setBootProgress(0);
    const timer = setTimeout(() => {
      setIsBooting(false);
      setBootProgress(0);
    }, 180);
    prevEnabled.current = enabled;
    return () => clearTimeout(timer);
  }, [enabled]);

  return (
    <TechVisionContext.Provider value={{ enabled, bootProgress, isBooting }}>
      {children}
    </TechVisionContext.Provider>
  );
}

export function useTechVision() {
  return useContext(TechVisionContext);
}
