import { SITE } from "../data/site.js";

// Posts the contact form to the site's own /api/contact endpoint (a Cloudflare Worker that
// emails the team). If that is unreachable, e.g. on a local dev server, fall back to the
// visitor's email app so a message is never lost.
export async function sendContact(values) {
  const payload = {
    name: values.name.trim(),
    email: values.email.trim(),
    phone: (values.dial ? values.dial.split(" ")[0] + " " : "") + values.phone.trim(),
    interest: values.interest,
    message: values.message.trim(),
    website: values.website || "",
  };
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok) return { ok: true, via: "api" };
    // A validation problem the server explains: show it instead of falling back.
    if (res.status === 400 && data.error) return { ok: false, error: data.error };
  } catch {
    /* network failure: fall through to mailto */
  }
  const body = [
    "Name: " + payload.name,
    "Email: " + payload.email,
    "Phone: " + payload.phone,
    "",
    payload.message,
  ].join("\n");
  window.location.href = "mailto:" + SITE.email + "?subject=" + encodeURIComponent(payload.interest) + "&body=" + encodeURIComponent(body);
  return { ok: true, via: "mailto" };
}
