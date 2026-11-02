# Security: what is done, what only you can do

Nothing can be made "unhackable". This site is mostly static files on Cloudflare, which already removes most attack surface (no database, no logins, no admin area). The layers below make attacks harder and mistakes less costly.

## Already in the code
- **Security headers on every page** (`website-react/public/_headers`): HSTS, `frame-ancestors`/`object-src`/`base-uri`/`form-action` Content-Security-Policy, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy, Cross-Origin-Opener-Policy. There is deliberately no `script-src` rule, because the Tawk.to chat widget (and Cloudflare's own scripts) would break under a strict one.
- **Only GET/HEAD are served for pages.** Cloudflare answers POST, PUT, DELETE, PATCH and TRACE with 405, and unknown paths such as `/wp-login.php`, `/.env`, `/.git/config` with 404. This was measured on the live site before any change.
- **Forms and the AI helper** (`worker/index.js`, `worker/ai.js`, `worker/guard.js`): allowed-origin list, per-visitor rate limit, hidden trap field, instant-submission check, clipped field lengths, control characters removed, no passwords or card numbers accepted by the AI helper. Run `node worker/test.mjs` to test these rules against a mock environment.
- `security.txt` at `/.well-known/security.txt`, Dependabot (weekly npm updates), and `.gitignore` entries for secrets (`.env`, `.dev.vars`, keys, keystores).

## Honest limits
- The Worker's rate limiter keeps its counters in memory per Cloudflare location. It slows abuse, it is not exact. Add the Cloudflare rule below for a hard limit.
- CORS (the allowed-origin list) protects people's browsers. A script that is not a browser can send any Origin header. The rate limit and the checks above are what protect the endpoints from those.
- The AI helper is told to stay on topic and never state prices, and its reply is cleaned afterwards, but a language model can never be guaranteed to obey. The server removes web addresses and money amounts from every answer.
- The site uses **Cloudflare Email Routing** to send form messages, not EmailJS. There is no EmailJS key or reCAPTCHA setting to configure. If you add EmailJS later, set its "allowed origins" to `https://firefoxpublisher.com` and turn on its reCAPTCHA option.

## Steps only you can do (Cloudflare dashboard, click by click)
1. **Turn on two-step login for Cloudflare, GitHub and your email.** Cloudflare: profile icon (top right) > My Profile > Authentication > Two-Factor Authentication > Set up. GitHub: Settings > Password and authentication > Two-factor authentication > Enable.
2. **Rate limiting rule for the form and AI helper.** Cloudflare > your domain `firefoxpublisher.com` > Security > Security rules > Create rule > Rate limiting rules. Name `api limit`. If URI Path starts with `/api/`. Characteristics: IP. Rate: 20 requests per 1 minute. Action: Block for 1 minute. Deploy.
3. **Bot protection.** Security > Settings > turn on **Bot fight mode**. Also turn on **Block AI bots** only if you do not want AI crawlers (your `robots.txt` currently welcomes them).
4. **Always use HTTPS.** SSL/TLS > Edge Certificates > Always Use HTTPS: On; Minimum TLS version: 1.2; HSTS is already sent by the site.
5. **Workers AI.** The `ai` binding is in `wrangler.jsonc`, so no setup is needed. Check usage under Workers & Pages > AI > Workers AI. The free allowance is daily; when it is used up the site automatically answers offline.
6. **Email.** Email Routing must stay on, and `contactus@firefoxpublisher.com` must be a verified destination (Email > Email Routing > Destination addresses).
7. **Search Console and Bing Webmaster Tools** (also in `docs/seo.md`).

## If you ever want a private admin area
Do not build a password page. Put the area behind **Cloudflare Access**: Zero Trust > Access > Applications > Add an application > Self-hosted, set the path (for example `firefoxpublisher.com/admin`), add a policy "Allow, Emails: your address", and choose **One-time PIN** as the login method. Cloudflare then emails a code before anyone reaches the page.

## Never share
Do not paste passwords, API keys, tokens or two-step codes into chat, issues or commits. If one is ever exposed, rotate it (create a new one, delete the old).
