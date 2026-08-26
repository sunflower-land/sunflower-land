import { getCookingQueueReadyAts } from "./cookingReadiness";
import { COOKING_BOOST_SPEED } from "./boostWindows";
import { getExpiryCooldown } from "./collectibleBuilt";
import { TEST_FARM } from "./constants";
import type { BuildingProduct, GameState } from "../types/game";

const HOUR = 60 * 60 * 1000;
const START = 1_000_000_000;

/** A farm with a Gourmet Hourglass placed at `createdAt` (2x cooking speed). */
const withHourglass = (createdAt: number): GameState =>
  ({
    ...TEST_FARM,
    collectibles: {
      ...TEST_FARM.collectibles,
      "Gourmet Hourglass": [
        { id: "1", coordinates: { x: 0, y: 0 }, createdAt, readyAt: createdAt },
      ],
    },
  }) as GameState;

describe("getCookingQueueReadyAts", () => {
  it("returns the stored readyAt for legacy recipes (no baseDurationMs)", () => {
    const crafting: BuildingProduct[] = [
      { name: "Boiled Eggs", readyAt: START + 3 * HOUR },
      { name: "Mashed Potato", readyAt: START + 5 * HOUR },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 3 * HOUR,
      START + 5 * HOUR,
    ]);
  });

  it("is startedAt + baseDurationMs when no boost window is active", () => {
    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 4 * HOUR,
    ]);
  });

  it("chains each queued recipe off the previous recipe's DERIVED readyAt", () => {
    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
      {
        name: "Mashed Potato",
        // Queued behind the head, so it carries NO startedAt - its start IS the
        // previous recipe's ready time, whatever that turns out to be.
        baseDurationMs: 2 * HOUR,
        readyAt: START + 6 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 4 * HOUR,
      START + 6 * HOUR,
    ]);
  });

  it("pulls the WHOLE queue forward when a boost covers it", () => {
    const game = withHourglass(START);
    // Sanity: the hourglass must outlast the whole (boosted) queue.
    expect(getExpiryCooldown("Gourmet Hourglass", game)).toBeGreaterThan(
      3 * HOUR,
    );

    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
      {
        name: "Mashed Potato",
        baseDurationMs: 2 * HOUR,
        readyAt: START + 6 * HOUR,
      },
    ];

    // 4h of work at 2x -> ready in 2h; the queued 2h of work at 2x -> +1h.
    expect(getCookingQueueReadyAts({ crafting, game })).toEqual([
      START + 2 * HOUR,
      START + 3 * HOUR,
    ]);
  });

  it("credits only the overlap when the boost expires mid-queue", () => {
    const cooldown = getExpiryCooldown("Gourmet Hourglass", TEST_FARM);
    // Hourglass placed 1h before the cook starts, so only its tail overlaps.
    const game = withHourglass(START - cooldown + 1 * HOUR);

    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
    ];

    // 1h boosted at 2x = 2h of work done; remaining 2h of work at 1x.
    expect(getCookingQueueReadyAts({ crafting, game })).toEqual([
      START + 3 * HOUR,
    ]);
  });

  it("chains a windowed recipe off a LEGACY recipe ahead of it", () => {
    const crafting: BuildingProduct[] = [
      { name: "Boiled Eggs", readyAt: START + 3 * HOUR },
      {
        name: "Mashed Potato",
        baseDurationMs: 2 * HOUR,
        readyAt: START + 5 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 3 * HOUR,
      START + 5 * HOUR,
    ]);
  });

  it("falls back to readyAt - baseDurationMs when startedAt is missing", () => {
    const crafting: BuildingProduct[] = [
      {
        name: "Boiled Eggs",
        baseDurationMs: 4 * HOUR,
        readyAt: START + 4 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 4 * HOUR,
    ]);
  });

  it("keeps an already-ready uncollected recipe as the anchor for the queue", () => {
    const crafting: BuildingProduct[] = [
      // Finished an hour ago, still sitting uncollected at the head.
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 1 * HOUR,
        readyAt: START + 1 * HOUR,
      },
      {
        name: "Mashed Potato",
        baseDurationMs: 2 * HOUR,
        readyAt: START + 3 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 1 * HOUR,
      START + 3 * HOUR,
    ]);
  });

  // A recipe cooked after the building sat IDLE anchors on its own start, not on
  // when the previous recipe finished - otherwise the idle gap is credited as
  // progress and the recipe is born part-cooked.
  it("does not back-date a recipe cooked after an idle gap", () => {
    const crafting: BuildingProduct[] = [
      // Finished an hour ago and was collected... but a ready recipe left sitting
      // uncollected keeps the same shape.
      {
        name: "Boiled Eggs",
        startedAt: START,
        baseDurationMs: 1 * HOUR,
        readyAt: START + 1 * HOUR,
      },
      // Cooked an hour AFTER that one finished, with the building idle in between.
      {
        name: "Mashed Potato",
        startedAt: START + 2 * HOUR,
        baseDurationMs: 1 * HOUR,
        readyAt: START + 3 * HOUR,
      },
    ];

    expect(getCookingQueueReadyAts({ crafting, game: TEST_FARM })).toEqual([
      START + 1 * HOUR,
      START + 3 * HOUR,
    ]);
  });

  it("returns an empty array for an empty queue", () => {
    expect(getCookingQueueReadyAts({ crafting: [], game: TEST_FARM })).toEqual(
      [],
    );
  });
});

describe("COOKING_BOOST_SPEED", () => {
  it("mirrors the legacy multipliers as their reciprocal speeds", () => {
    // x0.5 cook time == 2x speed; Boar Shrine's x0.8 == 1.25x.
    expect(COOKING_BOOST_SPEED["Gourmet Hourglass"]).toEqual(2);
    expect(COOKING_BOOST_SPEED["Super Totem"]).toEqual(2);
    expect(COOKING_BOOST_SPEED["Time Warp Totem"]).toEqual(2);
    expect(COOKING_BOOST_SPEED["Legendary Shrine"]).toEqual(2);
    expect(COOKING_BOOST_SPEED["Boar Shrine"]).toEqual(1.25);
  });
});
