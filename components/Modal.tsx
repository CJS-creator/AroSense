import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 transition-opacity duration-200 ease-out"
      onClick={onClose} // Close on backdrop click
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-surface rounded-xl shadow-2xl w-full ${sizeClasses[size]} p-6 sm:p-8 transform transition-all duration-200 ease-out opacity-0 animate-modalShow overflow-y-auto max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-6">
          <h3 id="modal-title" className="text-2xl font-semibold text-textPrimary">{title}</h3>
          <button
            onClick={onClose}
            className="text-textSecondary hover:text-danger p-1 rounded-full hover:bg-surface-hover transition-colors"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div>{children}</div>
      </div>
      {/* 
        The 'animate-modalShow' class and its keyframes 'modalShow' 
        are defined in `index.html` within the tailwind.config script tag.
        Updated animation properties in tailwind.config.
      */}
    </div>
  );
};