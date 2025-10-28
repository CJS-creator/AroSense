import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, AppSettings, InsurancePolicy, EmergencyContact, WellnessEntry } from '../types';
import { useUser } from '../contexts/UserContext';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label, Select, Toggle, Dialog, DialogContent, DialogHeader as DHeader, DialogTitle as DTitle, DialogDescription, DialogFooter } from '../components/bits';
import { IconPencil, IconShieldCheck, IconDownload, IconPrinter, IconSun, IconMoon, IconComputerDesktop, IconWellness, IconCreditCard, IconFamily, IconSettings, IconPlus, IconTrash } from '../constants';
import { useToast } from '../components/toast/useToast';
import { useTheme } from '../hooks/useTheme';
import { useSettings } from '../contexts/SettingsContext';
import { useFinancial } from '../contexts/FinancialContext';
import { AnimatePresence, motion } from 'framer-motion';
import { SettingsSection } from '../components/SettingsSection';
import { AddEditContactModal } from '../components/AddEditContactModal';
import { SlideInList } from '../components/animations/SlideInList';

export const SettingsPage: React.FC = () => {
  const { currentUser } = useUser();
  const { settings, setSettings, emergencyContacts, setEmergencyContacts } = useSettings();
  const { insurancePolicies } = useFinancial();
  const toast = useToast();
  const { theme, setTheme } = useTheme();

  const [userProfile, setUserProfile] = useState<UserProfile>(currentUser);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [isDirty, setIsDirty] = useState(false);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [contactToDelete, setContactToDelete] = useState<EmergencyContact | null>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    const hasChanged = JSON.stringify(localSettings) !== JSON.stringify(settings);
    setIsDirty(hasChanged);
  }, [localSettings, settings]);

  const handleSettingsChange = (section: keyof AppSettings, key: any, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };
  
  const handlePolicyVisibilityChange = (policyId: string, isVisible: boolean) => {
    setLocalSettings(prev => ({
        ...prev,
        billing: {
            ...prev.billing,
            policyVisibility: {
                ...prev.billing.policyVisibility,
                [policyId]: isVisible
            }
        }
    }));
  };

  const handleSaveSettings = () => {
    setSettings(localSettings);
    setIsDirty(false);
    toast.add("Settings saved successfully!", 'success');
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setIsContactModalOpen(true);
  };
  
  const handleAddContact = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };
  
  const confirmDeleteContact = () => {
    if (contactToDelete) {
        setEmergencyContacts(prev => prev.filter(c => c.id !== contactToDelete.id));
        toast.add("Emergency contact deleted.", "success");
        setContactToDelete(null);
    }
  };


  const themeOptions = [
    { name: 'Light', value: 'light', icon: <IconSun className="w-5 h-5"/> },
    { name: 'Dark', value: 'dark', icon: <IconMoon className="w-5 h-5"/> },
    { name: 'System', value: 'system', icon: <IconComputerDesktop className="w-5 h-5"/> }
  ];

  const moodOptions: { value: WellnessEntry['mood'], label: string }[] = [
    { value: 'Happy', label: '😊 Happy' }, { value: 'Neutral', label: '😐 Neutral' },
    { value: 'Sad', label: '😢 Sad' }, { value: 'Anxious', label: '😟 Anxious' },
    { value: 'Energetic', label: '⚡ Energetic' },
  ];

  return (
    <>
      <div className="space-y-8 pb-24">
        <h1 className="text-3xl font-bold text-textPrimary">Settings</h1>

        <SlideInList>
            <SettingsSection title="Wellness Hub" icon={<IconWellness/>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label>Default Mood</Label>
                        <Select options={moodOptions} value={localSettings.wellness.defaultMood} onChange={(e) => handleSettingsChange('wellness', 'defaultMood', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                        <Label>Daily Reminder</Label>
                        <div className="flex items-center gap-4">
                            <Toggle pressed={localSettings.wellness.remindersEnabled} onPressedChange={(val) => handleSettingsChange('wellness', 'remindersEnabled', val)} aria-label="Toggle daily reminders" />
                            <AnimatePresence>
                            {localSettings.wellness.remindersEnabled &&
                                <motion.div initial={{opacity: 0, width: 0}} animate={{opacity: 1, width: 'auto'}} exit={{opacity: 0, width: 0}}>
                                    <Input type="time" value={localSettings.wellness.reminderTime} onChange={(e) => handleSettingsChange('wellness', 'reminderTime', e.target.value)} />
                                </motion.div>
                            }
                            </AnimatePresence>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Water Intake Goal</Label>
                        <Input type="number" value={localSettings.wellness.waterIntakeGoalLiters} onChange={(e) => handleSettingsChange('wellness', 'waterIntakeGoalLiters', parseFloat(e.target.value))} rightIcon={<span className="text-textSecondary text-sm">Liters</span>} />
                    </div>
                     <div className="space-y-2">
                        <Label>Sleep Goal</Label>
                        <Input type="number" value={localSettings.wellness.sleepGoalHours} onChange={(e) => handleSettingsChange('wellness', 'sleepGoalHours', parseFloat(e.target.value))} rightIcon={<span className="text-textSecondary text-sm">Hours</span>} />
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Insurance & Billing" icon={<IconCreditCard/>}>
                 <div className="space-y-4">
                    <div className="space-y-2 md:w-1/2">
                        <Label>Default Payment Method</Label>
                        <Input value={localSettings.billing.defaultPaymentMethod} onChange={(e) => handleSettingsChange('billing', 'defaultPaymentMethod', e.target.value)} placeholder="e.g. Credit Card, HSA"/>
                    </div>
                     <div className="space-y-2">
                        <Label>Due Date Reminders</Label>
                        <div className="flex items-center gap-4">
                            <Toggle pressed={localSettings.billing.dueDateRemindersEnabled} onPressedChange={(val) => handleSettingsChange('billing', 'dueDateRemindersEnabled', val)} aria-label="Toggle bill due date reminders" />
                             <span className="text-sm text-textSecondary">Enable notifications for upcoming bills</span>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Policy Visibility</Label>
                        <p className="text-xs text-textSecondary -mt-1 mb-2">Toggle which policies appear on the dashboard and summaries.</p>
                        <div className="space-y-2 rounded-md border border-border p-3 max-h-48 overflow-y-auto">
                            {insurancePolicies.map(policy => (
                                <div key={policy.id} className="flex items-center justify-between">
                                    <span>{policy.providerName} ({policy.policyNumber})</span>
                                    <Toggle pressed={localSettings.billing.policyVisibility[policy.id] ?? true} onPressedChange={(val) => handlePolicyVisibilityChange(policy.id, val)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SettingsSection>
            
            <SettingsSection title="Family Coordination" icon={<IconFamily/>}>
                <div className="flex justify-between items-center mb-2">
                    <Label>Emergency Contacts</Label>
                    <Button size="sm" variant="outline" onClick={handleAddContact} leftIcon={<IconPlus className="w-4 h-4"/>}>Add Contact</Button>
                </div>
                <div className="space-y-2 rounded-md border border-border p-3">
                    {emergencyContacts.length > 0 ? (
                        <SlideInList>
                        {emergencyContacts.map(contact => (
                            <div key={contact.id} className="flex items-center justify-between p-2 hover:bg-surface-soft rounded-md">
                                <div>
                                    <p className="font-medium">{contact.name} <span className="text-xs text-textSecondary">({contact.relationship})</span></p>
                                    <p className="text-sm text-primary-DEFAULT font-mono">{contact.phone}</p>
                                </div>
                                <div className="space-x-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditContact(contact)}><IconPencil className="w-4 h-4"/></Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-danger hover:bg-danger/10" onClick={() => setContactToDelete(contact)}><IconTrash className="w-4 h-4"/></Button>
                                </div>
                            </div>
                        ))}
                        </SlideInList>
                    ) : (<p className="text-sm text-textSecondary text-center py-4">No emergency contacts added.</p>)}
                </div>
            </SettingsSection>

            <SettingsSection title="General" icon={<IconSettings/>}>
              <div className="space-y-2">
                  <Label>Theme</Label>
                  <p className="text-xs text-textSecondary -mt-1 mb-2">Select how you would like the application to appear.</p>
                  <div className="flex space-x-2 rounded-lg bg-surface-soft p-1 w-full max-w-xs">
                    {themeOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                        className={`w-full flex justify-center items-center space-x-2 p-2 text-sm font-medium rounded-md transition-colors
                        ${theme === option.value
                          ? 'bg-surface shadow text-primary-dark dark:text-primary-DEFAULT'
                          : 'text-textSecondary hover:bg-surface-hover/50'
                        }`}
                      >
                        {option.icon}
                        <span>{option.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
            </SettingsSection>
        </SlideInList>
      </div>

      <AnimatePresence>
          {isDirty && (
              <motion.div 
                className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm border-t border-border"
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                  <div className="max-w-7xl mx-auto flex justify-between items-center">
                      <p className="text-textPrimary font-medium">You have unsaved changes.</p>
                      <Button onClick={handleSaveSettings} size="lg">Save Changes</Button>
                  </div>
              </motion.div>
          )}
      </AnimatePresence>

      <AddEditContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        contactToEdit={editingContact}
      />
      
       <Dialog open={!!contactToDelete} onOpenChange={() => setContactToDelete(null)}>
            <DialogContent>
                <DHeader>
                    <DTitle>Delete Contact</DTitle>
                    <DialogDescription>
                        Are you sure you want to delete {contactToDelete?.name}? This action cannot be undone.
                    </DialogDescription>
                </DHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setContactToDelete(null)}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmDeleteContact}>Delete</Button>
                </DialogFooter>
            </DialogContent>
       </Dialog>
    </>
  );
};