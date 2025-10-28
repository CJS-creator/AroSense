import React, { useState, useEffect } from 'react';
import { Condition } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, Textarea } from './bits';
import { useToast } from './toast/useToast';

interface AddEditConditionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (condition: Omit<Condition, 'id' | 'familyMemberId'>) => void;
    conditionToEdit?: Condition | null;
}

const initialFormState: Omit<Condition, 'id' | 'familyMemberId'> = {
    name: '',
    dateOfDiagnosis: new Date().toISOString().split('T')[0],
    status: 'Active',
    notes: '',
};

export const AddEditConditionModal: React.FC<AddEditConditionModalProps> = ({ isOpen, onClose, onSave, conditionToEdit }) => {
    const [formData, setFormData] = useState(initialFormState);
    const toast = useToast();

    useEffect(() => {
        if (isOpen) {
            if (conditionToEdit) {
                setFormData({
                    name: conditionToEdit.name,
                    dateOfDiagnosis: conditionToEdit.dateOfDiagnosis,
                    status: conditionToEdit.status,
                    notes: conditionToEdit.notes || '',
                });
            } else {
                setFormData(initialFormState);
            }
        }
    }, [isOpen, conditionToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        toast.add(`Condition ${conditionToEdit ? 'updated' : 'added'} successfully!`, 'success');
        onClose();
    };

    const statusOptions = [
        { value: 'Active', label: 'Active' },
        { value: 'Resolved', label: 'Resolved' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{conditionToEdit ? 'Edit Condition' : 'Add New Condition'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Condition Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Seasonal Allergies" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="dateOfDiagnosis">Date of Diagnosis</Label>
                            <Input id="dateOfDiagnosis" name="dateOfDiagnosis" type="date" value={formData.dateOfDiagnosis} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select id="status" name="status" value={formData.status} onChange={handleChange} options={statusOptions} required />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{conditionToEdit ? 'Save Changes' : 'Add Condition'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};