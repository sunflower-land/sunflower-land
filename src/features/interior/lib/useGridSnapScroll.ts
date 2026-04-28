import { useEffect, useRef } from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { Section } from "lib/utils/hooks/useScrollIntoView";

/**
 * Returns a ref to attach to a scrollable container. On every scroll, after a
 * short debounce, it nudges `scrollTop` / `scrollLeft` so the
 * `Section.GenesisBlock` element's offset from the viewport centre is an
 * integer multiple of GRID_WIDTH_PX.
 *
 * Why GenesisBlock-relative (not absolute scrollTop)?
 *   Placeable.tsx renders its drag ghost from a fixed-position viewport-centre
 *   anchor, snapping to GRID_WIDTH_PX increments. The canvas tile grid only
 *   stays in lockstep with that snap grid if GenesisBlock's screen centre is
 *   at viewport-centre + integer*GRID. Snapping the absolute scroll value
 *   wouldn't help — `scrollIntoView` rarely lands at a clean GRID multiple in
 *   the first place — so we measure GenesisBlock's actual screen position and
 *   nudge scroll by the sub-grid remainder.
 */
export function useGridSnapScroll<
  T extends HTMLElement,
>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const snap = () => {
      const genesis = document.getElementById(Section.GenesisBlock);
      if (!genesis) return;
      const rect = genesis.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const offsetX = cx - window.innerWidth / 2;
      const offsetY = cy - window.innerHeight / 2;

      const xRemainder =
        offsetX - Math.round(offsetX / GRID_WIDTH_PX) * GRID_WIDTH_PX;
      const yRemainder =
        offsetY - Math.round(offsetY / GRID_WIDTH_PX) * GRID_WIDTH_PX;

      // Increasing scrollLeft/Top by R shifts the content (and GenesisBlock)
      // by -R in viewport space, which subtracts R from offsetX/Y.
      if (Math.abs(xRemainder) > 0.5) el.scrollLeft += xRemainder;
      if (Math.abs(yRemainder) > 0.5) el.scrollTop += yRemainder;
    };

    const onScroll = () => {
      if (timer) clearTimeout(timer);
      // 80ms is short enough to feel instant, long enough to coalesce
      // wheel/inertia events.
      timer = setTimeout(snap, 80);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (timer) clearTimeout(timer);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  return ref;
}
