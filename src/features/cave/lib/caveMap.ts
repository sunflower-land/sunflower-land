/**
 * Reads the Cave interior out of the art team's Tiled map
 * (`assets/map/cave_interior.json`). Test-only: the room is rendered from the
 * artist's per-tier images, and `caveLayout.ts` holds the positions as plain
 * constants; `caveLayout.test.ts` derives them from the map with these
 * helpers so a re-export that moves something fails the test, not the room.
 *
 * The map has no object layers. Everything is derived from the tile layers:
 * one layer GROUP per tier (`room1`..`room8`), each holding the slots unlocked
 * at that tier (`room-patch`), the next slot's barrier (`under-construction`),
 * and the Merchant's alcove (`cave_entrance_merchant?`); plus the shared
 * `stair` layer with the ladder.
 */

export const CAVE_TILE_PX = 16;

type TiledTileLayer = {
  type: "tilelayer";
  name: string;
  data: number[];
};

type TiledGroupLayer = {
  type: "group";
  name: string;
  layers: (TiledTileLayer | TiledGroupLayer)[];
};

export type CaveTiledMap = {
  width: number;
  height: number;
  layers: (TiledTileLayer | TiledGroupLayer)[];
};

export type PixelRect = { x: number; y: number; width: number; height: number };

type TileBox = { x: number; y: number; w: number; h: number };

const tileKey = (x: number, y: number) => `${x},${y}`;

const SLOTS_LAYER = "room-patch";
const CONSTRUCTION_LAYER = "under-construction";
const MERCHANT_LAYER = "cave_entrance_merchant?";
const STAIR_LAYER = "stair";

// Inside a slot's 7x11 box: the Myco Bin at rows 0-2 / columns 1-5, fence
// row 3, border row 4, the 5x5 sand at rows 5-9 / columns 1-5, border row 10.
const SIGN_OFFSET = { x: 1, y: 0, w: 5, h: 3 };
const DIG_OFFSET = { x: 1, y: 5 };

// Searches a group and its sub-groups (the Merchant's alcove sits in a
// `decors` group inside the room).
function findTileLayer(
  layers: (TiledTileLayer | TiledGroupLayer)[],
  name: string,
): TiledTileLayer | undefined {
  for (const layer of layers) {
    if (layer.type === "tilelayer" && layer.name === name) return layer;
    if (layer.type === "group") {
      const found = findTileLayer(layer.layers, name);
      if (found) return found;
    }
  }

  return undefined;
}

function roomLayer(map: CaveTiledMap, tier: number, name: string) {
  const group = map.layers.find(
    (layer): layer is TiledGroupLayer =>
      layer.type === "group" && layer.name === `room${tier}`,
  );

  return group && findTileLayer(group.layers, name);
}

function topLayer(map: CaveTiledMap, name: string): TiledTileLayer {
  const layer = map.layers.find(
    (l): l is TiledTileLayer => l.type === "tilelayer" && l.name === name,
  );

  if (!layer) {
    throw new Error(`Cave map has no ${name} layer`);
  }

  return layer;
}

function filledTiles(map: CaveTiledMap, layer: TiledTileLayer): Set<string> {
  const tiles = new Set<string>();

  layer.data.forEach((gid, index) => {
    if (gid) {
      tiles.add(tileKey(index % map.width, Math.floor(index / map.width)));
    }
  });

  return tiles;
}

/**
 * Splits a set of tiles into 8-connected clusters and returns each cluster's
 * bounding box, sorted by position (top to bottom, then left to right).
 */
function tileBoxes(tiles: Set<string>): TileBox[] {
  const remaining = new Set(tiles);
  const boxes: TileBox[] = [];

  while (remaining.size) {
    const [first] = remaining;
    remaining.delete(first);
    const stack = [first];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    while (stack.length) {
      const key = stack.pop() as string;
      const [x, y] = key.split(",").map(Number);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);

      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const neighbour = tileKey(x + dx, y + dy);
          if (remaining.has(neighbour)) {
            remaining.delete(neighbour);
            stack.push(neighbour);
          }
        }
      }
    }

    boxes.push({ x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 });
  }

  return boxes.sort((a, b) => a.y - b.y || a.x - b.x);
}

const toPixels = (box: TileBox): PixelRect => ({
  x: box.x * CAVE_TILE_PX,
  y: box.y * CAVE_TILE_PX,
  width: box.w * CAVE_TILE_PX,
  height: box.h * CAVE_TILE_PX,
});

export type CaveSlotRect = {
  /** The slot's 7x11 tile box from the map. */
  box: TileBox;
  /** Pixel origin of the 5x5 dig grid (top-left of the first cell). */
  dig: { x: number; y: number };
  /** The Myco Bin sign, in pixels. */
  sign: PixelRect;
};

/**
 * Slot N is the box that first appears in room N's `room-patch` layer — slots
 * 1-4 along the top row left to right, 5-8 along the bottom row right to left.
 */
export function getCaveSlotRects(
  map: CaveTiledMap,
): Record<number, CaveSlotRect> {
  const slots: Record<number, CaveSlotRect> = {};
  const seen = new Set<string>();

  for (let tier = 1; tier <= 8; tier++) {
    const layer = roomLayer(map, tier, SLOTS_LAYER);
    if (!layer) continue;

    const fresh = tileBoxes(filledTiles(map, layer)).filter(
      (box) => !seen.has(tileKey(box.x, box.y)),
    );

    if (fresh.length !== 1) {
      throw new Error(`room${tier} should unlock exactly one slot`);
    }

    const [box] = fresh;
    seen.add(tileKey(box.x, box.y));
    slots[tier] = {
      box,
      dig: {
        x: (box.x + DIG_OFFSET.x) * CAVE_TILE_PX,
        y: (box.y + DIG_OFFSET.y) * CAVE_TILE_PX,
      },
      sign: toPixels({
        x: box.x + SIGN_OFFSET.x,
        y: box.y + SIGN_OFFSET.y,
        w: SIGN_OFFSET.w,
        h: SIGN_OFFSET.h,
      }),
    };
  }

  return slots;
}

/** The barrier marking the next slot at a tier, or undefined at the last tier. */
export function getCaveConstructionSite(
  map: CaveTiledMap,
  tier: number,
): PixelRect | undefined {
  const layer = roomLayer(map, tier, CONSTRUCTION_LAYER);
  if (!layer) return undefined;

  const [box] = tileBoxes(filledTiles(map, layer));
  return box ? toPixels(box) : undefined;
}

/** The Merchant's alcove at a tier, or undefined before it is dug out. */
export function getCaveMerchantAlcove(
  map: CaveTiledMap,
  tier: number,
): PixelRect | undefined {
  const layer = roomLayer(map, tier, MERCHANT_LAYER);
  if (!layer) return undefined;

  const [box] = tileBoxes(filledTiles(map, layer));
  return box ? toPixels(box) : undefined;
}

/** The ladder out, in pixels. */
export function getCaveStair(map: CaveTiledMap): PixelRect {
  const [box] = tileBoxes(filledTiles(map, topLayer(map, STAIR_LAYER)));
  return toPixels(box);
}
