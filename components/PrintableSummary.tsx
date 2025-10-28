import React from 'react';
import { FamilyMember, EmergencyContact, MedicalNote, Condition, Prescription } from '../types';

interface PrintableSummaryProps {
  member: FamilyMember;
  contacts: EmergencyContact[];
  notes: MedicalNote[];
  conditions: Condition[];
  prescriptions: Prescription[];
}

const SummarySection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6 print-avoid-break">
    <h2 className="text-xl font-bold text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">{title}</h2>
    {children}
  </div>
);

export const PrintableSummary: React.FC<PrintableSummaryProps> = ({ member, contacts, notes, conditions, prescriptions }) => {
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const criticalNotes = notes.filter(n => n.isCritical);
  const activeConditions = conditions.filter(c => c.status === 'Active');
  const currentPrescriptions = prescriptions.filter(p => !p.endDate || new Date(p.endDate) >= new Date());

  return (
    <div className="bg-white text-black p-4 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Confidential Health Summary</h1>
        <p className="text-lg text-gray-600">Prepared on: {new Date().toLocaleDateString()}</p>
      </header>

      <main>
        <SummarySection title="Patient Information">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <div><strong>Name:</strong> {member.name}</div>
            <div><strong>Date of Birth:</strong> {new Date(member.dateOfBirth).toLocaleDateString()} ({calculateAge(member.dateOfBirth)} years)</div>
            <div><strong>Blood Type:</strong> {member.bloodType || 'N/A'}</div>
            <div><strong>Relationship:</strong> {member.relationship}</div>
          </div>
        </SummarySection>

        <SummarySection title="Emergency Contacts">
          <div className="grid grid-cols-2 gap-4">
            {contacts.map(contact => (
              <div key={contact.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="font-semibold">{contact.name} <span className="font-normal text-gray-600">({contact.relationship})</span></p>
                <p className="text-gray-800">{contact.phone}</p>
              </div>
            ))}
          </div>
        </SummarySection>

        {(member.allergies && member.allergies.length > 0) || criticalNotes.length > 0 ? (
          <SummarySection title="Critical Information">
            {member.allergies && member.allergies.length > 0 && (
              <div className="mb-4">
                <h3 className="font-bold text-red-600 text-lg">KNOWN ALLERGIES:</h3>
                <p className="font-medium text-red-700 text-lg pl-4">{member.allergies.join(', ')}</p>
              </div>
            )}
            {criticalNotes.map(note => (
              <div key={note.id} className="p-3 bg-red-50 border-l-4 border-red-500 mb-2">
                <h4 className="font-bold text-red-800">{note.title}</h4>
                <p className="text-gray-700">{note.content}</p>
              </div>
            ))}
          </SummarySection>
        ) : null}

        {activeConditions.length > 0 && (
          <SummarySection title="Active Medical Conditions">
            <ul className="list-disc list-inside space-y-1">
              {activeConditions.map(condition => (
                <li key={condition.id}>
                  <strong>{condition.name}</strong> (Diagnosed: {new Date(condition.dateOfDiagnosis).toLocaleDateString()})
                  {condition.notes && <p className="text-sm text-gray-600 pl-4 italic"> - {condition.notes}</p>}
                </li>
              ))}
            </ul>
          </SummarySection>
        )}
        
        {currentPrescriptions.length > 0 && (
             <SummarySection title="Current Prescriptions">
                <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentPrescriptions.map(p => (
                            <tr key={p.id}>
                                <td className="px-4 py-2 whitespace-nowrap">{p.medicationName}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{p.dosage}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{p.frequency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </SummarySection>
        )}
      </main>
    </div>
  );
};