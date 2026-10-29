// Premium cover maker settings.
//
// PAYMENT_LINK: paste the checkout URL here when it is ready (Stripe Payment Link, Gumroad,
// Paddle, etc.). While it is empty the unlock dialog shows "payments opening soon" and
// sends buyers to the contact form instead.
export const PAYMENT_LINK = "";

// Fill in when pricing is decided, e.g. "$19". Empty hides the price.
export const PRICES = { premiumCover: "", vectorFiles: "" };

// NOTE: this is a front-end gate only. Anyone can bypass client-side checks, so before real
// sales go live the unlock should be verified server-side (a /api/unlock route in the
// Worker that checks the payment, then returns a signed token). Until then the premium
// downloads stay locked for everyone except local development (?preview-premium).
export function isUnlocked() {
  if (typeof window === "undefined") return false;
  return import.meta.env.DEV && new URLSearchParams(window.location.search).has("preview-premium");
}
