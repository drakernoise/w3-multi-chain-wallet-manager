import React from 'react';
import { useTranslation } from '../contexts/LanguageContext';

export const HelpView: React.FC = () => {
    const { t } = useTranslation();

    // Reusing SVG icons from Sidebar and WalletView for consistency
    const icons = {
        home: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
        wallet: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />,
        bulk: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />,
        multisig: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
        settings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
        lock: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
        detach: <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z" stroke="currentColor" fill="currentColor" />,
        send: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />,
        receive: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />,
        history: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    };

    const navItems = [
        { icon: icons.home, label: t('sidebar.home'), desc: t('help.btn_home') },
        { icon: icons.wallet, label: t('sidebar.wallet'), desc: t('help.btn_wallet') },
        { icon: icons.bulk, label: t('sidebar.bulk'), desc: t('help.btn_bulk') },
        { icon: icons.multisig, label: t('sidebar.multisig'), desc: t('help.btn_multisig') },
        { icon: icons.settings, label: t('sidebar.manage'), desc: t('help.btn_settings') },
        { icon: icons.lock, label: t('sidebar.lock'), desc: t('help.btn_lock') },
        { icon: icons.detach, label: t('sidebar.pin'), desc: t('help.btn_detach') },
    ];

    const actionItems = [
        { icon: icons.send, label: t('wallet.send'), desc: t('help.btn_send') },
        { icon: icons.receive, label: t('wallet.receive'), desc: t('help.btn_receive') },
        { icon: icons.history, label: t('wallet.history'), desc: t('help.btn_history') },
        { icon: icons.wallet, label: t('wallet.keys'), desc: t('help.btn_keys') }, // Reuse wallet icon for keys
    ];

    return (
        <div className="h-full overflow-y-auto p-4 custom-scrollbar text-slate-300 space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dark-700 pb-2">{t('help.title')}</h2>

            {/* Navigation Guide */}
            <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Navigation</h3>
                <div className="space-y-3">
                    {navItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 bg-dark-800 p-3 rounded-xl border border-dark-700">
                            <div className="shrink-0 w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{item.label}</h4>
                                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Actions Guide */}
            <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Account Actions</h3>
                <div className="space-y-3">
                    {actionItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 bg-dark-800 p-3 rounded-xl border border-dark-700">
                            <div className="shrink-0 w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{item.label}</h4>
                                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-dark-800 rounded-xl p-5 border border-dark-700 shadow-lg mt-8">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {t('help.security_title')}
                </h3>
                <p className="text-sm leading-relaxed">{t('help.security_desc')}</p>
            </section>
        </div>
    );
};
