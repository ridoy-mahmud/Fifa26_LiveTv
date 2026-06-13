/**
 * Stream URL chain builder.
 *
 * For each channel, we try URLs in this order:
 * 1. Raw direct URL (fastest, works for CORS-enabled HTTPS streams)
 * 2. Server proxy /api/proxy?url=... (for streams with CORS restrictions)
 * 3. Fallback URL direct (if a fallbackUrl is provided)
 * 4. Fallback URL via proxy
 *
 * For http:// streams (blocked as mixed-content on HTTPS sites), the
 * proxy is tried FIRST since direct will always fail.
 */

export function toProxy(url: string): string {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
}

function isHttp(url: string): boolean {
    return url.startsWith("http://");
}

export function buildUrlChain(url: string, fallbackUrl?: string): string[] {
    const chain: string[] = [];

    if (isHttp(url)) {
        // http:// URLs are blocked as mixed-content — proxy first
        chain.push(toProxy(url));
        chain.push(url); // last resort (works on non-HTTPS deployments)
    } else {
        // https:// — try direct first (no latency), proxy as fallback
        chain.push(url);
        chain.push(toProxy(url));
    }

    if (fallbackUrl && fallbackUrl !== url) {
        if (isHttp(fallbackUrl)) {
            chain.push(toProxy(fallbackUrl));
            chain.push(fallbackUrl);
        } else {
            chain.push(fallbackUrl);
            chain.push(toProxy(fallbackUrl));
        }
    }

    return chain;
}
