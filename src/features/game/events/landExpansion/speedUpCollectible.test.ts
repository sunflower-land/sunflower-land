import { INITIAL_FARM } from "features/game/lib/constants";
import { speedUpCollectible } from "./speedUpCollectible";
import Decimal from "decimal.js-light";

describe("speedUpCollectible", () => {
  it("requires collectible exists", () => {
    expect(() => {
      speedUpCollectible({
        action: {
          type: "collectible.spedUp",
          id: "123",
          name: "Basic Scarecrow",
        },
        state: INITIAL_FARM,
      });
    }).toThrow("Collectible does not exist");
  });
  it("requires collectible not already completed", () => {
    expect(() => {
      speedUpCollectible({
        action: {
          type: "collectible.spedUp",
          id: "123",
          name: "Basic Scarecrow",
        },
        state: {
          ...INITIAL_FARM,
          collectibles: {
            "Basic Scarecrow": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 100,
                id: "123",
                readyAt: Date.now() - 24 * 60 * 60 * 1000,
              },
            ],
          },
        },
      });
    }).toThrow("Collectible already finished");
  });
  it("requires player has gems", () => {
    expect(() => {
      speedUpCollectible({
        action: {
          type: "collectible.spedUp",
          id: "123",
          name: "Basic Scarecrow",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            Gem: new Decimal(0),
          },
          collectibles: {
            "Basic Scarecrow": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 100,
                id: "123",
                readyAt: Date.now() + 1000,
              },
            ],
          },
        },
      });
    }).toThrow("Insufficient Gems");
  });
  it("charges gems", () => {
    const state = speedUpCollectible({
      action: {
        type: "collectible.spedUp",
        id: "123",
        name: "Basic Scarecrow",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          Gem: new Decimal(100),
        },
        collectibles: {
          "Basic Scarecrow": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 100,
              id: "123",
              readyAt: Date.now() + 1000,
            },
          ],
        },
      },
    });

    expect(state.inventory.Gem).toEqual(new Decimal(99));
  });
  it("instantly finishes", () => {
    const now = Date.now();
    const state = speedUpCollectible({
      action: {
        type: "collectible.spedUp",
        id: "123",
        name: "Basic Scarecrow",
      },
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Gem: new Decimal(100),
        },
        collectibles: {
          "Basic Scarecrow": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 100,
              id: "123",
              readyAt: Date.now() + 1000,
            },
          ],
        },
      },
    });

    expect(state.collectibles["Basic Scarecrow"]![0].readyAt).toEqual(now);
  });

  it("records gem history under the createdAt date key (cross-day)", () => {
    const createdAt = new Date("2024-06-15T12:00:00Z").getTime();
    const dateKey = "2024-06-15";
    const state = speedUpCollectible({
      action: {
        type: "collectible.spedUp",
        id: "123",
        name: "Basic Scarecrow",
      },
      createdAt,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Gem: new Decimal(100),
        },
        collectibles: {
          "Basic Scarecrow": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 100,
              id: "123",
              readyAt: createdAt + 1000,
            },
          ],
        },
      },
    });

    expect(state.gems.history).toHaveProperty(dateKey);
    expect(state.gems.history?.[dateKey]?.spent).toBe(1);
  });

  describe("Dino Egg Trophy coin payment", () => {
    it("throws when paymentMethod is 'coins' without a placed Dino Egg Trophy", () => {
      expect(() =>
        speedUpCollectible({
          action: {
            type: "collectible.spedUp",
            name: "Basic Scarecrow",
            id: "123",
            paymentMethod: "coins",
          },
          state: {
            ...INITIAL_FARM,
            coins: 100_000,
            collectibles: {
              "Basic Scarecrow": [
                {
                  id: "123",
                  createdAt: 100,
                  coordinates: { x: 0, y: 0 },
                  readyAt: Date.now() + 1000,
                },
              ],
            },
          },
        }),
      ).toThrow("Dino Egg Trophy required");
    });

    it("charges coins at 50 per gem when trophy is placed", () => {
      const now = Date.now();
      const state = speedUpCollectible({
        action: {
          type: "collectible.spedUp",
          name: "Basic Scarecrow",
          id: "123",
          paymentMethod: "coins",
        },
        createdAt: now,
        state: {
          ...INITIAL_FARM,
          coins: 1000,
          inventory: { Gem: new Decimal(0) },
          collectibles: {
            "Basic Scarecrow": [
              {
                id: "123",
                createdAt: 100,
                coordinates: { x: 0, y: 0 },
                readyAt: now + 1000,
              },
            ],
            "Dino Egg Trophy": [
              {
                id: "trophy-1",
                createdAt: 0,
                coordinates: { x: 5, y: 5 },
                readyAt: 0,
              },
            ],
          },
        },
      });

      expect(state.coins).toBe(950);
      expect(state.inventory.Gem).toEqual(new Decimal(0));
      expect(state.collectibles["Basic Scarecrow"]![0].readyAt).toBe(now);
    });
  });
});
