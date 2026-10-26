import { KNOWN_IDS } from ".";
import { COLLECTIBLES_DIMENSIONS } from "./craftables";
import { ITEM_DETAILS } from "./images";
import { RARECROW_IDS, RARECROW_NAMES } from "./rarecrows";
import { ITEM_TRADE_TYPES } from "features/marketplace/lib/getTradeType";

describe("Migrated Rarecrows", () => {
  it("registers every Rarecrows game crow", () => {
    expect(RARECROW_IDS["Alien Rarecrow"]).toEqual(3124);
    expect(RARECROW_IDS["Super Totem Rarecrow"]).toEqual(3227);
    expect(RARECROW_IDS["Beekeeper Rarecrow"]).toBeDefined();
    expect(RARECROW_IDS["St. Patrick's Rarecrow"]).toBeDefined();
  });

  it("registers the effect variants found in the snapshot", () => {
    // 104 base crows + 44 crows with an effect (4 sparkle, 16 coin, 24 love)
    expect(RARECROW_NAMES).toHaveLength(148);
    expect(RARECROW_IDS["Sparkle Halo Rarecrow"]).toEqual(3228);
    expect(RARECROW_IDS["Coin King Rarecrow"]).toBeDefined();
    expect(RARECROW_IDS["Love St. Patrick's Rarecrow"]).toBeDefined();
    expect(RARECROW_IDS["Love Grapes Rarecrow"]).toEqual(3271);
  });

  it("gives each crow a unique id that no other item uses", () => {
    const ids = Object.values(KNOWN_IDS);
    RARECROW_NAMES.forEach((name) => {
      expect(KNOWN_IDS[name]).toEqual(RARECROW_IDS[name]);
      expect(ids.filter((id) => id === KNOWN_IDS[name])).toHaveLength(1);
    });
  });

  it("makes each crow a placeable 2x2 cosmetic with an image", () => {
    RARECROW_NAMES.forEach((name) => {
      expect(COLLECTIBLES_DIMENSIONS[name]).toEqual({ width: 2, height: 2 });
      expect(ITEM_DETAILS[name].image).toBeTruthy();
      expect(ITEM_TRADE_TYPES.collectibles[name]).toEqual("instant");
    });
  });
});
