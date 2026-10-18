import { CONFIG } from "lib/config";
import {
  getCraftingBoxFreeAt,
  getCraftingQueueReadyAts,
  pauseCraftingQueue,
  resolveCraftingQueue,
  resolveCraftingQueueTimings,
} from "./craftingReadiness";
import { CRAFTING_BOOST_SPEED, getCraftingBoostWindows } from "./boostWindows";
import { getExpiryCooldown } from "./collectibleBuilt";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { CraftingQueueItem, GameState } from "features/game/types/game";

const HOUR = 60 * 60 * 1000;
const START = 1_000_000_000;

/** A farm with a Fox Shrine placed at `createdAt` (1.35x crafting speed). */
const withFoxShrine = (createdAt: number): GameState =>
  ({
    ...INITIAL_FARM,
    collectibles: {
      ...INITIAL_FARM.collectibles,
      "Fox Shrine": [
        { id: "1", coordinates: { x: 0, y: 0 }, createdAt, readyAt: createdAt },
      ],
    },
  }) as GameState;

/** A farm with a Time Warp Totem placed at `createdAt` (2x crafting speed). */
const withTotem = (createdAt: number): GameState =>
  ({
    ...INITIAL_FARM,
    collectibles: {
      ...INITIAL_FARM.collectibles,
      "Time Warp Totem": [
        { id: "1", coordinates: { x: 0, y: 0 }, createdAt, readyAt: createdAt },
      ],
    },
  }) as GameState;

const item = (
  overrides: Partial<CraftingQueueItem> & { readyAt: number },
): CraftingQueueItem =>
  ({
    id: "a",
    type: "collectible",
    name: "Cushion",
    ...overrides,
  }) as CraftingQueueItem;

