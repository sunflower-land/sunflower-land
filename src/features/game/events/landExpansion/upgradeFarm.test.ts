import { TEST_FARM } from "features/game/lib/constants";
import { updgrade } from "./upgradeFarm";
import Decimal from "decimal.js-light";

describe("upgradeFarm", () => {
  it("requires a player has met the expansions", () => {
    expect(() =>
      updgrade({
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
      updgrade({
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
    const state = updgrade({
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
    const state = updgrade({
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
    const state = updgrade({
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
      spawnedAt: createdAt,
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
    const state = updgrade({
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

  it("does not allow a player to upgrade to desert island", () => {
    expect(() =>
      updgrade({
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
});
