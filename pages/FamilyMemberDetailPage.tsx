import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, CardHeader, CardTitle } from '../components/bits';
import { Timeline } from '../components/Timeline';
import { TimelineEvent, VitalSign, VaccinationRecord, Condition } from '../types';
import { VitalsCard } from '../components/VitalsCard';
import { AddVitalModal } from '../components/AddVitalModal';
import { VaccinationCard } from '../components/VaccinationCard';
import { AddVaccinationModal } from '../components/AddVaccinationModal';
import { ConditionsCard } from '../components/ConditionsCard';
import { AddEditConditionModal } from '../components/AddEditConditionModal';
import { PrintableSummary } from '../components/PrintableSummary';
import { IconPrinter } from '../constants';
import { useFamily } from '../contexts/FamilyContext';
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFinancial } from '../contexts/FinancialContext';
import { useWellness } from '../contexts/WellnessContext';
import { useSettings } from '../contexts/SettingsContext';

export const FamilyMemberDetailPage: React.FC = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const { familyMembers, medicalNotes } = useFamily();
  const { documents, prescriptions, vitals, setVitals, vaccinations, setVaccinations, appointments, conditions, setConditions } = useHealthRecords();
  const { bills, insurancePolicies } = useFinancial();
  const { wellnessLog } = useWellness();
  const { emergencyContacts } = useSettings();
  const navigate = useNavigate();

  const [isVitalModalOpen, setIsVitalModalOpen] = useState(false);
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<Condition | null>(null);

  const member = familyMembers.find(m => m.id === memberId);
  
  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    if (!memberId) return [];

    const memberDocuments = documents.filter(d => d.familyMemberId === memberId).map((d): TimelineEvent => ({ id: d.id, type: 'document', title: d.title, date: d.uploadDate }));
    const memberPrescriptions = prescriptions.filter(p => p.familyMemberId === memberId).map((p): TimelineEvent => ({ id: p.id, type: 'prescription', title: p.medicationName, date: p.startDate }));
    const memberNotes = medicalNotes.filter(n => n.familyMemberId === memberId).map((n): TimelineEvent => ({ id: n.id, type: 'note', title: n.title, date: n.date, isCritical: n.isCritical }));
    
    const memberVitals = vitals.filter(v => v.familyMemberId === memberId).map((v): TimelineEvent => {
        const details = [ v.weightKg ? `${v.weightKg}kg` : null, v.bloodPressure ? `${v.bloodPressure} BP` : null, v.heartRate ? `${v.heartRate}bpm` : null ].filter(Boolean).join(', ');
        return { id: v.id, type: 'vital', title: `Vitals Logged: ${details || 'Entry created'}`, date: v.date };
    });

    const memberVaccinations = vaccinations.filter(v => v.familyMemberId === memberId).map((v): TimelineEvent => ({ id: v.id, type: 'vaccination', title: v.vaccineName, date: v.dateAdministered }));
    const memberAppointments = appointments.filter(a => a.familyMemberId === memberId).map((a): TimelineEvent => ({ id: a.id, type: 'appointment', title: `${a.type} with ${a.doctor}`, date: a.date }));
    const memberConditions = conditions.filter(c => c.familyMemberId === memberId).map((c): TimelineEvent => ({ id: c.id, type: 'condition', title: `Diagnosis: ${c.name} (${c.status})`, date: c.dateOfDiagnosis }));
    
    const memberWellness = wellnessLog.filter(w => w.familyMemberId === memberId).map((w): TimelineEvent => {
        const details = [ w.mood, w.sleepHours ? `${w.sleepHours}h sleep` : null, w.waterIntakeLiters ? `${w.waterIntakeLiters}L water` : null, w.activity || null, ].filter(Boolean).join(' • ');
        const title = `Wellness: ${details || 'Entry Logged'}`;
        return { id: w.id, type: 'wellness', title, date: w.date };
    });

    const memberBills = bills.filter(b => {
      const policy = insurancePolicies.find(p => p.memberId === memberId); // This logic might need refinement based on how bills are associated
      return !!policy;
    }).map((b): TimelineEvent => ({ id: b.id, type: 'bill', title: `Bill from ${b.serviceProvider}`, date: b.serviceDate }));

    return [...memberDocuments, ...memberPrescriptions, ...memberNotes, ...memberBills, ...memberVitals, ...memberVaccinations, ...memberAppointments, ...memberWellness, ...memberConditions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  }, [memberId, documents, prescriptions, medicalNotes, bills, insurancePolicies, vitals, vaccinations, appointments, wellnessLog, conditions]);

  if (!member) {
    return (
      <div className="text-center py-16 bg-surface rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-textPrimary">Family Member Not Found</h2>
        <p className="text-textSecondary mt-2">The member you are looking for does not exist.</p>
        <Button onClick={() => navigate('/family')} className="mt-6">Back to Family Page</Button>
      </div>
    );
  }

  const memberVitals = vitals.filter(v => v.familyMemberId === memberId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const memberVaccinations = vaccinations.filter(v => v.familyMemberId === memberId).sort((a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime());
  const memberConditions = conditions.filter(c => c.familyMemberId === memberId).sort((a, b) => new Date(b.dateOfDiagnosis).getTime() - new Date(a.dateOfDiagnosis).getTime());
  
  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleAddOrUpdateCondition = (conditionData: Omit<Condition, 'id' | 'familyMemberId'>) => {
    if (editingCondition) {
      setConditions(prev => prev.map(c => c.id === editingCondition.id ? { ...editingCondition, ...conditionData } : c));
    } else {
      const newCondition: Condition = { ...conditionData, id: `cond-${Date.now()}`, familyMemberId: member.id };
      setConditions(prev => [...prev, newCondition]);
    }
  };

  const handleEditCondition = (condition: Condition) => {
    setEditingCondition(condition);
    setIsConditionModalOpen(true);
  };
  
  const handleAddCondition = () => {
    setEditingCondition(null);
    setIsConditionModalOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <img src={member.profilePhotoUrl || `https://i.pravatar.cc/150?u=${member.id}`} alt={member.name} className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-primary-light flex-shrink-0"/>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-textPrimary">{member.name}</h1>
              <p className="text-textSecondary text-lg">{member.relationship} &bull; {calculateAge(member.dateOfBirth)} years old</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mt-3 text-sm">
                  {member.bloodType && <span className="bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 px-3 py-1 rounded-full font-medium">Blood Type: {member.bloodType}</span>}
                  {member.allergies && member.allergies.length > 0 && <span className="bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full font-medium">Allergies: {member.allergies.join(', ')}</span>}
              </div>
            </div>
            <Button variant="outline" onClick={() => window.print()} leftIcon={<IconPrinter className="w-5 h-5"/>} className="no-print self-start md:self-center">Print Summary</Button>
          </div>
          <div className="mt-4 pt-4 border-t border-border"><h4 className="font-semibold text-textPrimary">Medical History Summary</h4><p className="text-textSecondary text-sm mt-1">{member.medicalHistorySummary}</p></div>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
              <ConditionsCard conditions={memberConditions} onAddCondition={handleAddCondition} onEditCondition={handleEditCondition}/>
              <VitalsCard vitals={memberVitals} onAddVital={() => setIsVitalModalOpen(true)} />
              <VaccinationCard vaccinations={memberVaccinations} onAddVaccination={() => setIsVaccinationModalOpen(true)} />
          </div>
          <div className="lg:col-span-2">
              <Card className="h-full">
                  <CardHeader><CardTitle>Health Timeline</CardTitle></CardHeader>
                  <CardContent className="max-h-[620px] overflow-y-auto"><Timeline events={timelineEvents} /></CardContent>
              </Card>
          </div>
        </div>
          
        <div className="text-center pt-4"><Button variant="outline" onClick={() => navigate('/family')}>&larr; Back to All Family Members</Button></div>
      </div>

      <div className="hidden print:block">
        <PrintableSummary member={member} contacts={emergencyContacts} notes={medicalNotes.filter(n => n.familyMemberId === member.id)} conditions={memberConditions} prescriptions={prescriptions.filter(p => p.familyMemberId === member.id)} />
      </div>

      <AddEditConditionModal isOpen={isConditionModalOpen} onClose={() => setIsConditionModalOpen(false)} onSave={handleAddOrUpdateCondition} conditionToEdit={editingCondition}/>
      <AddVitalModal isOpen={isVitalModalOpen} onClose={() => setIsVitalModalOpen(false)} onAddVital={(v) => setVitals(p => [...p, {...v, id: `v-${Date.now()}`, familyMemberId: member.id}])} />
      <AddVaccinationModal isOpen={isVaccinationModalOpen} onClose={() => setIsVaccinationModalOpen(false)} onAddVaccination={(v) => setVaccinations(p => [...p, {...v, id: `vac-${Date.now()}`, familyMemberId: member.id}])} />
    </>
  );
};