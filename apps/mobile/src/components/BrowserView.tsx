import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InAppBrowser, ToolBarType, BackgroundColor } from '@capgo/inappbrowser';
import { mobileProvider } from '../services/mobileProvider';
import { Globe, ExternalLink, RotateCw, Plus, X } from 'lucide-react';

import { Account } from '@types';

interface BrowserViewProps {
    onClose?: () => void;
    accounts?: Account[];
}

export const BrowserView: React.FC<BrowserViewProps> = ({ onClose, accounts = [] }) => {
    const STORAGE_KEY = 'gravity_mobile_explorer_sites_v1';
    const DEFAULT_SITE_ORDER = [
        'https://hive-engine.com',
        'https://beblurt.com',
        'https://blurt.blog',
        'https://twiggy.lat',
        'https://peakd.com',
        'https://ecency.com',
        'https://steemit.com',
        'https://tribaldex.com',
        'https://splinterlands.com'
    ];
    const [inputUrl, setInputUrl] = useState('');
    const [launchingTarget, setLaunchingTarget] = useState<string | null>(null);
    const injectionScriptRef = useRef<string>('');
    const defaultDApps = useMemo(() => ([
        { name: 'Hive Engine', url: 'https://hive-engine.com', chain: 'Hive' },
        { name: 'BeBlurt', url: 'https://beblurt.com', chain: 'Blurt' },
        { name: 'Blurt Blog', url: 'https://blurt.blog', chain: 'Blurt' },
        { name: 'Twiggy', url: 'https://twiggy.lat', chain: 'Blurt' },
        { name: 'PeakD', url: 'https://peakd.com', chain: 'Hive' },
        { name: 'Ecency', url: 'https://ecency.com', chain: 'Hive' },
        { name: 'Steemit', url: 'https://steemit.com', chain: 'Steem' },
        { name: 'Tribaldex', url: 'https://tribaldex.com', chain: 'Hive' },
        { name: 'Splinterlands', url: 'https://splinterlands.com', chain: 'Hive' },
    ]), []);
    const sortSites = (sites: typeof defaultDApps) => {
        const rank = new Map(DEFAULT_SITE_ORDER.map((url, index) => [url, index]));
        return [...sites].sort((a, b) => {
            const aRank = rank.has(a.url) ? rank.get(a.url)! : Number.MAX_SAFE_INTEGER;
            const bRank = rank.has(b.url) ? rank.get(b.url)! : Number.MAX_SAFE_INTEGER;
            if (aRank !== bRank) return aRank - bRank;
            return a.name.localeCompare(b.name);
        });
    };
    const mergeWithDefaults = (sites: typeof defaultDApps) => {
        const merged = [...sites];
        defaultDApps.forEach((defaultSite) => {
            if (!merged.some((site) => site.url === defaultSite.url)) {
                merged.push(defaultSite);
            }
        });
        return sortSites(merged);
    };
    const [dApps, setDApps] = useState(mergeWithDefaults(defaultDApps));

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                setDApps(mergeWithDefaults(parsed));
            }
        } catch (e) {
            console.error('[BrowserView] Failed to load explorer sites', e);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dApps));
    }, [dApps]);

    const normalizeTarget = (value: string) => {
        let target = value.trim();
        if (!target) return '';
        if (!target.includes('.')) {
            target = 'https://www.google.com/search?q=' + encodeURIComponent(target);
        } else if (!target.startsWith('http')) {
            target = 'https://' + target;
        }
        return target;
    };

    const inferChain = (url: string) => {
        const lower = url.toLowerCase();
        if (lower.includes('blurt')) return 'Blurt';
        if (lower.includes('steem')) return 'Steem';
        return 'Hive';
    };

    const inferName = (url: string) => {
        try {
            const host = new URL(url).hostname.replace(/^www\./, '');
            return host.split('.')[0]
                .split('-')
                .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
                .join(' ');
        } catch (e) {
            return url;
        }
    };

    const getFaviconCandidates = (url: string) => {
        try {
            const parsed = new URL(url);
            const origin = parsed.origin;
            if (parsed.hostname.includes('splinterlands')) {
                return [
                    `https://www.google.com/s2/favicons?domain=${encodeURIComponent(parsed.hostname)}&sz=128`,
                    `${origin}/favicon.ico`
                ];
            }
            return [
                `${origin}/favicon.ico`,
                `https://www.google.com/s2/favicons?domain=${encodeURIComponent(parsed.hostname)}&sz=128`
            ];
        } catch (e) {
            return [];
        }
    };

    const addCurrentSite = () => {
        const target = normalizeTarget(inputUrl);
        if (!target) return;
        setDApps((current) => {
            if (current.some((site) => site.url === target)) return current;
            return mergeWithDefaults([{ name: inferName(target), url: target, chain: inferChain(target) }, ...current]);
        });
    };

    const removeSite = (url: string) => {
        setDApps((current) => sortSites(current.filter((site) => site.url !== url)));
    };

    const openBrowser = async (targetUrl: string) => {
        try {
            console.log('[BrowserView] Opening URL:', targetUrl);
            console.log('[GWDBG][browser:open]', JSON.stringify({ targetUrl, accountCount: accounts.length }));
            setInputUrl(targetUrl);
            setLaunchingTarget(targetUrl);
            
            const scriptUrl = window.location.origin + '/provider-bridge.js';
            const response = await fetch(scriptUrl);
            let injectionScript = await response.text();
            
            // Inject account info
            const accountsJson = JSON.stringify(accounts.map(a => ({ name: a.name, chain: a.chain })));
            injectionScript = `window.gravity_accounts = ${accountsJson}; \n` + injectionScript;
            injectionScriptRef.current = injectionScript;
            console.log('[GWDBG][browser:inject-script]', JSON.stringify({ scriptUrl, accountNames: accounts.map(a => a.name) }));

            await InAppBrowser.removeAllListeners();

            await InAppBrowser.addListener('closeEvent', () => {
                console.log('[BrowserView] In-app browser closed');
                console.log('[GWDBG][browser:close]');
                setLaunchingTarget(null);
            });

            await InAppBrowser.addListener('urlChangeEvent', (event: any) => {
                const nextUrl = event?.url || '';
                if (nextUrl) {
                    setInputUrl(nextUrl);
                }
                console.log('[GWDBG][browser:url-change]', JSON.stringify({ url: nextUrl }));
            });

            await InAppBrowser.addListener('browserPageLoaded', () => {
                console.log('[GWDBG][browser:page-loaded]');
                setLaunchingTarget(null);
                if (injectionScriptRef.current) {
                    [180, 700, 1500].forEach((delay) => {
                        setTimeout(() => {
                            InAppBrowser.executeScript({ code: injectionScriptRef.current }).catch(err =>
                                console.error('[BrowserView] reinject script failed', err)
                            );
                        }, delay);
                    });
                }
            });

            await InAppBrowser.addListener('pageLoadError', () => {
                console.log('[GWDBG][browser:page-load-error]');
                setLaunchingTarget(null);
            });

            await InAppBrowser.addListener('messageFromWebview', (event: any) => {
                try {
                    console.log('[BrowserView] Raw message received:', JSON.stringify(event));
                    // Handle different message formats from the bridge
                    const request = event.detail || (event.id ? event : (event.data ? event.data : null));
                    
                    if (request?.type === 'gravity_reload_request') {
                        console.log('[GWDBG][browser:reload-request]');
                        InAppBrowser.reload().catch(err => console.error('[BrowserView] reload failed', err));
                        return;
                    }

                    if (request?.type === 'gravity_navigate_request' && request?.url) {
                        console.log('[GWDBG][browser:navigate-request]', JSON.stringify({ url: request.url }));
                        setLaunchingTarget(request.url);
                        setInputUrl(request.url);
                        InAppBrowser.executeScript({
                            code: `window.location.href = ${JSON.stringify(request.url)};`
                        }).catch(err => {
                            console.error('[BrowserView] navigate script failed', err);
                            InAppBrowser.setUrl({ url: request.url }).catch(setUrlErr =>
                                console.error('[BrowserView] setUrl fallback failed', setUrlErr)
                            );
                        });
                        return;
                    }

                    if (!request || !request.method) {
                        console.warn('[BrowserView] Received invalid message format');
                        console.warn('[GWDBG][browser:invalid-message]', JSON.stringify(event));
                        return;
                    }
                    console.log('[GWDBG][browser:webview-message]', JSON.stringify({ id: request.id, method: request.method, domain: request.domain }));
                
                    // 1. Process the request via mobileProvider
                    mobileProvider.handleBridgeRequest(request, (bridgeResponse: any) => {
                        console.log('[BrowserView] Sending response back:', JSON.stringify(bridgeResponse));
                        console.log('[GWDBG][browser:response-to-webview]', JSON.stringify({ id: bridgeResponse?.id, success: bridgeResponse?.success, hasResult: !!bridgeResponse?.result, hasError: !!bridgeResponse?.error }));
                        InAppBrowser.postMessage({
                            detail: bridgeResponse
                        }).catch(err => console.error('[BrowserView] postMessage failed', err));
                    });
                } catch (e) {
                    console.error('[BrowserView] Failed to process message', e);
                    console.error('[GWDBG][browser:message-error]', String(e));
                }
            });

            await InAppBrowser.openWebView({
                url: targetUrl,
                title: 'Gravity dApp Explorer',
                toolbarType: ToolBarType.NAVIGATION, // Better for general browsing
                backgroundColor: BackgroundColor.BLACK,
                isPresentAfterPageLoad: true,
                preShowScript: injectionScript,
                showReloadButton: true,
                visibleTitle: true,
                showArrow: true,
                activeNativeNavigationForWebview: true,
                toolbarColor: '#0f172a',
                toolbarTextColor: '#ffffff'
            });
            console.log('[GWDBG][browser:opened]', JSON.stringify({ targetUrl }));
            setTimeout(() => {
                setLaunchingTarget((current) => current === targetUrl ? null : current);
            }, 15000);

        } catch (e) {
            console.error('[BrowserView] Error opening browser', e);
            console.error('[GWDBG][browser:open-error]', String(e));
            setLaunchingTarget(null);
        }
    };

    const handleGo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputUrl) return;
        const target = normalizeTarget(inputUrl);
        openBrowser(target);
    };

    return (
        <div className="flex flex-col h-full w-full space-y-6 animate-fadeIn pb-32 overflow-y-auto px-4 pt-6 bg-dark-950">
            <div className="bg-dark-800/50 border border-dark-700/50 rounded-[32px] p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                        <Globe size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-white">Web 3.0 Explorer</h2>
                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Secure Blockchain Gateway</p>
                    </div>
                </div>

                <form onSubmit={handleGo} className="relative mb-0">
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder="Enter URL or search..."
                        autoCapitalize="none"
                        autoCorrect="off"
                        autoComplete="off"
                        spellCheck={false}
                        className="w-full bg-dark-900 border border-dark-600 rounded-2xl py-4 pl-12 pr-28 text-sm font-medium text-white focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
                    />
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <button
                        type="button"
                        onClick={addCurrentSite}
                        className="absolute right-20 top-1/2 -translate-y-1/2 bg-dark-700 text-slate-200 px-3 py-2 rounded-xl text-[11px] font-black transition-all active:scale-95"
                    >
                        <Plus size={14} />
                    </button>
                    <button 
                        type="submit"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-black hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-900/40"
                    >
                        GO
                    </button>
                </form>
                <p className="mt-3 px-1 text-[10px] font-semibold tracking-[0.18em] uppercase text-slate-500">
                    Add or remove your landing shortcuts here. Inside the webview you now get a fixed top browser bar instead of the floating menu.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {dApps.map((dApp) => (
                    <div
                        key={dApp.url}
                        onClick={() => openBrowser(dApp.url)}
                        className={`bg-dark-800/40 border border-dark-700/30 p-5 rounded-[28px] flex flex-col items-center gap-4 transition-all active:scale-[0.97] hover:bg-dark-700/60 group relative overflow-hidden h-44 ${launchingTarget ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                    >
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation();
                                removeSite(dApp.url);
                            }}
                            className="absolute left-3 top-3 z-10 rounded-full bg-dark-950/85 p-2 text-slate-400 opacity-70 transition hover:opacity-100"
                            aria-label={`Remove ${dApp.name}`}
                        >
                            <X size={14} />
                        </button>
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ExternalLink size={20} />
                        </div>
                        <div className="w-20 h-20 bg-white shadow-xl rounded-2xl flex items-center justify-center border-4 border-dark-900 overflow-hidden transform group-hover:scale-110 group-hover:rotate-2 transition-all duration-500">
                            <img
                                src={getFaviconCandidates(dApp.url)[0]}
                                alt={dApp.name}
                                className="w-12 h-12 object-contain"
                                onError={(event) => {
                                    const img = event.currentTarget;
                                    const next = img.dataset.fallbackIndex ? Number(img.dataset.fallbackIndex) + 1 : 1;
                                    const candidates = getFaviconCandidates(dApp.url);
                                    if (next < candidates.length) {
                                        img.dataset.fallbackIndex = String(next);
                                        img.src = candidates[next];
                                        return;
                                    }
                                    img.src = '/vite.svg';
                                }}
                            />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{dApp.name}</p>
                            <div className="mt-1.5 flex items-center justify-center gap-1.5 bg-dark-900/50 px-3 py-1 rounded-full border border-white/5">
                                <span className={`w-1.5 h-1.5 rounded-full ${dApp.chain === 'Hive' ? 'bg-red-500' : dApp.chain === 'Steem' ? 'bg-blue-500 shadow-blue-500/50' : 'bg-orange-500 shadow-orange-500/50'} shadow-sm animate-pulse`}></span>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{dApp.chain}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {launchingTarget && (
                <div className="fixed inset-0 z-40 bg-dark-950/78 backdrop-blur-sm flex items-center justify-center px-6">
                    <div className="w-full max-w-sm rounded-[28px] border border-blue-500/20 bg-slate-950/92 p-6 shadow-2xl text-center">
                        <div className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-blue-500/30 border-t-blue-400 animate-spin" />
                        <div className="text-sm font-black uppercase tracking-[0.22em] text-blue-300">Opening dApp</div>
                        <div className="mt-3 text-xs font-semibold text-slate-400 break-all">{launchingTarget}</div>
                        <div className="mt-4 text-[11px] text-slate-500">Please wait. Repeated taps are disabled while the webview is preparing.</div>
                    </div>
                </div>
            )}

            <div className="bg-blue-600/5 border border-blue-500/10 rounded-[32px] p-6 text-center shadow-inner relative group">
                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px]"></div>
                <div className="flex items-center justify-center gap-2 mb-2 text-blue-400">
                    <RotateCw size={14} className="animate-spin-slow" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em]">Navigation Control</h3>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed font-semibold px-4">
                    Use the <span className="text-blue-400 font-bold border-b border-blue-400/30 pb-0.5">reload button</span> at the top to refresh. <br/>
                    <span className="text-[8px] opacity-40 italic">Native pull-to-refresh is currently limited by the engine.</span>
                </p>
            </div>
        </div>
    );
};
