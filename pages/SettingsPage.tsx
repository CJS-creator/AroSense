import React, { useState } from 'react';
import { UserProfile } from '../types';
// FIX: Replaced incorrect AppContext with useUser hook.
import { useUser } from '../contexts/UserContext';
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from '../components/bits';
import { IconPencil, IconShieldCheck, IconDownload, IconPrinter, IconSun, IconMoon, IconComputerDesktop } from '../constants';
import { useToast } from '../components/toast/useToast';
import { useTheme } from '../hooks/useTheme';

export const SettingsPage: React.FC = () => {
  // FIX: Used the useUser hook to correctly get currentUser.
  const { currentUser } = useUser();
  const [userProfile, setUserProfile] = useState<UserProfile>(currentUser);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false); 
  const toast = useToast();
  const { theme, setTheme } = useTheme();

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserProfile({ ...userProfile, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    // In a real app, this would make an API call to update the user profile
    // and then update the currentUser in AppContext.
    console.log("Saving profile:", userProfile);
    setIsEditingProfile(false);
    toast.add("Profile updated successfully!", 'success');
  };

  const toggleMfa = () => {
    const newMfaState = !mfaEnabled;
    setMfaEnabled(newMfaState);
    toast.add(`Multi-Factor Authentication ${newMfaState ? 'enabled' : 'disabled'}.`, 'info');
  };

  const renderSection = (title: string, icon: React.ReactElement<{ className?: string }>, children: React.ReactNode) => (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center">
                {React.cloneElement(icon, { className: "w-6 h-6 mr-3 text-primary-DEFAULT"})}
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
  );
  
  const themeOptions = [
    { name: 'Light', value: 'light', icon: <IconSun className="w-5 h-5"/> },
    { name: 'Dark', value: 'dark', icon: <IconMoon className="w-5 h-5"/> },
    { name: 'System', value: 'system', icon: <IconComputerDesktop className="w-5 h-5"/> }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-textPrimary">Settings</h1>

      {renderSection("Profile Information", <IconPencil />, 
        isEditingProfile ? (
          <form onSubmit={(e) => { e.preventDefault(); saveProfile(); }} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={userProfile.name} onChange={handleProfileChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={userProfile.email} onChange={handleProfileChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
                <Input id="avatarUrl" name="avatarUrl" placeholder="https://example.com/avatar.png" value={userProfile.avatarUrl || ''} onChange={handleProfileChange} />
            </div>
            <div className="flex space-x-3 pt-2">
              <Button type="submit">Save Profile</Button>
              <Button variant="outline" onClick={() => { setIsEditingProfile(false); setUserProfile(currentUser); }}>Cancel</Button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
                <img 
                    src={userProfile.avatarUrl || `https://i.pravatar.cc/80?u=${userProfile.id}`} 
                    alt="User Avatar" 
                    className="w-20 h-20 rounded-full object-cover ring-2 ring-primary-light ring-offset-background ring-offset-2"
                />
                <div>
                    <p className="text-lg font-semibold text-textPrimary">{userProfile.name}</p>
                    <p className="text-textSecondary">{userProfile.email}</p>
                </div>
            </div>
            <Button variant="outline" onClick={() => setIsEditingProfile(true)} leftIcon={<IconPencil className="w-4 h-4" />} className="mt-4">
              Edit Profile
            </Button>
          </div>
        )
      )}
      
      {renderSection("Appearance", theme === 'dark' ? <IconMoon /> : <IconSun />, 
        <div>
          <h4 className="font-medium text-textPrimary">Theme</h4>
            <p className="text-sm text-textSecondary mt-1 mb-3">
              Select how you would like the application to appear.
            </p>
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
      )}

      {renderSection("Security", <IconShieldCheck />, 
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-textPrimary">Multi-Factor Authentication (MFA)</h4>
            <p className="text-sm text-textSecondary mt-1 mb-3">
              Add an extra layer of security to your account for sensitive operations.
            </p>
            <Button onClick={toggleMfa} variant={mfaEnabled ? "destructive" : "default"}>
              {mfaEnabled ? 'Disable MFA' : 'Enable MFA'}
            </Button>
            {mfaEnabled && <p className="text-sm text-green-600 dark:text-green-400 mt-2">MFA is currently enabled (simulated).</p>}
          </div>
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-textPrimary">Biometric Authentication</h4>
            <p className="text-sm text-textSecondary mt-1 mb-3">
              Use fingerprint or face recognition (if supported by your device and browser).
            </p>
            <Button variant="outline" disabled>Setup Biometrics (Coming Soon)</Button>
          </div>
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-textPrimary">Audit Trail</h4>
            <p className="text-sm text-textSecondary mt-1 mb-3">
              Review a log of significant account activities and data access.
            </p>
            <Button variant="outline" disabled>View Audit Trail (Coming Soon)</Button>
          </div>
        </div>
      )}

      {renderSection("Data Management", <IconDownload />, 
        <div className="space-y-6">
           <div>
            <h4 className="font-medium text-textPrimary">Export Data</h4>
            <p className="text-sm text-textSecondary mt-1 mb-3">
              Download all your application data in a portable JSON format.
            </p>
            <Button variant="secondary" onClick={() => toast.add('Data export initiated (simulated).', 'info')} leftIcon={<IconDownload className="w-4 h-4"/>}>
                Export All Data
            </Button>
          </div>
          <div className="border-t border-border pt-4">
            <h4 className="font-medium text-textPrimary">Print Records</h4>
            <p className="text-sm text-textSecondary mt-1 mb-3">
              Generate a printable summary of key medical information.
            </p>
            <Button variant="secondary" onClick={() => toast.add('Print dialog would open here.', 'info')} leftIcon={<IconPrinter className="w-4 h-4"/>}>
                Print Summary
            </Button>
          </div>
        </div>
      )}
       <div className="text-center text-sm text-textSecondary py-4">
        AroSense Version 1.0.0
      </div>
    </div>
  );
};
