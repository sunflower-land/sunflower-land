import { SUNNYSIDE } from "assets/sunnyside";
import type { GameState } from "features/game/types/game";
import { getDirtTiles } from "./dirtTiles";

const crop = (x: number, y: number) =>
  ({ createdAt: 0, x, y }) as unknown as GameState["crops"][string];

describe("getDirtTiles", () => {
  it("returns no tiles for an empty farm", () => {
    expect(
      getDirtTiles({ crops: {}, collectibles: {}, biome: "Basic Biome" }),
    ).toEqual([]);
  });

  it("gives an isolated plot the full-edge tile", () => {
    const tiles = getDirtTiles({
      crops: { "1": crop(2, 3) },
      collectibles: {},
      biome: "Basic Biome",
    });

    expect(tiles).toEqual([{ x: 2, y: 3, texture: SUNNYSIDE.land.fullEdge }]);
  });

  it("joins a horizontal run of plots with side-aware edges", () => {
    const tiles = getDirtTiles({
      crops: { "1": crop(0, 0), "2": crop(1, 0), "3": crop(2, 0) },
      collectibles: {},
      biome: "Basic Biome",
    });

    const byPos = Object.fromEntries(
      tiles.map((tile) => [`${tile.x},${tile.y}`, tile.texture]),
    );
    // Left cap: edges on top, bottom, left. Middle: top and bottom. Right cap:
    // top, right, bottom.
    expect(byPos["0,0"]).toEqual(SUNNYSIDE.land.topLeftAndBottomEdge);
    expect(byPos["1,0"]).toEqual(SUNNYSIDE.land.topAndBottomEdge);
    expect(byPos["2,0"]).toEqual(SUNNYSIDE.land.topRightAndBottomEdge);
  });

  it("joins crop plots with placed Dirt Path collectibles", () => {
    const tiles = getDirtTiles({
      crops: { "1": crop(0, 0) },
      collectibles: {
        "Dirt Path": [
          {
            id: "p1",
            createdAt: 0,
            coordinates: { x: 0, y: 1 },
            readyAt: 0,
          },
        ],
      } as unknown as GameState["collectibles"],
      biome: "Basic Biome",
    });

    const byPos = Object.fromEntries(
      tiles.map((tile) => [`${tile.x},${tile.y}`, tile.texture]),
    );
    // Vertical pair: bottom cell keeps right/bottom/left edges, top cell keeps
    // top/right/left.
    expect(byPos["0,0"]).toEqual(SUNNYSIDE.land.rightBottomAndLeftEdge);
    expect(byPos["0,1"]).toEqual(SUNNYSIDE.land.topRightAndLeftEdge);
  });

  it("uses the biome's art set", () => {
    const tiles = getDirtTiles({
      crops: { "1": crop(0, 0) },
      collectibles: {},
      biome: "Desert Biome",
    });

    expect(tiles[0].texture).toEqual(SUNNYSIDE.land.desertFullEdge);
  });
});
