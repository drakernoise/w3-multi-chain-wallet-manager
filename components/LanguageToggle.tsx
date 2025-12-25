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
                className="text-xs font-bold text-slate-300 hover:text-white border border-dark-600 hover:border-blue-500/50 rounded-lg px-3 py-1.5 uppercase bg-dark-800/80 backdrop-blur-sm transition-all flex items-center gap-2 shadow-lg"
                title="Change Language"
            >
                <span className="opacity-70">{language}</span>
                <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`${positionClasses} w-36 bg-dark-800/95 backdrop-blur-md border border-dark-600 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[9999] overflow-hidden`}>
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code as any);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all flex justify-between items-center ${language === lang.code
                                    ? 'text-blue-400 bg-blue-500/10'
                                    : 'text-slate-400 hover:text-white hover:bg-dark-700'
                                    }`}
                            >
                                <span>{lang.label}</span>
                                {language === lang.code && (
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
