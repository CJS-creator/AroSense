import React, { useEffect, useState } from 'react';
import { ToastMessage, ToastType } from './ToastContext';
import { IconCheckCircle, IconExclamationTriangle, IconEmergency } from '../../constants';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const toastConfig: { [key in ToastType]: { icon: React.ReactNode; bgClass: string; textClass: string; } } = {
  success: {
    icon: <IconCheckCircle className="w-6 h-6" />,
    bgClass: 'bg-green-50 dark:bg-green-900/50',
    textClass: 'text-green-500',
  },
  error: {
    icon: <IconEmergency className="w-6 h-6" />,
    bgClass: 'bg-red-50 dark:dark:bg-red-900/50',
    textClass: 'text-danger',
  },
  info: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
      </svg>
    ),
    bgClass: 'bg-blue-50 dark:bg-blue-900/50',
    textClass: 'text-blue-500',
  },
  warning: {
    icon: <IconExclamationTriangle className="w-6 h-6" />,
    bgClass: 'bg-yellow-50 dark:bg-yellow-900/50',
    textClass: 'text-yellow-500',
  },
};

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const { id, message, type } = toast;
  const [isExiting, setIsExiting] = useState(false);

  const config = toastConfig[type];

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => onDismiss(id), 300); // Wait for animation to finish
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, onDismiss]);

  return (
    <div
      className={`w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 border border-border/50 animate-toastIn ${isExiting ? 'animate-toastOut' : ''} ${config.bgClass}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${config.textClass}`}>{config.icon}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-textPrimary">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleDismiss}
              className="inline-flex rounded-md bg-transparent text-textSecondary hover:text-textPrimary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-DEFAULT"
            >
              <span className="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};