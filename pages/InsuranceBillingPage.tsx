import React, { useState, useCallback, useMemo } from 'react';
import { useFinancial } from '../contexts/FinancialContext';
import { useFamily } from '../contexts/FamilyContext';
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader as DHeader, DialogTitle as DTitle } from '../components/bits';
import { IconPlus, IconClaim } from '../constants';
import { InsurancePolicy, Bill, InsuranceClaim } from '../types';
import { InsurancePolicyCard } from '../components/InsurancePolicyCard';
import { AddEditInsuranceModal } from '../components/AddEditInsuranceModal';
import { BillRow } from '../components/BillRow';
import { AddEditBillModal } from '../components/AddEditBillModal';
import { useToast } from '../components/toast/useToast';
import { AnimatePresence } from 'framer-motion';
import { AddEditClaimModal } from '../components/AddEditClaimModal';
import { ClaimRow } from '../components/ClaimRow';

export const InsuranceBillingPage: React.FC = () => {
    const { insurancePolicies, setInsurancePolicies, bills, setBills, claims, setClaims } = useFinancial();
    const { familyMembers, getMemberName } = useFamily();
    const toast = useToast();

    // State for modals
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [isBillModalOpen, setIsBillModalOpen] = useState(false);
    const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState<InsurancePolicy | null>(null);
    const [editingBill, setEditingBill] = useState<Bill | null>(null);
    const [editingClaim, setEditingClaim] = useState<InsuranceClaim | null>(null);

    // State for confirmation modals
    const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'policy' | 'bill' | 'claim' } | null>(null);

    // Handlers for Insurance Policies
    const handleAddPolicy = () => { setEditingPolicy(null); setIsPolicyModalOpen(true); };
    const handleEditPolicy = (policy: InsurancePolicy) => { setEditingPolicy(policy); setIsPolicyModalOpen(true); };
    const requestDeletePolicy = (policyId: string) => { setItemToDelete({ id: policyId, type: 'policy' }); };

    // Handlers for Bills
    const handleAddBill = () => { setEditingBill(null); setIsBillModalOpen(true); };
    const handleEditBill = (bill: Bill) => { setEditingBill(bill); setIsBillModalOpen(true); };
    const requestDeleteBill = (billId: string) => { setItemToDelete({ id: billId, type: 'bill' }); };
    
    // Handlers for Claims
    const handleAddClaim = () => { setEditingClaim(null); setIsClaimModalOpen(true); };
    const handleEditClaim = (claim: InsuranceClaim) => { setEditingClaim(claim); setIsClaimModalOpen(true); };
    const requestDeleteClaim = (claimId: string) => { setItemToDelete({ id: claimId, type: 'claim' }); };


    const handleBillStatusChange = (bill: Bill, isPaid: boolean) => {
        setBills(prevBills => prevBills.map(b => b.id === bill.id ? { 
            ...b, 
            isPaid,
            paymentDate: isPaid ? (b.paymentDate || new Date().toISOString().split('T')[0]) : undefined
        } : b));
        toast.add(`Bill status updated to ${isPaid ? 'Paid' : 'Unpaid'}.`, 'success');
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;

        if (itemToDelete.type === 'policy') {
            setInsurancePolicies(prev => prev.filter(p => p.id !== itemToDelete.id));
            toast.add('Insurance policy deleted.', 'success');
        } else if (itemToDelete.type === 'bill') {
            setBills(prev => prev.filter(b => b.id !== itemToDelete.id));
            toast.add('Bill deleted.', 'success');
        } else if (itemToDelete.type === 'claim') {
            setClaims(prev => prev.filter(c => c.id !== itemToDelete.id));
            toast.add('Claim deleted.', 'success');
        }
        setItemToDelete(null);
    };
    
    const getPolicyProviderName = (policyId: string) => insurancePolicies.find(p => p.id === policyId)?.providerName || 'Unknown';
    const getBillProviderName = (billId: string) => bills.find(b => b.id === billId)?.serviceProvider || 'Unknown';

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-textPrimary">Insurance & Billing</h1>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Insurance Policies</CardTitle>
                    <Button onClick={handleAddPolicy} leftIcon={<IconPlus />}>Add Policy</Button>
                </CardHeader>
                <CardContent>
                    {insurancePolicies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {insurancePolicies.map(policy => (
                                <InsurancePolicyCard 
                                    key={policy.id}
                                    policy={policy}
                                    memberName={getMemberName(policy.memberId)}
                                    onEdit={handleEditPolicy}
                                    onDelete={requestDeletePolicy}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-textSecondary text-center py-8">No insurance policies added yet.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Medical Bills</CardTitle>
                    <Button onClick={handleAddBill} leftIcon={<IconPlus />}>Add Bill</Button>
                </CardHeader>
                <CardContent>
                    {bills.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-surface-soft">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Provider</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Amount</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Due Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Payment Date</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface divide-y divide-border">
                                    <AnimatePresence>
                                        {bills.map(bill => (
                                            <BillRow 
                                                key={bill.id}
                                                bill={bill}
                                                onEdit={handleEditBill}
                                                onDelete={requestDeleteBill}
                                                onStatusChange={handleBillStatusChange}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-textSecondary text-center py-8">No medical bills added yet.</p>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center"><IconClaim className="w-6 h-6 mr-2 text-primary-DEFAULT"/>Insurance Claims</CardTitle>
                    <Button onClick={handleAddClaim} leftIcon={<IconPlus />}>Add Claim</Button>
                </CardHeader>
                <CardContent>
                    {claims.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-surface-soft">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Claim #</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Service Provider</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Submitted</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Insurance</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-surface divide-y divide-border">
                                    {claims.map(claim => (
                                        <ClaimRow
                                            key={claim.id}
                                            claim={claim}
                                            onEdit={handleEditClaim}
                                            onDelete={requestDeleteClaim}
                                            billProvider={getBillProviderName(claim.billId)}
                                            policyProvider={getPolicyProviderName(claim.policyId)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-textSecondary text-center py-8">No insurance claims filed yet.</p>
                    )}
                </CardContent>
            </Card>

            <AddEditInsuranceModal isOpen={isPolicyModalOpen} onClose={() => setIsPolicyModalOpen(false)} policyToEdit={editingPolicy}/>
            <AddEditBillModal isOpen={isBillModalOpen} onClose={() => setIsBillModalOpen(false)} billToEdit={editingBill}/>
            <AddEditClaimModal isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} claimToEdit={editingClaim} />

            <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
                <DialogContent>
                    <DHeader>
                        <DTitle>Delete {itemToDelete?.type}</DTitle>
                        <DialogDescription>
                            Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
                        </DialogDescription>
                    </DHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setItemToDelete(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};