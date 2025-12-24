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
        history: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
        power: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
        savings: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
        rc: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
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
        { icon: icons.power, label: 'Power up/down', desc: t('help.btn_powerup') },
        { icon: icons.savings, label: 'Savings', desc: t('help.btn_savings') },
        { icon: icons.rc, label: 'Resource Credits', desc: t('help.btn_rc') },
    ];

    return (
        <div className="h-full overflow-y-auto p-4 custom-scrollbar text-slate-300 space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-dark-700 pb-2">{t('help.title')}</h2>

            {/* Core Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-dark-800 p-5 rounded-2xl border border-dark-700">
                    <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                        {t('help.keys_title')}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">{t('help.keys_desc')}</p>
                    <ul className="space-y-2 text-sm">
                        <li><strong className="text-white">Posting:</strong> {t('help.posting_key_desc')}</li>
                        <li><strong className="text-white">Active:</strong> {t('help.active_key_desc')}</li>
                        <li><strong className="text-white">Memo:</strong> {t('help.memo_key_desc')}</li>
                    </ul>
                </section>

                <section className="bg-dark-800 p-5 rounded-2xl border border-dark-700">
                    <h3 className="text-pink-400 font-bold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        {t('help.power_title')}
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">{t('help.power_desc')}</p>
                    <ul className="space-y-2 text-sm">
                        <li className="flex gap-2 text-slate-300">• {t('help.power_point')}</li>
                        <li className="flex gap-2 text-slate-300">• {t('help.power_down_point')}</li>
                        <li className="flex gap-2 text-slate-300">• {t('help.delegate_point')}</li>
                    </ul>
                </section>
            </div>

            {/* Account Actions Section */}
            <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Account Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {actionItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 bg-dark-900/50 p-3 rounded-xl border border-dark-700/50 hover:border-dark-600 transition-colors">
                            <div className="shrink-0 w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-[13px]">{item.label}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Navigation Guide */}
            <section>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Main Navigation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {navItems.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 bg-dark-900/50 p-3 rounded-xl border border-dark-700/50">
                            <div className="shrink-0 w-10 h-10 bg-dark-800 rounded-lg flex items-center justify-center text-slate-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-[13px]">{item.label}</h4>
                                <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-blue-900/10 rounded-2xl p-6 border border-blue-500/20 shadow-lg mt-8">
                <h3 className="text-lg font-bold text-blue-400 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    {t('help.security_title')}
                </h3>
                <p className="text-sm leading-relaxed text-slate-400">{t('help.security_desc')}</p>
            </section>

            {/* Authenticator & Advanced Config */}
            <section className="bg-dark-800 rounded-2xl p-6 border border-dark-700 shadow-lg mt-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                    Two-Factor Authentication
                </h3>

                <div className="space-y-6">
                    <div>
                        <h4 className="font-bold text-sm text-blue-400 mb-2">Can I use multiple apps? (Aegis + Google Auth)</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">
                            Yes! You can have the same code generated on multiple devices or apps simultaneously.
                            To do this:
                        </p>
                        <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 ml-2">
                            <li><span className="text-slate-400">Go to Settings &gt; Authenticator App to reveal the QR Code.</span></li>
                            <li><span className="text-slate-400">Scan this <strong>same QR code</strong> with Aegis.</span></li>
                            <li><span className="text-slate-400">Scan it <strong>again</strong> with Google Authenticator.</span></li>
                            <li><span className="text-slate-400">Both apps will now generate identical codes that work for unlocking.</span></li>
                        </ol>
                    </div>

                    <div className="border-t border-dark-700 pt-4">
                        <h4 className="font-bold text-sm text-purple-400 mb-2">Visual Guides</h4>
                        <p className="text-xs text-slate-400 mb-4">
                            How to configure your wallet securely:
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-dark-900 p-2 rounded-lg border border-dark-700">
                                <div className="aspect-video bg-dark-800 rounded flex items-center justify-center mb-2 overflow-hidden">
                                    {/* Placeholder for GIF */}
                                    {/* To enable this, place 'setup_2fa.gif' in public/images/help/ */}
                                    <img
                                        src="/images/help/setup_2fa.gif"
                                        alt="2FA Setup Animation"
                                        className="w-full h-full object-cover opacity-80"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY2xhc3M9InRleHQtc2xhdGUtNzAwIj48cGF0aCBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0xNSAxMGEzIDMgMCAxMTYgMCAzIDMgMCAwMS02IDB6Ii8+PHBhdGggc3Ryb2tlPSJjdXJyZW50Q29xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0yLjQ1OCAxMmMyLjUxOS02Ljg3NiA5LjY3Mi02Ljg3NiAxOS4wODQgMG0tMi40NTggNmMtMi41MTkgNi44NzYtOS42NzIgNi44NzYtMTkuMDg0IDAiLz48L3N2Zz4=';
                                            (e.target as HTMLImageElement).classList.add('p-8');
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono block text-center">setup_2fa.gif</span>
                            </div>

                            <div className="bg-dark-900 p-2 rounded-lg border border-dark-700">
                                <div className="aspect-video bg-dark-800 rounded flex items-center justify-center mb-2 overflow-hidden">
                                    {/* Placeholder for GIF */}
                                    <img
                                        src="/images/help/multi_chain.gif"
                                        alt="Multi Chain Animation"
                                        className="w-full h-full object-cover opacity-80"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgY2xhc3M9InRleHQtc2xhdGUtNzAwIj48cGF0aCBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjEiIGQ9Ik0xMyAxMFYzbC05IDExaDd2N2w5LTExaC03eiIvPjwvc3ZnPg==';
                                            (e.target as HTMLImageElement).classList.add('p-8');
                                        }}
                                    />
                                </div>
                                <span className="text-[10px] text-slate-500 font-mono block text-center">multi_chain.gif</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
