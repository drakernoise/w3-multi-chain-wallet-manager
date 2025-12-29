
import { Buffer } from 'buffer';

if (typeof window !== 'undefined') {
    // @ts-ignore
    window.global = window;
    // @ts-ignore
    window.Buffer = Buffer;
    // @ts-ignore
    window.process = {
        env: { NODE_DEBUG: false, NODE_ENV: 'production' },
        version: '',
        nextTick: (cb: any) => setTimeout(cb, 0),
        platform: 'browser',
        browser: true,
    } as any;
}
