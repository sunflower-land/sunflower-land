import Decimal from "decimal.js-light";

import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";

import { planToolPurchases } from "./planToolPurchases";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  coins: 1000,
};

describe("planToolPurchases", () => {
  it("plans the max affordable amount of an affordable tool", () => {
    const plan = planToolPurchases(GAME_STATE, ["Axe"]);

    expect(plan.purchases).toHaveLength(1);
    expect(plan.purchases[0].toolName).toBe("Axe");
    expect(plan.purchases[0].amount).toBeGreaterThan(0);
    expect(plan.totalCost).toBeGreaterThan(0);
  });

  it("is not capped at the single-craft bulk-buy amount of 10", () => {
    // Axe costs 20 coins, has no ingredients, and starts with 200 in stock -
    // with a large coin pool the plan should buy far more than 10.
    const state: GameState = { ...GAME_STATE, coins: 100_000 };

    const plan = planToolPurchases(state, ["Axe"]);

    expect(plan.purchases[0].amount).toBeGreaterThan(10);
  });

  it("spends the shared coin pool in list order, skipping tools it can no longer afford", () => {
    const state: GameState = {
      ...GAME_STATE,
      coins: 20,
    };

    // Axe (20 coins) and Rod (20 coins) are equally priced - with a budget
    // for exactly one, the first tool in the list should eat the whole
    // pool, leaving nothing for the second.
    const plan = planToolPurchases(state, ["Axe", "Rod"]);

    expect(plan.purchases.map((p) => p.toolName)).toEqual(["Axe"]);
  });

  it("does not plan the same tool twice when it appears more than once in the input", () => {
    const plan = planToolPurchases(GAME_STATE, ["Axe", "Axe"]);

    expect(plan.purchases).toHaveLength(1);
  });

  it("limits the amount by the shared ingredient pool", () => {
    // Pickaxe needs 3 Wood each; only enough for 2.
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Wood: new Decimal(6),
      },
    };

    const plan = planToolPurchases(state, ["Pickaxe"]);

    expect(plan.purchases).toHaveLength(1);
    expect(plan.purchases[0].amount).toBe(2);
  });

  it("reports the total ingredients spent across all purchases", () => {
    // Pickaxe needs 3 Wood, Rod needs 3 Wood + 1 Stone - both fully
    // affordable, so the totals should sum across both tools.
    const state: GameState = {
      ...GAME_STATE,
      coins: 100_000,
      inventory: {
        ...GAME_STATE.inventory,
        Wood: new Decimal(1000),
        Stone: new Decimal(1000),
      },
    };

    const plan = planToolPurchases(state, ["Pickaxe", "Rod"]);

    const pickaxePurchase = plan.purchases.find(
      (p) => p.toolName === "Pickaxe",
    )!;
    const rodPurchase = plan.purchases.find((p) => p.toolName === "Rod")!;

    const expectedWood = new Decimal(3)
      .mul(pickaxePurchase.amount)
      .add(new Decimal(3).mul(rodPurchase.amount));
    const expectedStone = new Decimal(1).mul(rodPurchase.amount);

    expect(plan.totalIngredients.Wood?.toNumber()).toBe(
      expectedWood.toNumber(),
    );
    expect(plan.totalIngredients.Stone?.toNumber()).toBe(
      expectedStone.toNumber(),
    );
  });

  it("shares the ingredient pool across tools in list order", () => {
    // Both Pickaxe and Rod need Wood - Pickaxe first should consume it all.
    const state: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Wood: new Decimal(3),
        Stone: new Decimal(10),
      },
    };

    const plan = planToolPurchases(state, ["Pickaxe", "Rod"]);

    expect(plan.purchases.map((p) => p.toolName)).toEqual(["Pickaxe"]);
  });

  it("skips a disabled tool", () => {
    const plan = planToolPurchases(GAME_STATE, ["Pest Net"]);

    expect(plan.purchases).toHaveLength(0);
  });

  it("skips a tool locked by the bumpkin's level", () => {
    const state: GameState = {
      ...GAME_STATE,
      bumpkin: { ...INITIAL_BUMPKIN, experience: 0 },
      inventory: {
        ...GAME_STATE.inventory,
        Feather: new Decimal(100),
        Wool: new Decimal(100),
      },
    };

    // Crab Pot has a required bumpkin level
    const plan = planToolPurchases(state, ["Crab Pot"]);

    expect(plan.purchases).toHaveLength(0);
  });

  it("skips a tool locked by a missing island expansion", () => {
    const state: GameState = {
      ...GAME_STATE,
      island: { ...GAME_STATE.island, type: "basic" },
      inventory: {
        ...GAME_STATE.inventory,
        Wood: new Decimal(100),
        Iron: new Decimal(100),
        Leather: new Decimal(100),
      },
    };

    // Oil Drill requires the desert island
    const plan = planToolPurchases(state, ["Oil Drill"]);

    expect(plan.purchases).toHaveLength(0);
  });

  it("skips a tool that is out of stock", () => {
    const state: GameState = {
      ...GAME_STATE,
      stock: {
        ...GAME_STATE.stock,
        Axe: new Decimal(0),
      },
    };

    const plan = planToolPurchases(state, ["Axe"]);

    expect(plan.purchases).toHaveLength(0);
  });

  it("skips a tool blocked by the player's Buy All settings", () => {
    const state: GameState = {
      ...GAME_STATE,
      settings: {
        ...GAME_STATE.settings,
        toolShop: { buyAll: { Axe: { blocked: true } } },
      },
    };

    const plan = planToolPurchases(state, ["Axe"]);

    expect(plan.purchases).toHaveLength(0);
  });
});
