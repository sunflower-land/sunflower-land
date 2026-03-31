import React, { useEffect, useId, useRef, useState } from "react";

const CHICKEN_RESCUE_TILE_URL = "/minigames/chicken-rescue/47.png";

/**
 * Horizontally repeating bumpkin-tile background with every other tile mirrored so
 * seams read as a continuous strip (bookmatched), matching `auto 100%` square tiles.
 */
export const ChickenRescueBookmatchedBackdrop: React.FC = () => {
  const patternId = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [{ w, h }, setDims] = useState({ w: 100, h: 100 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0]?.contentRect ?? {
        width: 0,
        height: 0,
      };
      setDims({
        w: Math.max(1, Math.round(width)),
        h: Math.max(1, Math.round(height)),
      });
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const tile = h;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      aria-hidden
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${w} ${h}`}
        preserveAspectRatio="none"
        className="block size-full [image-rendering:pixelated]"
      >
        <defs>
          <pattern
            id={`chicken-tile-${patternId}`}
            patternUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={2 * tile}
            height={tile}
          >
            <image
              href={CHICKEN_RESCUE_TILE_URL}
              x={0}
              y={0}
              width={tile}
              height={tile}
              preserveAspectRatio="none"
            />
            <g transform={`translate(${2 * tile}, 0) scale(-1, 1)`}>
              <image
                href={CHICKEN_RESCUE_TILE_URL}
                x={0}
                y={0}
                width={tile}
                height={tile}
                preserveAspectRatio="none"
              />
            </g>
          </pattern>
        </defs>
        <rect width={w} height={h} fill={`url(#chicken-tile-${patternId})`} />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5))",
        }}
      />
    </div>
  );
};
