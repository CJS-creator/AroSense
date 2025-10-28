import React from 'react';
import { Condition } from '../types';
import { Button, Card, CardContent, CardHeader, CardTitle, cn } from './bits';
import { IconDiagnoses, IconPlus, IconPencil } from '../constants';

interface ConditionsCardProps {
    conditions: Condition[];
    onAddCondition: () => void;
    onEditCondition: (condition: Condition) => void;
}

export const ConditionsCard: React.FC<ConditionsCardProps> = ({ conditions, onAddCondition, onEditCondition }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                    <IconDiagnoses className="w-6 h-6 mr-2 text-rose-500"/>
                    Conditions
                </CardTitle>
                <Button onClick={onAddCondition} size="sm" variant="outline" leftIcon={<IconPlus className="w-4 h-4" />}>Add Condition</Button>
            </CardHeader>
            <CardContent>
                {conditions.length > 0 ? (
                    <ul className="space-y-3 max-h-80 overflow-y-auto">
                        {conditions.map(condition => (
                            <li key={condition.id} className="flex items-center justify-between p-3 bg-surface-soft rounded-md">
                                <div>
                                    <p className="font-semibold text-textPrimary">{condition.name}</p>
                                    <p className="text-xs text-textSecondary">
                                        Diagnosed: {new Date(condition.dateOfDiagnosis).toLocaleDateString()}
                                    </p>
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-0.5 rounded-full",
                                        condition.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
                                    )}>{condition.status}</span>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => onEditCondition(condition)}>
                                    <IconPencil className="w-4 h-4"/>
                                </Button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-textSecondary text-center py-8">No conditions logged for this member yet.</p>
                )}
            </CardContent>
        </Card>
    );
};