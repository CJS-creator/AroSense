import React, { useState } from 'react';
import { DashboardWidgetGrid } from '../components/DashboardWidgetGrid';
import { Button } from '../components/bits';
import { useUser } from '../contexts/UserContext';
import { IconSettings } from '../constants';
import { CustomizeDashboardModal } from '../components/CustomizeDashboardModal';

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

export const DashboardPage: React.FC = () => {
  const { currentUser } = useUser();
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  
  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">{getGreeting()}, {currentUser.name}!</h1>
            <p className="text-textSecondary mt-1 text-lg">Here's your family's health summary.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsCustomizeModalOpen(true)} leftIcon={<IconSettings className="w-4 h-4" />}>
            Customize
          </Button>
        </div>

        <DashboardWidgetGrid />
      </div>
      
      <CustomizeDashboardModal 
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
      />
    </>
  );
};