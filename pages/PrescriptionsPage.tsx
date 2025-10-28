import React, { useState, useCallback, useMemo } from 'react';
import { AddEditPrescriptionModal } from '../components/AddEditPrescriptionModal';
import { Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select } from '../components/bits';
import { IconPlus, IconPrescription } from '../constants';
import { Prescription } from '../types';
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFamily } from '../contexts/FamilyContext';
import { useToast } from '../components/toast/useToast';
import { PrescriptionCard } from '../components/PrescriptionCard';
import { SlideInList } from '../components/animations/SlideInList';

export const PrescriptionsPage: React.FC = () => {
  const { prescriptions, setPrescriptions } = useHealthRecords();
  const { familyMembers, getMemberName } = useFamily();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMember, setFilterMember] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [rxToDelete, setRxToDelete] = useState<string | null>(null);
  const toast = useToast();

  const familyMemberOptions = useMemo(() => {
    const options = familyMembers.map(fm => ({ value: fm.id, label: fm.name }));
    options.unshift({ value: "", label: "All Members" });
    return options;
  }, [familyMembers]);

  const handleAddPrescription = useCallback(() => {
    setEditingPrescription(null);
    setIsModalOpen(true);
  }, []);

  const handleEditPrescription = useCallback((rx: Prescription) => {
    setEditingPrescription(rx);
    setIsModalOpen(true);
  }, []);

  const requestDeletePrescription = useCallback((rxId: string) => {
    setRxToDelete(rxId);
    setIsConfirmOpen(true);
  }, []);

  const confirmDeletePrescription = useCallback(() => {
    if (rxToDelete) {
      setPrescriptions(prevRx => prevRx.filter(r => r.id !== rxToDelete));
      toast.add('Prescription deleted.', 'success');
    }
    setRxToDelete(null);
    setIsConfirmOpen(false);
  }, [rxToDelete, setPrescriptions, toast]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingPrescription(null);
  }, []);

  const handleUpdateAdherence = useCallback((prescriptionId: string, date: string, status: 'taken' | 'skipped') => {
    setPrescriptions(prev => prev.map(rx => {
      if (rx.id === prescriptionId) {
        const newAdherence = { ...(rx.adherence || {}) };
        if (newAdherence[date] === status) {
          delete newAdherence[date]; // Toggle off
        } else {
          newAdherence[date] = status;
        }
        return { ...rx, adherence: newAdherence };
      }
      return rx;
    }));
  }, [setPrescriptions]);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(rx => {
      const memberName = getMemberName(rx.familyMemberId);
      const matchesSearchTerm = rx.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                rx.prescribingDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                memberName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMember = filterMember ? rx.familyMemberId === filterMember : true;
      return matchesSearchTerm && matchesMember;
    });
  }, [prescriptions, searchTerm, filterMember, getMemberName]);


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-textPrimary">Prescriptions</h1>
        <Button onClick={handleAddPrescription} leftIcon={<IconPlus className="w-5 h-5" />}>
          Add Prescription
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
            <div className="md:flex md:items-end md:gap-4 space-y-4 md:space-y-0">
                <div className="flex-grow space-y-2">
                    <Label htmlFor="search-rx">Search Prescriptions</Label>
                    <Input 
                        id="search-rx"
                        placeholder="Medication, doctor, member..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="md:w-1/3 space-y-2">
                    <Label htmlFor="filter-rx-member">Filter by Member</Label>
                    <Select 
                        id="filter-rx-member"
                        options={familyMemberOptions}
                        value={filterMember} 
                        onChange={(e) => setFilterMember(e.target.value)}
                    />
                </div>
            </div>
        </CardContent>
      </Card>

      {filteredPrescriptions.length === 0 ? (
        <Card className="text-center py-16">
            <CardContent className="flex flex-col items-center">
                <IconPrescription className="w-24 h-24 text-textSecondary/50 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-textPrimary mb-2">No Prescriptions Found</h3>
                <p className="text-textSecondary mb-6">Try adjusting your search or add a new prescription.</p>
                <Button onClick={handleAddPrescription} leftIcon={<IconPlus className="w-5 h-5" />} size="lg">
                    Add New Prescription
                </Button>
            </CardContent>
        </Card>
      ) : (
        <SlideInList className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          {filteredPrescriptions.map((rx) => (
            <PrescriptionCard 
              key={rx.id}
              prescription={rx}
              onEdit={handleEditPrescription}
              onDelete={requestDeletePrescription}
              onUpdateAdherence={handleUpdateAdherence}
            />
          ))}
        </SlideInList>
      )}

      <AddEditPrescriptionModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        prescriptionToEdit={editingPrescription} 
      />
       <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Prescription</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to permanently delete this prescription record? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={confirmDeletePrescription}>Delete</Button>
                </DialogFooter>
            </DialogContent>
       </Dialog>
    </div>
  );
};