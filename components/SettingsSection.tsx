import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './bits';
import { ExpandCollapse } from './animations/ExpandCollapse';
import { motion } from 'framer-motion';

interface SettingsSectionProps {
  title: string;
  // FIX: Specified that the icon element can accept a className prop to resolve React.cloneElement type error.
  icon: React.ReactElement<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card>
      <CardHeader 
        className="cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`section-content-${title.replace(/\s+/g, '-')}`}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            {React.cloneElement(icon, { className: "w-6 h-6 mr-3 text-primary-DEFAULT" })}
            {title}
          </CardTitle>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-textSecondary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </motion.div>
        </div>
      </CardHeader>
      <ExpandCollapse isExpanded={isOpen}>
        <div id={`section-content-${title.replace(/\s+/g, '-')}`}>
          <CardContent>{children}</CardContent>
        </div>
      </ExpandCollapse>
    </Card>
  );
};