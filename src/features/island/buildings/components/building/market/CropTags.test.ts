import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import type { SeedName } from "features/game/types/seeds";
import { getCropTags } from "./CropTags";

const t = (key: string) => key;

const keys = (seed: SeedName, game: GameState = TEST_FARM) =>
  getCropTags(seed, game, t).map((tag) => tag.key);

const withMachine = (skills: GameState["bumpkin"]["skills"] = {}) =>
  ({
    ...TEST_FARM,
    inventory: { ...TEST_FARM.inventory, "Crop Machine": new Decimal(1) },
    bumpkin: { ...TEST_FARM.bumpkin, skills },
  }) as GameState;

describe("getCropTags", () => {
  it("tags overnight crops (what Hoot boosts)", () => {
    expect(keys("Radish Seed")).toContain("overnight");
    expect(keys("Wheat Seed")).toContain("overnight");
    expect(keys("Turnip Seed")).toContain("overnight");
    expect(keys("Barley Seed")).toContain("overnight");
    expect(keys("Crystal Leaf Seed")).toContain("overnight");
    expect(keys("Rice Seed")).toContain("overnight");
  });

  it("does not tag shorter or out-of-range crops as overnight", () => {
    expect(keys("Potato Seed")).not.toContain("overnight");
    expect(keys("Olive Seed")).not.toContain("overnight");
  });

  it("only shows the Crop Machine tag when the player owns one", () => {
    expect(keys("Sunflower Seed")).not.toContain("cropMachine");
    expect(keys("Sunflower Seed", withMachine())).toContain("cropMachine");
  });

  it("needs the matching Crop Extension Module for non-basic seeds", () => {
    expect(keys("Rhubarb Seed", withMachine())).not.toContain("cropMachine");
    expect(
      keys("Rhubarb Seed", withMachine({ "Crop Extension Module I": 1 })),
    ).toContain("cropMachine");
    expect(
      keys("Cabbage Seed", withMachine({ "Crop Extension Module I": 1 })),
    ).not.toContain("cropMachine");
    expect(
      keys("Yam Seed", withMachine({ "Crop Extension Module III": 1 })),
    ).toContain("cropMachine");
    expect(
      keys("Radish Seed", withMachine({ "Crop Extension Module III": 1 })),
    ).not.toContain("cropMachine");
  });

  it("tags Chapter Crop Week crops, current and retired", () => {
    expect(keys("Crystal Leaf Seed")).toContain("event");
    expect(keys("Saltwort Seed")).toContain("event");
    expect(keys("Wheat Seed")).not.toContain("event");
  });

  it("tags Full Moon berries", () => {
    expect(keys("Celestine Seed")).toContain("fullMoon");
    expect(keys("Lunara Seed")).toContain("fullMoon");
    expect(keys("Duskberry Seed")).toContain("fullMoon");
    expect(keys("Apple Seed")).not.toContain("fullMoon");
  });

  it("lists the seasons a seed can be planted in, unless left out", () => {
    expect(keys("Potato Seed")).toEqual(
      expect.arrayContaining(["summer", "autumn", "winter"]),
    );
    expect(
      getCropTags("Potato Seed", TEST_FARM, t, { seasons: false }).map(
        (tag) => tag.key,
      ),
    ).toEqual(["category"]);
  });
});
