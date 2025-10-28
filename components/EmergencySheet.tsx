import React from 'react';
import { EmergencyContact, MedicalNote, FamilyMember } from '../types';
import { IconEmergency } from '../constants';

interface EmergencySheetProps {
    contacts: EmergencyContact[];
    membersWithInfo: FamilyMember[];
    notes: MedicalNote[];
}

export const EmergencySheet: React.FC<EmergencySheetProps> = ({ contacts, membersWithInfo, notes }) => {
    
    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const Section: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
        <div className="mb-6">
            <h2 className="text-xl font-bold text-textPrimary border-b-2 border-primary-DEFAULT pb-1 mb-3">{title}</h2>
            {children}
        </div>
    );

    return (
        <div className="bg-surface p-4 print:p-0 print:shadow-none" id="emergency-sheet">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-danger flex items-center justify-center gap-2">
                    <IconEmergency className="w-8 h-8"/> Emergency Medical Information
                </h1>
                <p className="text-textSecondary">Generated on: {new Date().toLocaleString()}</p>
            </div>

            <Section title="Emergency Contacts">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contacts.map(contact => (
                        <div key={contact.id} className="p-3 bg-surface-soft rounded-md">
                            <p className="font-semibold text-lg text-textPrimary">{contact.name}</p>
                            <p className="text-sm text-textSecondary">{contact.relationship}</p>
                            <p className="text-xl font-mono text-primary-dark dark:text-primary-light">{contact.phone}</p>
                        </div>
                    ))}
                </div>
            </Section>

            <Section title="Family Members with Critical Information">
                {membersWithInfo.map(member => {
                    const memberNotes = notes.filter(n => n.familyMemberId === member.id && n.isCritical);
                    return (
                        <div key={member.id} className="p-4 border border-border rounded-lg mb-4">
                            <h3 className="text-2xl font-semibold text-textPrimary">{member.name}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-textSecondary mb-2">
                                <span><strong>DOB:</strong> {new Date(member.dateOfBirth).toLocaleDateString()} ({calculateAge(member.dateOfBirth)} years)</span>
                                {member.bloodType && <span><strong>Blood Type:</strong> {member.bloodType}</span>}
                            </div>

                             {member.allergies && member.allergies.length > 0 && (
                                <div className="mb-2">
                                    <h4 className="font-semibold text-textPrimary">Known Allergies:</h4>
                                    <p className="text-danger font-medium">{member.allergies.join(', ')}</p>
                                </div>
                            )}

                            {memberNotes.length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-textPrimary">Critical Notes:</h4>
                                    <ul className="list-disc list-inside space-y-1 pl-2">
                                        {memberNotes.map(note => (
                                            <li key={note.id} className="text-textSecondary">
                                                <span className="font-bold text-danger">{note.title}:</span> {note.content}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    );
                })}
            </Section>
        </div>
    );
};
