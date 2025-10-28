import React from 'react';
import { Modal } from './Modal';
import { Button } from './common/Button';
import { IconEmergency } from '../constants';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="flex items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
          <IconEmergency className="h-6 w-6 text-danger" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <p className="text-lg font-medium text-textPrimary" id="modal-title">
                {title}
            </p>
            <div className="mt-2">
                <p className="text-sm text-textSecondary">{message}</p>
            </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
        <Button
          type="button"
          variant="danger"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Confirm
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};