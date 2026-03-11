import { useEffect, useState } from "react";

/**
 * Detects if the environment has a non-zero top safe area (e.g. notch, dynamic island)
 * and returns the given padding to apply when so, otherwise 0.
 */
export const useSafeAreaPaddingTop = (paddingWhenActive = 30): number => {
  const [paddingTop, setPaddingTop] = useState(0);

  useEffect(() => {
    const el = document.createElement("div");
    el.style.cssText =
      "position:absolute;padding-top:env(safe-area-inset-top);visibility:hidden;pointer-events:none;";
    document.body.appendChild(el);
    const computed = getComputedStyle(el).paddingTop;
    document.body.removeChild(el);
    const px = parseInt(computed, 10);
    const value = !Number.isNaN(px) && px > 0 ? paddingWhenActive : 0;
    const id = requestAnimationFrame(() => setPaddingTop(value));
    return () => cancelAnimationFrame(id);
  }, [paddingWhenActive]);

  return paddingTop;
};
