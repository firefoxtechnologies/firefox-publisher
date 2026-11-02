import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ALLOWED_PATHS, answerOffline } from "../data/assistant.js";
import { apiUrl } from "../lib/api.js";
import { holdChatHidden } from "../lib/chatWidget.js";
import { COLOR_CHOICES, MAKE_CHOICES, STYLE_CHOICES, coverMakerUrl } from "../lib/helperPresets.js";

const GREETING = "Hi! I'm the Firefox Publisher helper. Ask me about our services, or use the Cover helper tab to start a book cover. I can't take passwords or card numbers, and I never quote prices.";
const SUGGESTIONS = ["What services do you offer?", "I need my book edited", "How do I publish on KDP?", "Is the cover maker free?"];

// The conversation survives closing and re-opening the panel (until the page is reloaded).
let saved = { messages: [{ role: "assistant", content: GREETING, links: [] }], mode: "ai" };

// Fixed list of links the helper may show, checked again here even though the server already picks from it.
const safeLinks = (links) => (Array.isArray(links) ? links.filter((l) => l && ALLOWED_PATHS.includes(l.to) && typeof l.label === "string").slice(0, 3) : []);

async function askServer(messages) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 15000);
  try {
    const res = await fetch(apiUrl("/api/ai"), {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })) }),
      signal: ctl.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.ok && data.reply) return { ok: true, reply: data.reply, links: safeLinks(data.links) };
    if (res.status === 429) return { ok: false, limited: true };
  } catch {
    /* no network, timeout or blocked: use the offline answers */
  } finally {
    clearTimeout(timer);
  }
  return { ok: false };
}

function CoverHelper({ onDone }) {
  const [make, setMake] = useState(null);
  const [style, setStyle] = useState(null);
  const step = !make ? 1 : !style ? 2 : 3;
  const back = () => (style ? setStyle(null) : setMake(null));
  return (
    <div className="ai-helper">
      <p className="ai-helper__step">Step {step} of 3{step > 1 && <button type="button" className="ai-link" onClick={back}>Back</button>}</p>
      {step === 1 && (
        <>
          <h3>What are you making?</h3>
          <div className="ai-choices">
            {MAKE_CHOICES.map((m) => <button key={m.id} type="button" onClick={() => setMake(m.id)}><strong>{m.label}</strong><small>{m.hint}</small></button>)}
          </div>
        </>
      )}
      {step === 2 && (
        <>
          <h3>Pick a style</h3>
          <div className="ai-choices ai-choices--chips">
            {STYLE_CHOICES.map((s) => <button key={s} type="button" onClick={() => setStyle(s)}>{s}</button>)}
          </div>
        </>
      )}
      {step === 3 && (
        <>
          <h3>Pick a main colour</h3>
          <div className="ai-choices ai-choices--chips">
            {COLOR_CHOICES.map((c) => (
              <button key={c.id} type="button" onClick={() => onDone(coverMakerUrl({ make, style, color: c.id }))}>
                <i style={{ background: c.swatch }} aria-hidden="true" />{c.label}
              </button>
            ))}
          </div>
          <p className="ai-helper__note">This opens the free cover maker already set to your style and colour.</p>
        </>
      )}
    </div>
  );
}

export default function AskPanel({ onClose }) {
  const [tab, setTab] = useState("chat");
  const [messages, setMessages] = useState(saved.messages);
  const [mode, setMode] = useState(saved.mode);
  const [busy, setBusy] = useState(false);
  const [text, setText] = useState("");
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => holdChatHidden(), []);
  useEffect(() => { saved = { messages, mode }; }, [messages, mode]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [messages, busy, tab]);
  useEffect(() => { if (tab === "chat") inputRef.current?.focus(); }, [tab]);
  useEffect(() => {
    const on = () => setOnline(true), off = () => setOnline(false);
    addEventListener("online", on);
    addEventListener("offline", off);
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => { removeEventListener("online", on); removeEventListener("offline", off); document.removeEventListener("keydown", onKey); };
  }, [onClose]);

  const send = async (raw) => {
    const content = raw.trim().slice(0, 500);
    if (!content || busy) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setText("");
    setBusy(true);
    const r = navigator.onLine === false ? { ok: false } : await askServer(next);
    if (r.ok) {
      setMode("ai");
      setMessages([...next, { role: "assistant", content: r.reply, links: r.links }]);
    } else if (r.limited) {
      setMessages([...next, { role: "assistant", content: "You're sending messages quickly. Please wait a minute and try again, or use the contact form.", links: [{ to: "/#contact", label: "Contact the team" }] }]);
    } else {
      const o = answerOffline(content);
      setMode("offline");
      setMessages([...next, { role: "assistant", content: o.reply, links: o.links }]);
    }
    setBusy(false);
    inputRef.current?.focus();
  };

  const shownMode = !online ? "offline" : mode;
  const go = (to) => { onClose(); navigate(to); };

  return (
    <section className="ai-panel" role="dialog" aria-label="Ask AI">
      <header className="ai-panel__head">
        <div>
          <strong>Ask AI</strong>
          <span className={"ai-mode ai-mode--" + shownMode} title={shownMode === "ai" ? "Answers come from a free AI service" : "Basic answers built into the site; they work without internet"}>
            {shownMode === "ai" ? "AI mode" : "Offline mode: basic answers"}
          </span>
        </div>
        <button type="button" className="ai-x" onClick={onClose} aria-label="Close Ask AI">&times;</button>
      </header>
      <div className="ai-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "chat"} onClick={() => setTab("chat")}>Chat</button>
        <button type="button" role="tab" aria-selected={tab === "cover"} onClick={() => setTab("cover")}>Cover helper</button>
      </div>

      {tab === "chat" ? (
        <>
          <div className="ai-msgs" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={"ai-msg ai-msg--" + m.role}>
                <p>{m.content}</p>
                {m.links?.length > 0 && (
                  <div className="ai-links">
                    {m.links.map((l) => <Link key={l.to} to={l.to} onClick={onClose}>{l.label}</Link>)}
                  </div>
                )}
              </div>
            ))}
            {busy && <div className="ai-msg ai-msg--assistant"><p className="ai-typing" aria-label="Thinking"><i /><i /><i /></p></div>}
            {messages.length === 1 && (
              <div className="ai-sugg">{SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => send(s)}>{s}</button>)}</div>
            )}
            <div ref={endRef} />
          </div>
          <form className="ai-form" onSubmit={(e) => { e.preventDefault(); send(text); }}>
            <input ref={inputRef} value={text} maxLength={500} onChange={(e) => setText(e.target.value)} placeholder="Ask about our services" aria-label="Your question" autoComplete="off" enterKeyHint="send" />
            <button type="submit" disabled={busy || !text.trim()}>Send</button>
          </form>
        </>
      ) : (
        <div className="ai-msgs"><CoverHelper onDone={go} /></div>
      )}
      <p className="ai-fine">AI answers can be wrong and never include prices. Do not share passwords or card numbers. In AI mode your question is processed by Cloudflare Workers AI. <Link to="/privacy-policy" onClick={onClose}>Privacy</Link></p>
    </section>
  );
}
