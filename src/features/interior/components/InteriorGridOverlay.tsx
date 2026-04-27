import React, { useEffect, useState } from "react";
import { GRID_WIDTH_PX } from "features/game/lib/constants";
import { IslandType } from "features/game/types/game";
import {
  INTERIOR_CANVAS,
  INTERIOR_LAYOUTS,
} from "features/game/expansion/placeable/lib/interiorLayouts";

/**
 * Dev overlay rendered on top of the interior canvas in debug mode.
 *
 * Shows every (x, y) tile coordinate and whether it's inside the valid layout
 * for the current island — green = placeable, red = wall / outside room.
 *
 * Click any tile to toggle it between valid and invalid. Toggles are kept in
 * local React state (not persisted), and after each click the full updated
 * tile sets are dumped to the console in a copy/paste-ready format. Use this
 * to tune INTERIOR_LAYOUTS by hand: click tiles until the room looks right
 * for an island, then paste the logged "VALID" block into interiorLayouts.ts.
 *
 * Switching islands resets the local toggles back to the canonical layout.
 */
export const InteriorGridOverlay: React.FC<{ island: IslandType }> = ({
  island,
}) => {
  // Local mutable copy of the valid-tile set for this island. Initialized from
  // the constant, and reset whenever the active island changes.
  const [validTiles, setValidTiles] = useState<Set<string>>(
    () => new Set(INTERIOR_LAYOUTS[island]),
  );

  useEffect(() => {
    setValidTiles(new Set(INTERIOR_LAYOUTS[island]));
  }, [island]);

  const tiles: Array<{ x: number; y: number }> = [];
  for (let x = 0; x < INTERIOR_CANVAS.width; x++) {
    // y is the TOP of each 1x1 tile (see coordinate convention in
    // interiorLayouts.ts). Bottom row has y = 1, top row has y = height.
    for (let y = 1; y <= INTERIOR_CANVAS.height; y++) {
      tiles.push({ x, y });
    }
  }

  const formatSet = (s: Set<string>): string => {
    // Sort by x then y for deterministic, easy-to-diff output.
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
      `[interior:${island}] ${next.size} valid / ${invalid.size} invalid (colliding)\n\n` +
        `// VALID — paste into INTERIOR_LAYOUTS.${island} in interiorLayouts.ts\n` +
        `${island}: ${formatSet(next)}\n\n` +
        `// INVALID (red / colliding) — for reference\n` +
        `${island}_invalid: ${formatSet(invalid)}`,
    );
  };

  const toggle = (key: string) => {
    setValidTiles((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
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
