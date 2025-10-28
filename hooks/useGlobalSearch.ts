import { useMemo } from 'react';
import { useFamily } from '../contexts/FamilyContext';
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFinancial } from '../contexts/FinancialContext';

export type SearchResult = {
    id: string;
    type: 'Family Member' | 'Document' | 'Prescription' | 'Condition';
    title: string;
    description: string;
    link: string;
};

export const useGlobalSearch = (term: string) => {
    const { familyMembers } = useFamily();
    const { documents, prescriptions, conditions } = useHealthRecords();

    const results = useMemo<SearchResult[]>(() => {
        if (!term || term.length < 2) {
            return [];
        }

        const lowerCaseTerm = term.toLowerCase();
        const allResults: SearchResult[] = [];

        // Search Family Members
        familyMembers.forEach(member => {
            if (member.name.toLowerCase().includes(lowerCaseTerm)) {
                allResults.push({
                    id: member.id,
                    type: 'Family Member',
                    title: member.name,
                    description: `Relationship: ${member.relationship}`,
                    link: `/family/${member.id}`
                });
            }
        });

        // Search Documents
        documents.forEach(doc => {
            if (doc.title.toLowerCase().includes(lowerCaseTerm)) {
                allResults.push({
                    id: doc.id,
                    type: 'Document',
                    title: doc.title,
                    description: `Category: ${doc.category}`,
                    link: '/documents'
                });
            }
        });

        // Search Prescriptions
        prescriptions.forEach(rx => {
            if (rx.medicationName.toLowerCase().includes(lowerCaseTerm)) {
                allResults.push({
                    id: rx.id,
                    type: 'Prescription',
                    title: rx.medicationName,
                    description: `For: ${familyMembers.find(m => m.id === rx.familyMemberId)?.name || 'Unknown'}`,
                    link: '/prescriptions'
                });
            }
        });
        
        // Search Conditions
        conditions.forEach(cond => {
            if (cond.name.toLowerCase().includes(lowerCaseTerm)) {
                allResults.push({
                    id: cond.id,
                    type: 'Condition',
                    title: cond.name,
                    description: `Member: ${familyMembers.find(m => m.id === cond.familyMemberId)?.name || 'Unknown'}`,
                    link: `/family/${cond.familyMemberId}`
                });
            }
        });


        return allResults;

    }, [term, familyMembers, documents, prescriptions, conditions]);

    return results;
};