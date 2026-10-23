// Framed call to action: a hairline box with "+" marks on its corners, rules
// that run past the top and bottom edges, a dashed centre line and a soft glow
// in the upper left.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes, lucide icons and the shadcn Button are replaced by a
//    scoped, .cta3- prefixed stylesheet and inline SVG.
//  - Heading, text and the buttons are passed in, so the host supplies router
//    links and its own button styles.
//  - Colours come from CSS variables (--cta3-fg, --cta3-muted, --cta3-line,
//    --cta3-accent) so the frame suits dark or light surfaces.
import * as React from "react";

export interface CallToActionProps {
  heading: React.ReactNode;
  text?: React.ReactNode;
  /** Buttons or links, centred under the text. */
  children?: React.ReactNode;
  className?: string;
}

const CTA3_CSS = `
.cta3 {
  position: relative; isolation: isolate; width: 100%; max-width: 48rem; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;
  padding: 36px 20px; color: var(--cta3-fg, #fff); border-block: 1px solid var(--cta3-line, rgba(255,255,255,.25));
  background: radial-gradient(35% 80% at 25% 0%, var(--cta3-glow, rgba(255,255,255,.1)), transparent);
}
.cta3__plus { position: absolute; z-index: 1; width: 24px; height: 24px; color: var(--cta3-accent, currentColor); }
.cta3__plus--tl { top: -12.5px; left: -11.5px; }
.cta3__plus--tr { top: -12.5px; right: -11.5px; }
.cta3__plus--bl { bottom: -12.5px; left: -11.5px; }
.cta3__plus--br { bottom: -12.5px; right: -11.5px; }
.cta3__rule { position: absolute; top: -24px; bottom: -24px; width: 1px; background: var(--cta3-line, rgba(255,255,255,.25)); pointer-events: none; }
.cta3__rule--l { left: 0; }
.cta3__rule--r { right: 0; }
.cta3__dash { position: absolute; z-index: -1; top: 0; left: 50%; height: 100%; border-left: 1px dashed var(--cta3-line, rgba(255,255,255,.25)); }
.cta3__text { display: flex; flex-direction: column; gap: 8px; text-align: center; }
.cta3__heading { margin: 0 auto; max-width: 30ch; font-size: clamp(1.5rem, 3.2vw, 2.1rem); font-weight: 700; letter-spacing: -.02em; line-height: 1.25; color: var(--cta3-fg, #fff); }
.cta3__sub { margin: 0 auto; max-width: 52ch; color: var(--cta3-muted, rgba(255,255,255,.75)); line-height: 1.6; }
.cta3__actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 12px; }
`;

const Plus = ({ className }: { className: string }) => (
  <svg
    className={"cta3__plus " + className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5v14" />
  </svg>
);

export function CallToAction({
  heading,
  text,
  children,
  className,
}: CallToActionProps) {
  return (
    <div className={"cta3" + (className ? " " + className : "")}>
      <style>{CTA3_CSS}</style>
      <Plus className="cta3__plus--tl" />
      <Plus className="cta3__plus--tr" />
      <Plus className="cta3__plus--bl" />
      <Plus className="cta3__plus--br" />
      <div className="cta3__rule cta3__rule--l" aria-hidden="true" />
      <div className="cta3__rule cta3__rule--r" aria-hidden="true" />
      <div className="cta3__dash" aria-hidden="true" />

      <div className="cta3__text">
        <h2 className="cta3__heading">{heading}</h2>
        {text ? <p className="cta3__sub">{text}</p> : null}
      </div>

      {children ? <div className="cta3__actions">{children}</div> : null}
    </div>
  );
}

export default CallToAction;
