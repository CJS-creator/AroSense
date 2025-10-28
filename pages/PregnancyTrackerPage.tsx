import React, { useState, useMemo } from 'react';
import { GoogleGenAI } from '@google/genai';
import { useToast } from '../components/toast/useToast';
import { PregnancyProgress } from '../components/PregnancyProgress';
import { KickCounter } from '../components/KickCounter';
import { IconPregnancy, IconPlus, IconSparkles, IconBaby } from '../constants';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogFooter, DialogHeader as DHeader, DialogTitle as DTitle, Input, Label, Select, Textarea, cn } from '../components/bits';
import { Appointment, PregnancyLogEntry, PregnancyMood } from '../types';
import { usePregnancy } from '../contexts/PregnancyContext';
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFamily } from '../contexts/FamilyContext';

const defaultMilestones: { id: string; week: number; description: string; completed: boolean }[] = [
  { id: 'm1', week: 8, description: 'First prenatal visit', completed: true },
  { id: 'm2', week: 12, description: 'Hear baby\'s heartbeat', completed: false },
  { id: 'm3', week: 20, description: 'Anatomy scan (ultrasound)', completed: false },
  { id: 'm4', week: 28, description: 'Glucose screening test', completed: false },
  { id: 'm5', week: 36, description: 'Group B Strep test', completed: false },
];

const moodOptions: { value: PregnancyMood, label: string }[] = [
  { value: 'Happy', label: '😊 Happy' },
  { value: 'Excited', label: '🤩 Excited' },
  { value: 'Neutral', label: '😐 Neutral' },
  { value: 'Anxious', label: '😟 Anxious' },
  { value: 'Tired', label: '😴 Tired' },
  { value: 'Nauseous', label: '🤢 Nauseous' },
];

