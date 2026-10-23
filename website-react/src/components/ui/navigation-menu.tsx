"use client";

// Navigation menu primitives (Radix) with dropdown panels.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - Tailwind classes, `cn` and lucide are replaced by a scoped, .nm- prefixed
//    stylesheet and an inline chevron. Colours and fonts inherit from the host
//    (--nm-* variables) so the menu sits on the site's navy header.
//  - The shared viewport is not used: each panel is positioned by the host,
//    so a wide mega panel can be centred under the whole header.
import * as React from "react";
import { NavigationMenu as NavigationMenuPrimitive } from "radix-ui";

const cx = (...parts: (string | false | undefined)[]) =>
  parts.filter(Boolean).join(" ");

const NM_CSS = `
.nm { position: static; display: flex; align-items: center; }
.nm__list { display: flex; align-items: center; gap: 2px; margin: 0; padding: 0; list-style: none; }
.nm__item { position: relative; }
.nm__item--mega { position: static; }
.nm__trigger, .nm__link {
  display: inline-flex; align-items: center; gap: 6px; padding: 9px 14px; border: 0; border-radius: 7px; cursor: pointer;
  background: transparent; color: var(--nm-fg, #e6eef9); font: inherit; font-weight: 600; font-size: .95rem; line-height: 1.2; text-decoration: none; white-space: nowrap;
  transition: background .2s ease, color .2s ease;
}
.nm__trigger:hover, .nm__link:hover, .nm__trigger[data-state="open"] { background: rgba(255,255,255,.1); color: var(--nm-accent, #ffb566); }
.nm__link[aria-current="true"], .nm__link[data-active="true"] { color: #fff; background: rgba(255,255,255,.12); }
.nm__trigger:focus-visible, .nm__link:focus-visible { outline: 2px solid var(--nm-accent, #ffb566); outline-offset: 2px; }
.nm__chev { width: 14px; height: 14px; opacity: .7; transition: transform .25s ease; }
.nm__trigger[data-state="open"] .nm__chev { transform: rotate(180deg); }
.nm__content {
  position: absolute; top: calc(100% + 14px); left: 0; z-index: 60; padding: 12px; color: var(--nm-panel-fg, #12294a);
  background: var(--nm-panel, #fff); border: 1px solid var(--nm-panel-line, #d6e3f2); border-radius: 7px;
  box-shadow: 0 30px 60px -24px rgba(18,41,74,.55);
}
.nm__content[data-state="open"] { animation: nm-in .22s ease both; }
.nm__content[data-state="closed"] { animation: nm-out .16s ease both; }
@keyframes nm-in { from { opacity: 0; transform: translateY(-6px) scale(.985); } to { opacity: 1; transform: none; } }
@keyframes nm-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(-6px) scale(.985); } }
@media (prefers-reduced-motion: reduce) { .nm__content[data-state] { animation: none; } .nm__chev { transition: none; } }
`;

function NavigationMenu({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      className={cx("nm", className)}
      {...props}
    >
      <style>{NM_CSS}</style>
      {children}
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cx("nm__list", className)}
      {...props}
    />
  );
}

function NavigationMenuItem({
  className,
  mega,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item> & {
  /** Position the panel against the nearest positioned ancestor, not this item. */
  mega?: boolean;
}) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cx("nm__item", mega && "nm__item--mega", className)}
      {...props}
    />
  );
}

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cx("nm__trigger", className)}
      {...props}
    >
      {children}
      <svg
        className="nm__chev"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cx("nm__content", className)}
      {...props}
    />
  );
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={className}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
};
