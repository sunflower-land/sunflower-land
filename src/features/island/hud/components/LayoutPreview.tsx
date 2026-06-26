import React, { useState } from "react";
import type { GameState, SavedLayout } from "features/game/types/game";
import {
  layoutItemRects,
  type LayoutRect,
  type LayoutRectCategory,
} from "features/game/events/landExpansion/lib/layouts";
import { ITEM_DETAILS } from "features/game/types/images";
import { getBudImage } from "lib/buds/types";
import { getPetImage } from "features/island/pets/lib/petShared";
import { getAnimatedWebpUrl } from "features/world/lib/animations";
import { getLandImage } from "features/game/expansion/components/LandBase";
import { getDirtImage } from "features/game/expansion/components/DirtRenderer";
import { getCurrentBiome } from "features/island/biomes/biomes";
import { hasRequiredIslandExpansion } from "features/game/lib/hasRequiredIslandExpansion";
import { SUNNYSIDE } from "assets/sunnyside";
import {
  connectedCollectibleImage,
  dirtTiles,
  layoutGrid,
} from "./connectedCollectibleSprite";
import { SOIL_IMAGES } from "features/island/plots/lib/plant";
import type { GameGrid } from "features/game/expansion/placeable/lib/makeGrid";

const ITEM_IMAGE = ITEM_DETAILS as Record<string, { image: string }>;

/** The land composite is generated at 16px/tile (origin 0,0 at its centre). */
const LAND_IMAGE_TILE_PX = 16;

/** The farm's ocean tile for this island/season — fills around the land. */
const oceanTexture = (
  island: GameState["island"] | undefined,
  season: string,
): string => {
  if (season === "winter") return SUNNYSIDE.decorations.frozenOcean;
  if (island && hasRequiredIslandExpansion(island.type, "volcano")) {
    return SUNNYSIDE.decorations.darkOcean;
  }
  return SUNNYSIDE.decorations.ocean;
};

/** Tiled-ocean background, matching the farm's water behind the land. */
const waterStyle = (
  island: GameState["island"] | undefined,
  season: string,
): React.CSSProperties => ({
  backgroundImage: `url(${oceanTexture(island, season)})`,
  backgroundSize: "48px",
  imageRendering: "pixelated",
});

/** Fallback block colour for the rare item with no resolvable sprite. */
const FALLBACK_COLOR: Record<LayoutRectCategory, string> = {
  resource: "#63a74a",
  building: "#c98f4f",
  collectible: "#b35aa6",
  nft: "#e3b23c",
  avatar: "#4a90d9",
};

/**
 * Resolve the sprite for a rect. Fences/paths pick a connecting sprite from the
 * `grid` (so runs join up like on the farm); other collectibles/buildings/
 * resources use their static `ITEM_DETAILS` image; Buds/Pet NFTs resolve from
 * their id (the on-farm sprite, not the marketplace one); the Bumpkin/FarmHands
 * compose an idle sprite from their live equipped parts (looked up on `game`).
 * Returns undefined → the preview draws a colour block.
 */
const resolveSprite = (
  rect: LayoutRect,
  grid: GameGrid,
  game?: GameState,
): string | undefined => {
  if (rect.category === "nft") {
    if (!rect.id) return undefined;
    return rect.name === "Bud"
      ? getBudImage(Number(rect.id))
      : getPetImage("happy", Number(rect.id));
  }

  if (rect.category === "avatar") {
    const parts =
      rect.name === "Bumpkin"
        ? game?.bumpkin.equipped
        : rect.id
          ? game?.farmHands.bumpkins[rect.id]?.equipped
          : undefined;
    return parts ? getAnimatedWebpUrl(parts, ["idle-small"]) : undefined;
  }

  if (rect.category === "collectible") {
    const connected = connectedCollectibleImage(
      rect.name,
      grid,
      rect.x,
      rect.y,
    );
    if (connected) return connected;
  }

  return ITEM_IMAGE[rect.name]?.image;
};

type Props = {
  layout: Pick<
    SavedLayout,
    | "collectibles"
    | "buildings"
    | "resources"
    | "buds"
    | "petNFTs"
    | "farmHands"
    | "bumpkin"
    | "land"
  >;
  /** Applied to the outer box — set the width here; height follows the aspect. */
  className?: string;
  /**
   * Live game state — supplies the current season for the land art and resolves
   * Bumpkin/FarmHand equipped sprites by id. Falls back to the layout's stored
   * land when absent.
   */
  game?: GameState;
};

