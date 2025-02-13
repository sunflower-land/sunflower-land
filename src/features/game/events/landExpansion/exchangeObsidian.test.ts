import { TEST_FARM } from "features/game/lib/constants";
import { exchangeObsidian } from "./exchangeObsidian";
import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";

describe("exchangeObsidian", () => {
  it("requires player has obsidian", () => {
    expect(() =>
      exchangeObsidian({
        state: TEST_FARM,
        action: { type: "obsidian.exchanged" },
      }),
    ).toThrow("Not enough obsidian");
  });

  it("should exchange 3 obsidian for 1 sunstone", () => {
    const state = exchangeObsidian({
      state: {
        ...TEST_FARM,
        inventory: {
          Obsidian: new Decimal(3),
        },
      },
      action: { type: "obsidian.exchanged" },
    });

    expect(state.inventory.Obsidian).toEqual(new Decimal(0));
    expect(state.inventory.Sunstone).toEqual(new Decimal(1));
  });

  it("should increase price to 4 obsidian after 3 exchanges", () => {
    let state: GameState = {
      ...TEST_FARM,
      inventory: {
        Obsidian: new Decimal(12),
      },
      farmActivity: {
        "Obsidian Exchanged": 2,
      },
    };

    state = exchangeObsidian({
      state,
      action: { type: "obsidian.exchanged" },
    });

    expect(state.inventory.Obsidian).toEqual(new Decimal(9));
    expect(state.inventory.Sunstone).toEqual(new Decimal(1));

    // Next exchange should cost 4
    expect(() =>
      exchangeObsidian({
        state: {
          ...state,
          inventory: { Obsidian: new Decimal(3) },
        },
        action: { type: "obsidian.exchanged" },
      }),
    ).toThrow("Not enough obsidian");
  });

  it("should increase price to 5 obsidian after 6 exchanges", () => {
    let state: GameState = {
      ...TEST_FARM,
      inventory: {
        Obsidian: new Decimal(20),
      },
      farmActivity: {
        "Obsidian Exchanged": 5,
      },
    };

    state = exchangeObsidian({
      state,
      action: { type: "obsidian.exchanged" },
    });

    expect(state.inventory.Obsidian).toEqual(new Decimal(16));
    expect(state.inventory.Sunstone).toEqual(new Decimal(1));

    // Next exchange should cost 5
    expect(() =>
      exchangeObsidian({
        state: {
          ...state,
          inventory: { Obsidian: new Decimal(4) },
        },
        action: { type: "obsidian.exchanged" },
      }),
    ).toThrow("Not enough obsidian");
  });

  it("rewards obsidian", () => {
    const state = exchangeObsidian({
      state: {
        ...TEST_FARM,
        inventory: {
          Obsidian: new Decimal(3),
        },
      },
      action: { type: "obsidian.exchanged" },
    });

    expect(state.inventory.Sunstone).toEqual(new Decimal(1));
  });

  it("tracks analytics", () => {
    const state = exchangeObsidian({
      state: {
        ...TEST_FARM,
        inventory: {
          Obsidian: new Decimal(3),
        },
      },
      action: { type: "obsidian.exchanged" },
    });

    expect(state.farmActivity["Obsidian Exchanged"]).toEqual(1);
  });
});
