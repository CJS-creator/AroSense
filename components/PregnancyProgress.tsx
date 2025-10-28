import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Input, Label, Dialog, DialogContent, DialogHeader as DHeader, DialogTitle as DTitle, DialogFooter, CardFooter } from './bits';

interface PregnancyProgressProps {
    dueDate?: string | null;
    onSaveDueDate: (date: string) => void;
}

export const PregnancyProgress: React.FC<PregnancyProgressProps> = ({ dueDate, onSaveDueDate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDueDate, setNewDueDate] = useState(dueDate || new Date().toISOString().split('T')[0]);
    
    const today = new Date();
    today.setHours(0,0,0,0);

    const progress = useMemo(() => {
        if (!dueDate) return null;
        const due = new Date(dueDate);
        const startDate = new Date(due.getTime() - 280 * 24 * 60 * 60 * 1000); // Assumes a 40-week (280-day) pregnancy
        const totalDays = 280;
        const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Handle cases where the due date implies the pregnancy hasn't started yet
        if (daysPassed < 0) return { currentWeek: 0, daysIntoWeek: 0, trimester: 1, progressPercent: 0, daysRemaining: 280 };

        const daysRemaining = Math.max(0, totalDays - daysPassed);
        const currentWeek = Math.floor(daysPassed / 7);
        const daysIntoWeek = daysPassed % 7;
        const trimester = currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3;
        const progressPercent = Math.min(100, Math.max(0, (daysPassed / totalDays) * 100));

        return { currentWeek, daysIntoWeek, trimester, progressPercent, daysRemaining };
    }, [dueDate, today]);

    const handleSave = () => {
        onSaveDueDate(newDueDate);
        setIsModalOpen(false);
    };

    const dueDateModal = (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
                <DHeader><DTitle>Set Estimated Due Date</DTitle></DHeader>
                <div className="space-y-4 py-4">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save Date</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    if (!dueDate || !progress) {
        return (
            <>
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Welcome to Your Pregnancy Journey!</CardTitle>
                        <CardDescription>To get started, please set your estimated due date.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => setIsModalOpen(true)}>Set Due Date</Button>
                    </CardContent>
                </Card>
                {dueDateModal}
            </>
        );
    }
    
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Pregnancy Progress</CardTitle>
                    <CardDescription>Estimated Due Date: {new Date(dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm text-textSecondary mb-1">
                            <span>Trimester {progress.trimester}</span>
                            <span>{progress.progressPercent.toFixed(0)}% Complete</span>
                        </div>
                        <div className="w-full bg-surface-soft rounded-full h-3">
                            <div className="bg-secondary-DEFAULT h-3 rounded-full transition-all duration-500" style={{ width: `${progress.progressPercent}%` }}></div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-surface-soft rounded-lg">
                            <p className="text-xs text-textSecondary uppercase tracking-wider">Current Week</p>
                            <p className="text-3xl font-bold text-secondary-dark dark:text-secondary-light">{progress.currentWeek}</p>
                            <p className="text-sm text-textSecondary">Day {progress.daysIntoWeek}</p>
                        </div>
                        <div className="p-4 bg-surface-soft rounded-lg">
                            <p className="text-xs text-textSecondary uppercase tracking-wider">Days Remaining</p>
                            <p className="text-4xl font-bold text-textPrimary">{progress.daysRemaining}</p>
                        </div>
                        <div className="p-4 bg-surface-soft rounded-lg col-span-2 sm:col-span-1">
                             <p className="text-xs text-textSecondary uppercase tracking-wider">Total Progress</p>
                             <p className="text-4xl font-bold text-textPrimary">{280 - progress.daysRemaining}<span className="text-lg font-medium text-textSecondary">/280</span></p>
                             <p className="text-sm text-textSecondary">days</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="justify-end">
                    <Button variant="link" onClick={() => setIsModalOpen(true)}>
                        Change Due Date
                    </Button>
                </CardFooter>
            </Card>
            {dueDateModal}
        </>
    );
};