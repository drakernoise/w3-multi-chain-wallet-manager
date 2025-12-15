import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export const LanguageToggle: React.FC<{ className?: string, direction?: 'bottom-right' | 'right-up' }> = ({ className = '', direction = 'bottom-right' }) => {
    const { language, setLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'es', label: 'Español' },
        { code: 'fr', label: 'Français' },
        { code: 'de', label: 'Deutsch' },
        { code: 'it', label: 'Italiano' }
    ];

    // Determine position classes based on direction prop
    let positionClasses = 'absolute right-0 top-full mt-2'; // Default: bottom-right
    if (direction === 'right-up') {
        positionClasses = 'absolute left-full bottom-0 ml-2';
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`relative ${className}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs font-bold text-slate-500 hover:text-white border border-dark-700 hover:border-dark-500 rounded px-2 py-1 uppercase bg-dark-800/50 transition-colors flex items-center gap-1"
                title="Change Language"
            >
                {language}
                <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`${positionClasses} w-32 bg-dark-800 border border-dark-600 rounded-lg shadow-xl z-50 overflow-hidden animate-fade-in-down`}>
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code as any);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-dark-700 transition-colors flex justify-between items-center ${language === lang.code ? 'text-blue-400 bg-dark-900/50' : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <span>{lang.label}</span>
                            {language === lang.code && <span className="text-blue-500">✓</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
