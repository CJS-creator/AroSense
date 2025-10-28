import React, { useState, useEffect } from 'react';
import { InsurancePolicy } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, Textarea } from './bits';
// FIX: Replaced incorrect AppContext with specific context hooks.
import { useFinancial } from '../contexts/FinancialContext';
import { useFamily } from '../contexts/FamilyContext';
import { useToast } from './toast/useToast';

interface AddEditInsuranceModalProps {
    isOpen: boolean;
    onClose: () => void;
    policyToEdit?: InsurancePolicy | null;
}

const initialFormState: Omit<InsurancePolicy, 'id'> = {
    providerName: '',
    policyNumber: '',
    groupNumber: '',
    memberId: '',
    coverageDetails: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expirationDate: '',
};

export const AddEditInsuranceModal: React.FC<AddEditInsuranceModalProps> = ({ isOpen, onClose, policyToEdit }) => {
    const [formData, setFormData] = useState<Omit<InsurancePolicy, 'id'>>(initialFormState);
    // FIX: Used specific context hooks to get state.
    const { insurancePolicies, setInsurancePolicies } = useFinancial();
    const { familyMembers } = useFamily();
    const toast = useToast();

    const familyMemberOptions = familyMembers.map(fm => ({ value: fm.id, label: fm.name }));

    useEffect(() => {
        if (policyToEdit) {
            setFormData({
                providerName: policyToEdit.providerName,
                policyNumber: policyToEdit.policyNumber,
                groupNumber: policyToEdit.groupNumber || '',
                memberId: policyToEdit.memberId,
                coverageDetails: policyToEdit.coverageDetails || '',
                effectiveDate: policyToEdit.effectiveDate,
                expirationDate: policyToEdit.expirationDate || '',
            });
        } else {
            setFormData({...initialFormState, memberId: familyMembers[0]?.id || ''});
        }
    }, [policyToEdit, isOpen, familyMembers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.memberId) {
            toast.add('Please select a family member.', 'error');
            return;
        }

        if (policyToEdit) {
            setInsurancePolicies(insurancePolicies.map(p => p.id === policyToEdit.id ? { ...policyToEdit, ...formData } : p));
            toast.add('Policy updated successfully!', 'success');
        } else {
            const newPolicy: InsurancePolicy = { ...formData, id: `ins-${Date.now()}` };
            setInsurancePolicies([...insurancePolicies, newPolicy]);
            toast.add('Policy added successfully!', 'success');
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{policyToEdit ? 'Edit Insurance Policy' : 'Add Insurance Policy'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="providerName">Provider Name</Label>
                        <Input id="providerName" name="providerName" value={formData.providerName} onChange={handleChange} required placeholder="e.g., Blue Shield, Delta Dental" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="memberId">Family Member</Label>
                        <Select 
                            id="memberId"
                            name="memberId" 
                            value={formData.memberId} 
                            onChange={handleChange} 
                            options={familyMemberOptions} 
                            required 
                            disabled={familyMembers.length === 0}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <div className="space-y-2">
                            <Label htmlFor="policyNumber">Policy Number</Label>
                            <Input id="policyNumber" name="policyNumber" value={formData.policyNumber} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="groupNumber">Group Number (Optional)</Label>
                            <Input id="groupNumber" name="groupNumber" value={formData.groupNumber} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="effectiveDate">Effective Date</Label>
                            <Input id="effectiveDate" name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                            <Input id="expirationDate" name="expirationDate" type="date" value={formData.expirationDate} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="coverageDetails">Coverage Details (Optional)</Label>
                        <Textarea id="coverageDetails" name="coverageDetails" value={formData.coverageDetails} onChange={handleChange} placeholder="e.g., PPO Plan, $500 deductible" />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{policyToEdit ? 'Save Changes' : 'Add Policy'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