describe("crafting readiness", () => {
  // Pins the flag ON rather than relying on `.env`: the windowed cooldowns
  // (Time Warp Totem 4h vs 2h) and boost contributions are flag-gated, so a
  // developer running with VITE_NETWORK=mainnet would otherwise see this fail.
  const originalNetwork = CONFIG.NETWORK;
  beforeEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "amoy";
  });
  afterEach(() => {
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
  });

  describe("resolveCraftingQueueTimings", () => {
    it("returns the stored readyAt for legacy items (no baseDurationMs)", () => {
      const queue = [
        item({ id: "a", startedAt: START, readyAt: START + 3 * HOUR }),
        item({
          id: "b",
          startedAt: START + 3 * HOUR,
          readyAt: START + 5 * HOUR,
        }),
      ];

      expect(getCraftingQueueReadyAts({ queue, game: INITIAL_FARM })).toEqual([
        START + 3 * HOUR,
        START + 5 * HOUR,
      ]);
    });

    it("is startedAt + baseDurationMs when no boost window is active", () => {
      const queue = [
        item({
          startedAt: START,
          baseDurationMs: 4 * HOUR,
          readyAt: START + 4 * HOUR,
        }),
      ];

      expect(getCraftingQueueReadyAts({ queue, game: INITIAL_FARM })).toEqual([
        START + 4 * HOUR,
      ]);
    });

    it("chains each queued craft off the previous craft's DERIVED readyAt", () => {
      const queue = [
        item({
          id: "a",
          startedAt: START,
          baseDurationMs: 4 * HOUR,
          readyAt: START + 4 * HOUR,
        }),
        // Queued behind the head, so it carries NO startedAt.
        item({ id: "b", baseDurationMs: 2 * HOUR, readyAt: START + 6 * HOUR }),
      ];

      // The totem halves both, so the tail lands at 2h + 1h.
      expect(
        getCraftingQueueReadyAts({ queue, game: withTotem(START) }),
      ).toEqual([START + 2 * HOUR, START + 3 * HOUR]);
    });

    it("pulls the WHOLE queue forward when a boost covers it", () => {
      const queue = [
        item({
          id: "a",
          startedAt: START,
          baseDurationMs: 2 * HOUR,
          readyAt: START + 2 * HOUR,
        }),
        item({ id: "b", baseDurationMs: 2 * HOUR, readyAt: START + 4 * HOUR }),
        item({ id: "c", baseDurationMs: 2 * HOUR, readyAt: START + 6 * HOUR }),
      ];

      expect(
        getCraftingQueueReadyAts({ queue, game: withTotem(START) }),
      ).toEqual([START + HOUR, START + 2 * HOUR, START + 3 * HOUR]);
    });

    it("credits only the overlap when the boost expires mid-queue", () => {
      const cooldown = getExpiryCooldown("Time Warp Totem", INITIAL_FARM);
      const game = withTotem(START);
      // One craft far longer than the totem's window.
      const queue = [
        item({
          startedAt: START,
          baseDurationMs: cooldown * 4,
          readyAt: START + cooldown * 4,
        }),
      ];

      // 2x for `cooldown`, so 2*cooldown of work is done inside the window; the
      // remaining 2*cooldown of work runs at 1x.
      const [readyAt] = getCraftingQueueReadyAts({ queue, game });
      expect(readyAt).toEqual(START + cooldown + cooldown * 2);
    });

    it("chains a windowed craft off a LEGACY craft ahead of it", () => {
      const queue = [
        item({ id: "a", startedAt: START, readyAt: START + 3 * HOUR }),
        item({ id: "b", baseDurationMs: 2 * HOUR, readyAt: START + 5 * HOUR }),
      ];

      expect(
        getCraftingQueueReadyAts({ queue, game: withTotem(START) }),
      ).toEqual([START + 3 * HOUR, START + 4 * HOUR]);
    });

    it("keeps the stored readyAt when startedAt is missing and nothing is ahead", () => {
      const queue = [
        item({ baseDurationMs: 2 * HOUR, readyAt: START + 2 * HOUR }),
      ];

      expect(
        getCraftingQueueReadyAts({ queue, game: withTotem(START) }),
      ).toEqual([START + 2 * HOUR]);
    });

    it("is a fixed point when the derived time is written back to the cache", () => {
      const game = withTotem(START);
      const queue = [
        item({
          id: "a",
          startedAt: START,
          baseDurationMs: 4 * HOUR,
          readyAt: START + 4 * HOUR,
        }),
        item({ id: "b", baseDurationMs: 2 * HOUR, readyAt: START + 6 * HOUR }),
      ];

      const first = getCraftingQueueReadyAts({ queue, game });
      const refreshed = queue.map((q, i) => ({ ...q, readyAt: first[i] }));

      expect(getCraftingQueueReadyAts({ queue: refreshed, game })).toEqual(
        first,
      );
    });

    it("does not back-date a craft anchored after an idle gap", () => {
      const queue = [
        // Finished long ago, never collected.
        item({ id: "a", startedAt: START, readyAt: START + HOUR }),
        // Queued hours later, so it is ANCHORED at its own start.
        item({
          id: "b",
          startedAt: START + 5 * HOUR,
          baseDurationMs: 2 * HOUR,
          readyAt: START + 7 * HOUR,
        }),
      ];

      expect(getCraftingQueueReadyAts({ queue, game: INITIAL_FARM })).toEqual([
        START + HOUR,
        START + 7 * HOUR,
      ]);
    });
  });

  describe("instant procs do not occupy the box", () => {
    it("a zero-baseDurationMs proc stays ready at its anchor and does not advance the cursor", () => {
      const queue = [
        item({
          id: "real-a",
          startedAt: START,
          baseDurationMs: 4 * HOUR,
          readyAt: START + 4 * HOUR,
        }),
        // Fox Shrine proc: queued at START, ready instantly, holds nothing.
        item({
          id: "proc",
          startedAt: START,
          baseDurationMs: 0,
          readyAt: START,
        }),
        // Must chain off real-a, NOT off the proc.
        item({
          id: "real-b",
          baseDurationMs: 2 * HOUR,
          readyAt: START + 6 * HOUR,
        }),
      ];

      const timings = resolveCraftingQueueTimings({ queue, windows: [] });

      expect(timings.map((t) => t.occupiesBox)).toEqual([true, false, true]);
      expect(timings[1].readyAt).toEqual(START);
      expect(timings[2].startedAt).toEqual(START + 4 * HOUR);
      expect(timings[2].readyAt).toEqual(START + 6 * HOUR);
    });

    it("a LEGACY proc (readyAt === startedAt) also does not advance the cursor", () => {
      const queue = [
        item({ id: "real-a", startedAt: START, readyAt: START + 4 * HOUR }),
        item({ id: "proc", startedAt: START, readyAt: START }),
        item({
          id: "real-b",
          baseDurationMs: 2 * HOUR,
          readyAt: START + 6 * HOUR,
        }),
      ];

      const timings = resolveCraftingQueueTimings({ queue, windows: [] });

      expect(timings.map((t) => t.occupiesBox)).toEqual([true, false, true]);
      expect(timings[2].startedAt).toEqual(START + 4 * HOUR);
    });

    it("getCraftingBoxFreeAt is undefined for a queue of only procs", () => {
      const queue = [
        item({ id: "p1", startedAt: START, baseDurationMs: 0, readyAt: START }),
        item({ id: "p2", startedAt: START, baseDurationMs: 0, readyAt: START }),
      ];

      expect(getCraftingBoxFreeAt({ queue, windows: [] })).toBeUndefined();
    });

    it("getCraftingBoxFreeAt is undefined for an empty queue", () => {
      expect(getCraftingBoxFreeAt({ queue: [], windows: [] })).toBeUndefined();
    });

    it("getCraftingBoxFreeAt matches the legacy Math.max fold on an all-legacy queue", () => {
      const queue = [
        item({ id: "a", startedAt: START, readyAt: START + 4 * HOUR }),
        item({
          id: "b",
          startedAt: START + 4 * HOUR,
          readyAt: START + 6 * HOUR,
        }),
      ];

      const legacyFold = queue.reduce(
        (latest, q) => Math.max(latest, q.readyAt),
        START,
      );

      expect(getCraftingBoxFreeAt({ queue, windows: [] })).toEqual(legacyFold);
    });
  });

  describe("CRAFTING_BOOST_SPEED", () => {
    it("matches the legacy multipliers the windows replace", () => {
      // The totems' 2x is the exact reciprocal of the legacy x0.5.
      expect(CRAFTING_BOOST_SPEED["Super Totem"]).toEqual(1 / 0.5);
      expect(CRAFTING_BOOST_SPEED["Time Warp Totem"]).toEqual(1 / 0.5);

      // Fox Shrine is DELIBERATELY not the reciprocal of its legacy x0.75 (1.333):
      // 1.35 is the house rate every windowed x0.75 boost shipped with, so a Fox
      // Shrine covering a whole craft is marginally faster than the old bake.
      expect(CRAFTING_BOOST_SPEED["Fox Shrine"]).toEqual(1.35);
      expect(CRAFTING_BOOST_SPEED["Fox Shrine"]).toBeGreaterThan(1 / 0.75);
    });

    it("getCraftingBoostWindows merges the two totems so they do not stack", () => {
      const game = {
        ...INITIAL_FARM,
        collectibles: {
          ...INITIAL_FARM.collectibles,
          "Time Warp Totem": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              createdAt: START,
              readyAt: START,
            },
          ],
          "Super Totem": [
            {
              id: "2",
              coordinates: { x: 1, y: 0 },
              createdAt: START,
              readyAt: START,
            },
          ],
        },
      } as GameState;

      const queue = [
        item({
          startedAt: START,
          baseDurationMs: 2 * HOUR,
          readyAt: START + 2 * HOUR,
        }),
      ];

      // 2x, not 4x.
      expect(
        resolveCraftingQueue({ queue, windows: getCraftingBoostWindows(game) }),
      ).toEqual([START + HOUR]);
    });
  });

  describe("pauseCraftingQueue", () => {
    it("banks work done before the lift and resumes from the placement", () => {
      const windows = getCraftingBoostWindows(withTotem(START));
      const queue = [
        item({
          startedAt: START,
          baseDurationMs: 4 * HOUR,
          readyAt: START + 2 * HOUR,
        }),
      ];

      // Lifted 1h in (2x => 2h of work banked), replaced 10h later, by which time
      // the totem has long expired.
      pauseCraftingQueue({
        queue,
        removedAt: START + HOUR,
        placedAt: START + 11 * HOUR,
        windows,
      });

      expect(queue[0].baseDurationMs).toEqual(2 * HOUR);
      expect(queue[0].startedAt).toEqual(START + 11 * HOUR);
      // 2h of work left at 1x.
      expect(queue[0].readyAt).toEqual(START + 13 * HOUR);
    });

    it("leaves a chained craft chained across the lift", () => {
      const queue = [
        item({
          id: "a",
          startedAt: START,
          baseDurationMs: 4 * HOUR,
          readyAt: START + 4 * HOUR,
        }),
        item({ id: "b", baseDurationMs: 2 * HOUR, readyAt: START + 6 * HOUR }),
      ];

      pauseCraftingQueue({
        queue,
        removedAt: START + HOUR,
        placedAt: START + 3 * HOUR,
        windows: [],
      });

      // The head banked 1h and re-anchors; the tail had done no work, so it stays
      // chained and tracks whatever the head derives to.
      expect(queue[0].baseDurationMs).toEqual(3 * HOUR);
      expect(queue[0].startedAt).toEqual(START + 3 * HOUR);
      expect(queue[1].startedAt).toBeUndefined();
      expect(queue[1].baseDurationMs).toEqual(2 * HOUR);
      expect(queue[1].readyAt).toEqual(START + 8 * HOUR);
    });

    it("leaves an instant proc completely untouched", () => {
      const queue = [
        item({
          id: "proc",
          startedAt: START,
          baseDurationMs: 0,
          readyAt: START,
        }),
      ];

      pauseCraftingQueue({
        queue,
        removedAt: START + HOUR,
        placedAt: START + 3 * HOUR,
        windows: [],
      });

      expect(queue[0].startedAt).toEqual(START);
      expect(queue[0].readyAt).toEqual(START);
      expect(queue[0].baseDurationMs).toEqual(0);
    });

    it("shifts BOTH timestamps for legacy items, exactly as the old pause did", () => {
      const queue = [
        item({ id: "a", startedAt: START, readyAt: START + 4 * HOUR }),
        item({
          id: "b",
          startedAt: START + 4 * HOUR,
          readyAt: START + 6 * HOUR,
        }),
      ];

      const removedAt = START + HOUR;
      const placedAt = START + 3 * HOUR;
      const downtime = placedAt - removedAt;

      pauseCraftingQueue({ queue, removedAt, placedAt, windows: [] });

      expect(queue[0].startedAt).toEqual(START + downtime);
      expect(queue[0].readyAt).toEqual(START + 4 * HOUR + downtime);
      expect(queue[1].startedAt).toEqual(START + 4 * HOUR + downtime);
      expect(queue[1].readyAt).toEqual(START + 6 * HOUR + downtime);
    });

    it("does not double-credit a windowed craft behind a completed legacy one", () => {
      const windows = getCraftingBoostWindows(withFoxShrine(START));
      const queue = [
        // Legacy, already finished before the lift.
        item({ id: "a", startedAt: START, readyAt: START + HOUR }),
        item({ id: "b", baseDurationMs: 2 * HOUR, readyAt: START + 3 * HOUR }),
      ];

      pauseCraftingQueue({
        queue,
        removedAt: START + 2 * HOUR,
        placedAt: START + 4 * HOUR,
        windows,
      });

      // `b` chained off a legacy readyAt in the past, so it HAD begun and banked
      // work - it must re-anchor rather than re-accrue that work after placement.
      expect(queue[1].startedAt).toEqual(START + 4 * HOUR);
      expect(queue[1].baseDurationMs).toBeLessThan(2 * HOUR);
    });
  });
});
