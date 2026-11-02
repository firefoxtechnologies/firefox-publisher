// The live-chat bubble (Tawk.to) sits in the bottom-right corner and would cover the Ask AI panel on phones.
// holdChatHidden() hides it until the returned function is called. The chat script loads late (on first
// interaction), so the hide is also applied when it finishes loading.
let holds = 0;

const apply = () => {
  const api = typeof window === "undefined" ? null : window.Tawk_API;
  if (!api) return;
  try { (holds > 0 ? api.hideWidget : api.showWidget)?.call(api); } catch { /* chat not ready yet */ }
};

export function holdChatHidden() {
  holds += 1;
  apply();
  const api = typeof window === "undefined" ? null : window.Tawk_API;
  if (api && !api.__fpHook) {
    const prev = api.onLoad;
    api.onLoad = function () { try { prev && prev.apply(this, arguments); } finally { apply(); } };
    api.__fpHook = true;
  }
  return () => { holds = Math.max(0, holds - 1); apply(); };
}
