import React, { createContext, useState, ReactNode, useContext } from 'react';
import { DocumentItem, Prescription, Appointment, VitalSign, VaccinationRecord, Condition } from '../types';
import { SampleDocuments, SamplePrescriptions, SampleAppointments, SampleVitals, SampleVaccinations, SampleConditions } from '../constants';

interface HealthRecordsContextType {
  documents: DocumentItem[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentItem[]>>;
  prescriptions: Prescription[];
  setPrescriptions: React.Dispatch<React.SetStateAction<Prescription[]>>;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  vitals: VitalSign[];
  setVitals: React.Dispatch<React.SetStateAction<VitalSign[]>>;
  vaccinations: VaccinationRecord[];
  setVaccinations: React.Dispatch<React.SetStateAction<VaccinationRecord[]>>;
  conditions: Condition[];
  setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
}

const HealthRecordsContext = createContext<HealthRecordsContextType | undefined>(undefined);

export const HealthRecordsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>(SampleDocuments);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(SamplePrescriptions);
  const [appointments, setAppointments] = useState<Appointment[]>(SampleAppointments);
  const [vitals, setVitals] = useState<VitalSign[]>(SampleVitals);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(SampleVaccinations);
  const [conditions, setConditions] = useState<Condition[]>(SampleConditions);

  return (
    <HealthRecordsContext.Provider value={{ 
      documents, setDocuments, 
      prescriptions, setPrescriptions, 
      appointments, setAppointments, 
      vitals, setVitals, 
      vaccinations, setVaccinations,
      conditions, setConditions
    }}>
      {children}
    </HealthRecordsContext.Provider>
  );
};

export const useHealthRecords = (): HealthRecordsContextType => {
  const context = useContext(HealthRecordsContext);
  if (!context) {
    throw new Error('useHealthRecords must be used within a HealthRecordsProvider');
  }
  return context;
};