import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './bits';
// FIX: Replaced incorrect AppContext with useFamily hook.
import { useFamily } from '../contexts/FamilyContext';
import { useToast } from './toast/useToast';
import { DocumentItem, MedicalNote } from '../types';
import { IconSparkles } from '../constants';

interface AnalyzeDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    documentToAnalyze: DocumentItem;
}

interface AnalysisResult {
    summary: string;
    metrics: {
        name: string;
        value: string;
        range?: string;
        interpretation: 'Normal' | 'High' | 'Low' | 'Abnormal';
    }[];
}

const fetchAnalysisFromAI = (document: DocumentItem): Promise<AnalysisResult> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (document.category !== "Lab Report") {
                reject(new Error("AI analysis is currently optimized for Lab Reports only."));
                return;
            }

            const mockApiResponse: AnalysisResult = {
                summary: "This blood panel shows generally healthy results. Cholesterol levels are within the optimal range, and blood glucose is normal, indicating good metabolic health. White blood cell count is slightly elevated, which could suggest a minor, resolving infection, but is not clinically alarming. All other markers are stable.",
                metrics: [
                    { name: "Total Cholesterol", value: "185 mg/dL", range: "<200 mg/dL", interpretation: "Normal" },
                    { name: "HDL Cholesterol", value: "65 mg/dL", range: ">40 mg/dL", interpretation: "Normal" },
                    { name: "LDL Cholesterol", value: "100 mg/dL", range: "<130 mg/dL", interpretation: "Normal" },
                    { name: "Glucose", value: "90 mg/dL", range: "70-99 mg/dL", interpretation: "Normal" },
                    { name: "White Blood Cell (WBC)", value: "11.5 x10^9/L", range: "4.5-11.0 x10^9/L", interpretation: "High" },
                    { name: "Hemoglobin (Hgb)", value: "15.2 g/dL", range: "13.5-17.5 g/dL", interpretation: "Normal" },
                ]
            };
            resolve(mockApiResponse);
        }, 2500);
    });
};

export const AnalyzeDocumentModal: React.FC<AnalyzeDocumentModalProps> = ({ isOpen, onClose, documentToAnalyze }) => {
    // FIX: Used the useFamily hook to correctly get medical notes state.
    const { medicalNotes, setMedicalNotes } = useFamily();
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

    useEffect(() => {
        if (isOpen && documentToAnalyze) {
            setIsLoading(true);
            setError(null);
            setAnalysisResult(null);
            
            fetchAnalysisFromAI(documentToAnalyze)
                .then(result => {
                    setAnalysisResult(result);
                })
                .catch(err => {
                    setError(err.message || "An unknown error occurred during analysis.");
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [isOpen, documentToAnalyze]);

    const handleSaveNote = () => {
        if (!analysisResult || !documentToAnalyze.familyMemberId) {
            toast.add("Cannot save note without analysis results or an assigned family member.", 'error');
            return;
        }

        const newNote: MedicalNote = {
            id: `mn-ai-${Date.now()}`,
            title: `AI Summary of ${documentToAnalyze.title}`,
            content: analysisResult.summary,
            date: new Date().toISOString().split('T')[0],
            isCritical: false,
            familyMemberId: documentToAnalyze.familyMemberId,
        };

        setMedicalNotes([...medicalNotes, newNote]);
        toast.add("AI summary saved to medical notes!", 'success');
        onClose();
    };
    
    const getInterpretationClass = (interpretation: AnalysisResult['metrics'][0]['interpretation']) => {
        switch (interpretation) {
            case 'High': return 'text-red-600 dark:text-red-400 font-semibold';
            case 'Low': return 'text-blue-600 dark:text-blue-400 font-semibold';
            case 'Abnormal': return 'text-yellow-600 dark:text-yellow-400 font-semibold';
            default: return 'text-green-600 dark:text-green-400';
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>AI Document Analysis</DialogTitle>
                </DialogHeader>
                <div className="pt-4">
                    {isLoading && (
                        <div className="text-center py-12">
                            <IconSparkles className="w-16 h-16 text-primary-DEFAULT mx-auto animate-pulse" />
                            <p className="mt-4 text-lg font-semibold text-textPrimary">Analyzing document...</p>
                            <p className="text-textSecondary">Please wait while Gemini processes the information.</p>
                        </div>
                    )}
                    {error && (
                        <div className="text-center py-12">
                            <p className="text-lg font-semibold text-danger">Analysis Failed</p>
                            <p className="text-textSecondary mt-2">{error}</p>
                            <Button onClick={onClose} variant="outline" className="mt-6">Close</Button>
                        </div>
                    )}
                    {analysisResult && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-textPrimary mb-2">Plain Language Summary</h3>
                                <p className="p-4 bg-primary-light/10 dark:bg-primary-dark/20 rounded-lg text-textSecondary border border-primary-light/20">{analysisResult.summary}</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-textPrimary mb-2">Key Metrics</h3>
                                <div className="overflow-x-auto rounded-lg border border-border">
                                    <table className="min-w-full">
                                        <thead className="bg-surface-soft">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-textSecondary">Metric</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-textSecondary">Result</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-textSecondary">Standard Range</th>
                                                <th className="px-4 py-2 text-left text-sm font-semibold text-textSecondary">Interpretation</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {analysisResult.metrics.map(metric => (
                                                <tr key={metric.name} className="hover:bg-surface-hover">
                                                    <td className="px-4 py-2 font-medium text-textPrimary">{metric.name}</td>
                                                    <td className="px-4 py-2 text-textSecondary">{metric.value}</td>
                                                    <td className="px-4 py-2 text-textSecondary">{metric.range || 'N/A'}</td>
                                                    <td className={`px-4 py-2 ${getInterpretationClass(metric.interpretation)}`}>{metric.interpretation}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {documentToAnalyze.familyMemberId ? (
                                <DialogFooter>
                                    <Button type="button" variant="outline" onClick={onClose}>Close</Button>
                                    <Button type="button" onClick={handleSaveNote}>Save Summary to Notes</Button>
                                </DialogFooter>
                            ) : (
                                <div className="text-center text-sm text-textSecondary p-3 bg-yellow-100/50 dark:bg-yellow-500/10 rounded-md">
                                    To save this summary, please first assign this document to a family member.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};
