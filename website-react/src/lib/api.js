// The site's API (contact form, AI helper) lives on firefoxpublisher.com. Inside the installed
// Android/iPhone app the page is served from the phone, so the address must be spelled out there.
const NATIVE_ORIGINS = ["https://localhost", "capacitor://localhost", "ionic://localhost"];

export const isNativeApp = () => typeof location !== "undefined" && NATIVE_ORIGINS.includes(location.origin) && !!globalThis.Capacitor;

export const apiUrl = (path) => (isNativeApp() ? "https://firefoxpublisher.com" : "") + path;
