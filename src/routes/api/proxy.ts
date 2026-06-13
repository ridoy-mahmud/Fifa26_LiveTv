/**
 * Server-side HLS stream proxy.
 *
 * GET /api/proxy?url=<encoded-stream-url>
 *
 * Fetches the target URL server-side (no CORS) and streams it back to the
 * browser with appropriate Access-Control-Allow-Origin headers.
 * Works for both .m3u8 manifests and .ts segments.
 *
 * Also rewrites relative URLs inside m3u8 manifests so segment requests
 * also go through this proxy.
 */
import { createAPIFileRoute } from "@tanstack/react-start/api";

const ALLOWED_CONTENT_TYPES = [
    "application/vnd.apple.mpegurl",
    "application/x-mpegurl",
    "video/mp2t",
    "video/mpeg",
    "text/plain",
    "application/octet-stream",
    "binary/octet-stream",
];

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "*",
};

function isM3u8(url: string, contentType: string): boolean {
    return (
        url.includes(".m3u8") ||
        url.includes(".m3u") ||
        contentType.includes("mpegurl") ||
        contentType.includes("x-mpegurl")
    );
}

/**
 * Rewrite an m3u8 manifest so all relative URIs go through our proxy.
 * Absolute URIs are also rewritten.
 */
function rewriteM3u8(text: string, baseUrl: string, proxyBase: string): string {
    const base = new URL(baseUrl);

    return text
        .split("\n")
        .map((line) => {
            const trimmed = line.trim();
            // Skip comment lines and blank lines
            if (!trimmed || trimmed.startsWith("#")) return line;

            // Resolve against base URL
            let absolute: string;
            try {
                absolute = new URL(trimmed, base).href;
            } catch {
                return line; // not a URL — leave it
            }

            return `${proxyBase}?url=${encodeURIComponent(absolute)}`;
        })
        .join("\n");
}

export const APIRoute = createAPIFileRoute("/api/proxy")({
    GET: async ({ request }) => {
        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
        }

        const reqUrl = new URL(request.url);
        const target = reqUrl.searchParams.get("url");

        if (!target) {
            return new Response("Missing url parameter", {
                status: 400,
                headers: CORS_HEADERS,
            });
        }

        let targetUrl: URL;
        try {
            targetUrl = new URL(target);
        } catch {
            return new Response("Invalid url parameter", {
                status: 400,
                headers: CORS_HEADERS,
            });
        }

        // Security: only allow http/https streams
        if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
            return new Response("Protocol not allowed", {
                status: 403,
                headers: CORS_HEADERS,
            });
        }

        try {
            const upstream = await fetch(target, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
                    Accept: "*/*",
                    "Accept-Language": "en-US,en;q=0.9",
                    Referer: `${targetUrl.origin}/`,
                    Origin: targetUrl.origin,
                },
                // Follow redirects
                redirect: "follow",
            });

            if (!upstream.ok) {
                return new Response(`Upstream returned ${upstream.status}`, {
                    status: upstream.status,
                    headers: CORS_HEADERS,
                });
            }

            const contentType =
                upstream.headers.get("content-type") ?? "application/octet-stream";

            // For m3u8 manifests: rewrite internal URLs through this proxy
            if (isM3u8(target, contentType)) {
                const text = await upstream.text();
                const proxyBase = `${reqUrl.origin}/api/proxy`;
                const rewritten = rewriteM3u8(text, target, proxyBase);

                return new Response(rewritten, {
                    status: 200,
                    headers: {
                        ...CORS_HEADERS,
                        "Content-Type": "application/vnd.apple.mpegurl; charset=utf-8",
                        "Cache-Control": "no-cache, no-store",
                    },
                });
            }

            // For TS segments and other binary: stream through
            return new Response(upstream.body, {
                status: 200,
                headers: {
                    ...CORS_HEADERS,
                    "Content-Type": contentType,
                    "Cache-Control": "no-cache",
                },
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            return new Response(`Proxy fetch failed: ${msg}`, {
                status: 502,
                headers: CORS_HEADERS,
            });
        }
    },

    OPTIONS: async () =>
        new Response(null, { status: 204, headers: CORS_HEADERS }),
});
