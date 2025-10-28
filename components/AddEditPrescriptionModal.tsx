import React, { useState, useEffect, useMemo } from 'react';
import { Prescription } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, Textarea } from './bits';
// FIX: Replaced incorrect AppContext with specific context hooks.
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFamily } from '../contexts/FamilyContext';
import { useToast } from './toast/useToast';
import { ExpandCollapse } from './animations/ExpandCollapse';

interface AddEditPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescriptionToEdit?: Prescription | null;
}

const initialFormState: Omit<Prescription, 'id' | 'adherence'> = {
  medicationName: '',
  dosage: '',
  frequency: '',
  prescribingDoctor: '',
  pharmacy: '',
  familyMemberId: '',
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  notes: '',
  supplyDays: undefined,
  refillsRemaining: undefined,
  conditionId: '',
};

export const AddEditPrescriptionModal: React.FC<AddEditPrescriptionModalProps> = ({ isOpen, onClose, prescriptionToEdit }) => {
  const [formData, setFormData] = useState<Omit<Prescription, 'id' | 'adherence'>>(initialFormState);
  // FIX: Used specific context hooks to get state.
  const { prescriptions, setPrescriptions, conditions } = useHealthRecords();
  const { familyMembers } = useFamily();
  const toast = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const familyMemberOptions = familyMembers.map(fm => ({ value: fm.id, label: fm.name }));
  if (familyMembers.length === 0) {
     familyMemberOptions.push({value: "", label: "Add a family member first"});
  }

  const conditionOptions = useMemo(() => {
    if (!formData.familyMemberId) return [];
    return conditions
      .filter(c => c.familyMemberId === formData.familyMemberId && c.status === 'Active')
      .map(c => ({ value: c.id, label: c.name }));
  }, [conditions, formData.familyMemberId]);


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
        supplyDays: prescriptionToEdit.supplyDays,
        refillsRemaining: prescriptionToEdit.refillsRemaining,
        conditionId: prescriptionToEdit.conditionId || '',
      });
      if (prescriptionToEdit.supplyDays || prescriptionToEdit.refillsRemaining || prescriptionToEdit.conditionId) {
        setShowAdvanced(true);
      }
    } else {
      // Set default family member if available and not editing
      setFormData({...initialFormState, familyMemberId: familyMembers[0]?.id || ''});
      setShowAdvanced(false);
    }
  }, [prescriptionToEdit, isOpen, familyMembers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number | undefined = value;

    if (name === 'supplyDays' || name === 'refillsRemaining') {
        processedValue = value === '' ? undefined : parseInt(value, 10);
    }

    setFormData(prev => ({ ...prev, [name]: processedValue }));
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
      const newPrescription: Prescription = { ...formData, id: `rx-${Date.now()}`, adherence: {} };
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

                <div className="flex items-center justify-end -mb-2">
                    <button type="button" onClick={() => setShowAdvanced(!showAdvanced)} className="text-sm text-primary-DEFAULT hover:underline font-medium p-1">
                        {showAdvanced ? 'Hide' : 'Show'} advanced options
                    </button>
                </div>

                <ExpandCollapse isExpanded={showAdvanced}>
                    <div className="space-y-4 pt-4 border-t border-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="supplyDays">Supply (Days)</Label>
                                <Input id="supplyDays" name="supplyDays" type="number" value={formData.supplyDays ?? ''} onChange={handleChange} placeholder="e.g., 30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="refillsRemaining">Refills Remaining</Label>
                                <Input id="refillsRemaining" name="refillsRemaining" type="number" value={formData.refillsRemaining ?? ''} onChange={handleChange} placeholder="e.g., 2" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="conditionId">Link to Condition (Optional)</Label>
                            <Select id="conditionId" name="conditionId" value={formData.conditionId} onChange={handleChange} options={conditionOptions} disabled={conditionOptions.length === 0} />
                        </div>
                    </div>
                </ExpandCollapse>


                <DialogFooter className="!pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit" disabled={familyMembers.length === 0 && !prescriptionToEdit}>{prescriptionToEdit ? 'Save Changes' : 'Add Prescription'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
};