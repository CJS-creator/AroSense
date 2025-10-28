import React, { useMemo, useState } from 'react';
// FIX: Replaced incorrect AppContext with useFamily hook.
import { useFamily } from '../contexts/FamilyContext';
import { EmergencySheet } from '../components/EmergencySheet';
import { QrCodeModal } from '../components/QrCodeModal';
import { Button, Card, CardContent, CardHeader, CardTitle, Dialog, DialogContent, DialogHeader as DHeader, DialogTitle as DTitle } from '../components/bits';
import { IconDevicePhoneMobile, IconPrinter, IconQrCode, IconEmergency, IconShieldCheck } from '../constants';

export const EmergencyPage: React.FC = () => {
    // FIX: Used the useFamily hook to correctly get family-related state.
    const { emergencyContacts, medicalNotes, familyMembers } = useFamily();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isQrOpen, setIsQrOpen] = useState(false);

    const criticalNotes = useMemo(() => medicalNotes.filter(note => note.isCritical), [medicalNotes]);

    const getMemberName = (memberId?: string): string => {
        if (!memberId) return 'General Note';
        return familyMembers.find(fm => fm.id === memberId)?.name || 'Unknown Member';
    };

    const membersWithCriticalInfo = useMemo(() => {
        const memberIds = new Set(criticalNotes.map(n => n.familyMemberId).filter(Boolean));
        return familyMembers.filter(fm => memberIds.has(fm.id));
    }, [criticalNotes, familyMembers]);


    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center">
                    <IconEmergency className="w-10 h-10 text-danger mr-3" />
                    <div>
                        <h1 className="text-3xl font-bold text-textPrimary">Emergency Hub</h1>
                        <p className="text-textSecondary">Quick access to critical information.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => setIsQrOpen(true)} leftIcon={<IconQrCode className="w-5 h-5"/>}>
                        Show QR
                    </Button>
                    <Button onClick={() => setIsSheetOpen(true)} leftIcon={<IconDevicePhoneMobile className="w-5 h-5"/>}>
                        View Emergency Sheet
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><IconShieldCheck className="w-6 h-6 mr-2 text-primary-DEFAULT"/>Primary Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                    {emergencyContacts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {emergencyContacts.map(contact => (
                                <div key={contact.id} className="p-4 bg-surface-soft rounded-lg border border-border">
                                    <p className="font-semibold text-textPrimary">{contact.name}</p>
                                    <p className="text-sm text-textSecondary">{contact.relationship}</p>
                                    <a href={`tel:${contact.phone}`} className="text-lg font-mono text-primary-DEFAULT hover:underline">{contact.phone}</a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-textSecondary text-center py-6">No emergency contacts added. Please add them in Settings.</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center"><IconEmergency className="w-6 h-6 mr-2 text-danger"/>Critical Medical Notes</CardTitle>
                </CardHeader>
                <CardContent>
                {criticalNotes.length > 0 ? (
                    <ul className="space-y-3">
                    {criticalNotes.map(note => (
                        <li key={note.id} className="p-4 bg-danger/10 rounded-lg border border-danger/20">
                        <p className="font-bold text-danger">{note.title}</p>
                        <p className="text-sm text-textSecondary font-semibold">For: {getMemberName(note.familyMemberId)}</p>
                        <p className="text-sm text-textPrimary mt-1">{note.content}</p>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-textSecondary text-center py-6">No critical medical notes found.</p>
                )}
                </CardContent>
            </Card>


            {/* A placeholder for future functionality */}
            <Card>
                <CardHeader><CardTitle>Local Emergency Services</CardTitle></CardHeader>
                <CardContent>
                    <p className="text-textSecondary">Location-based service information coming soon.</p>
                </CardContent>
            </Card>

            <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <DialogContent className="sm:max-w-4xl p-0">
                    <DHeader className="p-6">
                        <DTitle>Emergency Medical Sheet</DTitle>
                    </DHeader>
                    <div className="max-h-[70vh] overflow-y-auto p-6 pt-0">
                        <EmergencySheet 
                            contacts={emergencyContacts}
                            membersWithInfo={membersWithCriticalInfo}
                            notes={criticalNotes}
                        />
                    </div>
                    <div className="flex justify-end p-4 bg-surface-soft border-t border-border">
                         <Button onClick={() => window.print()} leftIcon={<IconPrinter className="w-5 h-5"/>}>Print Sheet</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <QrCodeModal 
                isOpen={isQrOpen}
                onClose={() => setIsQrOpen(false)}
                url={window.location.href}
            />
        </div>
    );
};
