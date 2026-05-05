import { INITIAL_FARM } from "features/game/lib/constants";
import { speedUpBuilding } from "./speedUpBuilding";
import Decimal from "decimal.js-light";

describe("speedUpBuilding", () => {
  it("requires building exists", () => {
    expect(() => {
      speedUpBuilding({
        action: {
          type: "building.spedUp",
          id: "123",
          name: "Hen House",
        },
        state: INITIAL_FARM,
      });
    }).toThrow("Building does not exist");
  });
  it("requires building not already completed", () => {
    expect(() => {
      speedUpBuilding({
        action: {
          type: "building.spedUp",
          id: "123",
          name: "Workbench",
        },
        state: {
          ...INITIAL_FARM,
          buildings: {
            Workbench: [
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
    }).toThrow("Building already finished");
  });
  it("requires player has gems", () => {
    expect(() => {
      speedUpBuilding({
        action: {
          type: "building.spedUp",
          id: "123",
          name: "Workbench",
        },
        state: {
          ...INITIAL_FARM,
          inventory: {
            Gem: new Decimal(0),
          },
          buildings: {
            Workbench: [
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
    const state = speedUpBuilding({
      action: {
        type: "building.spedUp",
        id: "123",
        name: "Workbench",
      },
      state: {
        ...INITIAL_FARM,
        inventory: {
          Gem: new Decimal(100),
        },
        buildings: {
          Workbench: [
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
    const state = speedUpBuilding({
      action: {
        type: "building.spedUp",
        id: "123",
        name: "Workbench",
      },
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Gem: new Decimal(100),
        },
        buildings: {
          Workbench: [
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

    expect(state.buildings["Workbench"]![0].readyAt).toEqual(now);
  });

  it("records gem history under the createdAt date key (cross-day)", () => {
    const createdAt = new Date("2024-06-15T12:00:00Z").getTime();
    const dateKey = "2024-06-15";
    const state = speedUpBuilding({
      action: {
        type: "building.spedUp",
        id: "123",
        name: "Workbench",
      },
      createdAt,
      state: {
        ...INITIAL_FARM,
        inventory: {
          Gem: new Decimal(100),
        },
        buildings: {
          Workbench: [
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
        speedUpBuilding({
          action: {
            type: "building.spedUp",
            id: "123",
            name: "Workbench",
            paymentMethod: "coins",
          },
          state: {
            ...INITIAL_FARM,
            coins: 100_000,
            buildings: {
              Workbench: [
                {
                  coordinates: { x: 0, y: 0 },
                  createdAt: 100,
                  id: "123",
                  readyAt: Date.now() + 1000,
                },
              ],
            },
          },
        }),
      ).toThrow("Dino Egg Trophy required");
    });

    it("charges coins at 50 per gem and finishes the building when trophy is placed", () => {
      const now = Date.now();
      const state = speedUpBuilding({
        action: {
          type: "building.spedUp",
          id: "123",
          name: "Workbench",
          paymentMethod: "coins",
        },
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
          buildings: {
            Workbench: [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 100,
                id: "123",
                readyAt: now + 1000,
              },
            ],
          },
        },
      });

      // 1s remaining ⇒ 1 gem ⇒ 50 coins.
      expect(state.coins).toBe(950);
      expect(state.inventory.Gem).toEqual(new Decimal(0));
      expect(state.buildings.Workbench![0].readyAt).toBe(now);
    });
  });
});
