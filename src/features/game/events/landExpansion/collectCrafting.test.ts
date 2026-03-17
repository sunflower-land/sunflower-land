import { INITIAL_FARM } from "features/game/lib/constants";
import { collectCrafting } from "./collectCrafting";
import Decimal from "decimal.js-light";

describe("collectCrafting", () => {
  it("throws when queue is empty", () => {
    expect(() =>
      collectCrafting({
        state: {
          ...INITIAL_FARM,
          craftingBox: {
            status: "crafting",
            recipes: {},
          },
        },
        action: { type: "crafting.collected" },
      }),
    ).toThrow("No item to collect");
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
                id: "timber-1",
                name: "Timber",
                readyAt: now - 1000,
                startedAt: now - 10000,
                type: "collectible",
              },
              {
                id: "doll-1",
                name: "Doll",
                readyAt: now - 500,
                startedAt: now - 1000,
                type: "collectible",
              },
              {
                id: "timber-2",
                name: "Timber",
                readyAt: now + 60000,
                startedAt: now - 500,
                type: "collectible",
              },
            ],
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
                id: "timber-1",
                name: "Timber",
                readyAt: now - 1000,
                startedAt: now - 10000,
                type: "collectible",
              },
              {
                id: "doll-1",
                name: "Doll",
                readyAt: now - 500,
                startedAt: now - 1000,
                type: "collectible",
              },
            ],
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
                  id: "timber-1",
                  name: "Timber",
                  readyAt: now + 60000,
                  startedAt: now,
                  type: "collectible",
                },
              ],
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
});
