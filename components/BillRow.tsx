import React from 'react';
import { Bill } from '../types';
import { Button, Toggle } from './bits';
import { IconPencil, IconTrash } from '../constants';
import { motion } from 'framer-motion';

interface BillRowProps {
    bill: Bill;
    onEdit: (bill: Bill) => void;
    onDelete: (billId: string) => void;
    onStatusChange: (bill: Bill, isPaid: boolean) => void;
}

export const BillRow: React.FC<BillRowProps> = ({ bill, onEdit, onDelete, onStatusChange }) => {
    return (
        <motion.tr
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="border-b border-border hover:bg-surface-hover transition-colors"
        >
            <td className="px-4 py-4 whitespace-nowrap">
                <Toggle 
                    pressed={bill.isPaid} 
                    onPressedChange={(pressed) => onStatusChange(bill, pressed)}
                    aria-label={`Mark bill from ${bill.serviceProvider} as ${bill.isPaid ? 'unpaid' : 'paid'}`}
                />
            </td>
            <td className="px-4 py-4 text-sm text-textPrimary">
                <div className="font-medium">{bill.serviceProvider}</div>
                {bill.notes && <div className="text-xs text-textSecondary italic truncate max-w-xs" title={bill.notes}>{bill.notes}</div>}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-textPrimary">${bill.amountDue.toFixed(2)}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-textSecondary">{new Date(bill.dueDate).toLocaleDateString()}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-textSecondary">
                {bill.paymentDate ? new Date(bill.paymentDate).toLocaleDateString() : '—'}
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                <Button variant="ghost" size="sm" onClick={() => onEdit(bill)} aria-label="Edit bill">
                    <IconPencil className="w-5 h-5"/>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(bill.id)} className="text-danger hover:bg-danger/10" aria-label="Delete bill">
                    <IconTrash className="w-5 h-5"/>
                </Button>
            </td>
        </motion.tr>
    );
};