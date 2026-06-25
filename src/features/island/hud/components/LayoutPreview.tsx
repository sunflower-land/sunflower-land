import React from "react";
import type { SavedLayout } from "features/game/types/game";
import {
  layoutItemRects,
  type LayoutRectCategory,
} from "features/game/events/landExpansion/lib/layouts";
import { ITEM_DETAILS } from "features/game/types/images";

const ITEM_IMAGE = ITEM_DETAILS as Record<string, { image: string }>;

/** Fallback block colour for the rare item with no resolvable sprite. */
const FALLBACK_COLOR: Record<LayoutRectCategory, string> = {
  resource: "#63a74a",
  building: "#c98f4f",
  collectible: "#b35aa6",
};

/** Grass field styling with faint per-tile grid lines that scale with the box. */
const grassStyle = (cols: number, rows: number): React.CSSProperties => ({
  backgroundColor: "#8fbf57",
  backgroundImage:
    `repeating-linear-gradient(90deg, rgba(40,70,20,0.07) 0px, rgba(40,70,20,0.07) 1px, transparent 1px, transparent calc(100% / ${cols})),` +
    `repeating-linear-gradient(0deg, rgba(40,70,20,0.07) 0px, rgba(40,70,20,0.07) 1px, transparent 1px, transparent calc(100% / ${rows})),` +
    "linear-gradient(160deg, #97c75f 0%, #84b64d 100%)",
  boxShadow: "inset 0 0 0 1px rgba(60,40,20,0.18)",
  imageRendering: "pixelated",
});

type Props = {
  layout: Pick<SavedLayout, "collectibles" | "buildings" | "resources">;
  /** Applied to the outer box — set the width here; height follows the aspect. */
  className?: string;
};

/**
 * A miniature render of a layout using each item's real sprite on a grass
 * field — a live thumbnail of the farm. Fully responsive: the box fills its
 * container's width and derives height from the layout's aspect ratio, with
 * sprites positioned as percentages. World y increases upwards (so it is
 * flipped), sprites are bottom-anchored to overhang their tile, and painted
 * back-to-front.
 */
export const LayoutPreview: React.FC<Props> = ({ layout, className }) => {
  const rects = layoutItemRects(layout);

  if (rects.length === 0) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          aspectRatio: "16 / 11",
          borderRadius: 3,
          ...grassStyle(16, 11),
        }}
      />
    );
  }

  const minX = Math.min(...rects.map((r) => r.x));
  const maxX = Math.max(...rects.map((r) => r.x + r.width));
  const minY = Math.min(...rects.map((r) => r.y - r.height));
  const maxY = Math.max(...rects.map((r) => r.y));

  const worldWidth = Math.max(maxX - minX, 1);
  const worldHeight = Math.max(maxY - minY, 1);

  // Paint back-to-front: higher world-y (further back) first.
  const ordered = [...rects].sort((a, b) => b.y - a.y);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: `${worldWidth} / ${worldHeight}`,
        overflow: "hidden",
        borderRadius: 3,
        ...grassStyle(worldWidth, worldHeight),
      }}
    >
      {ordered.map((rect, i) => {
        const image = ITEM_IMAGE[rect.name]?.image;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${((rect.x - minX) / worldWidth) * 100}%`,
              top: `${((maxY - rect.y) / worldHeight) * 100}%`,
              width: `${(rect.width / worldWidth) * 100}%`,
              height: `${(rect.height / worldHeight) * 100}%`,
            }}
          >
            {image ? (
              <img
                src={image}
                alt=""
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "auto",
                  imageRendering: "pixelated",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 1,
                  backgroundColor: FALLBACK_COLOR[rect.category],
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
