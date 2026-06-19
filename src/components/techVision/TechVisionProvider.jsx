import { createContext, useContext } from 'react';

const TechVisionContext = createContext({ enabled: false });

export function TechVisionProvider({ enabled, children }) {
  return (
    <TechVisionContext.Provider value={{ enabled }}>
      {children}
    </TechVisionContext.Provider>
  );
}

export function useTechVision() {
  return useContext(TechVisionContext);
}
