
import React, { useEffect } from 'react';

interface NotificationToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000); // Auto close after 3s
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColors = {
        success: 'bg-green-600/90 border-green-500/50',
        error: 'bg-red-600/90 border-red-500/50',
        info: 'bg-blue-600/90 border-blue-500/50'
    };

    return (
        <div className="absolute top-20 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none">
            <div className={`
                ${bgColors[type]} 
                text-white text-xs font-bold px-6 py-3 rounded-xl shadow-2xl border border-opacity-50
                animate-bounce-in pointer-events-auto flex items-center gap-2 backdrop-blur-md
            `}>
                {type === 'success' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                )}
                {type === 'error' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )}
                <span>{message}</span>
            </div>
        </div>
    );
};
