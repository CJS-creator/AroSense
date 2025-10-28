import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { AppSettings, EmergencyContact } from '../types';
import { SampleEmergencyContacts } from '../constants';

interface SettingsContextType {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  emergencyContacts: EmergencyContact[];
  setEmergencyContacts: React.Dispatch<React.SetStateAction<EmergencyContact[]>>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const DASHBOARD_WIDGETS = [
    { id: 'stats', name: 'Quick Stats' },
    { id: 'actions', name: 'Action Center' },
    { id: 'appointments', name: 'Upcoming Appointments' },
    { id: 'activity', name: 'Recent Activity' },
    { id: 'family', name: 'Family Overview' },
    { id: 'wellness', name: 'Quick Wellness Log' },
    { id: 'explore', name: 'Explore' },
];

const initializeWidgetVisibility = () => {
    const visibility: { [widgetId: string]: boolean } = {};
    DASHBOARD_WIDGETS.forEach(widget => {
        visibility[widget.id] = true;
    });
    return visibility;
};


const defaultSettings: AppSettings = {
    wellness: {
        defaultMood: 'Neutral',
        waterIntakeGoalLiters: 2.5,
        sleepGoalHours: 8,
        remindersEnabled: true,
        reminderTime: '09:00',
    },
    billing: {
        defaultPaymentMethod: 'HSA Card',
        dueDateRemindersEnabled: true,
        policyVisibility: {}, // This will be populated from financial context in a real app
    },
    dashboard: {
        widgetVisibility: initializeWidgetVisibility(),
    }
}

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
        const storedSettings = localStorage.getItem('appSettings');
        if (storedSettings) {
            const parsed = JSON.parse(storedSettings);
            // Deep merge to ensure new settings keys are added and to prevent errors from old/incomplete stored settings
            return {
                ...defaultSettings,
                wellness: { ...defaultSettings.wellness, ...(parsed.wellness || {}) },
                billing: { ...defaultSettings.billing, ...(parsed.billing || {}) },
                dashboard: { ...defaultSettings.dashboard, ...(parsed.dashboard || {}) },
            };
        }
    } catch (error) {
        console.error("Failed to parse settings from localStorage", error);
    }
    return defaultSettings;
  });

  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>(SampleEmergencyContacts);

  useEffect(() => {
    try {
        localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
        console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, emergencyContacts, setEmergencyContacts }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};