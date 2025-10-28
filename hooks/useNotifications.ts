import { useEffect, useRef } from 'react';
import { useToast } from '../components/toast/useToast';
import { useSettings } from '../contexts/SettingsContext';
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFinancial } from '../contexts/FinancialContext';
import { useWellness } from '../contexts/WellnessContext';
import { useUser } from '../contexts/UserContext';

// Helper to check if a date is within the next N days
const isWithinNextDays = (dateStr: string, days: number): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateStr);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    return targetDate >= today && targetDate <= futureDate;
};

export const useNotifications = () => {
    const { settings } = useSettings();
    const { appointments } = useHealthRecords();
    const { bills } = useFinancial();
    const { wellnessLog } = useWellness();
    const { currentUser } = useUser();
    const toast = useToast();
    const notificationsFired = useRef<Set<string>>(new Set());

    useEffect(() => {
        // This effect runs once on app load to check for notifications.
        // We use a ref to ensure notifications are only fired once per session.

        // Appointment Reminders
        if (settings.billing.dueDateRemindersEnabled) { // Assuming one setting for all date-based reminders
            appointments.forEach(apt => {
                if (isWithinNextDays(apt.date, 2)) {
                    const notificationId = `apt-${apt.id}`;
                    if (!notificationsFired.current.has(notificationId)) {
                        toast.add(`Reminder: Appointment with ${apt.doctor} is on ${new Date(apt.date).toLocaleDateString()}.`, 'info');
                        notificationsFired.current.add(notificationId);
                    }
                }
            });
        }

        // Bill Due Date Reminders
        if (settings.billing.dueDateRemindersEnabled) {
            bills.forEach(bill => {
                if (!bill.isPaid && isWithinNextDays(bill.dueDate, 3)) {
                    const notificationId = `bill-${bill.id}`;
                    if (!notificationsFired.current.has(notificationId)) {
                        toast.add(`Bill due soon: $${bill.amountDue} to ${bill.serviceProvider}.`, 'warning');
                        notificationsFired.current.add(notificationId);
                    }
                }
            });
        }
        
        // Wellness Check-in Reminder
        if (settings.wellness.remindersEnabled) {
            const todayStr = new Date().toISOString().split('T')[0];
            const hasLoggedToday = wellnessLog.some(log => log.familyMemberId === currentUser.id && log.date === todayStr);
            const notificationId = `wellness-${todayStr}`;
            
            if (!hasLoggedToday && !notificationsFired.current.has(notificationId)) {
                const [reminderHour, reminderMinute] = settings.wellness.reminderTime.split(':').map(Number);
                const now = new Date();
                if (now.getHours() > reminderHour || (now.getHours() === reminderHour && now.getMinutes() >= reminderMinute)) {
                    toast.add("Don't forget to log your wellness for today!", 'info');
                    notificationsFired.current.add(notificationId);
                }
            }
        }

    // We only want this to run once, so dependencies are empty.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};