/**
 * A miniature render of a layout on the real, biome-correct land sprite — a live
 * thumbnail of the farm sized to the land itself (not just the placed items).
 * The land image is 16px/tile with world (0,0) at its centre, so items are laid
 * out with an origin-centred map: world x grows right, world y grows up (so it
 * is flipped on screen), sprites bottom-anchored to overhang their tile, painted
 * back-to-front. The land's natural pixel size drives the box aspect ratio.
 */
export const LayoutPreview: React.FC<Props> = ({ layout, className, game }) => {
  // The measured natural size is tagged with the land image it came from, so a
  // newly-selected layout never paints a frame at the previous land's size.
  const [measured, setMeasured] = useState<{
    src: string;
    w: number;
    h: number;
  } | null>(null);

  const island = layout.land?.island ?? game?.island;
  const expansions =
    layout.land?.expansions ?? game?.inventory["Basic Land"]?.toNumber() ?? 3;
  const season = game?.season.season ?? "spring";
  const landSrc = island ? getLandImage(island, expansions, season) : undefined;

  // No resolvable land art (e.g. a legacy layout with no `land` and no game).
  if (!landSrc) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          aspectRatio: "16 / 11",
          borderRadius: 3,
          ...waterStyle(island, season),
        }}
      />
    );
  }

  // Ignore a measurement left over from a previously-selected land image.
  const size = measured?.src === landSrc ? measured : null;
  const tilesWide = size ? size.w / LAND_IMAGE_TILE_PX : 0;
  const tilesHigh = size ? size.h / LAND_IMAGE_TILE_PX : 0;

  // Grid of placed items so fences/paths pick the connecting sprite.
  const grid = layoutGrid(layout);
  const biome = island ? getCurrentBiome(island) : undefined;

  // Paint back-to-front: higher world-y (further back) first.
  const ordered = [...layoutItemRects(layout)].sort((a, b) => b.y - a.y);

  /** World tile (x,y) → CSS box on the origin-centred land image. */
  const tileBox = (
    x: number,
    y: number,
    w: number,
    h: number,
  ): React.CSSProperties => ({
    position: "absolute",
    left: `${((x + tilesWide / 2) / tilesWide) * 100}%`,
    top: `${((tilesHigh / 2 - y) / tilesHigh) * 100}%`,
    width: `${(w / tilesWide) * 100}%`,
    height: `${(h / tilesHigh) * 100}%`,
  });

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: size ? `${size.w} / ${size.h}` : "1 / 1",
        overflow: "hidden",
        borderRadius: 3,
        ...waterStyle(island, season),
      }}
    >
      <img
        src={landSrc}
        alt=""
        onLoad={(e) =>
          setMeasured({
            src: landSrc,
            w: e.currentTarget.naturalWidth,
            h: e.currentTarget.naturalHeight,
          })
        }
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
        }}
      />

      {/* Dirt layer — crop plots + Dirt Path decorations, joined like the farm. */}
      {size &&
        biome &&
        dirtTiles(grid).map(({ x, y }) => (
          <img
            key={`dirt_${x}_${y}`}
            src={getDirtImage(grid, x, y, biome)}
            alt=""
            style={{ ...tileBox(x, y, 1, 1), imageRendering: "pixelated" }}
          />
        ))}

      {/* Empty plots — the dug soil sits on the connecting dirt. */}
      {size &&
        biome &&
        Object.values(layout.resources.crops ?? {}).map(({ x, y }, i) => (
          <img
            key={`plot_${i}`}
            src={SOIL_IMAGES[biome].regular}
            alt=""
            style={{ ...tileBox(x, y, 1, 1), imageRendering: "pixelated" }}
          />
        ))}

      {/* Items are placed only once the land's natural size is known. */}
      {size &&
        ordered.map((rect, i) => {
          // Crop plots and Dirt Path are drawn by the dirt layer above, so they
          // share one connecting dirt shape exactly like the live game.
          if (rect.name === "Dirt Path" || rect.name === "Crop Plot") {
            return null;
          }
          const image = resolveSprite(rect, grid, game);
          return (
            <div
              key={i}
              style={tileBox(rect.x, rect.y, rect.width, rect.height)}
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
                    transform: rect.flipped ? "scaleX(-1)" : undefined,
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
