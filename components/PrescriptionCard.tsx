import React, { useMemo } from 'react';
import { Prescription } from '../types';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription, cn } from './bits';
import { IconPencil, IconTrash, IconPrescription } from '../constants';
import { useFamily } from '../contexts/FamilyContext';
import { useHealthRecords } from '../contexts/HealthRecordsContext';

interface PrescriptionCardProps {
    prescription: Prescription;
    onEdit: (prescription: Prescription) => void;
    onDelete: (prescriptionId: string) => void;
    onUpdateAdherence: (prescriptionId: string, date: string, status: 'taken' | 'skipped') => void;
}

export const PrescriptionCard: React.FC<PrescriptionCardProps> = ({ prescription, onEdit, onDelete, onUpdateAdherence }) => {
    const { getMemberName } = useFamily();
    const { conditions } = useHealthRecords();

    const linkedCondition = useMemo(() => {
        if (!prescription.conditionId) return null;
        return conditions.find(c => c.id === prescription.conditionId)?.name;
    }, [prescription.conditionId, conditions]);

    const refillDate = useMemo(() => {
        if (!prescription.supplyDays) return null;
        const startDate = new Date(prescription.startDate);
        // This is a simplified calculation. A real app would track refill dates.
        startDate.setDate(startDate.getDate() + prescription.supplyDays - 7); // Reminder 7 days before supply runs out
        return startDate;
    }, [prescription.startDate, prescription.supplyDays]);

    const adherenceDates = useMemo(() => {
        const dates: Date[] = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date);
        }
        return dates;
    }, []);
    
    return (
        <Card className="flex flex-col h-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <IconPrescription className="w-6 h-6 text-secondary-DEFAULT"/>
                            {prescription.medicationName}
                        </CardTitle>
                        <CardDescription>{getMemberName(prescription.familyMemberId)}</CardDescription>
                    </div>
                    {linkedCondition && (
                        <div className="text-xs bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-300 px-2 py-1 rounded-full text-center">
                            For: {linkedCondition}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
                 <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div><span className="text-textSecondary block text-xs">Dosage</span><span className="font-medium">{prescription.dosage}</span></div>
                    <div><span className="text-textSecondary block text-xs">Frequency</span><span className="font-medium">{prescription.frequency}</span></div>
                    <div><span className="text-textSecondary block text-xs">Doctor</span><span className="font-medium">{prescription.prescribingDoctor}</span></div>
                    <div><span className="text-textSecondary block text-xs">Pharmacy</span><span className="font-medium">{prescription.pharmacy || 'N/A'}</span></div>
                    <div><span className="text-textSecondary block text-xs">Supply</span><span className="font-medium">{prescription.supplyDays ? `${prescription.supplyDays} days` : 'N/A'}</span></div>
                    <div><span className="text-textSecondary block text-xs">Refills Left</span><span className="font-medium">{prescription.refillsRemaining ?? 'N/A'}</span></div>
                </div>
                {prescription.notes && <p className="text-xs text-textSecondary italic bg-surface-soft p-2 rounded-md">Note: {prescription.notes}</p>}

                <div>
                    <h4 className="text-sm font-semibold text-textPrimary mt-4 mb-2">Adherence (Last 7 Days)</h4>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {adherenceDates.map(date => {
                            const dateString = date.toISOString().split('T')[0];
                            const status = prescription.adherence?.[dateString];
                            return (
                                <div key={dateString} className="space-y-1">
                                    <p className="text-textSecondary">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                    <p className="font-bold text-textPrimary">{date.getDate()}</p>
                                    <div className="flex justify-center items-center gap-1">
                                        <button 
                                            onClick={() => onUpdateAdherence(prescription.id, dateString, 'taken')}
                                            className={cn("w-4 h-4 rounded-full border-2", status === 'taken' ? 'bg-green-500 border-green-600' : 'bg-surface border-green-500/50 hover:bg-green-200')}
                                            title="Mark as Taken"
                                        />
                                        <button 
                                            onClick={() => onUpdateAdherence(prescription.id, dateString, 'skipped')}
                                            className={cn("w-4 h-4 rounded-full border-2", status === 'skipped' ? 'bg-red-500 border-red-600' : 'bg-surface border-red-500/50 hover:bg-red-200')}
                                            title="Mark as Skipped"
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => onEdit(prescription)} leftIcon={<IconPencil className="w-4 h-4" />} className="w-full">
                    Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => onDelete(prescription.id)} leftIcon={<IconTrash className="w-4 h-4" />} className="w-full">
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
};
