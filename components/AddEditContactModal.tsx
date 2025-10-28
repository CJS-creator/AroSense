import React, { useState, useEffect } from 'react';
import { EmergencyContact } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label } from './bits';
import { useSettings } from '../contexts/SettingsContext';
import { useToast } from './toast/useToast';

interface AddEditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactToEdit?: EmergencyContact | null;
}

const initialFormState: Omit<EmergencyContact, 'id'> = {
  name: '',
  phone: '',
  relationship: '',
};

export const AddEditContactModal: React.FC<AddEditContactModalProps> = ({ isOpen, onClose, contactToEdit }) => {
  const [formData, setFormData] = useState<Omit<EmergencyContact, 'id'>>(initialFormState);
  const { emergencyContacts, setEmergencyContacts } = useSettings();
  const toast = useToast();

  useEffect(() => {
    if (contactToEdit) {
      setFormData(contactToEdit);
    } else {
      setFormData(initialFormState);
    }
  }, [contactToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (contactToEdit) {
      setEmergencyContacts(emergencyContacts.map(c => c.id === contactToEdit.id ? { ...contactToEdit, ...formData } : c));
      toast.add('Contact updated successfully!', 'success');
    } else {
      const newContact: EmergencyContact = { ...formData, id: `ec-${Date.now()}` };
      setEmergencyContacts([...emergencyContacts, newContact]);
      toast.add('Contact added successfully!', 'success');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>{contactToEdit ? 'Edit Emergency Contact' : 'Add Emergency Contact'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input id="relationship" name="relationship" value={formData.relationship} onChange={handleChange} required placeholder="e.g., Neighbor, Doctor, Sibling"/>
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{contactToEdit ? 'Save Changes' : 'Add Contact'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
};