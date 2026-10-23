"use client";

// Odometer-style number counter. When it scrolls into view the digits roll up
// from `from` to `to`, each column turning on its own like a mechanical counter.
//
// Local changes to the original (this project has no Tailwind or shadcn):
//  - `cn` and the Tailwind utility classes are replaced by inline styles.
//  - Optional `prefix` / `suffix` sit outside the rolling digits (e.g. "$").
//  - With prefers-reduced-motion the final number is shown straight away.
//  - Odometer columns carry only on the final step before rolling over, so the
//    settled number is exact (the original drifted each column early).
import * as React from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import useMeasure from "react-use-measure";

type DigitEffect = "none" | "fade" | "blur" | "slide";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  digitEffect?: DigitEffect;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  /** Shown before the number, not part of the roll. */
  prefix?: string;
  /** Shown after the number, not part of the roll. */
  suffix?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

type OdometerDigitProps = {
  springValue: MotionValue<number>;
  /** place value: 1, 10, 100, 1000 … */
  place: number;
};

function OdometerDigit({ springValue, place }: OdometerDigitProps) {
  const [ref, { height }] = useMeasure();

  const y = useTransform(springValue, (v) => {
    if (!height) return 0;
    // A column only turns toward the next digit during the last whole step before
    // it carries (e.g. the tens column moves while the ones run 9 -> 10). A plain
    // (v / place) % 10 drifts every column early, so a settled 399 read as ~409.
    const a = Math.abs(v);
    const base = Math.floor(a / place) % 10;
    const carry = Math.min(1, Math.max(0, (a % place) - (place - 1)));
    return -(base + carry) * height;
  });

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: "1ch",
        overflowY: "clip",
        overflowX: "visible",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span ref={ref} style={{ visibility: "hidden", display: "block" }}>
        0
      </span>
      <motion.span
        style={{
          y,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 11 digits (0–9 + repeated 0) so the 9→0 wrap is seamless */}
        {Array.from({ length: 11 }, (_, i) => (
          <span
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: height || "1em",
            }}
          >
            {i % 10}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

type CharSlotProps = {
  char: string;
  charKey: string;
  effect: Exclude<DigitEffect, "none" | "slide">;
  countingUp: boolean;
};

const CHAR_VARIANTS = {
  fade: {
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.7 },
    transition: { duration: 0.14, ease: "easeOut" },
    overflow: "hidden" as const,
  },
  blur: {
    initial: (up: boolean) => ({
      opacity: 0,
      filter: "blur(8px)",
      y: up ? -8 : 8,
    }),
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: (up: boolean) => ({
      opacity: 0,
      filter: "blur(8px)",
      y: up ? 8 : -8,
    }),
    transition: { duration: 0.18, ease: "easeOut" },
    overflow: "visible" as const,
  },
};

function CharSlot({ char, charKey, effect, countingUp }: CharSlotProps) {
  const isDigit = /\d/.test(char);

  if (!isDigit) {
    return <span style={{ display: "inline-block" }}>{char}</span>;
  }

  const v = CHAR_VARIANTS[effect];
  const initial =
    typeof v.initial === "function" ? v.initial(countingUp) : v.initial;

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        overflow: v.overflow,
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={charKey}
          initial={initial}
          animate={v.animate}
          transition={v.transition as object}
          style={{ display: "inline-block" }}
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const flexRow: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
};

function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  digitEffect = "none",
  className,
  startWhen = true,
  separator = "",
  prefix = "",
  suffix = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(direction === "down" ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes(".")) {
      const parts = str.split(".");
      const decimals = parts[1];
      if (decimals && parseInt(decimals) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = React.useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;
      const options: Intl.NumberFormatOptions = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };
      const formatted = Intl.NumberFormat("en-US", options).format(latest);
      return separator ? formatted.replace(/,/g, separator) : formatted;
    },
    [maxDecimals, separator],
  );

  const initialStr = formatValue(direction === "down" ? to : from);
  const [chars, setChars] = React.useState<string[]>(initialStr.split(""));

  React.useEffect(() => {
    const initial = formatValue(direction === "down" ? to : from);
    if (digitEffect === "none") {
      if (ref.current) ref.current.textContent = initial;
    } else if (digitEffect !== "slide") {
      setChars(initial.split(""));
    }
  }, [from, to, direction, formatValue, digitEffect]);

  React.useEffect(() => {
    if (isInView && startWhen) {
      onStart?.();
      const t1 = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);
      const t2 = setTimeout(() => onEnd?.(), delay * 1000 + duration * 1000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [
    isInView,
    startWhen,
    motionValue,
    direction,
    from,
    to,
    delay,
    onStart,
    onEnd,
    duration,
  ]);

  React.useEffect(() => {
    const unsubscribe = springValue.on("change", (latest: number) => {
      if (digitEffect === "none") {
        if (ref.current) ref.current.textContent = formatValue(latest);
      } else if (digitEffect !== "slide") {
        setChars(formatValue(latest).split(""));
      }
    });
    return () => unsubscribe();
  }, [springValue, formatValue, digitEffect]);

  const countingUp = direction === "up";
  const finalValue = direction === "down" ? from : to;

  // Reduced motion: no rolling, just the final number.
  if (reduced) {
    return (
      <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
        {prefix}
        {formatValue(finalValue)}
        {suffix}
      </span>
    );
  }

  if (digitEffect === "slide") {
    const targetStr = formatValue(finalValue);
    const structure: Array<{
      type: "digit" | "sep";
      char?: string;
      placeIdx?: number;
    }> = [];
    let digitCount = 0;
    for (const ch of targetStr) {
      if (/\d/.test(ch)) digitCount++;
    }
    let d = 0;
    for (const ch of targetStr) {
      if (/\d/.test(ch)) {
        const placeFromRight = digitCount - 1 - d;
        structure.push({ type: "digit", placeIdx: placeFromRight });
        d++;
      } else {
        structure.push({ type: "sep", char: ch });
      }
    }

    return (
      <span
        ref={ref}
        className={className}
        style={{ ...flexRow, fontVariantNumeric: "tabular-nums" }}
        role="text"
        aria-label={`${prefix}${targetStr}${suffix}`}
      >
        {prefix ? <span aria-hidden="true">{prefix}</span> : null}
        {structure.map((item, i) =>
          item.type === "sep" ? (
            <span key={i} aria-hidden="true">{item.char}</span>
          ) : (
            <span key={i} aria-hidden="true" style={{ display: "inline-flex" }}>
              <OdometerDigit
                springValue={springValue}
                place={Math.pow(10, item.placeIdx!)}
              />
            </span>
          ),
        )}
        {suffix ? <span aria-hidden="true">{suffix}</span> : null}
      </span>
    );
  }

  if (digitEffect === "none") {
    return <span ref={ref} className={className} />;
  }

  return (
    <span ref={ref} className={className} style={flexRow}>
      {prefix}
      {chars.map((char, i) => (
        <CharSlot
          key={i}
          char={char}
          charKey={`${i}-${char}`}
          effect={digitEffect as Exclude<DigitEffect, "none" | "slide">}
          countingUp={countingUp}
        />
      ))}
      {suffix}
    </span>
  );
}

export { CountUp, type CountUpProps, type DigitEffect };

export default CountUp;
