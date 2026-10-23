"use client";

// Expanding image gallery: a row of tall photo panels where the one you hover (or
// focus, or tap) opens wide to show its title and text, and the rest squeeze to slim
// strips with a vertical label.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes and the Poppins @import are replaced by a scoped, .ig- prefixed
//    stylesheet that inherits the site's font.
//  - Items are passed in (image, title, description, badge) instead of a fixed list of
//    bare photos, and one panel is open by default so the row never looks empty.
//  - Keyboard and touch work (panels are focusable and open on focus or tap); under
//    768px the panels stack as full cards with their text always visible.
import * as React from "react";

export interface GalleryItem {
  image: string;
  title: string;
  description: string;
  badge?: string;
  alt?: string;
}

export interface ImageGalleryProps {
  items: GalleryItem[];
  /** Index of the panel that starts open. @default 0 */
  defaultIndex?: number;
  className?: string;
}

const IG_CSS = `
.ig { display: flex; align-items: stretch; gap: 10px; width: 100%; height: 460px; }
.ig__panel { position: relative; flex: 1 1 0; min-width: 0; overflow: hidden; border-radius: 7px; cursor: pointer; outline: none; color: #fff;
  background: var(--navy, #12294a); transition: flex-grow .6s cubic-bezier(.25, 1, .5, 1), box-shadow .3s ease; box-shadow: 0 18px 36px -26px rgba(18,41,74,.6); }
.ig__panel[data-open="true"] { flex-grow: 6; box-shadow: 0 30px 56px -30px rgba(18,41,74,.75); }
.ig__panel:focus-visible { outline: 3px solid var(--glacier, #f28c28); outline-offset: 3px; }
.ig__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transform: scale(1.06); transition: transform .8s ease, filter .5s ease; filter: saturate(.85) brightness(.82); }
.ig__panel[data-open="true"] .ig__img { transform: scale(1); filter: none; }
.ig__shade { position: absolute; inset: 0; pointer-events: none; transition: opacity .5s ease;
  background: linear-gradient(to top, rgba(8,22,43,.92) 0%, rgba(8,22,43,.55) 32%, rgba(8,22,43,0) 62%); opacity: 0; }
.ig__panel[data-open="true"] .ig__shade { opacity: 1; }
.ig__label { position: absolute; left: 50%; bottom: 24px; transform: translateX(-50%) rotate(180deg); writing-mode: vertical-rl; white-space: nowrap; font-weight: 800; font-size: 1.3rem; letter-spacing: .015em;
  text-shadow: 0 2px 12px rgba(0,0,0,.75), 0 0 2px rgba(0,0,0,.4); transition: opacity .3s ease; }
.ig__panel[data-open="true"] .ig__label { opacity: 0; pointer-events: none; }
.ig__body { position: absolute; left: 0; right: 0; bottom: 0; padding: 28px; opacity: 0; transform: translateY(14px); transition: opacity .4s ease .15s, transform .5s ease .15s; }
.ig__panel[data-open="true"] .ig__body { opacity: 1; transform: none; }
.ig__badge { display: inline-block; margin-bottom: 12px; padding: 4px 12px; border-radius: 7px; font-size: .8rem; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #fff; background: var(--grad-orange, #f28c28); }
.ig__title { margin: 0 0 10px; font-size: clamp(1.7rem, 3vw, 2.4rem); font-weight: 800; letter-spacing: -.02em; line-height: 1.15; color: #fff; }
.ig__desc { margin: 0; max-width: 36rem; font-size: 1.15rem; line-height: 1.6; color: rgba(255,255,255,.88); }
@media (max-width: 767px) {
  .ig { flex-direction: column; height: auto; }
  .ig__panel, .ig__panel[data-open="true"] { flex: none; min-height: 300px; }
  .ig__img { filter: none; transform: none; }
  .ig__shade { opacity: 1; }
  .ig__label { display: none; }
  .ig__body { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) { .ig__panel, .ig__img, .ig__shade, .ig__body, .ig__label { transition: none; } }
`;

export function ImageGallery({ items, defaultIndex = 0, className }: ImageGalleryProps) {
  const [open, setOpen] = React.useState(defaultIndex);
  return (
    <div className={"ig" + (className ? " " + className : "")} role="list">
      <style>{IG_CSS}</style>
      {items.map((it, i) => (
        <article
          key={it.title}
          role="listitem"
          tabIndex={0}
          className="ig__panel"
          data-open={i === open}
          aria-label={it.title}
          onMouseEnter={() => setOpen(i)}
          onFocus={() => setOpen(i)}
          onClick={() => setOpen(i)}
        >
          <img className="ig__img" src={it.image} alt={it.alt ?? ""} loading="lazy" draggable={false} />
          <div className="ig__shade" aria-hidden="true" />
          <span className="ig__label" aria-hidden="true">{it.title}</span>
          <div className="ig__body">
            {it.badge ? <span className="ig__badge">{it.badge}</span> : null}
            <h3 className="ig__title">{it.title}</h3>
            <p className="ig__desc">{it.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ImageGallery;
