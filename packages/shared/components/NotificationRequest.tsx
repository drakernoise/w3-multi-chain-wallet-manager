import React, { useState } from 'react';

export const NotificationRequest: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');

    const handleRequest = async () => {
        setStatus('requesting');
        try {
            const perm = await Notification.requestPermission();
            if (perm === 'granted') {
                setStatus('granted');
                // Notify background script just in case
                if (typeof chrome !== 'undefined' && chrome.runtime) {
                    chrome.runtime.sendMessage({ type: 'CHAT_ENABLE_PUSH' });
                }
                setTimeout(() => {
                    // Close tab
                    window.close();
                }, 1500);
            } else {
                setStatus('denied');
            }
        } catch (e) {
            console.error(e);
            setStatus('denied');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-8 animate-fadeIn">
            <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 shadow-2xl text-center border border-slate-700">
                <div className="mx-auto w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-6 text-indigo-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold mb-4">Enable Notifications</h1>

                {status === 'idle' && (
                    <>
                        <p className="text-slate-400 mb-8">
                            Gravity Wallet needs your permission to show notifications for new messages and alerts.
                            <br /><br />
                            Click the button below to allow access.
                        </p>
                        <button
                            onClick={handleRequest}
                            className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-indigo-900/50"
                        >
                            Allow Notifications
                        </button>
                    </>
                )}

                {status === 'requesting' && (
                    <div className="flex flex-col items-center py-4">
                        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-400">Please click "Allow" on the browser popup...</p>
                    </div>
                )}

                {status === 'granted' && (
                    <div className="flex flex-col items-center py-4 text-green-400">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <p className="font-bold">Notifications Enabled!</p>
                        <p className="text-sm text-slate-500 mt-2">You can close this tab.</p>
                    </div>
                )}

                {status === 'denied' && (
                    <div className="flex flex-col items-center py-4">
                        <p className="text-red-400 font-bold mb-2">Permission Denied or Blocked</p>
                        <p className="text-sm text-slate-400 mb-4">
                            Please check your browser settings and ensure notifications are allowed for this extension via:
                            <code className="block mt-2 bg-black/30 p-2 rounded text-xs select-all">chrome://settings/content/notifications</code>
                        </p>
                        <button
                            onClick={handleRequest}
                            className="text-sm text-indigo-400 hover:text-white underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
