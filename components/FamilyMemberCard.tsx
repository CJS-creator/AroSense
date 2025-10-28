
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FamilyMember } from '../types';
import { IconPencil, IconTrash } from '../constants';
import { Button, CardContent, CardFooter, CardHeader } from './bits';
import { HoverCard } from './animations/HoverCard';
import { AnimatedAvatar } from './animations/AnimatedAvatar';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onEdit: (member: FamilyMember) => void;
  onDelete: (memberId: string) => void;
}

export const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({ member, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/family/${member.id}`);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(member);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(member.id);
  };

  return (
    <HoverCard 
      className="flex flex-col cursor-pointer h-full"
      onClick={handleNavigate}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigate()}
    >
      <CardHeader className="items-center pt-6">
        <AnimatedAvatar 
          src={member.profilePhotoUrl || `https://i.pravatar.cc/120?u=${member.id}`} 
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-primary-light"
        />
      </CardHeader>
      <CardContent className="flex-grow text-left">
        <h3 className="text-xl font-semibold text-textPrimary text-center">{member.name}</h3>
        <p className="text-sm text-primary-dark dark:text-primary-light font-medium text-center mb-4">{member.relationship}</p>
        
        <div className="space-y-2 text-sm border-t border-border pt-4">
            <div className="flex justify-between">
                <span className="text-textSecondary font-medium">Birthday:</span>
                <span className="font-semibold text-textPrimary">{new Date(member.dateOfBirth).toLocaleDateString()}</span>
            </div>
            {member.bloodType && (
                 <div className="flex justify-between">
                    <span className="text-textSecondary font-medium">Blood Type:</span>
                    <span className="font-semibold text-textPrimary">{member.bloodType}</span>
                </div>
            )}
        </div>
        
        {member.medicalHistorySummary && (
            <div className="mt-4">
                <h4 className="text-xs uppercase text-textSecondary font-semibold tracking-wider">Medical Summary</h4>
                <p className="mt-1 text-sm text-textSecondary bg-surface-soft p-2 rounded-md italic line-clamp-3">
                    {member.medicalHistorySummary}
                </p>
             </div>
        )}
      </CardContent>
      <CardFooter className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={handleEditClick} className="w-full" leftIcon={<IconPencil className="w-4 h-4" />}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDeleteClick} className="w-full" leftIcon={<IconTrash className="w-4 h-4" />}>
          Delete
        </Button>
      </CardFooter>
    </HoverCard>
  );
};