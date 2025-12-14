import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
    const { language, setLanguage } = useTranslation();
    return (
        <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className={`text-xs font-bold text-slate-500 hover:text-white border border-dark-700 hover:border-dark-500 rounded px-2 py-1 uppercase bg-dark-800/50 transition-colors ${className}`}
            title={language === 'en' ? 'Switch to Spanish' : 'Cambiar a Inglés'}
        >
            {language}
        </button>
    );
};
