import { INITIAL_FARM } from "features/game/lib/constants";
import { RECIPES } from "features/game/lib/crafting";
import { recalculateCraftingQueue } from "./cancelQueuedCrafting";
import { speedUpCrafting } from "./speedUpCrafting";
import Decimal from "decimal.js-light";
import { getInstantGems } from "features/game/lib/getInstantGems";
import { GameState } from "features/game/types/game";
const createdAt = Date.now();
describe("speedUpCrafting", () => {
  it("throws an error if crafting box is not crafting", () => {
    expect(() =>
      speedUpCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            status: "idle",
            startedAt: 0,
            readyAt: 0,
            recipes: {},
          },
        },
        action: { type: "crafting.spedUp" },
      }),
    ).toThrow("Crafting box is not crafting");
  });

  it("(edge case) throws an error if crafting box is not crafting anything", () => {
    expect(() =>
      speedUpCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            status: "crafting",
            startedAt: 0,
            readyAt: 0,
            recipes: {},
          },
        },
        action: { type: "crafting.spedUp" },
      }),
    ).toThrow("Crafting box is not crafting");
  });

  it("throws an error if crafting box is not ready to be sped up", () => {
    expect(() =>
      speedUpCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            status: "crafting",
            item: { collectible: "Doll" },
            startedAt: 0,
            readyAt: 0,
            recipes: {},
          },
        },
        action: { type: "crafting.spedUp" },
        createdAt,
      }),
    ).toThrow("Crafting box is not ready to be sped up");
  });

  it("throws an error if insufficient gems", () => {
    expect(() =>
      speedUpCrafting({
        state: {
          ...INITIAL_FARM,
          inventory: { Gem: new Decimal(0) },
          craftingBox: {
            status: "crafting",
            item: { collectible: "Doll" },
            startedAt: 0,
            readyAt: createdAt + 10000,
            recipes: {},
          },
        },
        action: { type: "crafting.spedUp" },
        createdAt,
      }),
    ).toThrow("Insufficient gems");
  });

  it("deducts gems from inventory", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      craftingBox: {
        status: "crafting",
        item: { collectible: "Doll" },
        startedAt: 0,
        readyAt: createdAt + 10000,
        recipes: {},
      },
    };
    const gemsNeeded = getInstantGems({
      readyAt: state.craftingBox.readyAt,
      now: createdAt,
      game: state,
    });
    state.inventory.Gem = new Decimal(gemsNeeded);
    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt,
    });
    expect(newState.inventory.Gem).toEqual(
      new Decimal(state.inventory.Gem).sub(gemsNeeded),
    );
  });

  it("updates readyAt", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      craftingBox: {
        status: "crafting",
        item: { collectible: "Doll" },
        startedAt: 0,
        readyAt: createdAt + 10000,
        recipes: {},
      },
    };
    const gemsNeeded = getInstantGems({
      readyAt: state.craftingBox.readyAt,
      now: createdAt,
      game: state,
    });
    state.inventory.Gem = new Decimal(gemsNeeded);
    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt,
    });
    expect(newState.inventory.Gem).toEqual(
      new Decimal(state.inventory.Gem).sub(gemsNeeded),
    );
    expect(newState.craftingBox.readyAt).toEqual(createdAt);
  });

  it("returns valid state when speeding up single-item queue", () => {
    const now = Date.now();
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { Gem: new Decimal(100) },
      craftingBox: {
        status: "crafting",
        queue: [
          {
            id: "doll-1",
            name: "Doll",
            readyAt: now + 10000,
            startedAt: now,
            type: "collectible",
          },
        ],
        item: { collectible: "Doll" },
        startedAt: now,
        readyAt: now + 10000,
        recipes: {},
      },
    };
    const gemsNeeded = getInstantGems({
      readyAt: state.craftingBox.readyAt,
      now,
      game: state,
    });
    state.inventory.Gem = new Decimal(gemsNeeded);

    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt: now,
      farmId: 1,
    });

    expect(newState).toBeDefined();
    expect(newState.craftingBox).toBeDefined();
    expect(newState.craftingBox.queue?.[0].readyAt).toEqual(now);
  });

  it("speeds up queue[0] and recalculates remaining queue items", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { Gem: new Decimal(100) },
      craftingBox: {
        status: "crafting",
        queue: [
          {
            id: "doll-1",
            name: "Doll",
            readyAt: createdAt + 10000,
            startedAt: createdAt,
            type: "collectible",
          },
          {
            id: "basic-bed-1",
            name: "Basic Bed",
            readyAt: createdAt + 10000 + 8 * 60 * 60 * 1000,
            startedAt: createdAt + 10000,
            type: "collectible",
          },
        ],
        item: { collectible: "Doll" },
        startedAt: createdAt,
        readyAt: createdAt + 10000,
        recipes: {},
      },
    };
    const gemsNeeded = getInstantGems({
      readyAt: state.craftingBox.readyAt,
      now: createdAt,
      game: state,
    });
    state.inventory.Gem = new Decimal(gemsNeeded);
    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt,
      farmId: 1,
    });
    expect(newState.craftingBox.queue?.[0].readyAt).toEqual(createdAt);
    expect(newState.craftingBox.readyAt).toEqual(createdAt);
    expect(newState.craftingBox.queue).toHaveLength(2);
    expect(newState.craftingBox.queue?.[1].name).toBe("Basic Bed");
    expect(newState.craftingBox.queue?.[1].readyAt).toBeGreaterThan(createdAt);
  });

  it("speeds up first in-progress item when queue has ready items at the front", () => {
    const now = Date.now();
    const readyItemReadyAt = now - 5000;
    const inProgressReadyAt = now + 2 * 60 * 60 * 1000;

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { Gem: new Decimal(100) },
      craftingBox: {
        status: "crafting",
        queue: [
          {
            id: "doll-ready",
            name: "Doll",
            readyAt: readyItemReadyAt,
            startedAt: readyItemReadyAt - 10000,
            type: "collectible",
          },
          {
            id: "doll-in-progress",
            name: "Doll",
            readyAt: inProgressReadyAt,
            startedAt: now,
            type: "collectible",
          },
        ],
        item: { collectible: "Doll" },
        startedAt: readyItemReadyAt - 10000,
        readyAt: readyItemReadyAt,
        recipes: {},
      },
    };

    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt: now,
      farmId: 1,
    });

    expect(newState.craftingBox.queue).toHaveLength(2);
    expect(newState.craftingBox.queue?.[0].readyAt).toEqual(readyItemReadyAt);
    expect(newState.craftingBox.queue?.[1].readyAt).toEqual(now);
  });

  it("charges gems based on in-progress item, not the ready item", () => {
    const now = Date.now();
    const readyItemReadyAt = now - 5000;
    const inProgressReadyAt = now + 2 * 60 * 60 * 1000;

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { Gem: new Decimal(100) },
      craftingBox: {
        status: "crafting",
        queue: [
          {
            id: "doll-ready",
            name: "Doll",
            readyAt: readyItemReadyAt,
            startedAt: readyItemReadyAt - 10000,
            type: "collectible",
          },
          {
            id: "doll-in-progress",
            name: "Doll",
            readyAt: inProgressReadyAt,
            startedAt: now,
            type: "collectible",
          },
        ],
        item: { collectible: "Doll" },
        startedAt: readyItemReadyAt - 10000,
        readyAt: readyItemReadyAt,
        recipes: {},
      },
    };

    const expectedGems = getInstantGems({
      readyAt: inProgressReadyAt,
      now,
      game: state,
    });

    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt: now,
      farmId: 1,
    });

    expect(newState.inventory.Gem).toEqual(new Decimal(100 - expectedGems));
  });

  it("throws when all queue items are already ready", () => {
    const now = Date.now();

    expect(() =>
      speedUpCrafting({
        state: {
          ...INITIAL_FARM,
          inventory: { Gem: new Decimal(100) },
          craftingBox: {
            status: "crafting",
            queue: [
              {
                id: "doll-ready",
                name: "Doll",
                readyAt: now - 5000,
                startedAt: now - 15000,
                type: "collectible",
              },
            ],
            item: { collectible: "Doll" },
            startedAt: now - 15000,
            readyAt: now - 5000,
            recipes: {},
          },
        },
        action: { type: "crafting.spedUp" },
        createdAt: now,
        farmId: 1,
      }),
    ).toThrow("Crafting box is not ready to be sped up");
  });

  it("preserves ready items and recalculates only in-progress items", () => {
    const now = Date.now();
    const readyAt1 = now - 10000;
    const readyAt2 = now - 5000;
    const inProgressReadyAt = now + 60000;

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: { Gem: new Decimal(100) },
      craftingBox: {
        status: "crafting",
        queue: [
          {
            id: "doll-1",
            name: "Doll",
            readyAt: readyAt1,
            startedAt: readyAt1 - 10000,
            type: "collectible",
          },
          {
            id: "doll-2",
            name: "Doll",
            readyAt: readyAt2,
            startedAt: readyAt2 - 10000,
            type: "collectible",
          },
          {
            id: "doll-3",
            name: "Doll",
            readyAt: inProgressReadyAt,
            startedAt: now,
            type: "collectible",
          },
        ],
        item: { collectible: "Doll" },
        startedAt: readyAt1 - 10000,
        readyAt: readyAt1,
        recipes: {},
      },
    };

    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt: now,
      farmId: 1,
    });

    expect(newState.craftingBox.queue).toHaveLength(3);
    expect(newState.craftingBox.queue?.[0].readyAt).toEqual(readyAt1);
    expect(newState.craftingBox.queue?.[1].readyAt).toEqual(readyAt2);
    expect(newState.craftingBox.queue?.[2].readyAt).toEqual(now);
  });

  it("preserves correct readyAt for mixed recipe queue after speedUp", () => {
    const now = Date.now();
    const farmId = 1;
    const dollReadyAt = now + 2 * 60 * 60 * 1000;
    const timberReadyAt = dollReadyAt;

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {
        Gem: new Decimal(100),
        "Beta Pass": new Decimal(1),
      },
      buildings: {
        "Crafting Box": [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            createdAt: 0,
            readyAt: 0,
          },
        ],
      },
      farmActivity: {
        "Doll Crafting Started": 1,
        "Timber Crafting Started": 1,
      },
      vip: { bundles: [], expiresAt: now + 86400000 },
      craftingBox: {
        status: "crafting",
        queue: [
          {
            id: "doll-1",
            name: "Doll",
            readyAt: dollReadyAt,
            startedAt: now,
            type: "collectible",
          },
          {
            id: "timber-1",
            name: "Timber",
            readyAt: timberReadyAt,
            startedAt: dollReadyAt,
            type: "collectible",
          },
        ],
        item: { collectible: "Doll" },
        startedAt: now,
        readyAt: dollReadyAt,
        recipes: {
          Doll: { ...RECIPES.Doll },
          Timber: { ...RECIPES.Timber },
        },
      },
    };

    const gemsNeeded = getInstantGems({
      readyAt: dollReadyAt,
      now,
      game: state,
    });
    state.inventory.Gem = new Decimal(gemsNeeded);

    const inProgressItems = state.craftingBox.queue!.filter(
      (q) => q.readyAt > now,
    );
    const expectedRecalculated = recalculateCraftingQueue({
      queue: inProgressItems,
      game: state,
      farmId,
      firstItemReadyAt: now,
    });

    const result = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt: now,
      farmId,
    });

    expect(result.craftingBox.queue).toHaveLength(2);
    expect(result.craftingBox.queue?.[0].name).toBe("Doll");
    expect(result.craftingBox.queue?.[0].readyAt).toEqual(now);
    expect(result.craftingBox.queue?.[1].name).toBe("Timber");
    expect(result.craftingBox.queue?.[1].readyAt).toEqual(
      expectedRecalculated[1].readyAt,
    );
  });

  it("updates gem history", () => {
    const currentDateString = new Date(createdAt)
      .toISOString()
      .substring(0, 10);
    const state: GameState = {
      ...INITIAL_FARM,
      craftingBox: {
        status: "crafting",
        item: { collectible: "Doll" },
        startedAt: 0,
        readyAt: createdAt + 10000,
        recipes: {},
      },
    };
    const gemsNeeded = getInstantGems({
      readyAt: state.craftingBox.readyAt,
      now: createdAt,
      game: state,
    });
    state.inventory.Gem = new Decimal(gemsNeeded);
    const newState = speedUpCrafting({
      state,
      action: { type: "crafting.spedUp" },
      createdAt,
    });
    expect(newState.gems.history?.[currentDateString]?.spent).toEqual(
      gemsNeeded,
    );
  });
});
