import { useState, useRef, useEffect } from 'react';

export function BrowserView() {
    const [url, setUrl] = useState('https://blurt.blog');
    const [inputUrl, setInputUrl] = useState('https://blurt.blog');
    const [loading, setLoading] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        let target = inputUrl;
        if (!target.startsWith('http')) {
            target = 'https://' + target;
        }
        setUrl(target);
        setInputUrl(target);
    };

    const handleLoad = () => {
        setLoading(false);
        injectProvider();
    };

    const injectProvider = () => {
        // Attempt to access iframe content to inject script
        // Note: This only works for same-origin or if headers allow.
        // For cross-origin DApps, this is severely limited in a Web/Hybrid App 
        // without a native WebView plugin.
        try {
            const win = iframeRef.current?.contentWindow;
            if (win) {
                console.log("[Browser] Injecting provider...");
                // In a real implementation, we would inject the full provider here
                // (win as any).hive_keychain = ...
            }
        } catch (e) {
            console.warn("[Browser] Cannot access iframe content (CORS):", e);
        }
    };

    return (
        <div className="flex flex-col h-full bg-dark-900">
            {/* Address Bar */}
            <div className="p-3 bg-dark-800 border-b border-dark-700 flex gap-2">
                <form onSubmit={handleNavigate} className="flex-1 flex gap-2">
                    <input
                        type="text"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        className="flex-1 bg-dark-900 border border-dark-600 rounded-xl px-4 py-2 text-sm text-white focus:border-purple-500 outline-none"
                        placeholder="Enter URL (e.g. blurt.blog)"
                    />
                    <button type="submit" className="bg-purple-600 p-2 rounded-xl text-white">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </button>
                </form>
            </div>

            {/* Browser Content */}
            <div className="flex-1 relative bg-white">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-dark-900 z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    </div>
                )}
                <iframe
                    ref={iframeRef}
                    src={url}
                    className="w-full h-full border-none"
                    onLoad={handleLoad}
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                    title="DApp Browser"
                />
            </div>

            <div className="bg-orange-500/20 text-orange-200 text-[10px] p-1 text-center">
                Beta Browser: Some sites may block embedding (CORS).
            </div>
        </div>
    );
}
