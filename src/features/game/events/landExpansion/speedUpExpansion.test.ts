import { INITIAL_FARM } from "features/game/lib/constants";
import { speedUpExpansion } from "./speedUpExpansion";
import Decimal from "decimal.js-light";

describe("instantExpand", () => {
  it("requires expansion is in progress", () => {
    expect(() =>
      speedUpExpansion({
        action: {
          type: "expansion.spedUp",
        },
        state: {
          ...INITIAL_FARM,
        },
      }),
    ).toThrow("Expansion not in progress");
  });

  it("requires expansion is not ready", () => {
    expect(() =>
      speedUpExpansion({
        action: {
          type: "expansion.spedUp",
        },
        state: {
          ...INITIAL_FARM,
          expansionConstruction: {
            createdAt: 0,
            readyAt: Date.now() - 1000,
          },
        },
      }),
    ).toThrow("Expansion already complete");
  });

  it("requires player has the gems", () => {
    expect(() =>
      speedUpExpansion({
        action: {
          type: "expansion.spedUp",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            Gem: new Decimal(0),
          },
          expansionConstruction: {
            createdAt: 0,
            readyAt: Date.now() + 1000,
          },
        },
      }),
    ).toThrow("Insufficient Gems");
  });

  it("charges gems", () => {
    const state = speedUpExpansion({
      action: {
        type: "expansion.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          Gem: new Decimal(2),
        },
        expansionConstruction: {
          createdAt: 0,
          readyAt: Date.now() + 1000,
        },
      },
    });

    expect(state.inventory.Gem).toEqual(new Decimal(1));
  });

  it("instantly expands the land", () => {
    const now = Date.now();
    const state = speedUpExpansion({
      action: {
        type: "expansion.spedUp",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          Gem: new Decimal(2),
        },
        expansionConstruction: {
          createdAt: 0,
          readyAt: Date.now() + 1000,
        },
      },
      createdAt: now,
    });

    expect(state.expansionConstruction?.readyAt).toEqual(now);
  });
  it("cannot speed up expansion on desert island", () => {
    expect(() =>
      speedUpExpansion({
        action: { type: "expansion.spedUp" },
        state: {
          ...INITIAL_FARM,
          island: {
            ...INITIAL_FARM.island,
            type: "desert",
          },
          expansionConstruction: {
            createdAt: 0,
            readyAt: Date.now() + 1000,
          },
        },
      }),
    ).toThrow("You can't speed up the expansion on this island");
  });
});
