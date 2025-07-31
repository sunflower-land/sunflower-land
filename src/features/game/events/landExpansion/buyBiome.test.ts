import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { LandBiomeName } from "features/island/biomes/biomes";
import { buyBiome } from "./buyBiome";

describe("buyBiome", () => {
  it("ensures that the biome exists", () => {
    expect(() =>
      buyBiome({
        state: INITIAL_FARM,
        action: {
          type: "biome.bought",
          biome: "Flower Biome" as LandBiomeName,
        },
      }),
    ).toThrow("This biome is not available");
  });

  it("ensures that player doesn't already own the biome", () => {
    expect(() =>
      buyBiome({
        state: {
          ...INITIAL_FARM,
          inventory: { "Basic Biome": new Decimal(1) },
        },
        action: { type: "biome.bought", biome: "Basic Biome" },
      }),
    ).toThrow("You already have the maximum number of this biome");
  });

  it("ensures that player has enough ingredients", () => {
    expect(() =>
      buyBiome({
        state: { ...INITIAL_FARM, island: { type: "spring" } },
        action: { type: "biome.bought", biome: "Basic Biome" },
      }),
    ).toThrow("You don't have enough ingredients");
  });

  it.todo("ensures that player has enough coins");

  it("requires the player to be in the correct island type", () => {
    expect(() =>
      buyBiome({
        state: {
          ...INITIAL_FARM,
          inventory: { Gem: new Decimal(1000) },
          island: { type: "basic" },
        },
        action: { type: "biome.bought", biome: "Spring Biome" },
      }),
    ).toThrow("You are not in the correct island type");
  });

  it("buys the biome", () => {
    const state = buyBiome({
      state: {
        ...INITIAL_FARM,
        inventory: {
          Gem: new Decimal(500),
          Wool: new Decimal(1000),
          Honey: new Decimal(500),
        },
        island: { type: "spring" },
      },
      action: { type: "biome.bought", biome: "Basic Biome" },
    });

    expect(state.inventory["Basic Biome"]).toEqual(new Decimal(1));
    expect(state.farmActivity["Basic Biome Bought"]).toEqual(1);
    expect(state.inventory["Gem"]).toEqual(new Decimal(0));
  });
});
