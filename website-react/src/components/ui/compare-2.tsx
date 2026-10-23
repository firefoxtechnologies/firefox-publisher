"use client";

// Two-column comparison: each side has a big centred heading and groups of ticked
// points. The right half sits on a tinted background so the split reads at a glance.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes and the @aliimam icon are replaced by a scoped, .cmp- prefixed
//    stylesheet and an inline check mark.
//  - Content is passed in as data (`columns`) instead of being written into the
//    component; groups can omit their small heading.
//  - Colours come from CSS variables (--cmp-fg, --cmp-muted, --cmp-accent, --cmp-tint)
//    so the host can set a brand palette.
import * as React from "react";

export interface CompareGroup {
  /** Small heading above the points. */
  heading?: string;
  items: string[];
}

export interface CompareColumn {
  title: string;
  groups: CompareGroup[];
}

export interface Compare2Props {
  /** Exactly two columns: the second one is tinted. */
  columns: [CompareColumn, CompareColumn];
  className?: string;
}

const CMP_CSS = `
.cmp { position: relative; width: 100%; }
.cmp__grid { display: grid; grid-template-columns: 1fr; width: 100%; }
.cmp__col { padding-block: clamp(32px, 4.5vw, 52px); padding-inline: clamp(20px, 5vw, 56px); color: var(--cmp-fg, #12294a); }
.cmp__col--tint { background: var(--cmp-tint, #eaf3fd); }
.cmp__inner { max-width: 640px; margin: 0 auto; display: grid; gap: 24px; }
.cmp__title { margin: 0; text-align: left; text-wrap: balance; font-size: clamp(1.7rem, 3vw, 2.5rem); font-weight: 800; letter-spacing: -.035em; line-height: 1.08; }
.cmp__groups { display: grid; gap: 18px; }
.cmp__group { display: grid; gap: 8px; }
.cmp__heading { margin: 0; font-size: 1.12rem; font-weight: 700; letter-spacing: -.01em; }
.cmp__items { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.cmp__item { display: flex; align-items: flex-start; gap: 14px; line-height: 1.55; font-size: 1.02rem; color: var(--cmp-muted, #3e5272); }
.cmp__tick { flex: none; display: grid; place-items: center; width: 22px; height: 22px; margin-top: 1px; border-radius: 7px; color: #fff; background: var(--cmp-accent, linear-gradient(135deg, #f28c28, #ff9f43)); box-shadow: 0 6px 12px -6px rgba(242,140,40,.8); }
.cmp__tick svg { width: 13px; height: 13px; }
@media (min-width: 900px) {
  .cmp__grid { grid-template-columns: 1fr 1fr; }
  .cmp__col--tint { border-left: 1px solid var(--cmp-line, #d6e3f2); }
}
`;

const Tick = () => (
  <span className="cmp__tick" aria-hidden="true">
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3.5 8.5 3 3 6-7" />
    </svg>
  </span>
);

function Column({ col, tint }: { col: CompareColumn; tint?: boolean }) {
  return (
    <div className={"cmp__col" + (tint ? " cmp__col--tint" : "")}>
      <div className="cmp__inner">
        <h3 className="cmp__title">{col.title}</h3>
        <div className="cmp__groups">
          {col.groups.map((g, gi) => (
            <div className="cmp__group" key={g.heading ?? gi}>
              {g.heading ? <h4 className="cmp__heading">{g.heading}</h4> : null}
              <ul className="cmp__items">
                {g.items.map((item) => (
                  <li className="cmp__item" key={item}>
                    <Tick />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Compare2({ columns, className }: Compare2Props) {
  return (
    <div className={"cmp" + (className ? " " + className : "")}>
      <style>{CMP_CSS}</style>
      <div className="cmp__grid">
        <Column col={columns[0]} />
        <Column col={columns[1]} tint />
      </div>
    </div>
  );
}

export default Compare2;
