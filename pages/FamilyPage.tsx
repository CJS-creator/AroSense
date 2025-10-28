import React, { useState, useCallback } from 'react';
import { FamilyMemberCard } from '../components/FamilyMemberCard';
import { AddEditFamilyMemberModal } from '../components/AddEditFamilyMemberModal';
import { Button } from '../components/bits/Button';
import { IconPlus, IconFamily } from '../constants'; 
import { FamilyMember } from '../types';
// FIX: Replaced incorrect AppContext with useFamily hook.
import { useFamily } from '../contexts/FamilyContext';
import { useToast } from '../components/toast/useToast';
import { Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle as DTitle } from '../components/bits';


export const FamilyPage: React.FC = () => {
  // FIX: Used the useFamily hook to correctly get family state.
  const { familyMembers, setFamilyMembers } = useFamily();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const toast = useToast();

  const handleAddMember = useCallback(() => {
    setEditingMember(null);
    setIsModalOpen(true);
  }, []);

  const handleEditMember = useCallback((member: FamilyMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  }, []);

  const requestDeleteMember = useCallback((memberId: string) => {
    setMemberToDelete(memberId);
    setIsConfirmOpen(true);
  }, []);
  
  const confirmDeleteMember = useCallback(() => {
    if (memberToDelete) {
      setFamilyMembers(prevMembers => prevMembers.filter(m => m.id !== memberToDelete));
      toast.add('Family member deleted.', 'success');
    }
    setMemberToDelete(null);
    setIsConfirmOpen(false);
  }, [memberToDelete, setFamilyMembers, toast]);


  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingMember(null);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-textPrimary">Family Members</h1>
          <p className="text-textSecondary mt-1">Manage profiles for everyone in your family.</p>
        </div>
        <Button onClick={handleAddMember} leftIcon={<IconPlus className="w-5 h-5" />}>
          Add Member
        </Button>
      </div>

      {familyMembers.length === 0 ? (
        <Card className="text-center py-16">
            <CardHeader>
                <IconFamily className="w-24 h-24 text-textSecondary/50 mx-auto mb-6" />
                <CardTitle className="text-xl">No Family Members Yet</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-textSecondary mb-6">Start building your family health hub by adding your first member.</p>
                <Button onClick={handleAddMember} leftIcon={<IconPlus className="w-5 h-5" />} size="lg">
                    Add First Member
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {familyMembers.map((member) => (
            <FamilyMemberCard 
              key={member.id} 
              member={member} 
              onEdit={handleEditMember} 
              onDelete={requestDeleteMember} 
            />
          ))}
        </div>
      )}

      <AddEditFamilyMemberModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        memberToEdit={editingMember} 
      />
      
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
            <DialogHeader>
                <DTitle>Delete Family Member</DTitle>
                <DialogDescription>
                    Are you sure you want to delete this family member? This will also remove their association from all documents and prescriptions. This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDeleteMember}>Delete</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
