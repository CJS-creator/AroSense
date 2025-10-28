import React from 'react';
import { VaccinationRecord } from '../types';
import { Button, Card, CardContent, CardHeader, CardTitle } from './bits';
import { IconSyringe, IconPlus } from '../constants';

interface VaccinationCardProps {
    vaccinations: VaccinationRecord[];
    onAddVaccination: () => void;
}

export const VaccinationCard: React.FC<VaccinationCardProps> = ({ vaccinations, onAddVaccination }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                    <IconSyringe className="w-6 h-6 mr-2 text-teal-500"/>
                    Vaccination Log
                </CardTitle>
                <Button onClick={onAddVaccination} size="sm" variant="outline" leftIcon={<IconPlus className="w-4 h-4" />}>Add Record</Button>
            </CardHeader>
            <CardContent>
                {vaccinations.length > 0 ? (
                    <div className="overflow-x-auto max-h-80">
                        <table className="min-w-full">
                            <thead className="bg-surface-soft sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-textSecondary">Vaccine</th>
                                    <th className="px-4 py-2 text-left text-sm font-semibold text-textSecondary">Date Administered</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {vaccinations.map(vac => (
                                    <React.Fragment key={vac.id}>
                                        <tr className="hover:bg-surface-hover">
                                            <td className="px-4 py-3 font-medium text-textPrimary">{vac.vaccineName}</td>
                                            <td className="px-4 py-3 text-textSecondary">{new Date(vac.dateAdministered).toLocaleDateString()}</td>
                                        </tr>
                                        {vac.notes && (
                                            <tr className="hover:bg-surface-hover">
                                                <td colSpan={2} className="px-4 pb-3 pt-0 text-xs text-textSecondary pl-6">
                                                    <span className="font-semibold">Note:</span> {vac.notes}
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-textSecondary text-center py-8">No vaccination records found.</p>
                )}
            </CardContent>
        </Card>
    );
};