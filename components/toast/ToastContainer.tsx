import React from 'react';
import { ToastContext } from './ToastContext';
import { Toast } from './Toast';
import { AnimatePresence } from 'framer-motion';

export const ToastContainer: React.FC = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    return null; // Should not happen if used within ToastProvider
  }

  const { toasts, removeToast } = context;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-end px-4 py-6 space-y-3 pointer-events-none sm:p-6">
      <AnimatePresence initial={false}>
        {toasts.map(toast => (
            <Toast
              key={toast.id}
              toast={toast}
              onDismiss={removeToast}
            />
        ))}
      </AnimatePresence>
    </div>
  );
};