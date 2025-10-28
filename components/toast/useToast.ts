import { useContext } from 'react';
import { ToastContext } from './ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  // Return a stable function reference for addToast
  const { addToast } = context;
  const toast = {
      add: addToast
  };

  return toast;
};
