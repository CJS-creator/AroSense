import React, { useState, useCallback, useMemo } from 'react';
import { DocumentRow } from '../components/DocumentRow';
import { AddEditDocumentModal } from '../components/AddEditDocumentModal';
import { Button, Card, CardContent, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Input, Label, Select } from '../components/bits';
import { IconPlus, IconDocument } from '../constants';
import { DocumentItem } from '../types';
// FIX: Replaced incorrect AppContext with specific context hooks.
import { useHealthRecords } from '../contexts/HealthRecordsContext';
import { useFamily } from '../contexts/FamilyContext';
import { DocumentCategories } from '../constants';
import { useToast } from '../components/toast/useToast';
import { AnalyzeDocumentModal } from '../components/AnalyzeDocumentModal';

export const DocumentsPage: React.FC = () => {
  // FIX: Used specific context hooks to get state.
  const { documents, setDocuments } = useHealthRecords();
  const { familyMembers } = useFamily();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterMember, setFilterMember] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const toast = useToast();

  const [isAnalyzeModalOpen, setIsAnalyzeModalOpen] = useState(false);
  const [docToAnalyze, setDocToAnalyze] = useState<DocumentItem | null>(null);

  const familyMemberOptions = useMemo(() => {
    const options = familyMembers.map(fm => ({ value: fm.id, label: fm.name }));
    options.unshift({ value: "", label: "All Members" });
    return options;
  }, [familyMembers]);

  const categoryOptions = useMemo(() => {
    const options = DocumentCategories.map(cat => ({ value: cat, label: cat }));
    options.unshift({ value: "", label: "All Categories" });
    return options;
  }, []);


  const handleAddDocument = useCallback(() => {
    setEditingDocument(null);
    setIsModalOpen(true);
  }, []);

  const handleEditDocument = useCallback((doc: DocumentItem) => {
    setEditingDocument(doc);
    setIsModalOpen(true);
  }, []);
  
  const handleAnalyzeDocument = useCallback((doc: DocumentItem) => {
    setDocToAnalyze(doc);
    setIsAnalyzeModalOpen(true);
  }, []);

  const requestDeleteDocument = useCallback((docId: string) => {
    setDocToDelete(docId);
    setIsConfirmOpen(true);
  }, []);

  const confirmDeleteDocument = useCallback(() => {
    if (docToDelete) {
      setDocuments(prevDocs => prevDocs.filter(d => d.id !== docToDelete));
      toast.add('Document deleted.', 'success');
    }
    setDocToDelete(null);
    setIsConfirmOpen(false);
  }, [docToDelete, setDocuments, toast]);


  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingDocument(null);
  }, []);

  const getMemberName = useCallback((memberId?: string): string => {
    if (!memberId) return 'General';
    const member = familyMembers.find(fm => fm.id === memberId);
    return member ? member.name : 'Unknown Member';
  }, [familyMembers]);

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearchTerm = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (doc.fileName && doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory ? doc.category === filterCategory : true;
      const matchesMember = filterMember ? doc.familyMemberId === filterMember : true;
      return matchesSearchTerm && matchesCategory && matchesMember;
    });
  }, [documents, searchTerm, filterCategory, filterMember]);


  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-textPrimary">Medical Documents</h1>
        <Button onClick={handleAddDocument} leftIcon={<IconPlus className="w-5 h-5" />}>
          Add Document
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
            <div className="flex-grow space-y-2">
              <Label htmlFor="search-docs">Search Documents</Label>
              <Input 
                id="search-docs"
                placeholder="Enter title or filename..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="md:w-1/4 space-y-2">
              <Label htmlFor="filter-category">Filter by Category</Label>
              <Select 
                id="filter-category"
                options={categoryOptions}
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              />
            </div>
             <div className="md:w-1/4 space-y-2">
              <Label htmlFor="filter-member">Filter by Member</Label>
              <Select 
                id="filter-member"
                options={familyMemberOptions}
                value={filterMember} 
                onChange={(e) => setFilterMember(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredDocuments.length === 0 ? (
         <Card className="text-center py-16">
          <CardContent className="flex flex-col items-center">
            <IconDocument className="w-24 h-24 text-textSecondary/50 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-textPrimary mb-2">No Documents Found</h3>
            <p className="text-textSecondary mb-6">Try adjusting your search or filters, or add a new document to get started.</p>
            <Button onClick={handleAddDocument} leftIcon={<IconPlus className="w-5 h-5" />} size="lg">
              Add New Document
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-surface-soft">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Member</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">Version</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-surface divide-y divide-border">
                {filteredDocuments.map((doc) => (
                  <DocumentRow 
                    key={doc.id} 
                    document={doc} 
                    onEdit={handleEditDocument} 
                    onDelete={requestDeleteDocument}
                    onAnalyze={handleAnalyzeDocument}
                    getMemberName={getMemberName}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <AddEditDocumentModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        documentToEdit={editingDocument} 
      />

      {docToAnalyze && (
        <AnalyzeDocumentModal
          isOpen={isAnalyzeModalOpen}
          onClose={() => setIsAnalyzeModalOpen(false)}
          documentToAnalyze={docToAnalyze}
        />
      )}

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete Document</DialogTitle>
                <DialogDescription>
                    Are you sure you want to permanently delete this document? This action cannot be undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={confirmDeleteDocument}>Delete</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
