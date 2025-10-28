import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { IconBars3 } from '../constants';
import { GlobalSearch } from './GlobalSearch';

interface HeaderProps {
  onMenuButtonClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuButtonClick }) => {
  const location = useLocation();
  const { currentUser } = useUser();

  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (location.pathname.startsWith('/family/')) return 'Family Member Details';
    if (!path || path === '') return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' ');
  };

  return (
    <header className="h-20 bg-surface shadow-sm flex items-center justify-between px-4 sm:px-6 border-b border-border no-print shrink-0">
      <div className="flex items-center">
        <button
          onClick={onMenuButtonClick}
          className="md:hidden text-textSecondary p-2 mr-2 rounded-md hover:bg-surface-hover"
          aria-label="Open sidebar"
        >
          <IconBars3 className="w-6 h-6" />
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-textPrimary">{getPageTitle()}</h2>
      </div>
      <div className="flex items-center space-x-4">
        <GlobalSearch />
        <span className="hidden sm:block text-textSecondary font-medium">{currentUser.name}</span>
        <img 
          src={currentUser.avatarUrl || `https://i.pravatar.cc/40?u=${currentUser.id}`} 
          alt="User Avatar" 
          className="w-10 h-10 rounded-full object-cover ring-2 ring-offset-2 ring-primary-light ring-offset-background"
        />
      </div>
    </header>
  );
};