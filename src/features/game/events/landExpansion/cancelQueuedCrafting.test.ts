import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { RECIPES } from "features/game/lib/crafting";
import {
  cancelQueuedCrafting,
  recalculateCraftingQueue,
} from "./cancelQueuedCrafting";
import { CraftingQueueItem, GameState } from "features/game/types/game";

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

  it("removes only the selected item when cancelling one of two identical pending items", () => {
    const now = Date.now();
    const timber1ReadyAt = now + 60000;
    const timber2ReadyAt = now + 120000;

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
              readyAt: timber1ReadyAt,
              startedAt: now,
              type: "collectible",
            },
            {
              name: "Timber",
              readyAt: timber2ReadyAt,
              startedAt: timber1ReadyAt,
              type: "collectible",
            },
          ],
          item: { collectible: "Timber" },
          startedAt: now,
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
          readyAt: timber2ReadyAt,
          startedAt: timber1ReadyAt,
          type: "collectible",
        },
      },
      createdAt: now,
      farmId,
    });

    expect(state.craftingBox.queue).toHaveLength(1);
    expect(state.craftingBox.queue?.[0].name).toBe("Timber");
    expect(state.craftingBox.queue?.[0].readyAt).toEqual(timber1ReadyAt);
    expect(state.inventory.Wood).toEqual(new Decimal(9));
  });

  it("throws when cancelling a ready item", () => {
    const now = Date.now();
    const readyItemReadyAt = now - 1000;
    const inProgressReadyAt = now + 60000;

    expect(() =>
      cancelQueuedCrafting({
        state: {
          ...INITIAL_FARM,
          inventory: {
            "Beta Pass": new Decimal(1),
            Leather: new Decimal(0),
            Wool: new Decimal(0),
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
            "Doll Crafting Started": 2,
          },
          craftingBox: {
            status: "crafting",
            queue: [
              {
                name: "Doll",
                readyAt: readyItemReadyAt,
                startedAt: now - 10000,
                type: "collectible",
              },
              {
                name: "Doll",
                readyAt: inProgressReadyAt,
                startedAt: readyItemReadyAt,
                type: "collectible",
              },
            ],
            item: { collectible: "Doll" },
            startedAt: now - 10000,
            readyAt: readyItemReadyAt,
            recipes: {
              Doll: {
                name: "Doll",
                type: "collectible",
                ingredients: [
                  { collectible: "Leather" },
                  { collectible: "Wool" },
                  { collectible: "Leather" },
                  { collectible: "Wool" },
                  { collectible: "Wool" },
                  { collectible: "Wool" },
                  { collectible: "Leather" },
                  { collectible: "Wool" },
                  { collectible: "Leather" },
                ],
                time: 2 * 60 * 60 * 1000,
              },
            },
          },
        },
        action: {
          type: "crafting.cancelled",
          queueItem: {
            name: "Doll",
            readyAt: readyItemReadyAt,
            startedAt: now - 10000,
            type: "collectible",
          },
        },
        createdAt: now,
        farmId,
      }),
    ).toThrow("is already ready and cannot be cancelled");
  });

  it("cancels a queued item and refunds ingredients", () => {
    const now = Date.now();
    const doll1ReadyAt = now - 1000;
    const doll2ReadyAt = now + 60000;
    const doll3ReadyAt = now + 120000;

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
          "Beta Pass": new Decimal(1),
          Leather: new Decimal(0),
          Wool: new Decimal(0),
        },
        farmActivity: {
          "Doll Crafting Started": 3,
        },
        craftingBox: {
          status: "crafting",
          queue: [
            {
              name: "Doll",
              readyAt: doll1ReadyAt,
              startedAt: now - 10000,
              type: "collectible",
            },
            {
              name: "Doll",
              readyAt: doll2ReadyAt,
              startedAt: doll1ReadyAt,
              type: "collectible",
            },
            {
              name: "Doll",
              readyAt: doll3ReadyAt,
              startedAt: doll2ReadyAt,
              type: "collectible",
            },
          ],
          item: { collectible: "Doll" },
          startedAt: now - 10000,
          readyAt: doll1ReadyAt,
          recipes: {
            Doll: {
              name: "Doll",
              type: "collectible",
              ingredients: [
                { collectible: "Leather" },
                { collectible: "Wool" },
                { collectible: "Leather" },
                { collectible: "Wool" },
                { collectible: "Wool" },
                { collectible: "Wool" },
                { collectible: "Leather" },
                { collectible: "Wool" },
                { collectible: "Leather" },
              ],
              time: 2 * 60 * 60 * 1000,
            },
          },
        },
      },
      action: {
        type: "crafting.cancelled",
        queueItem: {
          name: "Doll",
          readyAt: doll3ReadyAt,
          startedAt: doll2ReadyAt,
          type: "collectible",
        },
      },
      createdAt: now,
      farmId,
    });

    expect(state.craftingBox.queue).toHaveLength(2);
    expect(state.craftingBox.queue?.[0].name).toBe("Doll");
    expect(state.craftingBox.queue?.[1].name).toBe("Doll");
    expect(state.inventory.Leather).toEqual(new Decimal(4));
    expect(state.inventory.Wool).toEqual(new Decimal(5));
    expect(state.farmActivity["Crafting Queue Cancelled"]).toBe(1);
    expect(state.farmActivity["Doll Crafting Started"]).toBe(2);
  });

  it("preserves correct readyAt for mixed recipe queue after cancel", () => {
    const now = Date.now();
    const farmId = 1;
    const dollReadyAt = now + 2 * 60 * 60 * 1000;
    const timberReadyAt = dollReadyAt;
    const basicBedReadyAt = timberReadyAt + 8 * 60 * 60 * 1000;

    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {
        Leather: new Decimal(20),
        Wool: new Decimal(25),
        Wood: new Decimal(27),
        Cushion: new Decimal(10),
        Timber: new Decimal(10),
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
      collectibles: {
        "Fox Shrine": [
          {
            id: "123",
            coordinates: { x: 0, y: 0 },
            createdAt: now,
            readyAt: now,
          },
        ],
      },
      farmActivity: {
        "Doll Crafting Started": 1,
        "Timber Crafting Started": 1,
        "Basic Bed Crafting Started": 1,
      },
      vip: { bundles: [], expiresAt: now + 86400000 },
      craftingBox: {
        status: "crafting",
        queue: [
          {
            name: "Doll",
            readyAt: dollReadyAt,
            startedAt: now,
            type: "collectible",
          },
          {
            name: "Timber",
            readyAt: timberReadyAt,
            startedAt: dollReadyAt,
            type: "collectible",
          },
          {
            name: "Basic Bed",
            readyAt: basicBedReadyAt,
            startedAt: timberReadyAt,
            type: "collectible",
          },
        ],
        item: { collectible: "Doll" },
        startedAt: now,
        readyAt: dollReadyAt,
        recipes: {
          Doll: { ...RECIPES.Doll },
          Timber: { ...RECIPES.Timber },
          "Basic Bed": { ...RECIPES["Basic Bed"] },
        },
      },
    };

    const queue = state.craftingBox.queue!;
    expect(queue).toHaveLength(3);
    expect(queue[0].name).toBe("Doll");
    expect(queue[1].name).toBe("Timber");
    expect(queue[2].name).toBe("Basic Bed");

    const basicBedToCancel = queue[2];
    const updatedQueue = [queue[0], queue[1]];
    const gameAfterDecrement = {
      ...state,
      farmActivity: {
        ...state.farmActivity,
        "Basic Bed Crafting Started":
          (state.farmActivity!["Basic Bed Crafting Started"] ?? 1) - 1,
      },
    };

    const expectedQueue = recalculateCraftingQueue({
      queue: updatedQueue,
      game: gameAfterDecrement,
      farmId,
    });

    const result = cancelQueuedCrafting({
      state,
      action: {
        type: "crafting.cancelled",
        queueItem: basicBedToCancel,
      },
      createdAt: now,
      farmId,
    });

    expect(result.craftingBox.queue).toHaveLength(2);
    expect(result.craftingBox.queue?.[0].name).toBe("Doll");
    expect(result.craftingBox.queue?.[1].name).toBe("Timber");
    expect(result.craftingBox.queue?.[0].readyAt).toEqual(
      expectedQueue[0].readyAt,
    );
    expect(result.craftingBox.queue?.[1].readyAt).toEqual(
      expectedQueue[1].readyAt,
    );
  });
});
