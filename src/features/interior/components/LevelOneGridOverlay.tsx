import React, { useEffect, useState } from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { HomeExpansionTier } from "features/game/types/game";
import {
  INTERIOR_CANVAS,
  HOME_EXPANSION_LAYOUTS,
} from "features/game/expansion/placeable/lib/interiorLayouts";

/**
 * Click-to-toggle dev overlay for the level_one floor — same UX as the
 * InteriorGridOverlay but reads from HOME_EXPANSION_LAYOUTS for the player's
 * active expansion tier.
 *
 * Re-initialised whenever the active tier changes.
 */
export const LevelOneGridOverlay: React.FC<{ tier: HomeExpansionTier }> = ({
  tier,
}) => {
  const [validTiles, setValidTiles] = useState<Set<string>>(
    () => new Set(HOME_EXPANSION_LAYOUTS[tier]),
  );

  useEffect(() => {
    setValidTiles(new Set(HOME_EXPANSION_LAYOUTS[tier]));
  }, [tier]);

  const tiles: Array<{ x: number; y: number }> = [];
  for (let x = 0; x < INTERIOR_CANVAS.width; x++) {
    for (let y = 1; y <= INTERIOR_CANVAS.height; y++) {
      tiles.push({ x, y });
    }
  }

  const formatSet = (s: Set<string>): string => {
    const sorted = Array.from(s).sort((a, b) => {
      const [ax, ay] = a.split(",").map(Number);
      const [bx, by] = b.split(",").map(Number);
      return ax - bx || ay - by;
    });
    const lines: string[] = [];
    for (let i = 0; i < sorted.length; i += 8) {
      lines.push(
        "    " + sorted.slice(i, i + 8).map((k) => `"${k}"`).join(", ") + ",",
      );
    }
    return `new Set([\n${lines.join("\n")}\n  ]),`;
  };

  const logPasteable = (next: Set<string>) => {
    const invalid = new Set<string>();
    for (let x = 0; x < INTERIOR_CANVAS.width; x++) {
      for (let y = 1; y <= INTERIOR_CANVAS.height; y++) {
        const key = `${x},${y}`;
        if (!next.has(key)) invalid.add(key);
      }
    }
    // eslint-disable-next-line no-console
    console.log(
      `[level_one:${tier}] ${next.size} valid / ${invalid.size} invalid (colliding)\n\n` +
        `// VALID — paste into HOME_EXPANSION_LAYOUTS["${tier}"] in interiorLayouts.ts\n` +
        `"${tier}": ${formatSet(next)}\n\n` +
        `// INVALID (red / colliding) — for reference\n` +
        `"${tier}_invalid": ${formatSet(invalid)}`,
    );
  };

  const toggle = (key: string) => {
    setValidTiles((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      logPasteable(next);
      return next;
    });
  };

  return (
    <div className="absolute inset-0" style={{ zIndex: 50 }}>
      {tiles.map(({ x, y }) => {
        const key = `${x},${y}`;
        const valid = validTiles.has(key);
        return (
          <div
            key={key}
            role="button"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              toggle(key);
            }}
            className="absolute flex items-center justify-center cursor-pointer select-none"
            style={{
              left: x * GRID_WIDTH_PX,
              top: (INTERIOR_CANVAS.height - y) * GRID_WIDTH_PX,
              width: GRID_WIDTH_PX,
              height: GRID_WIDTH_PX,
              backgroundColor: valid
                ? "rgba(40, 200, 80, 0.22)"
                : "rgba(220, 40, 40, 0.28)",
              outline: "1px solid rgba(0,0,0,0.25)",
              fontSize: 9,
              fontFamily: "monospace",
              color: "rgba(0,0,0,0.8)",
              lineHeight: 1,
            }}
          >
            <span>
              {x},{y}
            </span>
          </div>
        );
      })}
    </div>
  );
};
