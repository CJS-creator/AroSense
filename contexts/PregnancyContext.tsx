import React, { createContext, useState, ReactNode, useContext } from 'react';
import { PregnancyData, PregnancyLogEntry, KickCounterSession } from '../types';

interface PregnancyContextType {
  pregnancyData: PregnancyData;
  setPregnancyData: React.Dispatch<React.SetStateAction<PregnancyData>>;
  pregnancyLog: PregnancyLogEntry[];
  setPregnancyLog: React.Dispatch<React.SetStateAction<PregnancyLogEntry[]>>;
  kickSessions: KickCounterSession[];
  setKickSessions: React.Dispatch<React.SetStateAction<KickCounterSession[]>>;
}

const PregnancyContext = createContext<PregnancyContextType | undefined>(undefined);

export const PregnancyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pregnancyData, setPregnancyData] = useState<PregnancyData>({ dueDate: '2025-02-15' });
  const [pregnancyLog, setPregnancyLog] = useState<PregnancyLogEntry[]>([]);
  const [kickSessions, setKickSessions] = useState<KickCounterSession[]>([]);

  return (
    <PregnancyContext.Provider value={{ pregnancyData, setPregnancyData, pregnancyLog, setPregnancyLog, kickSessions, setKickSessions }}>
      {children}
    </PregnancyContext.Provider>
  );
};

export const usePregnancy = (): PregnancyContextType => {
  const context = useContext(PregnancyContext);
  if (!context) {
    throw new Error('usePregnancy must be used within a PregnancyProvider');
  }
  return context;
};
