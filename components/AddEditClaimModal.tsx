import React, { useState, useEffect, useMemo } from 'react';
import { InsuranceClaim } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, Textarea } from './bits';
import { useToast } from './toast/useToast';
import { useFinancial } from '../contexts/FinancialContext';

interface AddEditClaimModalProps {
    isOpen: boolean;
    onClose: () => void;
    claimToEdit?: InsuranceClaim | null;
}

const initialFormState: Omit<InsuranceClaim, 'id'> = {
    billId: '',
    policyId: '',
    claimNumber: '',
    submissionDate: new Date().toISOString().split('T')[0],
    status: 'Submitted',
    amountCovered: undefined,
    notes: '',
};

export const AddEditClaimModal: React.FC<AddEditClaimModalProps> = ({ isOpen, onClose, claimToEdit }) => {
    const [formData, setFormData] = useState<Omit<InsuranceClaim, 'id'>>(initialFormState);
    const { claims, setClaims, bills, insurancePolicies } = useFinancial();
    const toast = useToast();

    useEffect(() => {
        if (claimToEdit) {
            setFormData({
                ...claimToEdit,
                amountCovered: claimToEdit.amountCovered ?? undefined,
            });
        } else {
            setFormData(initialFormState);
        }
    }, [claimToEdit, isOpen]);

    const billOptions = useMemo(() => bills.map(b => ({
        value: b.id,
        label: `${b.serviceProvider} - $${b.amountDue.toFixed(2)} on ${new Date(b.serviceDate).toLocaleDateString()}`
    })), [bills]);

    const policyOptions = useMemo(() => insurancePolicies.map(p => ({
        value: p.id,
        label: `${p.providerName} (${p.policyNumber})`
    })), [insurancePolicies]);
    
    const statusOptions = [
        { value: 'Submitted', label: 'Submitted' },
        { value: 'Processing', label: 'Processing' },
        { value: 'Approved', label: 'Approved' },
        { value: 'Denied', label: 'Denied' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'amountCovered') {
            setFormData(prev => ({ ...prev, amountCovered: value === '' ? undefined : parseFloat(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.billId || !formData.policyId) {
            toast.add("Please select a bill and an insurance policy.", 'error');
            return;
        }

        if (claimToEdit) {
            setClaims(claims.map(c => c.id === claimToEdit.id ? { ...claimToEdit, ...formData } : c));
            toast.add('Claim updated successfully!', 'success');
        } else {
            const newClaim: InsuranceClaim = { ...formData, id: `claim-${Date.now()}` };
            setClaims([...claims, newClaim]);
            toast.add('Claim added successfully!', 'success');
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{claimToEdit ? 'Edit Insurance Claim' : 'Add Insurance Claim'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="billId">Associated Bill</Label>
                        <Select id="billId" name="billId" value={formData.billId} onChange={handleChange} options={billOptions} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="policyId">Insurance Policy</Label>
                        <Select id="policyId" name="policyId" value={formData.policyId} onChange={handleChange} options={policyOptions} required />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="claimNumber">Claim Number</Label>
                            <Input id="claimNumber" name="claimNumber" value={formData.claimNumber} onChange={handleChange} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="submissionDate">Submission Date</Label>
                            <Input id="submissionDate" name="submissionDate" type="date" value={formData.submissionDate} onChange={handleChange} required />
                        </div>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select id="status" name="status" value={formData.status} onChange={handleChange} options={statusOptions} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amountCovered">Amount Covered ($)</Label>
                            <Input id="amountCovered" name="amountCovered" type="number" min="0" step="0.01" value={formData.amountCovered ?? ''} onChange={handleChange} placeholder="e.g., 120.50" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{claimToEdit ? 'Save Changes' : 'Add Claim'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
