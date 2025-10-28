import React, { createContext, useState, ReactNode, useContext } from 'react';
import { InsurancePolicy, Bill, InsuranceClaim } from '../types';
import { SampleInsurancePolicies, SampleBills, SampleClaims } from '../constants';

interface FinancialContextType {
  insurancePolicies: InsurancePolicy[];
  setInsurancePolicies: React.Dispatch<React.SetStateAction<InsurancePolicy[]>>;
  bills: Bill[];
  setBills: React.Dispatch<React.SetStateAction<Bill[]>>;
  claims: InsuranceClaim[];
  setClaims: React.Dispatch<React.SetStateAction<InsuranceClaim[]>>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [insurancePolicies, setInsurancePolicies] = useState<InsurancePolicy[]>(SampleInsurancePolicies);
  const [bills, setBills] = useState<Bill[]>(SampleBills);
  const [claims, setClaims] = useState<InsuranceClaim[]>(SampleClaims);

  return (
    <FinancialContext.Provider value={{ insurancePolicies, setInsurancePolicies, bills, setBills, claims, setClaims }}>
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