import React, { useState, useEffect } from 'react';
import { InsurancePolicy } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, Textarea } from './bits';
// FIX: Replaced incorrect AppContext with specific context hooks.
import { useFinancial } from '../contexts/FinancialContext';
import { useFamily } from '../contexts/FamilyContext';
import { useToast } from './toast/useToast';
import { ExpandCollapse } from './animations/ExpandCollapse';

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
    paymentMethod: '',
    copayAmount: undefined,
};

export const AddEditInsuranceModal: React.FC<AddEditInsuranceModalProps> = ({ isOpen, onClose, policyToEdit }) => {
    const [formData, setFormData] = useState<Omit<InsurancePolicy, 'id'>>(initialFormState);
    // FIX: Used specific context hooks to get state.
    const { insurancePolicies, setInsurancePolicies } = useFinancial();
    const { familyMembers } = useFamily();
    const toast = useToast();
    const [showAdvanced, setShowAdvanced] = useState(false);

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
                paymentMethod: policyToEdit.paymentMethod || '',
                copayAmount: policyToEdit.copayAmount,
            });
            if (policyToEdit.groupNumber || policyToEdit.expirationDate || policyToEdit.coverageDetails || policyToEdit.copayAmount || policyToEdit.paymentMethod) {
                setShowAdvanced(true);
            } else {
                setShowAdvanced(false);
            }
        } else {
            setFormData({...initialFormState, memberId: familyMembers[0]?.id || ''});
            setShowAdvanced(false);
        }
    }, [policyToEdit, isOpen, familyMembers]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'copayAmount') {
            setFormData(prev => ({ ...prev, copayAmount: value === '' ? undefined : parseFloat(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
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
                    <div className="space-y-2">
                        <Label htmlFor="policyNumber">Policy Number</Label>
                        <Input id="policyNumber" name="policyNumber" value={formData.policyNumber} onChange={handleChange} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="effectiveDate">Effective Date</Label>
                        <Input id="effectiveDate" name="effectiveDate" type="date" value={formData.effectiveDate} onChange={handleChange} required />
                    </div>
                    
                    <div className="flex items-center justify-end -mb-2">
                        <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-primary-DEFAULT hover:underline font-medium p-1">
                            {showAdvanced ? 'Hide' : 'Show'} advanced options
                        </button>
                    </div>

                    <ExpandCollapse isExpanded={showAdvanced}>
                        <div className="space-y-4 pt-4 border-t border-border">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                <div className="space-y-2">
                                    <Label htmlFor="groupNumber">Group Number (Optional)</Label>
                                    <Input id="groupNumber" name="groupNumber" value={formData.groupNumber} onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="expirationDate">Expiration Date (Optional)</Label>
                                    <Input id="expirationDate" name="expirationDate" type="date" value={formData.expirationDate || ''} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                <div className="space-y-2">
                                    <Label htmlFor="copayAmount">Copay Amount ($) (Optional)</Label>
                                    <Input id="copayAmount" name="copayAmount" type="number" min="0" step="0.01" value={formData.copayAmount ?? ''} onChange={handleChange} placeholder="e.g., 25.00" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="paymentMethod">Payment Method (Optional)</Label>
                                    <Input id="paymentMethod" name="paymentMethod" value={formData.paymentMethod || ''} onChange={handleChange} placeholder="e.g., HSA Card" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="coverageDetails">Coverage Details (Optional)</Label>
                                <Textarea id="coverageDetails" name="coverageDetails" value={formData.coverageDetails || ''} onChange={handleChange} placeholder="e.g., PPO Plan, $500 deductible" />
                            </div>
                        </div>
                    </ExpandCollapse>

                    <DialogFooter className="!pt-4">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{policyToEdit ? 'Save Changes' : 'Add Policy'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};