export const PregnancyTrackerPage: React.FC = () => {
  const { pregnancyData, setPregnancyData, pregnancyLog, setPregnancyLog } = usePregnancy();
  const { appointments, setAppointments } = useHealthRecords();
  const { familyMembers } = useFamily();
  const toast = useToast();

  const [milestones, setMilestones] = useState(defaultMilestones);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Omit<Appointment, 'id' | 'familyMemberId'>>({date: '', time: '', doctor: '', notes: '', type: 'Check-up'});
  
  const [logEntry, setLogEntry] = useState<{date: string, mood: PregnancyMood, notes: string}>({ date: new Date().toISOString().split('T')[0], mood: 'Neutral', notes: ''});
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');

  const [insights, setInsights] = useState("");
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [insightsError, setInsightsError] = useState("");
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // The mother is identified as the first family member with relationship 'Spouse' or 'Self'
  const mother = useMemo(() => 
    familyMembers.find(fm => fm.relationship === 'Spouse') || familyMembers.find(fm => fm.relationship === 'Self')
  , [familyMembers]);

  const pregnancyAppointments = useMemo(() => 
    appointments.filter(a => a.familyMemberId === mother?.id && ['Check-up', 'Ultrasound', 'Lab Test', 'Consultation'].includes(a.type))
  , [appointments, mother]);

  const pregnancyProgress = useMemo(() => {
    if (!pregnancyData.dueDate) return null;
    const dueDate = new Date(pregnancyData.dueDate);
    const startDate = new Date(dueDate.getTime() - 280 * 24 * 60 * 60 * 1000);
    const totalDays = 280;
    const daysPassed = (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const currentWeek = Math.floor(daysPassed / 7);
    const daysIntoWeek = Math.floor(daysPassed % 7);
    const trimester = currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3;
    const progressPercent = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));
    return { currentWeek, daysIntoWeek, trimester, progressPercent, daysPassed };
  }, [pregnancyData.dueDate, today]);

  const addAppointment = () => {
    if (!mother) {
      toast.add("Could not identify the mother's profile to assign the appointment.", 'error');
      return;
    }
    // This now correctly updates the global appointments list from HealthRecordsContext
    setAppointments(prev => [...prev, { ...newAppointment, id: `app-${Date.now()}`, familyMemberId: mother.id }]);
    setIsAppointmentModalOpen(false);
    setNewAppointment({date: '', time: '', doctor: '', notes: '', type: 'Check-up'});
    toast.add("Appointment added successfully!", 'success');
  };

  const handleAddSymptom = () => {
    if (currentSymptom && !symptoms.includes(currentSymptom)) {
      setSymptoms([...symptoms, currentSymptom.trim()]);
      setCurrentSymptom('');
    }
  };

  const handleRemoveSymptom = (symptomToRemove: string) => {
    setSymptoms(symptoms.filter(s => s !== symptomToRemove));
  };

  const handleLogJournal = () => {
    const newLog: PregnancyLogEntry = {
      id: `plog-${Date.now()}`,
      date: logEntry.date,
      mood: logEntry.mood,
      symptoms: symptoms,
      notes: logEntry.notes,
    };
    setPregnancyLog(prev => [newLog, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast.add('Journal entry saved!', 'success');
    setSymptoms([]);
    setCurrentSymptom('');
    setLogEntry({ date: new Date().toISOString().split('T')[0], mood: 'Neutral', notes: ''});
  };

  const getWeeklyInsights = async () => {
    if (!pregnancyProgress) return;
    setIsLoadingInsights(true);
    setInsights("");
    setInsightsError("");
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide a brief (2-3 sentences), encouraging, and easy-to-understand summary for week ${pregnancyProgress.currentWeek} of pregnancy for an expectant parent. Include the baby's approximate size (compared to a common fruit or vegetable), one key fetal development milestone, and one common maternal symptom. Write in a warm, friendly tone. Do not use markdown formatting.`
        });
        setInsights(response.text);
    } catch (error) {
        console.error("Error fetching Gemini insights:", error);
        setInsightsError("Could not load insights at this time. Please try again later.");
    } finally {
        setIsLoadingInsights(false);
    }
  };

  if (!pregnancyData.dueDate || !pregnancyProgress) {
    return <PregnancyProgress onSaveDueDate={(date) => setPregnancyData({ dueDate: date })} />;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-textPrimary flex items-center"><IconPregnancy className="w-8 h-8 mr-3 text-secondary-DEFAULT" />Pregnancy Journey</h2>
        <Button 
          onClick={() => setIsAppointmentModalOpen(true)} 
          leftIcon={<IconPlus />}
          disabled={!mother}
          title={!mother ? "Please add a 'Self' or 'Spouse' profile to add an appointment." : "Add a new appointment"}
        >
          Add Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PregnancyProgress dueDate={pregnancyData.dueDate} onSaveDueDate={(date) => setPregnancyData({ dueDate: date })} />

          <Card>
            <CardHeader><CardTitle className="flex items-center"><IconBaby className="w-6 h-6 mr-2 text-secondary-DEFAULT"/>Week {pregnancyProgress.currentWeek}: What's Happening?</CardTitle></CardHeader>
            <CardContent>{isLoadingInsights ? (<div className="text-center py-4"><p className="text-textSecondary">Loading insights...</p></div>) : insightsError ? (<p className="text-danger">{insightsError}</p>) : insights ? (<p className="text-textSecondary italic">"{insights}"</p>) : (<p className="text-textSecondary">Get AI-powered insights about this week's developments.</p>)}</CardContent>
            <CardContent className="pt-0"><Button onClick={getWeeklyInsights} disabled={isLoadingInsights} leftIcon={<IconSparkles className="w-5 h-5"/>}>{isLoadingInsights ? 'Generating...' : 'Get Weekly Insights from Gemini'}</Button></CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Daily Journal</CardTitle><CardDescription>Log your symptoms and how you're feeling today.</CardDescription></CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="logDate">Date</Label><Input id="logDate" type="date" value={logEntry.date} onChange={(e) => setLogEntry(p => ({...p, date: e.target.value}))}/></div>
                  <div className="space-y-2"><Label htmlFor="logMood">Mood</Label><Select id="logMood" options={moodOptions} value={logEntry.mood} onChange={(e) => setLogEntry(p => ({...p, mood: e.target.value as PregnancyMood}))}/></div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <div className="flex gap-2">
                    <Input id="symptoms" value={currentSymptom} onChange={(e) => setCurrentSymptom(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSymptom())} placeholder="e.g., Cravings, Fatigue"/>
                    <Button type="button" variant="outline" onClick={handleAddSymptom}>Add</Button>
                  </div>
                  {symptoms.length > 0 && (<div className="flex flex-wrap gap-2 pt-2">{symptoms.map(symptom => (<span key={symptom} className="flex items-center gap-x-2 rounded-full bg-surface-soft px-3 py-1.5 text-sm font-medium text-textPrimary">{symptom}<button type="button" onClick={() => handleRemoveSymptom(symptom)} className="text-textSecondary hover:text-danger">&times;</button></span>))}</div>)}
              </div>
              <div className="space-y-2"><Label htmlFor="logNotes">Notes</Label><Textarea id="logNotes" placeholder="Any additional thoughts or feelings..." value={logEntry.notes} onChange={(e) => setLogEntry(p => ({...p, notes: e.target.value}))}/></div>
              <Button onClick={handleLogJournal}>Save Today's Entry</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Appointment Log</CardTitle></CardHeader>
            <CardContent>
                 {pregnancyAppointments.length === 0 ? (<p className="text-textSecondary">No appointments scheduled yet.</p>) : (
                    <ul className="space-y-3 max-h-60 overflow-y-auto">{pregnancyAppointments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(app => {
                        const isPast = new Date(app.date) < today;
                        return (<li key={app.id} className={cn("p-3 rounded-md border", isPast ? "bg-surface-soft border-border" : "bg-secondary-DEFAULT/10 border-secondary-DEFAULT/20")}><p className={cn("font-semibold", isPast ? "text-textPrimary" : "text-secondary-dark dark:text-secondary-light")}>{app.type} with {app.doctor}</p><p className={cn("text-sm", isPast ? "text-textSecondary" : "text-secondary-DEFAULT")}>{new Date(app.date).toLocaleDateString()} at {app.time}</p></li>)
                    })}
                    </ul>
                )}
            </CardContent>
          </Card>

        </div>
        <div className="lg:col-span-1 space-y-6">
          <KickCounter />
          <Card>
            <CardHeader><CardTitle>Key Milestones</CardTitle></CardHeader>
            <CardContent>
              <ul className="space-y-3">{milestones.map(milestone => (<li key={milestone.id} className="flex items-center"><input type="checkbox" id={milestone.id} checked={milestone.completed} onChange={() => {setMilestones(prev => prev.map(m => m.id === milestone.id ? {...m, completed: !m.completed} : m))}} className="h-5 w-5 rounded border-border text-primary-DEFAULT focus:ring-primary-DEFAULT" /><label htmlFor={milestone.id} className={cn("ml-3 text-sm", milestone.completed && "text-textSecondary line-through")}><span className="font-semibold">Week {milestone.week}:</span> {milestone.description}</label></li>))}</ul>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isAppointmentModalOpen} onOpenChange={setIsAppointmentModalOpen}>
        <DialogContent>
            <DHeader><DTitle>Add New Appointment</DTitle></DHeader>
            <form onSubmit={(e) => { e.preventDefault(); addAppointment();}} className="space-y-4 pt-4">
                <div className="space-y-2"><Label htmlFor="type">Appointment Type</Label><Select id="type" name="type" value={newAppointment.type} onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value as Appointment['type']})} options={[{value: 'Check-up', label: 'Check-up'}, {value: 'Ultrasound', label: 'Ultrasound'}, {value: 'Lab Test', label: 'Lab Test'}, {value: 'Consultation', label: 'Consultation'},]}/></div>
                <div className="space-y-2"><Label htmlFor="date">Date</Label><Input id="date" type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})} required/></div>
                <div className="space-y-2"><Label htmlFor="time">Time</Label><Input id="time" type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})} required/></div>
                <div className="space-y-2"><Label htmlFor="doctor">Doctor/Clinic</Label><Input id="doctor" value={newAppointment.doctor} onChange={(e) => setNewAppointment({...newAppointment, doctor: e.target.value})} required/></div>
                <div className="space-y-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={newAppointment.notes} onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})} /></div>
                <DialogFooter><Button type="button" variant="outline" onClick={() => setIsAppointmentModalOpen(false)}>Cancel</Button><Button type="submit">Add Appointment</Button></DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};