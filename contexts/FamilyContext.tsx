import React, { createContext, useState, ReactNode, useContext } from 'react';
import { FamilyMember, MedicalNote } from '../types';
import { SampleFamilyMembers, SampleMedicalNotes } from '../constants';

interface FamilyContextType {
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
  medicalNotes: MedicalNote[];
  setMedicalNotes: React.Dispatch<React.SetStateAction<MedicalNote[]>>;
  getMemberName: (memberId?: string) => string;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const FamilyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(SampleFamilyMembers);
  const [medicalNotes, setMedicalNotes] = useState<MedicalNote[]>(SampleMedicalNotes);
  
  const getMemberName = (memberId?: string): string => {
    if (!memberId) return 'General';
    const member = familyMembers.find(fm => fm.id === memberId);
    return member ? member.name : 'Unknown Member';
  };

  return (
    <FamilyContext.Provider value={{ familyMembers, setFamilyMembers, medicalNotes, setMedicalNotes, getMemberName }}>
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = (): FamilyContextType => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily must be used within a FamilyProvider');
  }
  return context;
};