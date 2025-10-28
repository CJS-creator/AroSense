import React, { useState, useRef, useEffect } from 'react';
import { useGlobalSearch, SearchResult } from '../hooks/useGlobalSearch';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { IconFamily, IconDocument, IconPrescription, IconDiagnoses } from '../constants';

const resultIcons: { [key: string]: React.FC<any> } = {
    'Family Member': IconFamily,
    'Document': IconDocument,
    'Prescription': IconPrescription,
    'Condition': IconDiagnoses,
};

export const GlobalSearch: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const results = useGlobalSearch(searchTerm);
    const searchRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={searchRef} className="relative">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-textSecondary rounded-full hover:bg-surface-hover hover:text-textPrimary transition-colors"
                aria-label="Open search"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="absolute top-14 right-0 w-80 sm:w-96 bg-surface rounded-lg shadow-2xl border border-border z-50 origin-top-right"
                    >
                        <div className="p-3">
                            <input
                                type="text"
                                placeholder="Search anything..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                className="w-full px-3 py-2 bg-surface-soft border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT"
                            />
                        </div>
                        {searchTerm.length > 1 && (
                            <div className="max-h-96 overflow-y-auto">
                                {results.length > 0 ? (
                                    <ul>
                                        {results.map(result => {
                                            const Icon = resultIcons[result.type];
                                            return (
                                                <li key={result.id + result.type}>
                                                    <Link
                                                        to={result.link}
                                                        onClick={() => { setIsOpen(false); setSearchTerm(''); }}
                                                        className="flex items-start gap-3 px-4 py-3 hover:bg-surface-hover transition-colors"
                                                    >
                                                        {Icon && <Icon className="w-5 h-5 mt-0.5 text-textSecondary flex-shrink-0" />}
                                                        <div className="flex-1">
                                                            <p className="font-semibold text-textPrimary">{result.title}</p>
                                                            <p className="text-sm text-textSecondary">{result.description}</p>
                                                        </div>
                                                        <span className="text-xs bg-primary-light/20 text-primary-dark dark:text-primary-light px-2 py-1 rounded-full">{result.type}</span>
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p className="p-4 text-center text-sm text-textSecondary">No results found for "{searchTerm}"</p>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};