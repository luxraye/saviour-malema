import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";

// Animates a numeric value up from zero when scrolled into view.
// Preserves any non-numeric prefix/suffix, e.g. "500+", "P1,200".
export function CountUp({ value, duration = 1400, className = "" }) {
  const [ref, inView] = useInView();
  const [display, setDisplay] = useState(0);

  const raw = String(value);
  const match = raw.match(/-?[\d,]*\.?\d+/);
  const target = match ? Number(match[0].replace(/,/g, "")) : null;
  const prefix = match ? raw.slice(0, match.index) : "";
  const suffix = match ? raw.slice(match.index + match[0].length) : raw;

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (target === null || !inView) return;
    if (reduced) {
      setDisplay(target);
      return;
    }

    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration, reduced]);

  if (target === null) {
    return (
      <span ref={ref} className={className}>
        {raw}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
