import { INITIAL_FARM } from "features/game/lib/constants";
import { InventoryItemName } from "features/game/types/game";
import {
  getPendingSaltNodeIdsForUpgrade,
  SALT_NODE_COORDINATES,
  SaltNode,
} from "features/game/types/salt";
import { upgradeSaltFarm } from "./upgradeSaltFarm";
import Decimal from "decimal.js-light";

const makeSaltFarmTestNodes = (count: number) =>
  Array.from({ length: count }).reduce<Record<string, SaltNode>>(
    (nodes, _, i) => {
      nodes[String(i)] = {
        createdAt: 0,
        coordinates: SALT_NODE_COORDINATES[String(i)],
        salt: {
          storedCharges: 1,
          lastUpdatedAt: 0,
        },
      };

      return nodes;
    },
    {},
  );

describe("upgradeSaltFarm", () => {
  const now = Date.now();

  it("throws when the salt farm is already max level", () => {
    expect(() =>
      upgradeSaltFarm({
        state: {
          ...INITIAL_FARM,
          saltFarm: {
            level: 4,
            nodes: {},
          },
        },
        action: { type: "saltFarm.upgraded" },
        createdAt: now,
      }),
    ).toThrow("Salt farm is at max level");
  });

  it("throws when coins are insufficient for the upgrade", () => {
    expect(() =>
      upgradeSaltFarm({
        state: {
          ...INITIAL_FARM,
          coins: 199,
          saltFarm: {
            level: 0,
            nodes: {},
          },
        },
        action: { type: "saltFarm.upgraded" },
        createdAt: now,
      }),
    ).toThrow("Insufficient coins for upgrade");
  });

  it("throws when required items are missing", () => {
    expect(() =>
      upgradeSaltFarm({
        state: {
          ...INITIAL_FARM,
          coins: 500,
          inventory: {
            ...INITIAL_FARM.inventory,
            Wood: new Decimal(29),
            Stone: new Decimal(20),
          },
          saltFarm: {
            level: 0,
            nodes: {},
          },
        },
        action: { type: "saltFarm.upgraded" },
        createdAt: now,
      }),
    ).toThrow("Insufficient Wood for upgrade");
  });

  it("upgrades from level 0 to level 1 and deducts resources", () => {
    const state = upgradeSaltFarm({
      state: {
        ...INITIAL_FARM,
        coins: 1_000,
        inventory: {
          ...INITIAL_FARM.inventory,
          Wood: new Decimal(50),
          Stone: new Decimal(30),
        },
        saltFarm: {
          level: 0,
          nodes: {},
        },
      },
      action: { type: "saltFarm.upgraded" },
      createdAt: now,
    });

    expect(state.coins).toBe(800);
    expect(state.inventory.Wood).toEqual(new Decimal(20));
    expect(state.inventory.Stone).toEqual(new Decimal(10));
    expect(state.farmActivity["Coins Spent"]).toBe(200);
    expect(state.saltFarm.level).toBe(1);
    expect(Object.keys(state.saltFarm.nodes)).toHaveLength(1);
    expect(state.saltFarm.nodes["0"]).toMatchObject({
      coordinates: { x: -3, y: -6 },
      salt: {
        storedCharges: 1,
      },
    });
  });

  it("adds only missing nodes when upgrading to a higher level", () => {
    const state = upgradeSaltFarm({
      state: {
        ...INITIAL_FARM,
        coins: 100_000,
        inventory: {
          ...INITIAL_FARM.inventory,
          Wood: new Decimal(1_000),
          Stone: new Decimal(100),
          Iron: new Decimal(100),
          Gold: new Decimal(200),
          Salt: new Decimal(20_000),
        },
        saltFarm: {
          level: 2,
          nodes: {
            "0": {
              createdAt: 0,
              coordinates: { x: -16, y: -18 },
              salt: { storedCharges: 1, lastUpdatedAt: 0 },
            },
            "1": {
              createdAt: 0,
              coordinates: { x: -16, y: -16 },
              salt: { storedCharges: 1, lastUpdatedAt: 0 },
            },
          },
        },
      },
      action: { type: "saltFarm.upgraded" },
      createdAt: now,
    });

    expect(state.coins).toBe(60_000);
    expect(state.inventory.Wood).toEqual(new Decimal(500));
    expect(state.inventory.Gold).toEqual(new Decimal(160));
    expect(state.inventory.Salt).toEqual(new Decimal(18_000));
    expect(state.farmActivity["Coins Spent"]).toBe(40_000);
    expect(state.saltFarm.level).toBe(3);
    expect(Object.keys(state.saltFarm.nodes)).toHaveLength(4);
    expect(state.saltFarm.nodes["2"].coordinates).toEqual({ x: -5, y: -6 });
    expect(state.saltFarm.nodes["3"].coordinates).toEqual({ x: -5, y: -4 });
  });

  it("covers all upgrade iterations (1 to 4)", () => {
    const cases = [
      {
        fromLevel: 0,
        initialNodes: 0,
        expectedNodes: 1,
        coinsCost: 200,
        expectedInventory: {
          Wood: new Decimal(970),
          Stone: new Decimal(980),
        },
      },
      {
        fromLevel: 1,
        initialNodes: 1,
        expectedNodes: 2,
        coinsCost: 1_000,
        expectedInventory: {
          Stone: new Decimal(985),
          Iron: new Decimal(995),
          Salt: new Decimal(19_900),
        },
      },
      {
        fromLevel: 2,
        initialNodes: 2,
        expectedNodes: 4,
        coinsCost: 40_000,
        expectedInventory: {
          Wood: new Decimal(500),
          Gold: new Decimal(960),
          Salt: new Decimal(18_000),
        },
      },
      {
        fromLevel: 3,
        initialNodes: 4,
        expectedNodes: 6,
        coinsCost: 120_000,
        expectedInventory: {
          Gold: new Decimal(900),
          Salt: new Decimal(10_000),
        },
      },
    ];

    cases.forEach((testCase) => {
      const startingCoins = 500_000;
      const state = upgradeSaltFarm({
        state: {
          ...INITIAL_FARM,
          coins: startingCoins,
          inventory: {
            ...INITIAL_FARM.inventory,
            Wood: new Decimal(1_000),
            Stone: new Decimal(1_000),
            Iron: new Decimal(1_000),
            Gold: new Decimal(1_000),
            Salt: new Decimal(20_000),
          },
          saltFarm: {
            level: testCase.fromLevel,
            nodes: makeSaltFarmTestNodes(testCase.initialNodes),
          },
        },
        action: { type: "saltFarm.upgraded" },
        createdAt: now,
      });

      expect(state.coins).toBe(startingCoins - testCase.coinsCost);
      expect(state.farmActivity["Coins Spent"]).toBe(testCase.coinsCost);
      expect(Object.keys(state.saltFarm.nodes)).toHaveLength(
        testCase.expectedNodes,
      );
      expect(state.saltFarm.level).toBe(testCase.fromLevel + 1);

      Object.entries(testCase.expectedInventory).forEach(([item, amount]) => {
        expect(state.inventory[item as InventoryItemName]).toEqual(amount);
      });
    });
  });
});

describe("getPendingSaltNodeIdsForUpgrade", () => {
  it("returns no ids at max level", () => {
    expect(getPendingSaltNodeIdsForUpgrade({ level: 4, nodes: {} })).toEqual(
      [],
    );
  });

  it("returns one id at level 0 with no nodes", () => {
    expect(getPendingSaltNodeIdsForUpgrade({ level: 0, nodes: {} })).toEqual([
      "0",
    ]);
  });

  it("returns two ids at level 2 with two nodes", () => {
    expect(
      getPendingSaltNodeIdsForUpgrade({
        level: 2,
        nodes: makeSaltFarmTestNodes(2),
      }),
    ).toEqual(["2", "3"]);
  });

  it("returns no ids when node count already matches next tier", () => {
    expect(
      getPendingSaltNodeIdsForUpgrade({
        level: 2,
        nodes: makeSaltFarmTestNodes(4),
      }),
    ).toEqual([]);
  });
});
