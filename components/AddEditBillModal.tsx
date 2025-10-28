import React, { useState, useEffect, useMemo } from 'react';
import { Bill } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select, Textarea } from './bits';
import { useToast } from './toast/useToast';
import { useFinancial } from '../contexts/FinancialContext';
import { useFamily } from '../contexts/FamilyContext';
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { motion, AnimatePresence } from 'framer-motion';

interface AddEditBillModalProps {
    isOpen: boolean;
    onClose: () => void;
    billToEdit?: Bill | null;
}

const initialFormState: Omit<Bill, 'id'> = {
    serviceProvider: '',
    serviceDate: new Date().toISOString().split('T')[0],
    amountDue: 0,
    dueDate: '',
    isPaid: false,
    notes: '',
    paymentDate: '',
    familyMemberId: '',
    appointmentId: '',
};

export const AddEditBillModal: React.FC<AddEditBillModalProps> = ({ isOpen, onClose, billToEdit }) => {
    const [formData, setFormData] = useState<Omit<Bill, 'id'>>(initialFormState);
    const { bills, setBills } = useFinancial();
    const { familyMembers } = useFamily();
    const { appointments } = useHealthRecords();
    const toast = useToast();

    useEffect(() => {
        if (billToEdit) {
            setFormData({
                serviceProvider: billToEdit.serviceProvider,
                serviceDate: billToEdit.serviceDate,
                amountDue: billToEdit.amountDue,
                dueDate: billToEdit.dueDate,
                isPaid: billToEdit.isPaid,
                notes: billToEdit.notes || '',
                paymentDate: billToEdit.paymentDate || '',
                familyMemberId: billToEdit.familyMemberId || '',
                appointmentId: billToEdit.appointmentId || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [billToEdit, isOpen]);
    
    const familyMemberOptions = useMemo(() => familyMembers.map(fm => ({ value: fm.id, label: fm.name })), [familyMembers]);
    
    const appointmentOptions = useMemo(() => {
        if (!formData.familyMemberId) return [];
        return appointments
            .filter(a => a.familyMemberId === formData.familyMemberId)
            .map(a => ({ value: a.id, label: `${new Date(a.date).toLocaleDateString()} - ${a.doctor} (${a.type})`}));
    }, [appointments, formData.familyMemberId]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const isChecked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({
                ...prev,
                isPaid: isChecked,
                paymentDate: isChecked ? (prev.paymentDate || new Date().toISOString().split('T')[0]) : ''
            }));
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.amountDue <= 0) {
            toast.add("Amount due must be greater than zero.", 'error');
            return;
        }

        if (billToEdit) {
            setBills(bills.map(b => b.id === billToEdit.id ? { ...billToEdit, ...formData } : b));
            toast.add('Bill updated successfully!', 'success');
        } else {
            const newBill: Bill = { ...formData, id: `bill-${Date.now()}` };
            setBills([...bills, newBill]);
            toast.add('Bill added successfully!', 'success');
        }
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{billToEdit ? 'Edit Medical Bill' : 'Add Medical Bill'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="serviceProvider">Service Provider</Label>
                        <Input id="serviceProvider" name="serviceProvider" value={formData.serviceProvider} onChange={handleChange} required placeholder="e.g., City General Hospital" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <div className="space-y-2">
                            <Label htmlFor="amountDue">Amount Due</Label>
                            <Input id="amountDue" name="amountDue" type="number" min="0.01" step="0.01" value={formData.amountDue} onChange={handleChange} required />
                        </div>
                        <div className="flex items-center pt-8">
                            <input
                                type="checkbox"
                                id="isPaid"
                                name="isPaid"
                                checked={formData.isPaid}
                                onChange={handleChange}
                                className="h-5 w-5 text-primary-DEFAULT border-slate-300 rounded focus:ring-primary-DEFAULT"
                            />
                            <Label htmlFor="isPaid" className="ml-2 font-medium">Mark as Paid</Label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <div className="space-y-2">
                            <Label htmlFor="serviceDate">Service Date</Label>
                            <Input id="serviceDate" name="serviceDate" type="date" value={formData.serviceDate} onChange={handleChange} required />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date</Label>
                            <Input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} required />
                        </div>
                    </div>
                    <AnimatePresence>
                        {formData.isPaid && (
                             <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2 pt-2">
                                    <Label htmlFor="paymentDate">Payment Date</Label>
                                    <Input id="paymentDate" name="paymentDate" type="date" value={formData.paymentDate || ''} onChange={handleChange} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                     <div className="space-y-2">
                        <Label htmlFor="familyMemberId">Link to Family Member (Optional)</Label>
                        <Select id="familyMemberId" name="familyMemberId" value={formData.familyMemberId} onChange={handleChange} options={familyMemberOptions} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="appointmentId">Link to Appointment (Optional)</Label>
                        <Select id="appointmentId" name="appointmentId" value={formData.appointmentId} onChange={handleChange} options={appointmentOptions} disabled={!formData.familyMemberId || appointmentOptions.length === 0} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., ER visit for sprained ankle." />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">{billToEdit ? 'Save Changes' : 'Add Bill'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};