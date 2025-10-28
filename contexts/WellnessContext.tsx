import React, { createContext, useState, ReactNode, useContext } from 'react';
import { WellnessEntry } from '../types';

interface WellnessContextType {
  wellnessLog: WellnessEntry[];
  setWellnessLog: React.Dispatch<React.SetStateAction<WellnessEntry[]>>;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wellnessLog, setWellnessLog] = useState<WellnessEntry[]>([]);

  return (
    <WellnessContext.Provider value={{ wellnessLog, setWellnessLog }}>
      {children}
    </WellnessContext.Provider>
  );
};

export const useWellness = (): WellnessContextType => {
  const context = useContext(WellnessContext);
  if (!context) {
    throw new Error('useWellness must be used within a WellnessProvider');
  }
  return context;
};
