import React from 'react';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Label, Toggle } from './bits';
import { useSettings, DASHBOARD_WIDGETS } from '../contexts/SettingsContext';
import { useToast } from './toast/useToast';

interface CustomizeDashboardModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CustomizeDashboardModal: React.FC<CustomizeDashboardModalProps> = ({ isOpen, onClose }) => {
    const { settings, setSettings } = useSettings();
    const toast = useToast();

    const handleVisibilityChange = (widgetId: string, isVisible: boolean) => {
        setSettings(prev => ({
            ...prev,
            dashboard: {
                ...prev.dashboard,
                widgetVisibility: {
                    ...prev.dashboard.widgetVisibility,
                    [widgetId]: isVisible,
                }
            }
        }));
    };
    
    const handleSaveChanges = () => {
        toast.add("Dashboard layout saved!", "success");
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Customize Dashboard</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <p className="text-sm text-textSecondary">
                        Select the widgets you want to see on your dashboard.
                    </p>
                    <div className="space-y-3 rounded-md border border-border p-4">
                        {DASHBOARD_WIDGETS.map(widget => (
                            <div key={widget.id} className="flex items-center justify-between">
                                <Label htmlFor={`toggle-${widget.id}`} className="font-medium text-textPrimary">
                                    {widget.name}
                                </Label>
                                <Toggle 
                                    id={`toggle-${widget.id}`}
                                    pressed={settings.dashboard.widgetVisibility[widget.id] ?? false}
                                    onPressedChange={(pressed) => handleVisibilityChange(widget.id, pressed)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSaveChanges}>Done</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};