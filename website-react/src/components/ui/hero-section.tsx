"use client";

// Split section: heading, text and a button on the left, two tilted pictures on the
// right that lift and tilt on hover, over a faded grid. Everything fades up in turn
// when the section scrolls into view.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes, lucide and the shadcn Button are replaced by a scoped,
//    .hs- prefixed stylesheet and an inline arrow; colours are CSS variables so the
//    host can set a brand palette (--hs-fg, --hs-muted, --hs-line, --hs-accent).
//  - Imports come from `motion/react`; the animation runs on scroll into view, not
//    on mount, and is skipped for reduced motion.
//  - `description` can be rich text, alt text is passed in, and the button can be a
//    router link (`as` / `hrefProp`) and takes the host's button classes.
import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

export interface SplitHeroProps {
  title: React.ReactNode;
  description: React.ReactNode;
  buttonText: string;
  buttonLink: string;
  imageUrl1: string;
  imageUrl2: string;
  imageAlt1?: string;
  imageAlt2?: string;
  /** Element for the button, e.g. a router Link. @default "a" */
  as?: React.ElementType;
  /** Prop carrying the URL on `as`: "href" for <a>, "to" for router Links. @default "href" */
  hrefProp?: string;
  /** Classes for the button, so it matches the host's buttons. */
  buttonClassName?: string;
  className?: string;
}

const HS_CSS = `
.hs { position: relative; width: 100%; overflow: hidden; color: var(--hs-fg, #fff); }
.hs__grid { position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(var(--hs-line, rgba(255,255,255,.1)) 1px, transparent 1px), linear-gradient(90deg, var(--hs-line, rgba(255,255,255,.1)) 1px, transparent 1px);
  background-size: 3rem 3rem;
  -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, #000 30%, transparent 100%); }
.hs__in { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 48px; min-height: 520px; padding-block: 72px; }
.hs__text { display: flex; flex-direction: column; align-items: flex-start; flex: 1 1 50%; min-width: 0; }
.hs__title { margin: 0; font-size: clamp(2.1rem, 4.4vw, 3.4rem); font-weight: 800; line-height: 1.08; letter-spacing: -.03em; color: var(--hs-fg, #fff); }
.hs__title em { font-style: normal; background: linear-gradient(90deg, var(--hs-accent, #f28c28), #ffc58a 70%, #fff); -webkit-background-clip: text; background-clip: text; color: transparent; }
.hs__desc { margin: var(--s5, 24px) 0 0; max-width: 40rem; font-size: 1.08rem; line-height: 1.75; color: var(--hs-muted, #c9d6e8); }
.hs__desc strong { display: block; margin-top: 12px; color: var(--hs-fg, #fff); }
.hs__cta { margin-top: var(--s6, 32px); display: inline-flex; align-items: center; gap: 10px; }
.hs__cta svg { width: 18px; height: 18px; }
.hs__art { position: relative; flex: 1 1 42%; min-height: 380px; display: flex; align-items: center; justify-content: center; }
/* The tilt and offset live on the wrapper so the entrance and hover motion on the image cannot override them. */
.hs__card { position: absolute; }
.hs__card--back { transform: rotate(-6deg) translateX(96px); }
.hs__card--front { transform: rotate(6deg) translateX(-72px); z-index: 1; }
.hs__img { display: block; height: 20rem; width: auto; border-radius: 7px; object-fit: cover; box-shadow: 0 40px 70px -28px rgba(0,0,0,.8); outline: 1px solid rgba(255,255,255,.14); outline-offset: -1px; cursor: default; }
@media (max-width: 900px) {
  .hs__in { flex-direction: column; padding-block: 56px; min-height: 0; }
  .hs__text { align-items: center; text-align: center; }
  .hs__art { width: 100%; min-height: 340px; }
  .hs__img { height: 15rem; }
  .hs__card--back { transform: rotate(-6deg) translateX(64px); }
  .hs__card--front { transform: rotate(6deg) translateX(-48px); }
}
`;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
const cardsVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.3 } },
};
const cardItemVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};
// With reduced motion everything is simply there.
const still: Variants = { hidden: { opacity: 1 }, visible: { opacity: 1 } };

export function SplitHero({
  title,
  description,
  buttonText,
  buttonLink,
  imageUrl1,
  imageUrl2,
  imageAlt1 = "",
  imageAlt2 = "",
  as,
  hrefProp = "href",
  buttonClassName = "",
  className,
}: SplitHeroProps) {
  const reduced = useReducedMotion();
  const Cta = (as ?? "a") as React.ElementType;
  const linkProps = { [hrefProp]: buttonLink };
  const v = (m: Variants): Variants => (reduced ? still : m);

  return (
    <section className={"hs" + (className ? " " + className : "")}>
      <style>{HS_CSS}</style>
      <div className="hs__grid" aria-hidden="true" />
      <motion.div
        className="wrap hs__in"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={v(containerVariants)}
      >
        <div className="hs__text">
          <motion.h2 className="hs__title" variants={v(itemVariants)}>
            {title}
          </motion.h2>
          <motion.div className="hs__desc" variants={v(itemVariants)}>
            {description}
          </motion.div>
          <motion.div variants={v(itemVariants)}>
            <Cta className={`hs__cta ${buttonClassName}`.trim()} {...linkProps}>
              {buttonText}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Cta>
          </motion.div>
        </div>

        <motion.div className="hs__art" variants={v(cardsVariants)} aria-hidden={!imageAlt1 && !imageAlt2}>
          <div className="hs__card hs__card--back">
            <motion.img
              src={imageUrl2}
              alt={imageAlt2}
              variants={v(cardItemVariants)}
              whileHover={reduced ? undefined : { y: -10, rotate: -5, transition: { duration: 0.3 } }}
              className="hs__img"
              draggable={false}
            />
          </div>
          <div className="hs__card hs__card--front">
            <motion.img
              src={imageUrl1}
              alt={imageAlt1}
              variants={v(cardItemVariants)}
              whileHover={reduced ? undefined : { y: -10, rotate: 5, transition: { duration: 0.3 } }}
              className="hs__img"
              draggable={false}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export { SplitHero as FinancialHero };
export default SplitHero;
