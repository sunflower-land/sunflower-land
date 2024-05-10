import Decimal from "decimal.js-light";
import { TEST_FARM } from "../lib/constants";
import { LAND_4_LAYOUT, SPRING_LAND_5_LAYOUT, getLand } from "./expansions";

const s = TEST_FARM;
describe("getLand", () => {
  it("returns a basic land", () => {
    const land = getLand({
      id: 1,
      game: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(3),
        },
      },
    });

    expect(land).toEqual(LAND_4_LAYOUT());
  });

  it("returns a spring land", () => {
    const land = getLand({
      id: 1,
      game: {
        ...TEST_FARM,
        island: {
          type: "spring",
        },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(4),
        },
      },
    });

    expect(land).toEqual(SPRING_LAND_5_LAYOUT());
  });

  it("does not return resources if player already has expected resources", () => {
    const land = getLand({
      id: 1,
      game: {
        ...TEST_FARM,
        island: {
          type: "spring",
        },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(4),
          "Crop Plot": new Decimal(44),
          Tree: new Decimal(22),
          "Stone Rock": new Decimal(12),
          "Iron Rock": new Decimal(6),
          "Gold Rock": new Decimal(3),
          "Fruit Patch": new Decimal(4),
        },
      },
    });

    expect(land?.trees).toEqual([]);
    expect(land?.stones).toEqual([]);
    expect(land?.gold).toEqual([]);
    expect(land?.iron).toEqual([]);
    expect(land?.fruitPatches).toEqual([]);
    expect(land?.plots).toEqual([]);
  });

  it("only returns spring resources if they previously had basic resources", () => {
    const land = getLand({
      id: 1,
      game: {
        ...TEST_FARM,
        island: {
          type: "spring",
        },
        inventory: {
          ...TEST_FARM.inventory,
          "Basic Land": new Decimal(5),
          "Crop Plot": new Decimal(44),
          Tree: new Decimal(22),
          "Stone Rock": new Decimal(12),
          "Iron Rock": new Decimal(6),
          "Gold Rock": new Decimal(3),
          "Fruit Patch": new Decimal(4),
        },
      },
    });

    expect(land?.trees).toEqual([]);
    expect(land?.stones).toEqual([]);
    expect(land?.gold).toEqual([]);
    expect(land?.iron).toEqual([]);
    expect(land?.fruitPatches).toEqual([]);
    expect(land?.plots).toEqual([]);
    expect(land?.beehives).toHaveLength(1);
    expect(land?.flowerBeds).toHaveLength(1);
  });
});
