import React, { useState, useEffect } from 'react';
import { DocumentItem } from '../types';
import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select } from './bits';
// FIX: Replaced incorrect AppContext with specific context hooks.
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFamily } from '../contexts/FamilyContext';
import { DocumentCategories } from '../constants';
import { IconCamera, IconDocument } from '../constants';
import { useToast } from './toast/useToast';

interface AddEditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentToEdit?: DocumentItem | null;
}

const initialFormState: Omit<DocumentItem, 'id' | 'fileUrl' | 'fileName' | 'version'> = {
  title: '',
  category: DocumentCategories[0],
  uploadDate: new Date().toISOString().split('T')[0],
  familyMemberId: '',
};

export const AddEditDocumentModal: React.FC<AddEditDocumentModalProps> = ({ isOpen, onClose, documentToEdit }) => {
  const [formData, setFormData] = useState<Omit<DocumentItem, 'id' | 'fileUrl' | 'fileName' | 'version'>>(initialFormState);
  // FIX: Used specific context hooks to get state.
  const { documents, setDocuments } = useHealthRecords();
  const { familyMembers } = useFamily();
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null); // For image previews
  const toast = useToast();

  const familyMemberOptions = familyMembers.map(fm => ({ value: fm.id, label: fm.name }));
  familyMemberOptions.unshift({value: "", label: "General (Not specific to a member)"});

  const documentCategoryOptions = DocumentCategories.map(cat => ({value: cat, label: cat}));

  useEffect(() => {
    if (documentToEdit) {
      setFormData({
        title: documentToEdit.title,
        category: documentToEdit.category,
        uploadDate: documentToEdit.uploadDate,
        familyMemberId: documentToEdit.familyMemberId || '',
      });
      setFileName(documentToEdit.fileName || null);
      // In a real app, you might fetch a preview URL if documentToEdit.fileUrl exists
      setFilePreview(null); 
    } else {
      setFormData(initialFormState);
      setFileName(null);
      setFilePreview(null);
    }
  }, [documentToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      // Generate a preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null); // Clear preview if not an image
      }
      // In a real app, you'd handle the file upload here (e.g., to S3 or GCS)
    }
  };
  
  const handleScanWithCamera = () => {
    toast.add("Camera scanning requires camera permissions and is a future feature.", 'info');
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation: ensure a file is selected for new documents
    if (!documentToEdit && !fileName) {
        toast.add("Please select a file to upload.", 'error');
        return;
    }

    if (documentToEdit) {
      setDocuments(documents.map(d => d.id === documentToEdit.id ? { ...documentToEdit, ...formData, version: (documentToEdit.version || 1) + (fileName !== documentToEdit.fileName ? 1: 0) , fileName: fileName || documentToEdit.fileName } : d));
      toast.add('Document updated successfully!', 'success');
    } else {
      const newDocument: DocumentItem = { ...formData, id: `doc-${Date.now()}`, version: 1, fileName: fileName || 'document.pdf' }; // Ensure fileName is set
      setDocuments([...documents, newDocument]);
      toast.add('Document added successfully!', 'success');
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>{documentToEdit ? 'Edit Document' : 'Add New Document'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Document Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select id="category" name="category" value={formData.category} onChange={handleChange} options={documentCategoryOptions} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="familyMemberId">Family Member (Optional)</Label>
                        <Select id="familyMemberId" name="familyMemberId" value={formData.familyMemberId} onChange={handleChange} options={familyMemberOptions} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="uploadDate">Upload Date</Label>
                    <Input id="uploadDate" name="uploadDate" type="date" value={formData.uploadDate} onChange={handleChange} required />
                </div>
                
                <div className="space-y-2">
                    <Label>File Upload</Label>
                    <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md hover:border-primary-DEFAULT transition-colors">
                        {filePreview ? (
                            <img src={filePreview} alt="File preview" className="max-h-40 rounded-md mb-3" />
                        ) : fileName ? (
                            <IconDocument className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                        ) : (
                            <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                        <div className="flex text-sm text-slate-600 justify-center">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-transparent rounded-md font-medium text-primary-DEFAULT hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-DEFAULT px-2 py-1">
                            <span>{fileName ? 'Change file' : 'Upload a file'}</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                            </label>
                            {!fileName && <p className="pl-1 self-center text-textSecondary">or drag and drop</p>}
                        </div>
                        {fileName && <p className="text-sm text-textSecondary mt-2 text-center">Selected: {fileName}</p>}
                        {!fileName && <p className="text-xs text-slate-500 mt-1">PDF, PNG, JPG, DOCX up to 10MB</p>}
                    </div>
                    <Button type="button" variant="outline" onClick={handleScanWithCamera} className="w-full mt-3" leftIcon={<IconCamera className="w-5 h-5" />}>
                        Scan with Camera
                    </Button>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                    <Button type="submit">{documentToEdit ? 'Save Changes' : 'Add Document'}</Button>
                </DialogFooter>
            </form>
        </DialogContent>
    </Dialog>
  );
};
