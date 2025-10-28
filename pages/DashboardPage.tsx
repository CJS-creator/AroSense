import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/toast/useToast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Alert, AlertTitle, AlertDescription } from '../components/bits';
import { IconEmergency, IconDocument, IconPrescription, IconCreditCard, IconBell, IconCheckCircle, IconCalendar, IconHeart } from '../constants';
import { WellnessEntry } from '../types';
import { useUser } from '../contexts/UserContext';
import { useFamily } from '../contexts/FamilyContext';
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFinancial } from '../contexts/FinancialContext';
import { useWellness } from '../contexts/WellnessContext';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

const moodOptions: { mood: WellnessEntry['mood'], label: string, icon: string }[] = [
  { mood: 'Happy', label: 'Happy', icon: '😊' },
  { mood: 'Energetic', label: 'Energetic', icon: '⚡' },
  { mood: 'Neutral', label: 'Neutral', icon: '😐' },
  { mood: 'Anxious', label: 'Anxious', icon: '😟' },
  { mood: 'Sad', label: 'Sad', icon: '😢' },
];

export const DashboardPage: React.FC = () => {
  const { currentUser } = useUser();
  const { familyMembers, medicalNotes, getMemberName } = useFamily();
  const { documents, prescriptions, appointments } = useHealthRecords();
  const { bills } = useFinancial();
  const { wellnessLog, setWellnessLog } = useWellness();
  
  const navigate = useNavigate();
  const toast = useToast();

  const criticalNotes = useMemo(() => medicalNotes.filter(note => note.isCritical), [medicalNotes]);

  const expiringPrescriptions = useMemo(() => {
    const today = new Date();
    const sevenDaysFromNow = new Date(new Date().setDate(today.getDate() + 7));
    return prescriptions.filter(rx => {
      if (!rx.endDate) return false;
      const endDate = new Date(rx.endDate);
      return endDate <= sevenDaysFromNow && endDate >= today;
    });
  }, [prescriptions]);
  
  const upcomingBills = useMemo(() => {
    const today = new Date();
    const fourteenDaysFromNow = new Date(new Date().setDate(today.getDate() + 14));
    return bills.filter(bill => {
        if(bill.isPaid) return false;
        const dueDate = new Date(bill.dueDate);
        return dueDate <= fourteenDaysFromNow && dueDate >= today;
    });
  }, [bills]);
  
  const todayWellnessLog = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return wellnessLog.find(log => log.date === todayStr && log.familyMemberId === currentUser.id);
  }, [wellnessLog, currentUser.id]);

  const actionItems = useMemo(() => [
    ...criticalNotes.map(n => ({
        id: n.id,
        type: 'note' as const,
        title: `Critical Note: ${getMemberName(n.familyMemberId)}`,
        description: n.title,
        link: '/emergency'
    })),
    ...expiringPrescriptions.map(p => ({
        id: p.id,
        type: 'prescription' as const,
        title: `Refill Needed: ${p.medicationName}`,
        description: `For ${getMemberName(p.familyMemberId)}. Expires on ${new Date(p.endDate!).toLocaleDateString()}.`,
        link: '/prescriptions'
    })),
    ...upcomingBills.map(b => ({
        id: b.id,
        type: 'bill' as const,
        title: `Bill Due: ${new Date(b.dueDate).toLocaleDateString()}`,
        description: `$${b.amountDue.toFixed(2)} to ${b.serviceProvider}`,
        link: '/insurance'
    })),
    ...(!todayWellnessLog ? [{
        id: 'wellness',
        type: 'wellness' as const,
        title: 'Daily Wellness Reminder',
        description: "Log your mood and health for today.",
        link: '/wellness'
    }] : [])
], [criticalNotes, expiringPrescriptions, upcomingBills, todayWellnessLog, getMemberName]);

