"use client";

// A feed that adds one item at a time at the top, pushing the earlier ones down,
// then starts over once every item has appeared.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes are replaced by a scoped, .al- prefixed stylesheet, and the
//    import comes from `motion/react` instead of `framer-motion`.
//  - The demo notification data is dropped; items are passed in as children.
//  - The animated feed is hidden from assistive tech and a plain list of the same
//    children is provided for screen readers.
//  - With reduced motion the full list is shown at once, with no timer.
//  - Items fade out toward the bottom edge of the box.
import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
  /** Milliseconds between items. @default 1400 */
  delay?: number;
  /** Accessible name for the plain list read by screen readers. */
  label?: string;
}

const AL_CSS = `
.al { position: relative; height: var(--al-height, 460px); overflow: hidden; padding: 4px; }
.al__feed { display: flex; flex-direction: column; align-items: stretch; gap: 14px; }
.al__item { width: 100%; }
.al::after { content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 28%; pointer-events: none; background: linear-gradient(to top, var(--al-fade, #eaf3fd), rgba(234,243,253,0)); }
.al__sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
@media (prefers-reduced-motion: reduce) { .al { height: auto; overflow: visible; } .al::after { display: none; } }
`;

export const AnimatedList = React.memo(function AnimatedList({
  className,
  children,
  delay = 1400,
  label,
}: AnimatedListProps) {
  const reduce = useReducedMotion();
  const items = React.useMemo(() => React.Children.toArray(children), [children]);
  const [count, setCount] = React.useState(1);

  React.useEffect(() => {
    if (reduce || items.length < 2) return;
    const timer = setInterval(() => {
      setCount((c) => (c >= items.length ? 1 : c + 1));
    }, delay);
    return () => clearInterval(timer);
  }, [reduce, items.length, delay]);

  const shown = reduce ? items : items.slice(0, count).reverse();

  return (
    <div className={"al" + (className ? " " + className : "")}>
      <style>{AL_CSS}</style>
      <ul className="al__sr" aria-label={label}>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
      <div className="al__feed" aria-hidden="true">
        <AnimatePresence initial={false}>
          {shown.map((item) => (
            <AnimatedListItem key={(item as React.ReactElement).key}>{item}</AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});

export function AnimatedListItem({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="al__item"
      layout
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.7, opacity: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 40 }}
      style={{ originY: 0 }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedList;
