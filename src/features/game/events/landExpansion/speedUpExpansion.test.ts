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

  describe("Dino Egg Trophy coin payment", () => {
    it("throws when paymentMethod is 'coins' without a placed Dino Egg Trophy", () => {
      expect(() =>
        speedUpExpansion({
          action: { type: "expansion.spedUp", paymentMethod: "coins" },
          state: {
            ...INITIAL_FARM,
            coins: 100_000,
            expansionConstruction: {
              createdAt: 0,
              readyAt: Date.now() + 1000,
            },
          },
        }),
      ).toThrow("Dino Egg Trophy required");
    });

    it("charges coins at 50 per gem when trophy is placed", () => {
      const now = Date.now();
      const state = speedUpExpansion({
        action: { type: "expansion.spedUp", paymentMethod: "coins" },
        createdAt: now,
        state: {
          ...INITIAL_FARM,
          coins: 1000,
          inventory: { Gem: new Decimal(0) },
          collectibles: {
            "Dino Egg Trophy": [
              {
                id: "trophy-1",
                createdAt: 0,
                coordinates: { x: 0, y: 0 },
                readyAt: 0,
              },
            ],
          },
          expansionConstruction: {
            createdAt: 0,
            readyAt: now + 1000,
          },
        },
      });

      expect(state.coins).toBe(950);
      expect(state.inventory.Gem).toEqual(new Decimal(0));
      expect(state.expansionConstruction?.readyAt).toBe(now);
    });
  });
});