const actionConfig: { [key in typeof actionItems[number]['type']]: { variant: "destructive" | "warning" | "default", icon: React.FC<any> } } = {
    note: { variant: 'destructive', icon: IconEmergency },
    prescription: { variant: 'warning', icon: IconPrescription },
    bill: { variant: 'default', icon: IconCreditCard },
    wellness: { variant: 'default', icon: IconHeart }
};

  const upcomingAppointments = useMemo(() => {
      const today = new Date();
      return appointments
        .filter(apt => new Date(apt.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
  }, [appointments]);
  
  const recentActivity = useMemo(() => {
    const activities = [
      ...documents.map(d => ({ date: new Date(d.uploadDate), text: `Document "${d.title}" added for ${getMemberName(d.familyMemberId)}`, icon: IconDocument, link: '/documents'})),
      ...prescriptions.map(p => ({ date: new Date(p.startDate), text: `Prescription "${p.medicationName}" started for ${getMemberName(p.familyMemberId)}`, icon: IconPrescription, link: '/prescriptions'})),
      ...wellnessLog.map(w => ({ date: new Date(w.date), text: `Wellness entry for ${getMemberName(w.familyMemberId)} logged`, icon: IconHeart, link: '/wellness' }))
    ];
    return activities.sort((a,b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }, [documents, prescriptions, wellnessLog, getMemberName]);

  const quickLogWellness = (mood: WellnessEntry['mood']) => {
    if(todayWellnessLog) {
        toast.add("You've already logged your mood today!", "info");
        return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry: WellnessEntry = {
      id: `we-${Date.now()}`,
      date: todayStr,
      mood: mood,
      familyMemberId: currentUser.id,
    };
    setWellnessLog(prev => [newEntry, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast.add(`Mood logged as ${mood}!`, 'success');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-textPrimary">{getGreeting()}, {currentUser.name}!</h1>
        <p className="text-textSecondary mt-1 text-lg">Here's your family's health summary.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 shadow-none"><div className="font-bold text-2xl text-primary-DEFAULT">{actionItems.length}</div><p className="text-sm text-textSecondary">Urgent Actions</p></Card>
          <Card className="p-4 shadow-none"><div className="font-bold text-2xl text-primary-DEFAULT">{upcomingAppointments.length}</div><p className="text-sm text-textSecondary">Upcoming Appts</p></Card>
          <Card className="p-4 shadow-none"><div className="font-bold text-2xl text-primary-DEFAULT">{familyMembers.length}</div><p className="text-sm text-textSecondary">Family Members</p></Card>
          <Card className="p-4 shadow-none"><div className="font-bold text-2xl text-primary-DEFAULT">{documents.length}</div><p className="text-sm text-textSecondary">Documents</p></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <main className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader><CardTitle className="flex items-center"><IconBell className="w-6 h-6 mr-2 text-primary-DEFAULT"/>Action Center</CardTitle></CardHeader>
                <CardContent>
                    {actionItems.length === 0 ? (
                        <div className="text-center py-6"><IconCheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2"/><p className="font-semibold text-textPrimary">All Caught Up!</p><p className="text-sm text-textSecondary">You have no urgent items.</p></div>
                    ) : (
                        <div className="space-y-4">
                            {actionItems.map(item => {
                                const config = actionConfig[item.type];
                                return (
                                    <Alert key={item.id} variant={config.variant}>
                                        <config.icon className="w-5 h-5" />
                                        <AlertTitle>{item.title}</AlertTitle>
                                        <AlertDescription>
                                            <div className="flex justify-between items-center">
                                                <span>{item.description}</span>
                                                <Button size="sm" variant="link" onClick={() => navigate(item.link)}>View</Button>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex items-center"><IconCalendar className="w-6 h-6 mr-2 text-primary-DEFAULT"/>Upcoming Appointments</CardTitle></CardHeader>
                <CardContent>
                     {upcomingAppointments.length === 0 ? (<p className="text-textSecondary text-center py-4">No upcoming appointments scheduled.</p>) : (
                        <ul className="space-y-4">{upcomingAppointments.map(apt => (<li key={apt.id} className="flex items-center gap-4"><div className="flex flex-col items-center justify-center w-16 bg-primary-light/20 text-primary-dark dark:bg-primary-dark/50 dark:text-primary-light p-2 rounded-lg"><span className="text-sm font-bold">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</span><span className="text-2xl font-extrabold">{new Date(apt.date).getDate()}</span></div><div><p className="font-semibold text-textPrimary">{apt.type} with {apt.doctor}</p><p className="text-sm text-textSecondary">{getMemberName(apt.familyMemberId)} at {apt.time}</p></div></li>))}</ul>
                    )}
                </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
              <CardContent>
                  {recentActivity.length > 0 ? (<ul className="space-y-3">{recentActivity.map((activity, index) => (<li key={index} className="flex items-center text-sm"><activity.icon className="w-5 h-5 mr-3 text-textSecondary flex-shrink-0" /><span className="text-textSecondary">{activity.text}</span><span className="text-xs text-textSecondary/70 ml-auto whitespace-nowrap">{activity.date.toLocaleDateString()}</span></li>))}</ul>) : (<p className="text-textSecondary text-center py-4">No recent activity.</p>)}
              </CardContent>
            </Card>
          </main>
          <aside className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Family Overview</CardTitle></CardHeader>
                <CardContent>
                    <ul className="space-y-3">{familyMembers.map(member => (<li key={member.id}><Link to={`/family/${member.id}`} className="flex items-center gap-3 p-2 -m-2 rounded-lg hover:bg-surface-hover transition-colors"><img src={member.profilePhotoUrl || `https://i.pravatar.cc/40?u=${member.id}`} alt={member.name} className="w-10 h-10 rounded-full object-cover" /><div><p className="font-semibold text-textPrimary">{member.name}</p><p className="text-xs text-textSecondary">{member.relationship}</p></div></Link></li>))}</ul>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Quick Wellness Log</CardTitle><CardDescription>How are you feeling today?</CardDescription></CardHeader>
                <CardContent>
                    {todayWellnessLog ? (<div className="text-center py-4 bg-green-500/10 text-green-700 dark:text-green-300 rounded-lg"><p className="font-semibold">Logged for today: {moodOptions.find(m => m.mood === todayWellnessLog.mood)?.icon} {todayWellnessLog.mood}</p><p className="text-sm ">Great job!</p></div>) : (<div className="flex justify-around">{moodOptions.map(({mood, icon, label}) => (<button key={mood} onClick={() => quickLogWellness(mood)} title={label} className="text-3xl transition-transform hover:scale-125 p-1">{icon}</button>))}</div>)}
                </CardContent>
            </Card>
            
            <Card>
              <CardHeader><CardTitle>Explore</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <Link to="/documents" className="p-3 bg-surface-soft hover:bg-surface-hover rounded-lg transition-colors"><IconDocument className="w-8 h-8 mx-auto text-primary-DEFAULT mb-1"/><span className="text-sm font-medium">Documents</span></Link>
                    <Link to="/prescriptions" className="p-3 bg-surface-soft hover:bg-surface-hover rounded-lg transition-colors"><IconPrescription className="w-8 h-8 mx-auto text-secondary-DEFAULT mb-1"/><span className="text-sm font-medium">Prescriptions</span></Link>
                    <Link to="/emergency" className="p-3 bg-surface-soft hover:bg-surface-hover rounded-lg transition-colors"><IconEmergency className="w-8 h-8 mx-auto text-danger mb-1"/><span className="text-sm font-medium">Emergency</span></Link>
                    <Link to="/insurance" className="p-3 bg-surface-soft hover:bg-surface-hover rounded-lg transition-colors"><IconCreditCard className="w-8 h-8 mx-auto text-green-500 mb-1"/><span className="text-sm font-medium">Billing</span></Link>
                </div>
              </CardContent>
            </Card>
          </aside>
      </div>
    </div>
  );
};
