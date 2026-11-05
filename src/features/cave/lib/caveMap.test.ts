// Relative: jest maps the `assets/*` alias to a file stub.
import mapJSON from "../../../assets/map/cave_interior.json";
import {
  CAVE_TILE_PX,
  getCaveConstructionSite,
  getCaveMerchantAlcove,
  getCaveSlotRects,
  getCaveStair,
  type CaveTiledMap,
} from "./caveMap";

const map = mapJSON as unknown as CaveTiledMap;

describe("caveMap (the artist's Tiled map)", () => {
  it("is an 80x80 map of 16px tiles with one group per tier", () => {
    expect(map.width).toEqual(80);
    expect(map.height).toEqual(80);
    expect(CAVE_TILE_PX).toEqual(16);
    expect(
      map.layers.filter((l) => l.type === "group").map((l) => l.name),
    ).toEqual([
      "room1",
      "room2",
      "room3",
      "room4",
      "room5",
      "room6",
      "room7",
      "room8",
    ]);
  });

  describe("getCaveSlotRects", () => {
    const slots = getCaveSlotRects(map);

    it("finds the eight slots in unlock order: top row left to right, bottom row right to left", () => {
      expect(Object.keys(slots).map(Number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(
        [1, 2, 3, 4, 5, 6, 7, 8].map((id) => [
          slots[id].box.x,
          slots[id].box.y,
        ]),
      ).toEqual([
        [20, 31],
        [29, 31],
        [38, 31],
        [47, 31],
        [47, 43],
        [38, 43],
        [29, 43],
        [20, 43],
      ]);
    });

    it("places the 5x5 dig grid on the sand inside the box and the Myco Bin above the fence", () => {
      // Slot 1 box is tiles 20..26 x 31..41: Myco Bin rows 31-33 at
      // x 21..25, fence 34, border 35, sand 36-40 at x 21..25, border 41.
      expect(slots[1].dig).toEqual({ x: 21 * 16, y: 36 * 16 });
      expect(slots[1].sign).toEqual({
        x: 21 * 16,
        y: 31 * 16,
        width: 80,
        height: 48,
      });
      expect(slots[5].dig).toEqual({ x: 48 * 16, y: 48 * 16 });
    });
  });

  describe("getCaveConstructionSite", () => {
    it("is the barrier strip of the tier's room, in pixels", () => {
      expect(getCaveConstructionSite(map, 1)).toEqual({
        x: 29 * 16,
        y: 33 * 16,
        width: 16,
        height: 160,
      });
      expect(getCaveConstructionSite(map, 4)).toEqual({
        x: 45 * 16,
        y: 43 * 16,
        width: 176,
        height: 16,
      });
    });

    it("is absent at the last tier", () => {
      expect(getCaveConstructionSite(map, 8)).toBeUndefined();
    });
  });

  describe("getCaveMerchantAlcove", () => {
    it("is drawn at every tier, from tier 1", () => {
      [1, 2, 3, 4, 5, 6, 7, 8].forEach((tier) => {
        expect(getCaveMerchantAlcove(map, tier)).toEqual({
          x: 31 * 16,
          y: 22 * 16,
          width: 10 * 16,
          height: 5 * 16,
        });
      });
    });
  });

  it("finds the ladder", () => {
    expect(getCaveStair(map)).toEqual({
      x: 20 * 16,
      y: 21 * 16,
      width: 32,
      height: 64,
    });
  });
});
