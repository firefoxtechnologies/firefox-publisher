// Firefox Publisher: sends the website's contact form to the team inbox.
//
// Only /api/* reaches this Worker (see run_worker_first in wrangler.jsonc); every other
// request is answered straight from the static site. Mail goes out through Cloudflare
// Email Routing's send_email binding, so no third-party service is involved.
import { EmailMessage } from "cloudflare:email";

const ALLOWED_ORIGINS = ["https://firefoxpublisher.com", "https://www.firefoxpublisher.com"];
const LIMITS = { name: 120, email: 254, phone: 40, subject: 120, message: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

// Header values must never contain line breaks, or a visitor could inject extra headers.
const oneLine = (v) => String(v ?? "").replace(/[\r\n]+/g, " ").trim();
const clip = (v, n) => String(v ?? "").trim().slice(0, n);

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
  if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  const origin = request.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ ok: false, error: "Forbidden" }, 403);

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request" }, 400);
  }

  // Hidden field that people never see and bots tend to fill in. Pretend it worked.
  if (data.website) return json({ ok: true });

  const name = clip(data.name, LIMITS.name);
  const email = clip(data.email, LIMITS.email);
  const phone = clip(data.phone, LIMITS.phone);
  const subject = clip(data.interest || data.subject, LIMITS.subject) || "Website enquiry";
  const message = clip(data.message, LIMITS.message);

  if (!name) return json({ ok: false, error: "Please enter your name." }, 400);
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: "Please enter a valid email address." }, 400);
  if (message.length < 10) return json({ ok: false, error: "Please tell us a little about your project." }, 400);

  const to = env.MAIL_TO;
  const from = env.MAIL_FROM;
  if (!env.EMAIL || !to || !from) return json({ ok: false, error: "Email is not configured." }, 500);

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
    return json({ ok: false, error: "We could not send your message right now." }, 502);
  }
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api/contact") return handleContact(request, env);
    if (pathname.startsWith("/api/")) return json({ ok: false, error: "Not found" }, 404);
    // run_worker_first only routes /api/* here, but fall back to the site just in case.
    return env.ASSETS.fetch(request);
  },
};
