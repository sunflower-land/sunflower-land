import { CONFIG } from "lib/config";
import { INITIAL_FARM } from "features/game/lib/constants";
import { collectCrafting } from "./collectCrafting";
import Decimal from "decimal.js-light";
import type { CraftingQueueItem, GameState } from "features/game/types/game";
import { getCraftingQueueReadyAts } from "features/game/lib/craftingReadiness";

describe("collectCrafting", () => {
  // These tests assert the LEGACY discount-at-start timing (every boost is baked
  // into readyAt when the craft is queued). FE jest runs on amoy where
  // SPEED_BOOSTS is on, so force the flag off here; the windowed model is covered
  // in its own describe.
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  it("throws when queue is empty", () => {
    expect(() =>
      collectCrafting({
        state: {
          ...INITIAL_FARM,
          buildings: {
            ...INITIAL_FARM.buildings,
            "Crafting Box": [
              {
                id: "1",
                createdAt: 0,
                readyAt: 0,
                coordinates: { x: 0, y: 0 },
              },
            ],
          },
          craftingBox: {
            status: "crafting",
            recipes: {},
          },
        },
        action: { type: "crafting.collected" },
      }),
    ).toThrow("No item to collect");
  });

  it("throws when the crafting box is not placed", () => {
    // A lifted box keeps crafting until it is placed back down, where the pause is
    // applied. Collecting from one in the inventory would skip it.
    const now = Date.now();
    expect(() =>
      collectCrafting({
        state: {
          ...INITIAL_FARM,
          buildings: {
            ...INITIAL_FARM.buildings,
            "Crafting Box": [
              { id: "1", createdAt: 0, readyAt: 0, removedAt: now - 1000 },
            ],
          },
          craftingBox: {
            status: "crafting",
            recipes: {},
            queue: [
              {
                id: "timber-1",
                name: "Timber",
                readyAt: now - 1000,
                startedAt: now - 10000,
                type: "collectible",
              },
            ],
          },
        },
        action: { type: "crafting.collected" },
        createdAt: now,
      }),
    ).toThrow("Crafting Box is not placed");
  });

  describe("queue", () => {
    it("collects all ready items from the queue", () => {
      const now = Date.now();
      const state = collectCrafting({
        state: {
          ...INITIAL_FARM,
          buildings: {
            ...INITIAL_FARM.buildings,
            "Crafting Box": [
              {
                id: "1",
                createdAt: 0,
                readyAt: 0,
                coordinates: { x: 0, y: 0 },
              },
            ],
          },
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
          buildings: {
            ...INITIAL_FARM.buildings,
            "Crafting Box": [
              {
                id: "1",
                createdAt: 0,
                readyAt: 0,
                coordinates: { x: 0, y: 0 },
              },
            ],
          },
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
            buildings: {
              ...INITIAL_FARM.buildings,
              "Crafting Box": [
                {
                  id: "1",
                  createdAt: 0,
                  readyAt: 0,
                  coordinates: { x: 0, y: 0 },
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

describe("collectCrafting — SPEED_BOOSTS", () => {
  // Pins the flag ON rather than relying on `.env`: a developer running with
  // VITE_NETWORK=mainnet would otherwise see this whole describe fail.
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  const HOUR = 60 * 60 * 1000;

  const craft = (
    overrides: Partial<CraftingQueueItem> & { id: string; readyAt: number },
  ) =>
    ({
      type: "collectible",
      name: "Doll",
      ...overrides,
    }) as CraftingQueueItem;

  const stateWith = (
    queue: CraftingQueueItem[],
    collectibles: GameState["collectibles"] = {},
  ): GameState =>
    ({
      ...INITIAL_FARM,
      collectibles: { ...INITIAL_FARM.collectibles, ...collectibles },
      buildings: {
        "Crafting Box": [
          { id: "123", coordinates: { x: 0, y: 0 }, createdAt: 0, readyAt: 0 },
        ],
      },
      craftingBox: { status: "crafting", queue, recipes: {} },
    }) as GameState;

  const withTotem = (createdAt: number): GameState["collectibles"] => ({
    "Time Warp Totem": [
      { id: "t", coordinates: { x: 5, y: 5 }, createdAt, readyAt: createdAt },
    ],
  });

  it("collects a craft the windows have finished but the cache has not", () => {
    const now = Date.now();
    const queue = [
      craft({
        id: "a",
        startedAt: now - 4 * HOUR,
        baseDurationMs: 4 * HOUR,
        readyAt: now + 2 * HOUR,
      }),
    ];

    const result = collectCrafting({
      state: stateWith(queue, withTotem(now - 4 * HOUR)),
      action: { type: "crafting.collected" },
      createdAt: now,
    });

    expect(result.craftingBox.queue).toEqual([]);
    expect(result.inventory.Doll?.toNumber()).toEqual(1);
  });

  it("collects MULTIPLE ready crafts and anchors the survivor", () => {
    const now = Date.now();
    const queue = [
      craft({
        id: "a",
        startedAt: now - 6 * HOUR,
        baseDurationMs: 2 * HOUR,
        readyAt: now - 4 * HOUR,
      }),
      craft({ id: "b", baseDurationMs: 2 * HOUR, readyAt: now - 2 * HOUR }),
      craft({ id: "c", baseDurationMs: 4 * HOUR, readyAt: now + 2 * HOUR }),
    ];

    const result = collectCrafting({
      state: stateWith(queue),
      action: { type: "crafting.collected" },
      createdAt: now,
    });

    const survivors = result.craftingBox.queue ?? [];
    expect(survivors.map((q) => q.id)).toEqual(["c"]);
    // `c` was chained to `b`; with `b` gone it keeps the start the chain derived
    // for it, so no progress is invented or lost.
    expect(survivors[0].startedAt).toEqual(now - 2 * HOUR);
    expect(survivors[0].readyAt).toEqual(now + 2 * HOUR);
  });

  it("anchors the survivor to the last REAL craft, not to a proc ahead of it", () => {
    const now = Date.now();
    const queue = [
      // Finished 2h ago - this is what actually freed the box.
      craft({
        id: "a",
        startedAt: now - 6 * HOUR,
        baseDurationMs: 4 * HOUR,
        readyAt: now - 2 * HOUR,
      }),
      // A Fox Shrine proc that never held the box, ready long before that.
      craft({
        id: "proc",
        startedAt: now - 6 * HOUR,
        baseDurationMs: 0,
        readyAt: now - 6 * HOUR,
      }),
      craft({ id: "c", baseDurationMs: 4 * HOUR, readyAt: now + 2 * HOUR }),
    ];

    const result = collectCrafting({
      state: stateWith(queue),
      action: { type: "crafting.collected" },
      createdAt: now,
    });

    const survivors = result.craftingBox.queue ?? [];
    expect(survivors.map((q) => q.id)).toEqual(["c"]);
    // Cooking would stamp the PREVIOUS entry's ready time here, which is the
    // proc's - 4h too early, handing `c` free progress.
    expect(survivors[0].startedAt).toEqual(now - 2 * HOUR);
    expect(survivors[0].readyAt).toEqual(now + 2 * HOUR);
  });

  it("does not let a collected craft's successor jump backwards", () => {
    const now = Date.now();
    const queue = [
      craft({
        id: "a",
        startedAt: now - 4 * HOUR,
        baseDurationMs: 2 * HOUR,
        readyAt: now - 2 * HOUR,
      }),
      craft({ id: "b", baseDurationMs: 4 * HOUR, readyAt: now + 2 * HOUR }),
    ];

    const collected = collectCrafting({
      state: stateWith(queue),
      action: { type: "crafting.collected" },
      createdAt: now,
    });

    const before = getCraftingQueueReadyAts({
      queue: collected.craftingBox.queue ?? [],
      game: collected,
    });

    // A totem placed after the collect must accelerate the remainder, not
    // re-apply itself to work already banked.
    const boosted = {
      ...collected,
      collectibles: { ...collected.collectibles, ...withTotem(now) },
    } as GameState;

    const after = getCraftingQueueReadyAts({
      queue: boosted.craftingBox.queue ?? [],
      game: boosted,
    });

    expect(before[0]).toEqual(now + 2 * HOUR);
    // 2h of work left, halved: 1h - not instant, and not before `now`.
    expect(after[0]).toEqual(now + HOUR);
    expect(after[0]).toBeGreaterThan(now);
  });
});
