import React, { useState, useEffect } from 'react';
import { Prescription } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, Textarea } from './bits';
// FIX: Replaced incorrect AppContext with specific context hooks.
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFamily } from '../contexts/FamilyContext';
import { useToast } from './toast/useToast';

interface AddEditPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptionToEdit?: Prescription | null;
}

const initialFormState: Omit<Prescription, 'id'> = {
  medicationName: '',
  dosage: '',
  frequency: '',
  prescribingDoctor: '',
  pharmacy: '',
  familyMemberId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  notes: '',
};

export const AddEditPrescriptionModal: React.FC<AddEditPrescriptionModalProps> = ({ isOpen, onClose, prescriptionToEdit }) => {
  const [formData, setFormData] = useState<Omit<Prescription, 'id'>>(initialFormState);
  // FIX: Used specific context hooks to get state.
  const { prescriptions, setPrescriptions } = useHealthRecords();
  const { familyMembers } = useFamily();
  const toast = useToast();

  const familyMemberOptions = familyMembers.map(fm => ({ value: fm.id, label: fm.name }));
  if (familyMembers.length === 0) {
     familyMemberOptions.push({value: "", label: "Add a family member first"});
  }


  useEffect(() => {
    if (prescriptionToEdit) {
      setFormData({
        medicationName: prescriptionToEdit.medicationName,
        dosage: prescriptionToEdit.dosage,
        frequency: prescriptionToEdit.frequency,
        prescribingDoctor: prescriptionToEdit.prescribingDoctor,
        pharmacy: prescriptionToEdit.pharmacy || '',
        familyMemberId: prescriptionToEdit.familyMemberId,
        startDate: prescriptionToEdit.startDate,
        endDate: prescriptionToEdit.endDate || '',
        notes: prescriptionToEdit.notes || '',
      });
    } else {
      // Set default family member if available and not editing
      setFormData({...initialFormState, familyMemberId: familyMembers[0]?.id || ''});
    }
  }, [prescriptionToEdit, isOpen, familyMembers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (familyMembers.length === 0) {
        toast.add("Please add a family member before adding a prescription.", 'error');
        return;
    }
    if (!formData.familyMemberId) { 
        toast.add("Please select a family member for the prescription.", 'error');
        return;
    }

    if (prescriptionToEdit) {
      setPrescriptions(prescriptions.map(p => p.id === prescriptionToEdit.id ? { ...prescriptionToEdit, ...formData } : p));
      toast.add('Prescription updated successfully!', 'success');
    } else {
      const newPrescription: Prescription = { ...formData, id: `rx-${Date.now()}` };
      setPrescriptions([...prescriptions, newPrescription]);
      toast.add('Prescription added successfully!', 'success');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>{prescriptionToEdit ? 'Edit Prescription' : 'Add New Prescription'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="medicationName">Medication Name</Label>
                        <Input id="medicationName" name="medicationName" value={formData.medicationName} onChange={handleChange} required placeholder="e.g., Lisinopril, Amoxicillin" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="familyMemberId">Family Member</Label>
                        <Select 
                            id="familyMemberId"
                            name="familyMemberId" 
                            value={formData.familyMemberId} 
                            onChange={handleChange} 
                            options={familyMemberOptions} 
                            required 
                            disabled={familyMembers.length === 0}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dosage">Dosage</Label>
                        <Input id="dosage" name="dosage" value={formData.dosage} onChange={handleChange} required placeholder="e.g., 10mg, 1 tablet, 5ml" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Input id="frequency" name="frequency" value={formData.frequency} onChange={handleChange} required placeholder="e.g., Once a day, Every 6 hours" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="prescribingDoctor">Prescribing Doctor</Label>
                        <Input id="prescribingDoctor" name="prescribingDoctor" value={formData.prescribingDoctor} onChange={handleChange} required placeholder="e.g., Dr. Smith" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="pharmacy">Pharmacy (Optional)</Label>
                        <Input id="pharmacy" name="pharmacy" value={formData.pharmacy} onChange={handleChange} placeholder="e.g., CVS Pharmacy, Walgreens" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="endDate">End Date (Optional)</Label>
                        <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., Take with food, For ear infection, Side effects to watch for" />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={familyMembers.length === 0 && !prescriptionToEdit}>{prescriptionToEdit ? 'Save Changes' : 'Add Prescription'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
};
