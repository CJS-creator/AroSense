import React from 'react';
import { InsurancePolicy } from '../types';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from './bits';
import { IconPencil, IconTrash, IconShieldCheck } from '../constants';

interface InsurancePolicyCardProps {
    policy: InsurancePolicy;
    memberName: string;
    onEdit: (policy: InsurancePolicy) => void;
    onDelete: (policyId: string) => void;
}

export const InsurancePolicyCard: React.FC<InsurancePolicyCardProps> = ({ policy, memberName, onEdit, onDelete }) => {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <IconShieldCheck className="w-8 h-8 text-primary-DEFAULT mt-1 flex-shrink-0" />
                <div className="flex-grow">
                    <CardTitle className="text-lg">{policy.providerName}</CardTitle>
                    <p className="text-sm font-medium text-primary-dark dark:text-primary-light">{memberName}</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm flex-grow">
                <div className="flex justify-between">
                    <span className="text-textSecondary">Policy #:</span>
                    <span className="font-mono text-textPrimary">{policy.policyNumber}</span>
                </div>
                {policy.groupNumber && (
                    <div className="flex justify-between">
                        <span className="text-textSecondary">Group #:</span>
                        <span className="font-mono text-textPrimary">{policy.groupNumber}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span className="text-textSecondary">Effective:</span>
                    <span className="font-medium text-textPrimary">{new Date(policy.effectiveDate).toLocaleDateString()}</span>
                </div>
                 {policy.coverageDetails && (
                    <p className="text-xs text-textSecondary mt-3 pt-3 border-t border-border line-clamp-2">
                        {policy.coverageDetails}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(policy)} leftIcon={<IconPencil className="w-4 h-4" />}>
                    Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(policy.id)} leftIcon={<IconTrash className="w-4 h-4" />}>
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
};