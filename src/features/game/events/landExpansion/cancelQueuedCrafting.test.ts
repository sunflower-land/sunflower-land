import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { RECIPES } from "features/game/lib/crafting";
import {
  cancelQueuedCrafting,
  recalculateCraftingQueue,
} from "./cancelQueuedCrafting";
import type { CraftingQueueItem, GameState } from "features/game/types/game";

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
          queueItemId: "nonexistent",
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
                id: "timber-1",
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
          queueItemId: "nonexistent",
        },
        createdAt: now,
      }),
    ).toThrow("Item does not exist in queue");
  });

  it("throws an error if the item is currently being crafted", () => {
    const now = Date.now();
    const timberReadyAt = now + 60000;
    const queueItem: CraftingQueueItem = {
      id: "timber-in-progress",
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
          queueItemId: queueItem.id,
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
              id: "doll-1",
              name: "Doll",
              readyAt: inProgressReadyAt,
              startedAt: now,
              type: "collectible",
            },
            {
              id: "timber-pending",
              name: "Timber",
              readyAt: pendingReadyAt,
              startedAt: inProgressReadyAt,
              type: "collectible",
            },
            {
              id: "timber-instant-1",
              name: "Timber",
              readyAt: instant1ReadyAt,
              startedAt: instant1ReadyAt,
              type: "collectible",
            },
            {
              id: "timber-instant-2",
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
        queueItemId: "timber-pending",
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
              id: "timber-1",
              name: "Timber",
              readyAt: timber1ReadyAt,
              startedAt: now,
              type: "collectible",
            },
            {
              id: "timber-2",
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
        queueItemId: "timber-2",
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
                id: "doll-ready",
                name: "Doll",
                readyAt: readyItemReadyAt,
                startedAt: now - 10000,
                type: "collectible",
              },
              {
                id: "doll-in-progress",
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
          queueItemId: "doll-ready",
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
              id: "doll-1",
              name: "Doll",
              readyAt: doll1ReadyAt,
              startedAt: now - 10000,
              type: "collectible",
            },
            {
              id: "doll-2",
              name: "Doll",
              readyAt: doll2ReadyAt,
              startedAt: doll1ReadyAt,
              type: "collectible",
            },
            {
              id: "doll-3",
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
        queueItemId: "doll-3",
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
          {
            id: "basic-bed-1",
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
    });

    const result = cancelQueuedCrafting({
      state,
      action: {
        type: "crafting.cancelled",
        queueItemId: basicBedToCancel.id,
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

  // Bug #2: cancelling a later queued item must not re-derive the currently
  // crafting item's time from the *current* boost state. The duration is locked
  // in when the item is queued.
  it("keeps the in-progress item's locked readyAt when a later item is cancelled", () => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    // Doll's base recipe time is 2h, but this item was queued while a crafting
    // speed boost was active, so its locked duration is only 1h.
    const dollReadyAt = now + hour;
    const doll2ReadyAt = dollReadyAt + 2 * hour;

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
        inventory: { Leather: new Decimal(0), Wool: new Decimal(0) },
        farmActivity: { "Doll Crafting Started": 2 },
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
              id: "doll-2",
              name: "Doll",
              readyAt: doll2ReadyAt,
              startedAt: dollReadyAt,
              type: "collectible",
            },
          ],
          recipes: { Doll: { ...RECIPES.Doll } },
        },
      },
      action: { type: "crafting.cancelled", queueItemId: "doll-2" },
      createdAt: now,
      farmId,
    });

    expect(state.craftingBox.queue).toHaveLength(1);
    expect(state.craftingBox.queue?.[0].id).toBe("doll-1");
    // Must stay at the locked 1h, not be recomputed to the full 2h recipe time.
    expect(state.craftingBox.queue?.[0].readyAt).toEqual(dollReadyAt);
  });

  // Bug #4: the "currently being crafted" guard must compare by id, not readyAt.
  it("cancels a later pending item that shares a readyAt with the in-progress item", () => {
    const now = Date.now();
    const sharedReadyAt = now + 60 * 60 * 1000;
    // doll-current is actively crafting (ready in 1h). doll-pending is an
    // instant item queued behind it, so it becomes ready exactly when the
    // current craft finishes — the two share a readyAt. Cancelling the pending
    // item must be allowed.
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
        inventory: { Leather: new Decimal(0), Wool: new Decimal(0) },
        farmActivity: { "Doll Crafting Started": 2 },
        craftingBox: {
          status: "crafting",
          queue: [
            {
              id: "doll-current",
              name: "Doll",
              readyAt: sharedReadyAt,
              startedAt: now,
              type: "collectible",
            },
            {
              id: "doll-pending",
              name: "Doll",
              readyAt: sharedReadyAt,
              startedAt: sharedReadyAt,
              type: "collectible",
            },
          ],
          recipes: { Doll: { ...RECIPES.Doll } },
        },
      },
      action: { type: "crafting.cancelled", queueItemId: "doll-pending" },
      createdAt: now,
      farmId,
    });

    expect(state.craftingBox.queue).toHaveLength(1);
    expect(state.craftingBox.queue?.[0].id).toBe("doll-current");
  });

  // Bug #3: recalculating must not re-derive crafting time (which on the buggy
  // path re-rolls the Fox Shrine prng). An item that rolled the instant proc
  // when queued has a locked (zero) duration and must stay instant, even though
  // its recipe time is 2h.
  it("does not resurrect a Fox Shrine instant item's time when recalculating", () => {
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;
    const instantReadyAt = now; // this Doll rolled the Fox Shrine instant proc

    const result = recalculateCraftingQueue({
      queue: [
        {
          id: "doll-in-progress",
          name: "Doll",
          readyAt: now + twoHours,
          startedAt: now,
          type: "collectible",
        },
        {
          id: "doll-instant",
          name: "Doll",
          readyAt: instantReadyAt,
          startedAt: instantReadyAt,
          type: "collectible",
        },
      ],
      game: {
        ...INITIAL_FARM,
        farmActivity: { "Doll Crafting Started": 2 },
        craftingBox: {
          status: "crafting",
          queue: [],
          recipes: { Doll: { ...RECIPES.Doll } },
        },
      },
    });

    // Locked (zero) duration is kept instead of being recomputed from the recipe.
    expect(result[1].readyAt).toEqual(instantReadyAt);
  });

  // Review finding: an instant Fox Shrine proc is "ready" out of order (its
  // readyAt is in the past while a longer craft ahead of it is still going). A
  // later real craft must chain off when the box is actually free, NOT off the
  // instant proc's stale readyAt (which would discount it).
  it("does not discount a later craft chained behind an instant proc when an item is cancelled", () => {
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000;

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
        inventory: { Leather: new Decimal(0), Wool: new Decimal(0) },
        farmActivity: { "Doll Crafting Started": 4 },
        craftingBox: {
          status: "crafting",
          queue: [
            {
              id: "doll-1",
              name: "Doll",
              startedAt: now,
              readyAt: now + twoHours,
              type: "collectible",
            },
            {
              id: "doll-instant",
              name: "Doll",
              startedAt: now,
              readyAt: now,
              type: "collectible",
            },
            {
              id: "doll-2",
              name: "Doll",
              startedAt: now + twoHours,
              readyAt: now + 2 * twoHours,
              type: "collectible",
            },
            {
              id: "doll-3",
              name: "Doll",
              startedAt: now + 2 * twoHours,
              readyAt: now + 3 * twoHours,
              type: "collectible",
            },
          ],
          recipes: { Doll: { ...RECIPES.Doll } },
        },
      },
      action: { type: "crafting.cancelled", queueItemId: "doll-2" },
      createdAt: now,
      farmId,
    });

    const queue = state.craftingBox.queue!;
    const instant = queue.find((q) => q.id === "doll-instant");
    const doll3 = queue.find((q) => q.id === "doll-3");
    // Instant proc stays ready; doll-3 starts when doll-1 finishes (now+2h) and
    // takes its full 2h -> now+4h, NOT now+2h chained off the instant.
    expect(instant?.readyAt).toEqual(now);
    expect(doll3?.readyAt).toEqual(now + 2 * twoHours);
  });

  // Review finding: an in-progress craft must not be dragged earlier by an
  // already-ready instant proc sitting in front of it in the queue.
  it("does not move an in-progress craft earlier than an instant proc queued before it", () => {
    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const twoHours = 2 * hour;

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
        inventory: { Leather: new Decimal(0), Wool: new Decimal(0) },
        farmActivity: { "Doll Crafting Started": 3 },
        craftingBox: {
          status: "crafting",
          queue: [
            {
              id: "doll-instant",
              name: "Doll",
              startedAt: now - hour,
              readyAt: now - hour,
              type: "collectible",
            },
            {
              id: "doll-1",
              name: "Doll",
              startedAt: now,
              readyAt: now + twoHours,
              type: "collectible",
            },
            {
              id: "doll-2",
              name: "Doll",
              startedAt: now + twoHours,
              readyAt: now + 2 * twoHours,
              type: "collectible",
            },
          ],
          recipes: { Doll: { ...RECIPES.Doll } },
        },
      },
      action: { type: "crafting.cancelled", queueItemId: "doll-2" },
      createdAt: now,
      farmId,
    });

    const doll1 = state.craftingBox.queue!.find((q) => q.id === "doll-1");
    // doll-1 is actively crafting; cancelling a later item must not pull it
    // earlier by chaining off the instant proc's past readyAt.
    expect(doll1?.readyAt).toEqual(now + twoHours);
  });
});
