import { KNOWN_IDS } from ".";
import { COLLECTIBLES_DIMENSIONS } from "./craftables";
import { ITEM_DETAILS } from "./images";
import { RARE_CROW_IDS, RARE_CROW_NAMES } from "./rareCrows";
import { ITEM_TRADE_TYPES } from "features/marketplace/lib/getTradeType";

describe("Rare Crows", () => {
  it("registers every Rarecrows game crow", () => {
    expect(RARE_CROW_NAMES).toHaveLength(104);
    expect(RARE_CROW_IDS["Alien Rare Crow"]).toEqual(3124);
    expect(RARE_CROW_IDS["Super Totem Rare Crow"]).toEqual(3227);
    expect(RARE_CROW_IDS["Beekeeper Rare Crow"]).toBeDefined();
    expect(RARE_CROW_IDS["St. Patrick's Rare Crow"]).toBeDefined();
  });

  it("gives each crow a unique id that no other item uses", () => {
    const ids = Object.values(KNOWN_IDS);
    RARE_CROW_NAMES.forEach((name) => {
      expect(KNOWN_IDS[name]).toEqual(RARE_CROW_IDS[name]);
      expect(ids.filter((id) => id === KNOWN_IDS[name])).toHaveLength(1);
    });
  });

  it("makes each crow a placeable 2x2 cosmetic with an image", () => {
    RARE_CROW_NAMES.forEach((name) => {
      expect(COLLECTIBLES_DIMENSIONS[name]).toEqual({ width: 2, height: 2 });
      expect(ITEM_DETAILS[name].image).toBeTruthy();
      expect(ITEM_TRADE_TYPES.collectibles[name]).toEqual("instant");
    });
  });
});
