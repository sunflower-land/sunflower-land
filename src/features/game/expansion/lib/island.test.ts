import { EXPANSION_ORIGINS, LAND_SIZE } from "./constants";
import { getIslandSpawnPositions, reAnchorToIsland } from "./island";

describe("island vs next expansion", () => {
  const listed = Object.keys(EXPANSION_ORIGINS).length;
  const half = LAND_SIZE / 2;

  // The island is anchored off the next expansion's edge, so no island spawn
  // tile may fall inside the next expansion's footprint — otherwise the
  // upcoming-expansion scaffolding would overlap the island.
  it("keeps every island spawn tile out of the next expansion's footprint", () => {
    for (let count = 1; count < listed; count++) {
      const next = EXPANSION_ORIGINS[count];

      for (const tile of getIslandSpawnPositions(count)) {
        const insideX = tile.x >= next.x - half && tile.x < next.x + half;
        const insideY = tile.y >= next.y - half && tile.y < next.y + half;

        expect({
          count,
          tile,
          insideNextExpansion: insideX && insideY,
        }).toEqual({ count, tile, insideNextExpansion: false });
      }
    }
  });
});

describe("reAnchorToIsland", () => {
  const expansionCount = 9;

  // Mushrooms can spawn on the main land; they belong to the land, not the
  // island, so re-anchoring must leave them where they are.
  it("leaves items that are on the main land in place", () => {
    const items = { onLand: { x: 0, y: 0, name: "Wild Mushroom" } };

    expect(reAnchorToIsland(items, expansionCount)).toEqual(items);
  });

  // Island items stranded in open water get snapped back onto a current tile.
  it("snaps off-land items back onto the island", () => {
    const island = getIslandSpawnPositions(expansionCount);
    const items = { stranded: { x: -40, y: 4, name: "Wild Mushroom" } };

    const moved = reAnchorToIsland(items, expansionCount).stranded;

    expect(island.some((p) => p.x === moved.x && p.y === moved.y)).toBe(true);
  });

  it("is a no-op for items already on the island", () => {
    const [tile] = getIslandSpawnPositions(expansionCount);
    const items = { onIsland: { x: tile.x, y: tile.y, name: "Wild Mushroom" } };

    expect(reAnchorToIsland(items, expansionCount)).toEqual(items);
  });

  // Island-only items (clutter): keepLandItems:false pulls an on-land item back.
  it("re-anchors on-land items onto the island when keepLandItems is false", () => {
    const island = getIslandSpawnPositions(expansionCount);
    const items = { onLand: { x: 0, y: 0, type: "Trash" } };

    const moved = reAnchorToIsland(items, expansionCount, {
      keepLandItems: false,
    }).onLand;

    expect(island.some((p) => p.x === moved.x && p.y === moved.y)).toBe(true);
  });
});
