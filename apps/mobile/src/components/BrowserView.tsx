import React, { useEffect, useMemo, useRef, useState } from 'react';
import { InAppBrowser, ToolBarType, BackgroundColor } from '@capgo/inappbrowser';
import { mobileProvider } from '../services/mobileProvider';
import {
    ArrowLeft,
    ArrowRight,
    LockKeyhole,
    MoreVertical,
    Moon,
    Plus,
    Search,
    ShieldCheck,
    Sun,
    X
} from 'lucide-react';

import { Account } from '@types';

interface BrowserViewProps {
    onClose?: () => void;
    accounts?: Account[];
}

export const BrowserView: React.FC<BrowserViewProps> = ({ onClose, accounts = [] }) => {
    const STORAGE_KEY = 'gravity_mobile_explorer_sites_v1';
    const THEME_STORAGE_KEY = 'gravity_mobile_explorer_theme_v1';
    const BRIDGE_VERSION = 'bridge-2026-03-21-1';
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
    const [showMenu, setShowMenu] = useState(false);
    const [launchingTarget, setLaunchingTarget] = useState<string | null>(null);
    const [systemDark, setSystemDark] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    const [themePreference, setThemePreference] = useState<'system' | 'light' | 'dark'>(() => {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        return stored === 'light' || stored === 'dark' ? stored : 'system';
    });
    const isDark = themePreference === 'system' ? systemDark : themePreference === 'dark';
    const injectionScriptRef = useRef<string>('');
    const initialTargetRef = useRef<string | null>(null);
    const peakdResetAttemptedRef = useRef(false);
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

    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const updateSystemTheme = (event: MediaQueryListEvent) => setSystemDark(event.matches);
        setSystemDark(media.matches);
        media.addEventListener('change', updateSystemTheme);
        return () => media.removeEventListener('change', updateSystemTheme);
    }, []);

    useEffect(() => {
        localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    }, [themePreference]);

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
            initialTargetRef.current = targetUrl;
            peakdResetAttemptedRef.current = false;
            
            const scriptUrl = `${window.location.origin}/provider-bridge.js?v=${encodeURIComponent(BRIDGE_VERSION)}`;
            const response = await fetch(scriptUrl, { cache: 'no-store' });
            let injectionScript = await response.text();
            
            // Inject account info
            const accountsJson = JSON.stringify(accounts.map(a => ({ name: a.name, chain: a.chain })));
            injectionScript = `window.gravity_accounts = ${accountsJson}; window.__gravityBridgeVersion = ${JSON.stringify(BRIDGE_VERSION)}; console.log('[GWDBG][bridge-version]', window.__gravityBridgeVersion); \n` + injectionScript;
            injectionScriptRef.current = injectionScript;
            console.log('[GWDBG][browser:inject-script]', JSON.stringify({ scriptUrl, bridgeVersion: BRIDGE_VERSION, accountNames: accounts.map(a => a.name) }));

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

                const initialTarget = initialTargetRef.current;
                if (
                    initialTarget &&
                    !peakdResetAttemptedRef.current &&
                    initialTarget.replace(/\/+$/, '') === 'https://peakd.com' &&
                    /^https:\/\/peakd\.com\/@[^/]+\/feed\/?$/i.test(nextUrl)
                ) {
                    peakdResetAttemptedRef.current = true;
                    console.log('[GWDBG][browser:peakd-reset-trigger]', JSON.stringify({ initialTarget, redirectedTo: nextUrl }));
                    const resetPeakdState = `
                        (async () => {
                            try {
                                localStorage.clear();
                                sessionStorage.clear();
                                if (window.indexedDB && typeof window.indexedDB.databases === 'function') {
                                    const dbs = await window.indexedDB.databases();
                                    await Promise.all((dbs || []).map((db) => db && db.name ? new Promise((resolve) => {
                                        const req = window.indexedDB.deleteDatabase(db.name);
                                        req.onsuccess = req.onerror = req.onblocked = () => resolve(true);
                                    }) : Promise.resolve(true)));
                                }
                                if (window.caches && typeof window.caches.keys === 'function') {
                                    const keys = await window.caches.keys();
                                    await Promise.all(keys.map((key) => window.caches.delete(key)));
                                }
                                if (navigator.serviceWorker && typeof navigator.serviceWorker.getRegistrations === 'function') {
                                    const regs = await navigator.serviceWorker.getRegistrations();
                                    await Promise.all(regs.map((reg) => reg.unregister()));
                                }
                            } catch (error) {
                                console.error('[GWDBG][browser:peakd-reset-script-error]', error);
                            }
                            window.location.replace('https://peakd.com/');
                        })();
                    `;
                    InAppBrowser.clearCookies({ url: 'https://peakd.com' }).catch((err) =>
                        console.error('[BrowserView] peakd clearCookies failed', err)
                    );
                    InAppBrowser.executeScript({ code: resetPeakdState }).catch((err) =>
                        console.error('[BrowserView] peakd reset script failed', err)
                    );
                }
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
                title: inferName(targetUrl),
                toolbarType: ToolBarType.NAVIGATION,
                backgroundColor: isDark ? BackgroundColor.BLACK : BackgroundColor.WHITE,
                isPresentAfterPageLoad: true,
                preShowScript: injectionScript,
                showReloadButton: true,
                visibleTitle: true,
                showArrow: true,
                activeNativeNavigationForWebview: true,
                toolbarColor: isDark ? '#202124' : '#ffffff',
                toolbarTextColor: isDark ? '#f1f3f4' : '#202124'
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
        setShowMenu(false);
        openBrowser(target);
    };

    const toggleDarkMode = () => {
        setThemePreference(isDark ? 'light' : 'dark');
    };

    return (
        <div className={`relative flex h-full w-full flex-col overflow-y-auto px-4 pb-28 pt-2 animate-fadeIn no-scrollbar transition-colors ${
            isDark ? 'bg-[#202124] text-[#e8eaed]' : 'bg-[#f8f9fa] text-[#202124]'
        }`}>
            <div className="relative flex h-12 shrink-0 items-center justify-between">
                <button
                    type="button"
                    onClick={onClose}
                    className={`flex h-10 w-10 items-center justify-center rounded-full bg-transparent ${
                        isDark ? 'text-[#bdc1c6] active:bg-[#3c4043]' : 'text-[#5f6368] active:bg-[#e8eaed]'
                    }`}
                    aria-label="Back to wallet"
                >
                    <ArrowLeft size={22} />
                </button>
                <div className={`text-sm font-medium ${isDark ? 'text-[#bdc1c6]' : 'text-[#5f6368]'}`}>New tab</div>
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={toggleDarkMode}
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-transparent ${
                            isDark ? 'text-[#bdc1c6] active:bg-[#3c4043]' : 'text-[#5f6368] active:bg-[#e8eaed]'
                        }`}
                        aria-label={isDark ? 'Use light mode' : 'Use dark mode'}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowMenu((current) => !current)}
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-transparent ${
                            isDark ? 'text-[#bdc1c6] active:bg-[#3c4043]' : 'text-[#5f6368] active:bg-[#e8eaed]'
                        }`}
                        aria-label="Browser menu"
                    >
                        <MoreVertical size={22} />
                    </button>
                </div>

                {showMenu && (
                    <div className={`absolute right-0 top-11 z-30 w-60 overflow-hidden rounded-xl border py-2 text-sm shadow-xl ${
                        isDark ? 'border-[#5f6368] bg-[#303134] text-[#e8eaed]' : 'border-[#dadce0] bg-white text-[#202124]'
                    }`}>
                        <button
                            type="button"
                            onClick={toggleDarkMode}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                                isDark ? 'active:bg-[#3c4043]' : 'active:bg-[#f1f3f4]'
                            }`}
                        >
                            {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            {isDark ? 'Light mode' : 'Dark mode'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setThemePreference('system');
                                setShowMenu(false);
                            }}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                                isDark ? 'active:bg-[#3c4043]' : 'active:bg-[#f1f3f4]'
                            }`}
                        >
                            <ShieldCheck size={18} />
                            Use device theme
                            {themePreference === 'system' && <span className="ml-auto text-[#1a73e8]">On</span>}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                addCurrentSite();
                                setShowMenu(false);
                            }}
                            disabled={!inputUrl}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left disabled:opacity-40 ${
                                isDark ? 'active:bg-[#3c4043]' : 'active:bg-[#f1f3f4]'
                            }`}
                        >
                            <Plus size={18} />
                            Add current shortcut
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowMenu(false)}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                                isDark ? 'active:bg-[#3c4043]' : 'active:bg-[#f1f3f4]'
                            }`}
                        >
                            <X size={18} />
                            Close menu
                        </button>
                    </div>
                )}
            </div>

            <div className="mx-auto mt-[7vh] flex w-full max-w-md flex-col items-center">
                <div className="mb-7 flex items-center gap-3">
                    <img src="/logowallet.png" alt="Gravity" className="h-14 w-14 rounded-full shadow-sm" />
                    <div className={`text-[34px] font-medium tracking-[-0.04em] ${isDark ? 'text-[#e8eaed]' : 'text-[#3c4043]'}`}>Gravity</div>
                </div>

                <form onSubmit={handleGo} className="w-full">
                    <div className={`flex h-13 min-h-[52px] w-full items-center rounded-[26px] border border-transparent px-4 shadow-sm transition focus-within:shadow-md ${
                        isDark
                            ? 'bg-[#303134] focus-within:border-[#5f6368] focus-within:bg-[#303134]'
                            : 'bg-[#eef0f3] focus-within:border-[#d2e3fc] focus-within:bg-white'
                    }`}>
                        <Search size={20} className={`mr-3 shrink-0 ${isDark ? 'text-[#bdc1c6]' : 'text-[#5f6368]'}`} />
                        <input
                            type="text"
                            value={inputUrl}
                            onChange={(event) => setInputUrl(event.target.value)}
                            placeholder="Search or type web address"
                            autoCapitalize="none"
                            autoCorrect="off"
                            autoComplete="off"
                            spellCheck={false}
                            className={`min-w-0 flex-1 border-none bg-transparent text-[16px] outline-none ${
                                isDark ? 'text-[#e8eaed] placeholder:text-[#9aa0a6]' : 'text-[#202124] placeholder:text-[#5f6368]'
                            }`}
                        />
                        {inputUrl && (
                            <button
                                type="button"
                                onClick={() => setInputUrl('')}
                                className={`mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                                    isDark ? 'text-[#bdc1c6] active:bg-[#5f6368]' : 'text-[#5f6368] active:bg-[#dadce0]'
                                }`}
                                aria-label="Clear address"
                            >
                                <X size={18} />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={!inputUrl || Boolean(launchingTarget)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#1a73e8] active:bg-[#d2e3fc] disabled:opacity-30"
                            aria-label="Open address"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </form>

                <div className="mt-7 grid w-full grid-cols-4 gap-x-2 gap-y-6 px-1">
                    {dApps.slice(0, 8).map((dApp) => (
                        <button
                            type="button"
                            key={dApp.url}
                            onClick={() => openBrowser(dApp.url)}
                            disabled={Boolean(launchingTarget)}
                            className={`group flex min-w-0 flex-col items-center gap-2 bg-transparent p-0 disabled:opacity-40 ${
                                isDark ? 'text-[#e8eaed]' : 'text-[#3c4043]'
                            }`}
                        >
                            <span className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-full shadow-sm transition-transform group-active:scale-95 ${
                                isDark ? 'bg-[#303134]' : 'bg-[#e8eaed]'
                            }`}>
                                <img
                                    src={getFaviconCandidates(dApp.url)[0]}
                                    alt=""
                                    className="h-7 w-7 object-contain"
                                    onError={(event) => {
                                        const img = event.currentTarget;
                                        const next = img.dataset.fallbackIndex ? Number(img.dataset.fallbackIndex) + 1 : 1;
                                        const candidates = getFaviconCandidates(dApp.url);
                                        if (next < candidates.length) {
                                            img.dataset.fallbackIndex = String(next);
                                            img.src = candidates[next];
                                            return;
                                        }
                                        img.src = '/logowallet.png';
                                    }}
                                />
                            </span>
                            <span className="w-full truncate px-1 text-center text-[11px] font-medium">{dApp.name}</span>
                        </button>
                    ))}
                </div>

                <div className={`mt-8 flex w-full items-center justify-between border-t pt-4 ${
                    isDark ? 'border-[#3c4043]' : 'border-[#dadce0]'
                }`}>
                    <div>
                        <div className={`text-sm font-medium ${isDark ? 'text-[#e8eaed]' : 'text-[#3c4043]'}`}>Your dApps</div>
                        <div className={`mt-0.5 text-xs ${isDark ? 'text-[#9aa0a6]' : 'text-[#80868b]'}`}>{dApps.length} saved sites</div>
                    </div>
                    <button
                        type="button"
                        onClick={addCurrentSite}
                        disabled={!inputUrl}
                        className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium text-[#1a73e8] disabled:opacity-40 ${
                            isDark ? 'border-[#5f6368] bg-[#303134] active:bg-[#3c4043]' : 'border-[#dadce0] bg-white active:bg-[#f1f3f4]'
                        }`}
                    >
                        <Plus size={16} />
                        Add shortcut
                    </button>
                </div>

                {dApps.length > 8 && (
                    <div className={`mt-3 w-full overflow-hidden rounded-2xl border ${
                        isDark ? 'border-[#5f6368] bg-[#303134]' : 'border-[#dadce0] bg-white'
                    }`}>
                        {dApps.slice(8).map((dApp) => (
                            <div key={dApp.url} className={`flex items-center border-b last:border-b-0 ${
                                isDark ? 'border-[#3c4043]' : 'border-[#f1f3f4]'
                            }`}>
                                <button
                                    type="button"
                                    onClick={() => openBrowser(dApp.url)}
                                    className={`flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left ${
                                        isDark ? 'active:bg-[#3c4043]' : 'active:bg-[#f1f3f4]'
                                    }`}
                                >
                                    <img
                                        src={getFaviconCandidates(dApp.url)[0]}
                                        alt=""
                                        className="h-6 w-6 object-contain"
                                        onError={(event) => {
                                            event.currentTarget.src = '/logowallet.png';
                                        }}
                                    />
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-medium">{dApp.name}</span>
                                        <span className={`block truncate text-xs ${isDark ? 'text-[#9aa0a6]' : 'text-[#80868b]'}`}>{dApp.url}</span>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeSite(dApp.url)}
                                    className={`mr-2 flex h-10 w-10 items-center justify-center rounded-full ${
                                        isDark ? 'text-[#bdc1c6] active:bg-[#3c4043]' : 'text-[#5f6368] active:bg-[#f1f3f4]'
                                    }`}
                                    aria-label={`Remove ${dApp.name}`}
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className={`mt-6 flex w-full items-start gap-3 rounded-2xl px-4 py-4 text-left ${
                    isDark ? 'bg-[#202e3f]' : 'bg-[#e8f0fe]'
                }`}>
                    <ShieldCheck size={21} className="mt-0.5 shrink-0 text-[#1967d2]" />
                    <div>
                        <div className="text-sm font-medium text-[#174ea6]">Gravity signing enabled</div>
                        <div className={`mt-1 text-xs leading-relaxed ${isDark ? 'text-[#bdc1c6]' : 'text-[#3c4043]'}`}>
                            Supported dApps can request signatures without exposing your private keys.
                        </div>
                    </div>
                    <LockKeyhole size={16} className="ml-auto mt-0.5 shrink-0 text-[#1967d2]" />
                </div>
            </div>

            {launchingTarget && (
                <div className={`fixed inset-0 z-40 flex items-center justify-center px-6 backdrop-blur-sm ${
                    isDark ? 'bg-[#202124]/90' : 'bg-white/85'
                }`}>
                    <div className={`w-full max-w-sm rounded-2xl border p-6 text-center shadow-xl ${
                        isDark ? 'border-[#5f6368] bg-[#303134]' : 'border-[#dadce0] bg-white'
                    }`}>
                        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-[#d2e3fc] border-t-[#1a73e8]" />
                        <div className={`text-sm font-medium ${isDark ? 'text-[#e8eaed]' : 'text-[#202124]'}`}>Opening page</div>
                        <div className={`mt-2 break-all text-xs ${isDark ? 'text-[#bdc1c6]' : 'text-[#5f6368]'}`}>{launchingTarget}</div>
                    </div>
                </div>
            )}
        </div>
    );
};
