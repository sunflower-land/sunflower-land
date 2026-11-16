// Relative: jest maps the `assets/*` alias to a file stub.
import mapJSON from "../../../../../assets/map/cave_interior.json";
import {
  getCaveConstructionSite,
  getCaveMerchantAlcove,
  getCaveSlotRects,
  getCaveStair,
  type CaveTiledMap,
} from "features/cave/lib/caveMap";
import {
  CAVE_CONSTRUCTION_SITES,
  CAVE_IMAGE_ORIGIN,
  CAVE_IMAGE_SIZE,
  CAVE_LADDER,
  CAVE_MERCHANT_ALCOVE,
  CAVE_MERCHANT_ALCOVE_TIER,
  CAVE_PATCH_SIZE,
  CAVE_SLOTS,
  caveSlotsForTier,
} from "./caveLayout";

const map = mapJSON as unknown as CaveTiledMap;
const TILE = 16;

// The map is in 16 px tiles from the map origin; the layout is in tiles from
// the cropped image's origin.
const toImageTiles = (px: { x: number; y: number }) => ({
  x: px.x / TILE - CAVE_IMAGE_ORIGIN.x,
  y: px.y / TILE - CAVE_IMAGE_ORIGIN.y,
});

describe("caveLayout (pinned to the Tiled map)", () => {
  it("crops the room image to the drawn walls", () => {
    expect(CAVE_IMAGE_SIZE).toEqual({ width: 66, height: 55 });
    expect(CAVE_PATCH_SIZE).toEqual(5);
  });

  it("places every slot's sign and sand where the map draws them", () => {
    const slots = getCaveSlotRects(map);

    [1, 2, 3, 4, 5, 6, 7, 8].forEach((id) => {
      expect(CAVE_SLOTS[id].patch).toEqual(toImageTiles(slots[id].dig));
      expect(CAVE_SLOTS[id].sign).toEqual({
        ...toImageTiles(slots[id].sign),
        width: slots[id].sign.width / TILE,
        height: slots[id].sign.height / TILE,
      });
    });
  });

  it("puts the expansion sign on each tier's barrier", () => {
    [1, 2, 3, 4, 5, 6, 7].forEach((tier) => {
      const site = getCaveConstructionSite(map, tier);
      expect(site).toBeDefined();
      expect(CAVE_CONSTRUCTION_SITES[tier]).toEqual({
        ...toImageTiles(site as { x: number; y: number }),
        width: (site as { width: number }).width / TILE,
        height: (site as { height: number }).height / TILE,
      });
    });
    expect(CAVE_CONSTRUCTION_SITES[8]).toBeUndefined();
  });

  it("puts the Merchant in the alcove the room draws from tier I", () => {
    expect(
      getCaveMerchantAlcove(map, CAVE_MERCHANT_ALCOVE_TIER - 1),
    ).toBeUndefined();
    const alcove = getCaveMerchantAlcove(map, CAVE_MERCHANT_ALCOVE_TIER);
    expect(CAVE_MERCHANT_ALCOVE).toEqual({
      ...toImageTiles(alcove as { x: number; y: number }),
      width: (alcove as { width: number }).width / TILE,
      height: (alcove as { height: number }).height / TILE,
    });
  });

  it("puts the exit on the ladder", () => {
    const stair = getCaveStair(map);
    expect(CAVE_LADDER).toEqual({
      ...toImageTiles(stair),
      width: stair.width / TILE,
      height: stair.height / TILE,
    });
  });

  it("unlocks one slot per tier, up to eight", () => {
    expect(caveSlotsForTier(1)).toEqual([1]);
    expect(caveSlotsForTier(5)).toEqual([1, 2, 3, 4, 5]);
    expect(caveSlotsForTier(9)).toHaveLength(8);
  });
});
