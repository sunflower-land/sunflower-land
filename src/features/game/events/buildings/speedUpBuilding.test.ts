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
});
