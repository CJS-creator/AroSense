import React, { useState, useEffect } from 'react';
import { FamilyMember, Relationship } from '../types';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Textarea, Select, Label } from './bits';
import { RelationshipOptions } from '../constants';
// FIX: Replaced incorrect AppContext with useFamily hook.
import { useFamily } from '../contexts/FamilyContext';
import { useToast } from './toast/useToast';

interface AddEditFamilyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: FamilyMember | null;
}

const initialFormState: Omit<FamilyMember, 'id' | 'profilePhotoUrl'> = {
  name: '',
  dateOfBirth: '',
  relationship: Relationship.CHILD,
  medicalHistorySummary: '',
  bloodType: '',
  allergies: [],
};

export const AddEditFamilyMemberModal: React.FC<AddEditFamilyMemberModalProps> = ({ isOpen, onClose, memberToEdit }) => {
  const [formData, setFormData] = useState<Omit<FamilyMember, 'id' | 'profilePhotoUrl'>>(initialFormState);
  const [currentAllergy, setCurrentAllergy] = useState('');
  // FIX: Used the useFamily hook to correctly get family state.
  const { familyMembers, setFamilyMembers } = useFamily();
  const toast = useToast();

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        name: memberToEdit.name,
        dateOfBirth: memberToEdit.dateOfBirth,
        relationship: memberToEdit.relationship,
        medicalHistorySummary: memberToEdit.medicalHistorySummary,
        bloodType: memberToEdit.bloodType || '',
        allergies: memberToEdit.allergies || [],
      });
    } else {
      setFormData(initialFormState);
    }
    setCurrentAllergy('');
  }, [memberToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const addAllergies = (allergiesToAdd: string[]) => {
    const newAllergies = allergiesToAdd
      .map(a => a.trim())
      .filter(a => a.length > 0);
    
    if (newAllergies.length === 0) return;

    setFormData(prev => {
      const existingAllergies = prev.allergies || [];
      const uniqueNewAllergies = newAllergies.filter(a => !existingAllergies.includes(a));
      if (uniqueNewAllergies.length === 0) return prev;
      
      return { ...prev, allergies: [...existingAllergies, ...uniqueNewAllergies] };
    });
  };

  const handleAddAllergy = () => {
    if (currentAllergy) {
      addAllergies([currentAllergy]);
      setCurrentAllergy('');
    }
  };

  const handleRemoveAllergy = (allergyToRemove: string) => {
    setFormData(prev => ({ ...prev, allergies: (prev.allergies || []).filter(a => a !== allergyToRemove) }));
  };

  const handleAllergyInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddAllergy();
    }
  };

  const handleAllergyInputPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const allergiesFromPaste = pastedText.split(/,|\n/).map(s => s.trim()).filter(Boolean);
    addAllergies(allergiesFromPaste);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (memberToEdit) {
      setFamilyMembers(familyMembers.map(m => m.id === memberToEdit.id ? { ...memberToEdit, ...formData } : m));
      toast.add('Family member updated successfully!', 'success');
    } else {
      const newMember: FamilyMember = { ...formData, id: `fm-${Date.now()}` };
      setFamilyMembers([...familyMembers, newMember]);
      toast.add('Family member added successfully!', 'success');
    }
    onClose();
  };
  
  const relationshipEnumOptions = RelationshipOptions.map(r => ({ value: r, label: r }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{memberToEdit ? 'Edit Family Member' : 'Add Family Member'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="relationship">Relationship</Label>
                        <Select id="relationship" name="relationship" value={formData.relationship} onChange={handleChange} options={relationshipEnumOptions} required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="bloodType">Blood Type (Optional)</Label>
                        <Input id="bloodType" name="bloodType" value={formData.bloodType} onChange={handleChange} placeholder="e.g. A+" />
                    </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <div className="flex gap-2">
                    <Input id="allergies" name="allergies" value={currentAllergy} onChange={(e) => setCurrentAllergy(e.target.value)} placeholder="Type allergy and press Enter" onKeyDown={handleAllergyInputKeyDown} onPaste={handleAllergyInputPaste} />
                    <Button type="button" variant="outline" onClick={handleAddAllergy}>Add</Button>
                  </div>
                   {formData.allergies && formData.allergies.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-border">
                      {formData.allergies.map(allergy => (
                        <span key={allergy} className="group flex items-center gap-x-2 rounded-full bg-primary-light/20 px-3 py-1.5 text-sm font-medium text-primary-dark dark:text-primary-light transition-colors">
                          {allergy}
                          <button type="button" onClick={() => handleRemoveAllergy(allergy)} aria-label={`Remove ${allergy}`} className="flex items-center justify-center w-4 h-4 rounded-full bg-black/10 text-primary-dark opacity-70 group-hover:opacity-100 group-hover:bg-black/20 dark:bg-white/20 dark:text-primary-light dark:hover:bg-white/30 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="medicalHistorySummary">Medical History Summary</Label>
                    <Textarea id="medicalHistorySummary" name="medicalHistorySummary" value={formData.medicalHistorySummary} required placeholder="Brief summary of key medical conditions, past surgeries, etc." />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{memberToEdit ? 'Save Changes' : 'Add Member'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
};
