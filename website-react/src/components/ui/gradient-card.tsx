"use client";

// A soft gradient card: a coloured dot badge, a title, a short description and a
// link, with a decorative picture tucked into the bottom-right corner. On hover the
// card lifts and the picture grows and tilts slightly.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - cva, cn, lucide and Tailwind classes are replaced by a scoped, .gcard- prefixed
//    stylesheet; the gradients are CSS variables so the host can use brand colours.
//  - Imports come from `motion/react`; hover motion is skipped for reduced motion.
//  - `as` / `hrefProp` render the link as a router Link.
import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

export interface GradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badgeText: string;
  /** Any CSS colour for the dot in the badge. */
  badgeColor: string;
  title: string;
  description: string;
  /** The link is shown only when both are given. */
  ctaText?: string;
  ctaHref?: string;
  imageUrl: string;
  /** CSS gradient for the card background. */
  gradient?: string;
  /** Element used for the link, e.g. a router Link. @default "a" */
  as?: React.ElementType;
  /** Prop carrying the URL on `as`: "href" for <a>, "to" for router Links. @default "href" */
  hrefProp?: string;
}

const GCARD_CSS = `
.gcard { position: relative; display: flex; flex-direction: column; justify-content: space-between; height: 100%; min-height: 340px; width: 100%; overflow: hidden;
  border-radius: 7px; padding: 32px; background: var(--gcard-bg, linear-gradient(135deg, #f1f5f9, #e2e8f0)); color: var(--gcard-fg, #12294a);
  border: 1px solid var(--gcard-line, rgba(18,41,74,.08)); box-shadow: 0 10px 30px -22px rgba(18,41,74,.45); transition: box-shadow .3s ease; }
.gcard:hover { box-shadow: 0 26px 50px -26px rgba(18,41,74,.55); }
.gcard__img { position: absolute; right: -14%; bottom: -16%; width: 62%; max-width: 300px; opacity: .95; mix-blend-mode: multiply; pointer-events: none; }
.gcard__body { position: relative; z-index: 1; display: flex; flex-direction: column; height: 100%; }
.gcard__badge { display: inline-flex; align-items: center; gap: 8px; width: fit-content; margin-bottom: 16px; padding: 5px 12px; border-radius: 7px;
  font-size: .85rem; font-weight: 600; color: var(--gcard-fg, #12294a); background: rgba(255,255,255,.88); }
.gcard__dot { width: 8px; height: 8px; border-radius: 50%; }
.gcard__text { flex: 1; }
.gcard__title { margin: 0 0 8px; font-size: 1.6rem; font-weight: 800; letter-spacing: -.02em; line-height: 1.2; color: var(--gcard-fg, #12294a); }
.gcard__desc { margin: 0; max-width: 24ch; font-size: 1rem; line-height: 1.6; color: var(--gcard-muted, #3e5272); }
.gcard__cta { display: inline-flex; align-items: center; gap: 8px; margin-top: 24px; width: fit-content; font-size: .92rem; font-weight: 700; text-decoration: none; color: var(--gcard-fg, #12294a); }
.gcard__cta:hover { color: var(--gcard-fg, #12294a); }
.gcard__cta svg { width: 16px; height: 16px; transition: transform .3s ease; }
.gcard__cta:hover svg { transform: translateX(4px); }
.gcard__cta:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; border-radius: 4px; }
`;

const GradientCard = React.forwardRef<HTMLDivElement, GradientCardProps>(
  (
    {
      className,
      gradient,
      badgeText,
      badgeColor,
      title,
      description,
      ctaText,
      ctaHref,
      imageUrl,
      as,
      hrefProp = "href",
      style,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();
    const Cta = (as ?? "a") as React.ElementType;
    const linkProps = ctaHref ? { [hrefProp]: ctaHref } : {};

    const cardAnimation = reduced
      ? { rest: { scale: 1, y: 0 }, hover: { scale: 1, y: 0 } }
      : { rest: { scale: 1, y: 0 }, hover: { scale: 1.03, y: -4 } };
    const imageAnimation = reduced
      ? { rest: { scale: 1, rotate: 0 }, hover: { scale: 1, rotate: 0 } }
      : { rest: { scale: 1, rotate: 0 }, hover: { scale: 1.1, rotate: 3 } };

    return (
      <motion.div
        variants={cardAnimation}
        initial="rest"
        whileHover="hover"
        animate="rest"
        style={{ height: "100%" }}
        ref={ref}
      >
        <style>{GCARD_CSS}</style>
        <div
          className={"gcard" + (className ? " " + className : "")}
          style={{ ...(gradient ? { ["--gcard-bg" as string]: gradient } : null), ...style }}
          {...props}
        >
          <motion.img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            variants={imageAnimation}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="gcard__img"
          />
          <div className="gcard__body">
            <div className="gcard__badge">
              <span className="gcard__dot" style={{ backgroundColor: badgeColor }} />
              {badgeText}
            </div>
            <div className="gcard__text">
              <h3 className="gcard__title">{title}</h3>
              <p className="gcard__desc">{description}</p>
            </div>
            {ctaText && ctaHref ? (
              <Cta className="gcard__cta" {...linkProps}>
                {ctaText}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Cta>
            ) : null}
          </div>
        </div>
      </motion.div>
    );
  },
);
GradientCard.displayName = "GradientCard";

export { GradientCard };
export default GradientCard;
