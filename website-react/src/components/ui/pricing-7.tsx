"use client";

// Pricing selector: pick a tier from a pill tab group and the plan card swaps
// in beneath it (features on the left, price and call to action on the right).
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes and the shadcn Badge / Button / ToggleGroup / FancyButton
//    are replaced by a scoped, .p7- prefixed stylesheet and a native
//    role="tablist" group (arrow keys, roving tabindex).
//  - Tiers and the call to action are passed in, so the host can render a
//    router link and decide what the price line says.
//  - Inline SVG replaces lucide-react.
import * as React from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";

export interface PricingTier {
  value: string;
  /** Short label on the tab. */
  label: string;
  /** Full plan name, shown as the card heading. */
  name: string;
  /** Displayed as given, e.g. "$1,499". */
  price: string;
  /** Small line under the price. */
  priceNote?: string;
  description: string;
  features: string[];
  /** Small flag beside the plan name, e.g. "Most popular". */
  badge?: string;
}

export interface PricingProps {
  tiers: PricingTier[];
  /** Value of the tier shown first. Defaults to the first tier. */
  defaultValue?: string;
  /** Renders the card's call to action. */
  renderCta: (tier: PricingTier) => React.ReactNode;
  /** Optional line under the card (help text and link). */
  footer?: React.ReactNode;
  className?: string;
}

const animVariant: Variants = {
  initial: { opacity: 0, y: 14, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 22, stiffness: 320 },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: "blur(2px)",
    transition: { duration: 0.15 },
  },
};

const P7_CSS = `
.p7-root { width: 100%; max-width: 48rem; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 32px; }
.p7-tabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; padding: 4px; border-radius: 7px; background: var(--ice, #eaf3fd); border: 1px solid var(--line, #d6e3f2); }
.p7-tabs button {
  min-width: 6.5rem; padding: 9px 22px; border: 0; border-radius: 7px; cursor: pointer; font: inherit; font-weight: 600; font-size: .95rem;
  color: var(--slate, #3e5272); background: transparent; transition: background .2s ease, color .2s ease, box-shadow .2s ease;
}
.p7-tabs button:hover { color: var(--navy, #12294a); }
.p7-tabs button[aria-selected="true"] { color: #fff; background: var(--grad-orange, #f28c28); box-shadow: 0 8px 18px -10px rgba(242,140,40,.9); }
.p7-tabs button:focus-visible { outline: 2px solid var(--deep, #1d5fa8); outline-offset: 2px; }
.p7-stage { width: 100%; }
.p7-shell { border-radius: 7px; padding: 4px; background: var(--ice, #eaf3fd); border: 1px solid var(--line, #d6e3f2); }
.p7-card {
  display: grid; grid-template-columns: 1fr; gap: 28px; align-items: start; padding: 28px; border-radius: 7px; background: #fff;
  box-shadow: 0 24px 50px -28px rgba(18,41,74,.45);
}
.p7-main { display: flex; flex-direction: column; gap: 22px; }
.p7-name { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin: 0 0 8px; font-size: 1.3rem; font-weight: 700; letter-spacing: -.01em; color: var(--navy, #12294a); }
.p7-badge { padding: 3px 10px; border-radius: 7px; font-size: .68rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--navy, #12294a); background: var(--grad-orange, #f28c28); }
.p7-desc { margin: 0; color: var(--slate, #3e5272); font-size: .95rem; line-height: 1.6; }
.p7-price { margin: 0; font-size: clamp(2.8rem, 8vw, 3.8rem); font-weight: 800; letter-spacing: -.03em; line-height: 1; color: var(--navy, #12294a); font-variant-numeric: tabular-nums; }
.p7-note { margin: 6px 0 0; font-size: .85rem; color: var(--slate, #3e5272); }
.p7-cta { display: flex; }
.p7-cta > * { width: 100%; justify-content: center; }
.p7-rule { display: none; width: 1px; align-self: stretch; background: var(--line, #d6e3f2); }
.p7-features { margin: 0; }
.p7-footer { text-align: center; color: var(--slate, #3e5272); font-size: .95rem; }
@media (min-width: 768px) {
  .p7-card { grid-template-columns: 1.25fr auto 1fr; padding: 32px; gap: 28px; }
  .p7-main { order: 3; }
  .p7-rule { display: block; order: 2; }
  .p7-features { order: 1; }
}
`;

export default function Pricing({
  tiers,
  defaultValue,
  renderCta,
  footer,
  className,
}: PricingProps) {
  const [selected, setSelected] = React.useState(
    defaultValue ?? tiers[0]?.value,
  );
  const tabs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const current = tiers.find((t) => t.value === selected) ?? tiers[0];
  if (!current) return null;

  const move = (event: React.KeyboardEvent, i: number) => {
    const n = tiers.length;
    const next =
      event.key === "ArrowRight"
        ? (i + 1) % n
        : event.key === "ArrowLeft"
          ? (i - 1 + n) % n
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? n - 1
              : null;
    if (next === null) return;
    event.preventDefault();
    setSelected(tiers[next].value);
    tabs.current[next]?.focus();
  };

  return (
    <div className={"p7-root" + (className ? " " + className : "")}>
      <style>{P7_CSS}</style>

      <div className="p7-tabs" role="tablist" aria-label="Publishing packages">
        {tiers.map((tier, i) => (
          <button
            key={tier.value}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`p7-tab-${tier.value}`}
            aria-selected={tier.value === current.value}
            aria-controls="p7-panel"
            tabIndex={tier.value === current.value ? 0 : -1}
            onClick={() => setSelected(tier.value)}
            onKeyDown={(event) => move(event, i)}
          >
            {tier.label}
          </button>
        ))}
      </div>

      <div
        className="p7-stage"
        role="tabpanel"
        id="p7-panel"
        aria-labelledby={`p7-tab-${current.value}`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.value}
            variants={animVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className="p7-shell"
          >
            <div className="p7-card">
              <div className="p7-main">
                <div>
                  <h3 className="p7-name">
                    {current.name}
                    {current.badge ? (
                      <span className="p7-badge">{current.badge}</span>
                    ) : null}
                  </h3>
                  <p className="p7-desc">{current.description}</p>
                </div>
                <div>
                  <p className="p7-price">{current.price}</p>
                  {current.priceNote ? (
                    <p className="p7-note">{current.priceNote}</p>
                  ) : null}
                </div>
                <div className="p7-cta">{renderCta(current)}</div>
              </div>

              <div className="p7-rule" aria-hidden="true" />

              <ul className="ticks p7-features">
                {current.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {footer ? <div className="p7-footer">{footer}</div> : null}
    </div>
  );
}
