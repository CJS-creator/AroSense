import React, { useState, useCallback, useMemo } from 'react';
import { PrescriptionRow } from '../components/PrescriptionRow';
import { AddEditPrescriptionModal } from '../components/AddEditPrescriptionModal';
import { Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select } from '../components/bits';
import { IconPlus, IconPrescription } from '../constants';
import { Prescription } from '../types';
// FIX: Replaced incorrect AppContext with specific context hooks.
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFamily } from '../contexts/FamilyContext';
import { useToast } from '../components/toast/useToast';

export const PrescriptionsPage: React.FC = () => {
  // FIX: Used specific context hooks to get state.
  const { prescriptions, setPrescriptions } = useHealthRecords();
  const { familyMembers } = useFamily();
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

  const getMemberName = useCallback((memberId: string): string => {
    const member = familyMembers.find(fm => fm.id === memberId);
    return member ? member.name : 'Unknown Member';
  }, [familyMembers]);

  const filteredPrescriptions = useMemo(() => {
    return prescriptions.filter(rx => {
      const member = familyMembers.find(fm => fm.id === rx.familyMemberId);
      const memberName = member ? member.name : '';
      const matchesSearchTerm = rx.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                rx.prescribingDoctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                memberName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMember = filterMember ? rx.familyMemberId === filterMember : true;
      return matchesSearchTerm && matchesMember;
    });
  }, [prescriptions, searchTerm, filterMember, familyMembers]);


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
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
                <thead className="bg-surface-soft">
                <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Medication</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Member</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Dosage</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Frequency</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Doctor</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Start Date</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
                </thead>
                <tbody className="bg-surface divide-y divide-border">
                {filteredPrescriptions.map((rx) => (
                    <PrescriptionRow 
                    key={rx.id} 
                    prescription={rx} 
                    onEdit={handleEditPrescription} 
                    onDelete={requestDeletePrescription}
                    getMemberName={getMemberName}
                    />
                ))}
                </tbody>
            </table>
          </div>
        </Card>
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
