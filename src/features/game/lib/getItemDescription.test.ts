import Decimal from "decimal.js-light";
import { TEST_FARM } from "./constants";
import {
  getItemDescription,
  getSpeedBoostDescription,
} from "./getItemDescription";
import { ITEM_DETAILS } from "features/game/types/images";

// Jest runs on amoy, so `betaFeatureFlag` (and therefore SPEED_BOOSTS) is always
// on - only the flag-on copy is reachable here.
describe("getItemDescription", () => {
  it("describes an hourglass as a speed multiplier over its rebalanced duration", () => {
    expect(
      getItemDescription({ item: "Blossom Hourglass", game: TEST_FARM }),
    ).toBe("Grows flowers 1.35x faster for 12 hours.");
    expect(
      getItemDescription({ item: "Harvest Hourglass", game: TEST_FARM }),
    ).toBe("Grows crops 1.35x faster for 9 hours.");
    expect(getItemDescription({ item: "Ore Hourglass", game: TEST_FARM })).toBe(
      "Recovers minerals 2x faster for 5 hours.",
    );
  });

  it("describes the Time Warp Totem with its rebalanced duration", () => {
    expect(
      getItemDescription({ item: "Time Warp Totem", game: TEST_FARM }),
    ).toBe(
      "2x speed for crops, trees, fruits, cooking & minerals. Only lasts for 4 hours",
    );
  });

  it("keeps the legacy description for items with no speed rewrite", () => {
    expect(getItemDescription({ item: "Sunflower", game: TEST_FARM })).toBe(
      ITEM_DETAILS["Sunflower"].description,
    );
  });

  it("still honours boostedDescriptions on a rewritten item", () => {
    const game = {
      ...TEST_FARM,
      bumpkin: {
        ...TEST_FARM.bumpkin,
        skills: { "Fruitful Bounty": 1 },
      },
    };

    expect(
      getItemDescription({ item: "Turbofruit Mix", game: TEST_FARM }),
    ).toBe(
      "Turbofruit Mix increases your fruit patch yield by +0.1 and grows fruit patches 1.25x faster.",
    );
    expect(getItemDescription({ item: "Turbofruit Mix", game })).toBe(
      "Turbofruit Mix increases your fruit patch yield by +0.2 and grows fruit patches 1.25x faster.",
    );
  });

  it("still honours boostedDescriptions on an item with no rewrite", () => {
    const game = {
      ...TEST_FARM,
      inventory: { ...TEST_FARM.inventory, "Knowledge Crab": new Decimal(1) },
      collectibles: {
        ...TEST_FARM.collectibles,
        "Knowledge Crab": [
          {
            id: "1",
            createdAt: 0,
            readyAt: 0,
            coordinates: { x: 0, y: 0 },
          },
        ],
      },
    };

    expect(getItemDescription({ item: "Sprout Mix", game })).toBe(
      "Sprout Mix increases your crop yield from plots by +0.4",
    );
  });
});

describe("getSpeedBoostDescription", () => {
  it("returns the rewrite only for items that have one", () => {
    expect(
      getSpeedBoostDescription({ item: "Gourmet Hourglass", game: TEST_FARM }),
    ).toBe("Cooks food 2x faster for 6 hours.");
    expect(
      getSpeedBoostDescription({ item: "Fisher's Hourglass", game: TEST_FARM }),
    ).toBeUndefined();
  });
});
