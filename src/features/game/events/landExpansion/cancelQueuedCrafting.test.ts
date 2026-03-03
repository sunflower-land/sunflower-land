import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { cancelQueuedCrafting } from "./cancelQueuedCrafting";
import { CraftingQueueItem } from "features/game/types/game";

describe("cancelQueuedCrafting", () => {
  const farmId = 1;

  it("throws an error if no queue exists", () => {
    expect(() =>
      cancelQueuedCrafting({
        state: {
          ...INITIAL_FARM,
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
          craftingBox: {
            status: "idle",
            startedAt: 0,
            readyAt: 0,
            recipes: {},
          },
        },
        action: {
          type: "crafting.cancelled",
          queueItem: {
            name: "Timber",
            readyAt: 0,
            startedAt: 0,
            type: "collectible",
          },
        },
      }),
    ).toThrow("No queue exists");
  });

  it("throws an error if item does not exist in queue", () => {
    const now = Date.now();
    expect(() =>
      cancelQueuedCrafting({
        state: {
          ...INITIAL_FARM,
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
          type: "crafting.cancelled",
          queueItem: {
            name: "Doll",
            readyAt: now + 120000,
            startedAt: now,
            type: "collectible",
          },
        },
        createdAt: now,
      }),
    ).toThrow("Item does not exist in queue");
  });

  it("throws an error if the item is currently being crafted", () => {
    const now = Date.now();
    const timberReadyAt = now + 60000;
    const queueItem: CraftingQueueItem = {
      name: "Timber",
      readyAt: timberReadyAt,
      startedAt: now,
      type: "collectible",
    };

    expect(() =>
      cancelQueuedCrafting({
        state: {
          ...INITIAL_FARM,
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
          craftingBox: {
            status: "crafting",
            queue: [queueItem],
            item: { collectible: "Timber" },
            startedAt: now,
            readyAt: timberReadyAt,
            recipes: {},
          },
        },
        action: {
          type: "crafting.cancelled",
          queueItem,
        },
        createdAt: now,
      }),
    ).toThrow(
      `Item Timber with readyAt ${timberReadyAt} is currently being crafted`,
    );
  });

  it("preserves instant items as ready when a pending item before them is cancelled", () => {
    const now = Date.now();
    const inProgressReadyAt = now + 2 * 60 * 60 * 1000;
    const pendingReadyAt = inProgressReadyAt + 60000;
    const instant1ReadyAt = now - 2000;
    const instant2ReadyAt = now - 1000;

    const state = cancelQueuedCrafting({
      state: {
        ...INITIAL_FARM,
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
        inventory: {
          Wood: new Decimal(0),
        },
        craftingBox: {
          status: "crafting",
          queue: [
            {
              name: "Doll",
              readyAt: inProgressReadyAt,
              startedAt: now,
              type: "collectible",
            },
            {
              name: "Timber",
              readyAt: pendingReadyAt,
              startedAt: inProgressReadyAt,
              type: "collectible",
            },
            {
              name: "Timber",
              readyAt: instant1ReadyAt,
              startedAt: instant1ReadyAt,
              type: "collectible",
            },
            {
              name: "Timber",
              readyAt: instant2ReadyAt,
              startedAt: instant2ReadyAt,
              type: "collectible",
            },
          ],
          item: { collectible: "Doll" },
          startedAt: now,
          readyAt: inProgressReadyAt,
          recipes: {
            Timber: {
              name: "Timber",
              type: "collectible",
              ingredients: [
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
              ],
              time: 0,
            },
          },
        },
      },
      action: {
        type: "crafting.cancelled",
        queueItem: {
          name: "Timber",
          readyAt: pendingReadyAt,
          startedAt: inProgressReadyAt,
          type: "collectible",
        },
      },
      createdAt: now,
      farmId,
    });

    expect(state.craftingBox.queue).toHaveLength(3);
    expect(state.craftingBox.queue?.[0].readyAt).toEqual(inProgressReadyAt);
    expect(state.craftingBox.queue?.[1].readyAt).toEqual(instant1ReadyAt);
    expect(state.craftingBox.queue?.[1].readyAt).toBeLessThanOrEqual(now);
    expect(state.craftingBox.queue?.[2].readyAt).toEqual(instant2ReadyAt);
    expect(state.craftingBox.queue?.[2].readyAt).toBeLessThanOrEqual(now);
  });

  it("removes only the selected item when cancelling one of two identical instant items", () => {
    const now = Date.now();
    const identicalReadyAt = now - 1000;

    const state = cancelQueuedCrafting({
      state: {
        ...INITIAL_FARM,
        inventory: {
          "Beta Pass": new Decimal(1),
          Wood: new Decimal(0),
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
        craftingBox: {
          status: "crafting",
          queue: [
            {
              name: "Timber",
              readyAt: identicalReadyAt,
              startedAt: identicalReadyAt,
              type: "collectible",
            },
            {
              name: "Timber",
              readyAt: identicalReadyAt,
              startedAt: identicalReadyAt,
              type: "collectible",
            },
          ],
          item: { collectible: "Timber" },
          startedAt: identicalReadyAt,
          readyAt: identicalReadyAt,
          recipes: {
            Timber: {
              name: "Timber",
              type: "collectible",
              ingredients: [
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
              ],
              time: 0,
            },
          },
        },
      },
      action: {
        type: "crafting.cancelled",
        queueItem: {
          name: "Timber",
          readyAt: identicalReadyAt,
          startedAt: identicalReadyAt,
          type: "collectible",
        },
      },
      createdAt: now,
      farmId,
    });

    expect(state.craftingBox.queue).toHaveLength(1);
    expect(state.craftingBox.queue?.[0].name).toBe("Timber");
    expect(state.inventory.Wood).toEqual(new Decimal(9));
  });

  it("cancels a queued item and refunds ingredients", () => {
    const now = Date.now();
    const timber1ReadyAt = now - 1000;
    const timber2ReadyAt = now + 60000;
    const timber3ReadyAt = now + 120000;

    const state = cancelQueuedCrafting({
      state: {
        ...INITIAL_FARM,
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
        inventory: {
          Wood: new Decimal(0),
        },
        craftingBox: {
          status: "crafting",
          queue: [
            {
              name: "Timber",
              readyAt: timber1ReadyAt,
              startedAt: now - 10000,
              type: "collectible",
            },
            {
              name: "Timber",
              readyAt: timber2ReadyAt,
              startedAt: timber1ReadyAt,
              type: "collectible",
            },
            {
              name: "Timber",
              readyAt: timber3ReadyAt,
              startedAt: timber2ReadyAt,
              type: "collectible",
            },
          ],
          item: { collectible: "Timber" },
          startedAt: now - 10000,
          readyAt: timber1ReadyAt,
          recipes: {
            Timber: {
              name: "Timber",
              type: "collectible",
              ingredients: [
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
                { collectible: "Wood" },
              ],
              time: 0,
            },
          },
        },
      },
      action: {
        type: "crafting.cancelled",
        queueItem: {
          name: "Timber",
          readyAt: timber3ReadyAt,
          startedAt: timber2ReadyAt,
          type: "collectible",
        },
      },
      createdAt: now,
      farmId,
    });

    expect(state.craftingBox.queue).toHaveLength(2);
    expect(state.craftingBox.queue?.[0].name).toBe("Timber");
    expect(state.craftingBox.queue?.[1].name).toBe("Timber");
    expect(state.inventory.Wood).toEqual(new Decimal(9));
    expect(state.farmActivity["Crafting Queue Cancelled"]).toBe(1);
  });
});
