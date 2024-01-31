import { TEST_FARM } from "features/game/lib/constants";
import { upgrade } from "./upgradeFarm";
import Decimal from "decimal.js-light";

describe("upgradeFarm", () => {
  it("requires a player has met the expansions", () => {
    expect(() =>
      upgrade({
        action: {
          type: "farm.upgraded",
        },
        state: {
          ...TEST_FARM,
        },
      })
    ).toThrow("Player has not met the expansion requirements");
  });

  it("requires a player has ingredients", () => {
    expect(() =>
      upgrade({
        action: {
          type: "farm.upgraded",
        },
        state: {
          ...TEST_FARM,
          inventory: {
            "Basic Land": new Decimal(9),
            Gold: new Decimal(1),
          },
        },
      })
    ).toThrow("Insufficient Gold");
  });

  it("burns the ingredients", () => {
    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
      },
    });

    expect(state.inventory.Gold).toEqual(new Decimal(5));
  });

  it("resets the expansions", () => {
    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
      },
    });

    expect(state.inventory["Basic Land"]).toEqual(new Decimal(4));
  });

  it("resets collectibles, buildings, fishing, chickens, mushrooms & buds", () => {
    const createdAt = Date.now();
    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
        fishing: {
          wharf: {
            castedAt: 10001023,
            caught: { Anchovy: 1 },
          },
          beach: {},
          weather: "Sunny",
        },
        mushrooms: {
          mushrooms: {
            1: {
              amount: 1,
              name: "Wild Mushroom",
              x: 1,
              y: 1,
            },
          },
          spawnedAt: 0,
        },
        collectibles: {
          "Abandoned Bear": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 100001,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        buildings: {
          "Hen House": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 100001,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        buds: {
          1: {
            aura: "Basic",
            colour: "Beige",
            ears: "Ears",
            stem: "3 Leaf Clover",
            type: "Beach",
            location: "farm",
            coordinates: { x: 1, y: 1 },
          },
        },
      },
      createdAt,
    });

    expect(state.collectibles).toEqual({});

    expect(Object.keys(state.buildings)).not.toContain("Hen House");
    expect(state.chickens).toEqual({});
    expect(state.fishing.wharf).toEqual({});
    expect(state.mushrooms).toEqual({
      mushrooms: {},
      spawnedAt: 0,
    });
    expect(state.buds).toEqual({
      1: {
        aura: "Basic",
        colour: "Beige",
        ears: "Ears",
        stem: "3 Leaf Clover",
        type: "Beach",
      },
    });
  });

  it("upgrades to spring island", () => {
    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(9),
          Gold: new Decimal(15),
        },
      },
    });

    expect(state.inventory.House).toEqual(new Decimal(1));
    expect(state.inventory["Fruit Patch"]).toEqual(new Decimal(2));
    expect(state.inventory["Town Center"]).toBeUndefined();

    expect(Object.keys(state.buildings)).toEqual([
      "House",
      "Workbench",
      "Market",
      "Fire Pit",
    ]);
  });

  it("sets island history", () => {
    const createdAt = Date.now();
    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Gold: new Decimal(15),
        },
      },
      createdAt,
    });

    expect(state.island.upgradedAt).toEqual(createdAt);
    expect(state.island.previousExpansions).toEqual(16);
  });

  it("does not allow a player to upgrade to desert island", () => {
    expect(() =>
      upgrade({
        action: {
          type: "farm.upgraded",
        },
        state: {
          ...TEST_FARM,
          island: {
            type: "spring",
          },
          inventory: {
            "Basic Land": new Decimal(16),
            Gold: new Decimal(1000000000000),
          },
        },
      })
    ).toThrow("Not implemented");
  });

  it("removes items which have expired on the land", () => {
    const createdAt = Date.now();

    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Gold: new Decimal(15),
          "Time Warp Totem": new Decimal(1),
        },
        collectibles: {
          "Time Warp Totem": [
            {
              id: "1",
              readyAt: Date.now() - 48 * 60 * 60 * 1000,
              createdAt: Date.now() - 48 * 60 * 60 * 1000,
              coordinates: { x: 0, y: 0 },
            },
          ],
        },
      },
      createdAt,
    });

    expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(0));
  });

  it("it does not remove items that have not yet expired", () => {
    const createdAt = Date.now();

    const state = upgrade({
      action: {
        type: "farm.upgraded",
      },
      state: {
        ...TEST_FARM,
        inventory: {
          "Basic Land": new Decimal(16),
          Gold: new Decimal(15),
          "Time Warp Totem": new Decimal(1),
        },
        collectibles: {
          "Time Warp Totem": [
            {
              id: "1",
              // Still active
              readyAt: Date.now() - 1 * 60 * 60 * 1000,
              createdAt: Date.now() - 1 * 60 * 60 * 1000,
              coordinates: { x: 0, y: 0 },
            },
          ],
        },
      },
      createdAt,
    });

    expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(1));
  });
});
