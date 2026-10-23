"use client";

// A button with a travelling sheen around its edge. The look lives in the site
// stylesheet (the `.shiny-cta` rules in theme.css, which also style every primary
// `.btn--primary` button), so links and form buttons share it.
//
// Local changes to the original (this project has no Tailwind, Next or styled-jsx):
//  - The styles moved out of a <style jsx> block into the global stylesheet, with a
//    navy base and an orange highlight instead of black and blue, and 7px corners.
//  - Polymorphic: `as` renders a router Link or an <a>; the default is a <button>.
//  - Honours prefers-reduced-motion (the sheen stops).
import * as React from "react";

type ShinyButtonOwnProps<T extends React.ElementType> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
};

export type ShinyButtonProps<T extends React.ElementType = "button"> =
  ShinyButtonOwnProps<T> &
    Omit<React.ComponentPropsWithoutRef<T>, keyof ShinyButtonOwnProps<T>>;

export function ShinyButton<T extends React.ElementType = "button">({
  as,
  children,
  className = "",
  ...props
}: ShinyButtonProps<T>) {
  const Tag = (as ?? "button") as React.ElementType;
  return (
    <Tag className={`btn shiny-cta ${className}`.trim()} {...props}>
      <span>{children}</span>
    </Tag>
  );
}

export default ShinyButton;
