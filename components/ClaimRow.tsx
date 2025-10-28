import React from 'react';
import { InsuranceClaim } from '../types';
import { Button, cn } from './bits';
import { IconPencil, IconTrash } from '../constants';

interface ClaimRowProps {
    claim: InsuranceClaim;
    onEdit: (claim: InsuranceClaim) => void;
    onDelete: (claimId: string) => void;
    billProvider: string;
    policyProvider: string;
}

const statusClasses: { [key in InsuranceClaim['status']]: string } = {
    Submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Approved: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Denied: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
};

export const ClaimRow: React.FC<ClaimRowProps> = ({ claim, onEdit, onDelete, billProvider, policyProvider }) => {
    return (
        <tr className="border-b border-border hover:bg-surface-hover transition-colors">
            <td className="px-4 py-4 whitespace-nowrap text-sm">
                <span className={cn("px-2.5 py-0.5 text-xs font-semibold rounded-full", statusClasses[claim.status])}>
                    {claim.status}
                </span>
            </td>
            <td className="px-4 py-4 whitespace-nowrap text-sm font-mono text-textPrimary">{claim.claimNumber}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-textSecondary">{billProvider}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-textSecondary">{new Date(claim.submissionDate).toLocaleDateString()}</td>
            <td className="px-4 py-4 whitespace-nowrap text-sm text-textSecondary">{policyProvider}</td>
            <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                 <Button variant="ghost" size="sm" onClick={() => onEdit(claim)} aria-label="Edit claim">
                    <IconPencil className="w-5 h-5"/>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(claim.id)} className="text-danger hover:bg-danger/10" aria-label="Delete claim">
                    <IconTrash className="w-5 h-5"/>
                </Button>
            </td>
        </tr>
    );
};
