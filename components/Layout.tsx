
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ToastContainer } from './toast/ToastContainer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-textPrimary">
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} closeMobileMenu={() => setIsMobileMenuOpen(false)} />
      
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuButtonClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
};