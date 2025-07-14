import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { applyBiome } from "./applyBiome";

describe("applyBiome", () => {
  it("throws an error if player does not have the biome", () => {
    expect(() =>
      applyBiome({
        state: { ...INITIAL_FARM },
        action: { type: "biome.applied", biome: "Basic Biome" },
        createdAt: Date.now(),
      }),
    ).toThrow("You do not own this biome");
  });
  it("throws if player is not in the correct island type", () => {
    expect(() =>
      applyBiome({
        state: {
          ...INITIAL_FARM,
          island: { type: "basic", biome: "Basic Biome" },
          inventory: { "Desert Biome": new Decimal(1) },
        },
        action: { type: "biome.applied", biome: "Desert Biome" },
        createdAt: Date.now(),
      }),
    ).toThrow("You are not permitted to apply this biome");
  });
  it("throws if selected biome is the same as the current biome and the biome is unset", () => {
    expect(() =>
      applyBiome({
        state: {
          ...INITIAL_FARM,
          island: { type: "volcano" },
          inventory: { "Volcano Biome": new Decimal(1) },
        },
        action: { type: "biome.applied", biome: "Volcano Biome" },
        createdAt: Date.now(),
      }),
    ).toThrow("You are already in this biome");
  });
  it("unapplies the biome if current biome is the same as the new biome", () => {
    const state = applyBiome({
      state: {
        ...INITIAL_FARM,
        island: { type: "volcano", biome: "Volcano Biome" },
        inventory: { "Volcano Biome": new Decimal(1) },
      },
      action: { type: "biome.applied", biome: "Volcano Biome" },
      createdAt: Date.now(),
    });
    expect(state.island.biome).toBeUndefined();
  });
  it("applies the biome to the island", () => {
    const state = applyBiome({
      state: {
        ...INITIAL_FARM,
        island: { type: "desert" },
        inventory: { "Basic Biome": new Decimal(1) },
      },
      action: { type: "biome.applied", biome: "Basic Biome" },
      createdAt: Date.now(),
    });
    expect(state.island.biome).toEqual("Basic Biome");
  });
});
