import { INITIAL_FARM } from "features/game/lib/constants";
import { collectCrafting } from "./collectCrafting";
import Decimal from "decimal.js-light";

describe("collectCrafting", () => {
  it("adds the item to the inventory", () => {
    const state = collectCrafting({
      state: {
        ...INITIAL_FARM,
        craftingBox: {
          item: { collectible: "Doll" },
          readyAt: 1,
          startedAt: 1,
          status: "crafting",
          recipes: {},
        },
      },
      action: {
        type: "crafting.collected",
      },
    });

    expect(state.inventory["Doll"]).toEqual(new Decimal(1));
  });

  it("sets the state back to idle", () => {
    const state = collectCrafting({
      state: {
        ...INITIAL_FARM,
        craftingBox: {
          item: { collectible: "Doll" },
          readyAt: 1,
          startedAt: 1,
          status: "crafting",
          recipes: {},
        },
      },
      action: {
        type: "crafting.collected",
      },
    });

    expect(state.craftingBox.status).toEqual("idle");
  });

  it("clears the item from the crafting box", () => {
    const state = collectCrafting({
      state: {
        ...INITIAL_FARM,
        craftingBox: {
          item: { collectible: "Doll" },
          readyAt: 1,
          startedAt: 1,
          status: "crafting",
          recipes: {},
        },
      },
      action: {
        type: "crafting.collected",
      },
    });

    expect(state.craftingBox.item).toBeUndefined();
  });

  describe("queue", () => {
    it("collects all ready items from the queue", () => {
      const now = Date.now();
      const state = collectCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            status: "crafting",
            queue: [
              {
                name: "Timber",
                readyAt: now - 1000,
                startedAt: now - 10000,
                type: "collectible",
              },
              {
                name: "Doll",
                readyAt: now - 500,
                startedAt: now - 1000,
                type: "collectible",
              },
              {
                name: "Timber",
                readyAt: now + 60000,
                startedAt: now - 500,
                type: "collectible",
              },
            ],
            item: { collectible: "Timber" },
            startedAt: now - 10000,
            readyAt: now - 1000,
            recipes: {},
          },
        },
        action: {
          type: "crafting.collected",
        },
        createdAt: now,
      });

      expect(state.inventory.Timber).toEqual(new Decimal(1));
      expect(state.inventory.Doll).toEqual(new Decimal(1));
      expect(state.craftingBox.queue).toHaveLength(1);
      expect(state.craftingBox.queue?.[0].name).toBe("Timber");
      expect(state.craftingBox.status).toBe("crafting");
    });

    it("sets status to idle when all queue items are collected", () => {
      const now = Date.now();
      const state = collectCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            status: "crafting",
            queue: [
              {
                name: "Timber",
                readyAt: now - 1000,
                startedAt: now - 10000,
                type: "collectible",
              },
              {
                name: "Doll",
                readyAt: now - 500,
                startedAt: now - 1000,
                type: "collectible",
              },
            ],
            item: { collectible: "Timber" },
            startedAt: now - 10000,
            readyAt: now - 1000,
            recipes: {},
          },
        },
        action: {
          type: "crafting.collected",
        },
        createdAt: now,
      });

      expect(state.craftingBox.status).toBe("idle");
      expect(state.craftingBox.queue).toHaveLength(0);
      expect(state.craftingBox.item).toBeUndefined();
    });

    it("throws if no items are ready in the queue", () => {
      const now = Date.now();

      expect(() =>
        collectCrafting({
          state: {
            ...INITIAL_FARM,
            craftingBox: {
              status: "crafting",
              queue: [
                {
                  name: "Timber",
                  readyAt: now + 60000,
                  startedAt: now,
                  type: "collectible",
                },
              ],
              item: { collectible: "Timber" },
              startedAt: now,
              readyAt: now + 60000,
              recipes: {},
            },
          },
          action: {
            type: "crafting.collected",
          },
          createdAt: now,
        }),
      ).toThrow("No items are ready");
    });
  });

  it("throws if the item is not ready", () => {
    const now = Date.now();

    expect(() =>
      collectCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            item: { collectible: "Doll" },
            readyAt: now + 1000,
            startedAt: now,
            status: "crafting",
            recipes: {},
          },
        },
        action: {
          type: "crafting.collected",
        },
        createdAt: now,
      }),
    ).toThrow("Item is not ready");
  });
});
