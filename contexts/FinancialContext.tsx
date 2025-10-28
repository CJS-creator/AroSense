import React, { createContext, useState, ReactNode, useContext } from 'react';
import { InsurancePolicy, Bill } from '../types';
import { SampleInsurancePolicies, SampleBills } from '../constants';

interface FinancialContextType {
  insurancePolicies: InsurancePolicy[];
  setInsurancePolicies: React.Dispatch<React.SetStateAction<InsurancePolicy[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(SampleInsurancePolicies);
  const [bills, setBills] = useState<Bill[]>(SampleBills);

  return (
    <FinancialContext.Provider value={{ insurancePolicies, setInsurancePolicies, bills, setBills }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = (): FinancialContextType => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
