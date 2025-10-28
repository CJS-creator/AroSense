import React from 'react';
import { NavLink } from 'react-router-dom';
import { IconDashboard, IconFamily, IconEmergency, IconDocument, IconPrescription, IconWellness, IconPregnancy, IconSettings, IconCreditCard, IconImageAnalyzer } from '../constants';

const navItems = [
  { to: '/', text: 'Dashboard', icon: IconDashboard },
  { to: '/family', text: 'Family', icon: IconFamily },
  { to: '/emergency', text: 'Emergency', icon: IconEmergency },
  { to: '/documents', text: 'Documents', icon: IconDocument },
  { to: '/prescriptions', text: 'Prescriptions', icon: IconPrescription },
  { to: '/wellness', text: 'Wellness', icon: IconWellness },
  { to: '/pregnancy', text: 'Pregnancy Care', icon: IconPregnancy },
  { to: '/insurance', text: 'Insurance & Billing', icon: IconCreditCard },
  { to: '/analyzer', text: 'AI Image Analyzer', icon: IconImageAnalyzer },
  { to: '/settings', text: 'Settings', icon: IconSettings },
];

interface SidebarProps {
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, closeMobileMenu }) => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ease-in-out group
    ${isActive 
      ? 'bg-primary-dark text-white font-semibold shadow-md hover:bg-primary-dark' 
      : 'text-textSecondary hover:bg-primary-light/20 dark:hover:bg-primary-dark/40 hover:text-primary-dark dark:hover:text-primary-DEFAULT font-medium'
    }`;

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-40
      w-64 bg-surface text-textPrimary
      flex-col shadow-xl transition-transform duration-300 ease-in-out
      md:relative md:translate-x-0
      ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-20 flex items-center justify-center border-b border-border">
        <div className="flex items-center gap-2 text-2xl font-semibold text-textPrimary">
          <span className="text-3xl">💖</span>
          <span>AroSense</span>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={navLinkClasses}
            onClick={closeMobileMenu} // Close menu on mobile when a link is clicked
          >
            <item.icon className="w-6 h-6" />
            <span>{item.text}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <p className="text-xs text-textSecondary/70 text-center">&copy; 2024 AroSense</p>
      </div>
    </aside>
  );
};