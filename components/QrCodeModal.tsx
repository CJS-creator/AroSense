import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './bits';

interface QrCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, url }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Share Emergency Sheet</DialogTitle>
                    <DialogDescription>
                        Scan this QR code with a mobile device to view the emergency information.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4 bg-white rounded-lg flex justify-center mt-4">
                    {/* Placeholder for a real QR code component/library */}
                    <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" fill="#fff"/>
                        <rect x="10" y="10" width="25" height="25" fill="#000"/>
                        <rect x="65" y="10" width="25" height="25" fill="#000"/>
                        <rect x="10" y="65" width="25" height="25" fill="#000"/>
                        <rect x="45" y="10" width="10" height="10" fill="#000"/>
                        <rect x="40" y="40" width="50" height="10" fill="#000"/>
                        <rect x="40" y="60" width="10" height="30" fill="#000"/>
                        <rect x="60" y="60" width="30" height="10" fill="#000"/>
                        <rect x="80" y="70" width="10" height="20" fill="#000"/>
                    </svg>
                </div>
                <div className="mt-2 text-center">
                    <p className="text-xs text-textSecondary break-all">{url}</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};
