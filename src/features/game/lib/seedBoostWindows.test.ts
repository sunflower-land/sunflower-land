import { getNodeBoostWindows, getSeedBoostWindows } from "./seedBoostWindows";
import {
  getCropPlotBoostWindows,
  getFlowerBoostWindows,
  getFruitBoostWindows,
  getGreenhouseBoostWindows,
  getMineBoostWindows,
  getOilBoostWindows,
  getTreeBoostWindows,
} from "./boostWindows";
import { TEST_FARM } from "./constants";
import type { GameState } from "../types/game";

const createdAt = 1_000_000;

/** Every windowed booster at once, so each resolver has something to find. */
const BOOSTED: GameState = {
  ...TEST_FARM,
  collectibles: {
    ...TEST_FARM.collectibles,
    "Harvest Hourglass": [{ id: "1", coordinates: { x: 0, y: 0 }, createdAt }],
    "Orchard Hourglass": [{ id: "2", coordinates: { x: 1, y: 0 }, createdAt }],
    "Blossom Hourglass": [{ id: "3", coordinates: { x: 2, y: 0 }, createdAt }],
    "Timber Hourglass": [{ id: "4", coordinates: { x: 3, y: 0 }, createdAt }],
    "Ore Hourglass": [{ id: "5", coordinates: { x: 4, y: 0 }, createdAt }],
    "Stag Shrine": [{ id: "6", coordinates: { x: 5, y: 0 }, createdAt }],
    "Tortoise Shrine": [{ id: "7", coordinates: { x: 6, y: 0 }, createdAt }],
  },
};

describe("getSeedBoostWindows", () => {
  it("resolves a crop seed to the plot windows", () => {
    expect(getSeedBoostWindows(BOOSTED, "Sunflower Seed")).toEqual(
      getCropPlotBoostWindows(BOOSTED),
    );
  });

  it("resolves a patch fruit seed to the fruit windows", () => {
    expect(getSeedBoostWindows(BOOSTED, "Apple Seed")).toEqual(
      getFruitBoostWindows(BOOSTED),
    );
  });

  it("resolves a flower seed to the flower windows", () => {
    expect(getSeedBoostWindows(BOOSTED, "Sunpetal Seed")).toEqual(
      getFlowerBoostWindows(BOOSTED),
    );
  });

  it("resolves a greenhouse CROP seed to that plant's windows", () => {
    expect(getSeedBoostWindows(BOOSTED, "Rice Seed")).toEqual(
      getGreenhouseBoostWindows(BOOSTED, "Rice"),
    );
  });

  it("resolves a greenhouse FRUIT seed to Grape's windows", () => {
    // Grape takes the Orchard Hourglass where Rice/Olive take Harvest, so this
    // must not collapse into one greenhouse set.
    expect(getSeedBoostWindows(BOOSTED, "Grape Seed")).toEqual(
      getGreenhouseBoostWindows(BOOSTED, "Grape"),
    );
    expect(getSeedBoostWindows(BOOSTED, "Grape Seed")).not.toEqual(
      getSeedBoostWindows(BOOSTED, "Rice Seed"),
    );
  });

  it("returns nothing when no booster is placed", () => {
    expect(getSeedBoostWindows(TEST_FARM, "Sunflower Seed")).toEqual([]);
  });
});

describe("getNodeBoostWindows", () => {
  it("resolves a Tree to the tree windows", () => {
    expect(getNodeBoostWindows(BOOSTED, "Tree")).toEqual(
      getTreeBoostWindows(BOOSTED),
    );
  });

  it("resolves an Oil Reserve to the oil windows", () => {
    expect(getNodeBoostWindows(BOOSTED, "Oil Reserve")).toEqual(
      getOilBoostWindows(BOOSTED),
    );
  });

  it.each(["Stone Rock", "Iron Rock", "Gold Rock"] as const)(
    "resolves %s to the mine windows for that rock",
    (rock) => {
      expect(getNodeBoostWindows(BOOSTED, rock)).toEqual(
        getMineBoostWindows(BOOSTED, rock),
      );
    },
  );

  it("gives crimstone its own (Mole-only) set, not the Ore Hourglass one", () => {
    expect(getNodeBoostWindows(BOOSTED, "Crimstone Rock")).toEqual(
      getMineBoostWindows(BOOSTED, "Crimstone Rock"),
    );
    expect(getNodeBoostWindows(BOOSTED, "Crimstone Rock")).not.toEqual(
      getNodeBoostWindows(BOOSTED, "Stone Rock"),
    );
  });

  it("returns nothing for a node that was never windowed", () => {
    // Sunstone has no temporary recovery boost; crab pots and salt aren't rocks.
    expect(getNodeBoostWindows(BOOSTED, "Sunstone Rock")).toEqual([]);
    expect(getNodeBoostWindows(BOOSTED, "Crop Plot")).toEqual([]);
  });
});
