import React, { useState } from 'react';
import { VitalSign } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Textarea } from './bits';
import { useToast } from './toast/useToast';

interface AddVitalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddVital: (vital: Omit<VitalSign, 'id' | 'familyMemberId'>) => void;
}

export const AddVitalModal: React.FC<AddVitalModalProps> = ({ isOpen, onClose, onAddVital }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        heightCm: '',
        weightKg: '',
        bloodPressure: '',
        heartRate: '',
        notes: '',
    });
    const toast = useToast();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newVital = {
            date: formData.date,
            heightCm: formData.heightCm ? parseFloat(formData.heightCm) : undefined,
            weightKg: formData.weightKg ? parseFloat(formData.weightKg) : undefined,
            bloodPressure: formData.bloodPressure || undefined,
            heartRate: formData.heartRate ? parseInt(formData.heartRate) : undefined,
            notes: formData.notes || undefined,
        };
        
        onAddVital(newVital);
        toast.add('Vitals logged successfully!', 'success');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Log New Vitals</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="heightCm">Height (cm)</Label>
                            <Input id="heightCm" name="heightCm" type="number" value={formData.heightCm} onChange={handleChange} placeholder="e.g. 175" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="weightKg">Weight (kg)</Label>
                            <Input id="weightKg" name="weightKg" type="number" value={formData.weightKg} onChange={handleChange} placeholder="e.g. 70.5" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="bloodPressure">Blood Pressure</Label>
                            <Input id="bloodPressure" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} placeholder="e.g. 120/80" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                            <Input id="heartRate" name="heartRate" type="number" value={formData.heartRate} onChange={handleChange} placeholder="e.g. 65" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Log Vitals</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};