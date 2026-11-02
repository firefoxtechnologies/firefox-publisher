// Small safety helpers shared by the Worker's API routes: allowed origins, per-visitor rate limits,
// and cleaning of visitor text.

export const SITE_ORIGINS = ["https://firefoxpublisher.com", "https://www.firefoxpublisher.com"];
// The installed Android and iPhone apps (Capacitor) call the API from these origins.
export const APP_ORIGINS = ["https://localhost", "capacitor://localhost", "ionic://localhost"];
export const ALLOWED_ORIGINS = [...SITE_ORIGINS, ...APP_ORIGINS];

// A browser always sends Origin on cross-site POSTs. A missing Origin (curl, server code) is allowed
// through here and left to the rate limit: CORS only protects people's browsers, it is not a lock.
export const originAllowed = (origin) => !origin || ALLOWED_ORIGINS.includes(origin);

export function corsHeaders(origin) {
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
    vary: "origin",
  };
}

// Control characters (except newline and tab) are removed; they have no place in a form field.
export const stripControl = (v) => String(v ?? "").replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u2028\u2029]/g, "");
export const clip = (v, n) => stripControl(v).trim().slice(0, n);

// Fixed-window counter per visitor, kept in the Worker's memory. Each Cloudflare location keeps its own
// counters and they reset when the Worker restarts, so this slows abuse but is not exact.
// For a hard limit, also add a Cloudflare Rate Limiting rule (docs/security.md).
const hits = new Map();
export function rateLimited(key, limit, windowMs, now = Date.now()) {
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset <= now) hits.delete(k);
  const h = hits.get(key);
  if (!h || h.reset <= now) {
    hits.set(key, { n: 1, reset: now + windowMs });
    return false;
  }
  h.n += 1;
  return h.n > limit;
}

export const visitorKey = (request, scope) =>
  `${scope}:${request.headers.get("cf-connecting-ip") || "local"}:${(request.headers.get("user-agent") || "").slice(0, 80)}`;

export const resetRateLimits = () => hits.clear();
