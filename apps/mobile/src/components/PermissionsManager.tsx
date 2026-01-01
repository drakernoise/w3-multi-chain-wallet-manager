import React from 'react';
import { DAppPermission } from '../services/mobileProvider';
import { useTranslation } from 'gravity-shared/contexts/LanguageContext';

interface PermissionsManagerProps {
    permissions: DAppPermission[];
    onRevoke: (domain: string) => void;
    onClose: () => void;
}

export const PermissionsManager: React.FC<PermissionsManagerProps> = ({ permissions, onRevoke, onClose }) => {
    const { t } = useTranslation();

    const formatTimeRemaining = (expiresAt: number) => {
        const now = Date.now();
        const remaining = expiresAt - now;

        if (remaining < 0) return t('mobile.expired') || 'Expired';

        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        const hours = Math.floor((remaining % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

        if (days > 0) return `${days}d ${hours}h`;
        return `${hours}h`;
    };

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-dark-800 rounded-2xl border border-dark-700 w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-dark-700">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-white">{t('mobile.dapp_permissions') || 'dApp Permissions'}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <p className="text-sm text-slate-400 mt-2">
                        {t('mobile.permissions_desc') || 'Manage which sites can auto-approve operations'}
                    </p>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {permissions.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 mx-auto text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-slate-400">{t('mobile.no_permissions') || 'No active permissions'}</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {permissions.map((permission) => (
                                <div
                                    key={permission.domain}
                                    className="bg-dark-900/50 rounded-lg p-4 border border-dark-700"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="font-bold text-white mb-1">{permission.domain}</div>
                                            <div className="text-xs text-slate-400">
                                                {t('mobile.expires_in') || 'Expires in'}: {formatTimeRemaining(permission.expiresAt)}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onRevoke(permission.domain)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-1">
                                        {permission.operations.map((op) => (
                                            <span
                                                key={op}
                                                className="text-xs bg-blue-900/30 border border-blue-500/30 text-blue-300 px-2 py-1 rounded"
                                            >
                                                {op}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-dark-700/50 text-xs text-slate-500">
                                        {t('mobile.granted') || 'Granted'}: {new Date(permission.grantedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {permissions.length > 0 && (
                    <div className="p-6 border-t border-dark-700">
                        <button
                            onClick={() => {
                                permissions.forEach(p => onRevoke(p.domain));
                            }}
                            className="w-full bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 font-bold py-3 rounded-xl transition-colors"
                        >
                            {t('mobile.revoke_all') || 'Revoke All Permissions'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
