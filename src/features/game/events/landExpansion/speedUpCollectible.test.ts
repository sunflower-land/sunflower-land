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
});
