import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string | React.ReactNode;
    type?: 'info' | 'warning' | 'error' | 'success';
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    type = 'info',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    isLoading = false
}) => {
    if (!isOpen) return null;

    const colors = {
        info: 'text-blue-400 border-blue-500/30',
        warning: 'text-orange-400 border-orange-500/30',
        error: 'text-red-400 border-red-500/30',
        success: 'text-green-400 border-green-500/30'
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-100 animate-slideIn">
                <div className="p-5">
                    <h3 className={`text-lg font-bold mb-2 ${colors[type].split(' ')[0]}`}>{title}</h3>
                    <div className="text-sm text-slate-300 mb-6 leading-relaxed">
                        {message}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 py-2 px-4 bg-dark-800 border border-dark-700 rounded-lg text-slate-400 hover:bg-dark-700 text-sm font-medium transition-colors"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 py-2 px-4 rounded-lg text-white text-sm font-bold shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2
                                ${type === 'error' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'}
                                ${isLoading ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {isLoading && <span className="animate-spin h-3 w-3 border-2 border-white/30 border-t-white rounded-full"></span>}
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
