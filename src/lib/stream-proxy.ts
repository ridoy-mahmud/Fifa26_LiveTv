/**
 * Stream proxy helper.
 *
 * Our own server-side proxy at /api/proxy is always tried first for
 * problematic URLs (HTTP, BDIX IPs, known CORS-blocked hosts).
 * It fetches the stream server-side (no CORS restrictions) and rewrites
 * m3u8 manifests so all segment URLs also go through the proxy.
 *
 * For normal HTTPS streams that work directly, the raw URL is tried first
 * and the proxy is used as a fallback.
 */

/** Proxy every stream URL through our own /api/proxy server route */
export function toServerProxy(url: string): string {
    return `/api/proxy?url=${encodeURIComponent(url)}`;
}

/**
 * Returns true for URLs that need proxying:
 * - http:// (mixed content blocked in HTTPS pages)
 * - BDIX/LAN IP ranges (192.168.x, 10.x, 172.16-31.x, 198.195.x)
 * - Known CORS-restricted hosts
 */
export function likelyNeedsProxy(url: string): boolean {
    try {
        const u = new URL(url);
        if (u.protocol === "http:") return true;
        if (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.|198\.195\.)/.test(u.hostname))
            return true;
        // Known CORS-restricted IPTV hosts
        if (
            u.hostname.includes("27.124.71.27") ||
            u.hostname.includes("103.99.249") ||
            u.hostname.includes("103.180.212") ||
            u.hostname.includes("202.70.146") ||
            u.hostname.includes("145.239.5") ||
            u.hostname.includes("ua.online24.pm") ||
            u.hostname.includes("4kgood.org") ||
            u.hostname.includes("streamlock.net") ||
            u.hostname.includes("maxdigitaltv.com")
        )
            return true;
        return false;
    } catch {
        return false;
    }
}

/**
 * Builds an ordered list of URLs to attempt for a given stream:
 * - Needs proxy → server proxy first, raw URL as last resort
 * - Looks fine  → raw URL first, server proxy as fallback
 */
export function buildUrlChain(url: string): string[] {
    const proxied = toServerProxy(url);
    if (likelyNeedsProxy(url)) {
        return [proxied, url];
    }
    return [url, proxied];
}
