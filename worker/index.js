// Firefox Publisher: the website's small server side.
//
// Only /api/* reaches this Worker (see run_worker_first in wrangler.jsonc); every other
// request is answered straight from the static site. Mail goes out through Cloudflare
// Email Routing's send_email binding, so no third-party service is involved.
//   /api/contact  the contact form, emailed to the team inbox
//   /api/ai       the "Ask AI" helper (see ai.js)
import { EmailMessage } from "cloudflare:email";
import { clip, corsHeaders, originAllowed, rateLimited, visitorKey } from "./guard.js";
import { handleAi } from "./ai.js";

const LIMITS = { name: 120, email: 254, phone: 40, subject: 120, message: 5000 };
const MIN_FILL_MS = 2000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200, extra = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...extra } });

// Header values must never contain line breaks, or a visitor could inject extra headers.
const oneLine = (v) => String(v ?? "").replace(/[\r\n]+/g, " ").trim();

// RFC 2047 encoded-word so non-ASCII subjects (names, accents) survive.
const encodeHeader = (text) => {
  if (/^[\x20-\x7e]*$/.test(text)) return text;
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return `=?UTF-8?B?${btoa(bin)}?=`;
};

const toBase64 = (text) => {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/(.{76})/g, "$1\r\n");
};

function buildMime({ from, fromName, to, replyTo, subject, body }) {
  const id = `<${crypto.randomUUID()}@${from.split("@")[1]}>`;
  return [
    `From: ${encodeHeader(fromName)} <${from}>`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${encodeHeader(subject)}`,
    `Message-ID: ${id}`,
    `Date: ${new Date().toUTCString()}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    toBase64(body),
  ].join("\r\n");
}

async function handleContact(request, env) {
  const origin = request.headers.get("origin");
  const cors = corsHeaders(origin);
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405, { allow: "POST, OPTIONS" });
  if (!originAllowed(origin)) return json({ ok: false, error: "Forbidden" }, 403);
  if (rateLimited(visitorKey(request, "contact"), 5, 10 * 60 * 1000)) {
    return json({ ok: false, error: "Too many messages. Please try again in a few minutes." }, 429, { ...cors, "retry-after": "600" });
  }
  const reply = (body, status = 200) => json(body, status, cors);

  let data;
  try {
    data = await request.json();
  } catch {
    return reply({ ok: false, error: "Invalid request" }, 400);
  }
  if (!data || typeof data !== "object") return reply({ ok: false, error: "Invalid request" }, 400);

  // A hidden field that people never see and bots tend to fill in, and forms sent faster than a person
  // can type (the page reports how long the visitor had been on it). Pretend it worked.
  if (data.website) return reply({ ok: true });
  if (typeof data.elapsed === "number" && data.elapsed < MIN_FILL_MS) return reply({ ok: true });

  const name = clip(data.name, LIMITS.name);
  const email = clip(data.email, LIMITS.email);
  const phone = clip(data.phone, LIMITS.phone);
  const subject = clip(data.interest || data.subject, LIMITS.subject) || "Website enquiry";
  const message = clip(data.message, LIMITS.message);

  if (!name) return reply({ ok: false, error: "Please enter your name." }, 400);
  if (!EMAIL_RE.test(email)) return reply({ ok: false, error: "Please enter a valid email address." }, 400);
  if (message.length < 10) return reply({ ok: false, error: "Please tell us a little about your project." }, 400);

  const to = env.MAIL_TO;
  const from = env.MAIL_FROM;
  if (!env.EMAIL || !to || !from) return reply({ ok: false, error: "Email is not configured." }, 500);

  const body = [
    `New message from the Firefox Publisher website`,
    "",
    `Name: ${oneLine(name)}`,
    `Email: ${oneLine(email)}`,
    `Phone: ${oneLine(phone) || "not given"}`,
    `Topic: ${oneLine(subject)}`,
    "",
    message,
    "",
    "--",
    `Sent from ${origin || "firefoxpublisher.com"}. Reply to this email to answer ${oneLine(name)} directly.`,
  ].join("\n");

  try {
    const raw = buildMime({
      from,
      fromName: "Firefox Publisher website",
      to,
      replyTo: oneLine(email),
      subject: `[Website] ${oneLine(subject)} from ${oneLine(name)}`,
      body,
    });
    await env.EMAIL.send(new EmailMessage(from, to, raw));
  } catch (err) {
    console.error("send_email failed", err && err.message);
    return reply({ ok: false, error: "We could not send your message right now." }, 502);
  }
  return reply({ ok: true });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact") return handleContact(request, env);
    if (pathname === "/api/ai") return handleAi(request, env);
    if (pathname.startsWith("/api/")) return json({ ok: false, error: "Not found" }, 404);
    // run_worker_first only routes /api/* here, but fall back to the site just in case.
    return env.ASSETS.fetch(request);
  },
};
