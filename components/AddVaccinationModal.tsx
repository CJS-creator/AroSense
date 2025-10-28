import React, { useState, useEffect } from 'react';
import { VaccinationRecord } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Textarea } from './bits';
import { useToast } from './toast/useToast';

interface AddVaccinationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddVaccination: (vaccination: Omit<VaccinationRecord, 'id' | 'familyMemberId'>) => void;
}

const initialFormState = {
    vaccineName: '',
    dateAdministered: new Date().toISOString().split('T')[0],
    notes: '',
};

export const AddVaccinationModal: React.FC<AddVaccinationModalProps> = ({ isOpen, onClose, onAddVaccination }) => {
    const [formData, setFormData] = useState(initialFormState);
    const toast = useToast();

    useEffect(() => {
        // Reset form when modal opens for a new entry
        if (isOpen) {
            setFormData(initialFormState);
        }
    }, [isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        onAddVaccination(formData);
        toast.add('Vaccination record added!', 'success');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Vaccination Record</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="vaccineName">Vaccine Name</Label>
                        <Input id="vaccineName" name="vaccineName" value={formData.vaccineName} onChange={handleChange} required placeholder="e.g. MMR, Tetanus Booster" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="dateAdministered">Date Administered</Label>
                        <Input id="dateAdministered" name="dateAdministered" type="date" value={formData.dateAdministered} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., Administered at City Clinic, slight fever noted." />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Add Record</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};