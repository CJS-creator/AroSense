import React from 'react';
import { Prescription } from '../types';
import { IconPencil, IconTrash, IconPrescription } from '../constants';
import { Button } from './bits';

interface PrescriptionRowProps {
  prescription: Prescription;
  onEdit: (prescription: Prescription) => void;
  onDelete: (prescriptionId: string) => void;
  getMemberName: (memberId: string) => string;
}

export const PrescriptionRow: React.FC<PrescriptionRowProps> = ({ prescription, onEdit, onDelete, getMemberName }) => {
  return (
    <tr className="border-b border-border hover:bg-surface-hover transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
         <div className="flex items-center">
            <IconPrescription className="w-5 h-5 mr-3 text-secondary-DEFAULT flex-shrink-0"/>
            <span className="font-medium">{prescription.medicationName}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{getMemberName(prescription.familyMemberId)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{prescription.dosage}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{prescription.frequency}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{prescription.prescribingDoctor}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{new Date(prescription.startDate).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
         <Button variant="ghost" size="sm" onClick={() => onEdit(prescription)} aria-label="Edit prescription">
            <IconPencil className="w-5 h-5"/>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(prescription.id)} className="text-danger hover:bg-danger/10" aria-label="Delete prescription">
            <IconTrash className="w-5 h-5"/>
        </Button>
      </td>
    </tr>
  );
};