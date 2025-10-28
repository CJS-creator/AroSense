import React from 'react';
import { useToast } from './useToast';
import { ToastContext } from './ToastContext';
import { Toast } from './Toast';

export const ToastContainer: React.FC = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    return null; // Should not happen if used within ToastProvider
  }

  const { toasts, removeToast } = context;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-end px-4 py-6 space-y-3 pointer-events-none sm:p-6">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            toast={toast}
            onDismiss={removeToast}
          />
        </div>
      ))}
    </div>
  );
};
