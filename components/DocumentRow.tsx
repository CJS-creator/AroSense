import React from 'react';
import { DocumentItem } from '../types';
import { IconPencil, IconTrash, IconDocument, IconSparkles } from '../constants';
import { Button } from './bits';

interface DocumentRowProps {
  document: DocumentItem;
  onEdit: (document: DocumentItem) => void;
  onDelete: (documentId: string) => void;
  onAnalyze: (document: DocumentItem) => void;
  getMemberName: (memberId?: string) => string;
}

export const DocumentRow: React.FC<DocumentRowProps> = ({ document, onEdit, onDelete, onAnalyze, getMemberName }) => {
  return (
    <tr className="border-b border-border hover:bg-surface-hover transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textPrimary">
        <div className="flex items-center">
          <IconDocument className="w-5 h-5 mr-3 text-primary-DEFAULT flex-shrink-0"/>
          <span className="font-medium">{document.title}</span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{document.category}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{getMemberName(document.familyMemberId)}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">{new Date(document.uploadDate).toLocaleDateString()}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-textSecondary">V{document.version}</td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
        <Button variant="ghost" size="sm" onClick={() => onAnalyze(document)} aria-label="Analyze with AI">
            <IconSparkles className="w-5 h-5 text-purple-500"/>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(document)} aria-label="Edit document">
            <IconPencil className="w-5 h-5"/>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(document.id)} className="text-danger hover:bg-danger/10" aria-label="Delete document">
            <IconTrash className="w-5 h-5"/>
        </Button>
      </td>
    </tr>
  );
};