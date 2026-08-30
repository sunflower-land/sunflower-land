import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import {
  getCollectibleExpiry,
  getExpiryCooldown,
  type TotemName,
} from "features/game/lib/collectibleBuilt";
import {
  computeReadyAt,
  getCropPlotBoostWindows,
  getMergedTotemWindows,
} from "features/game/lib/boostWindows";
import { extendCollectible } from "./extendCollectible";

describe("extendCollectible", () => {
  const now = Date.now();

  const farmWithHourglass = (
    createdAt: number,
    spares = 1,
    extendedMs?: number,
  ) => ({
    ...TEST_FARM,
    inventory: {
      ...TEST_FARM.inventory,
      // One placed + `spares` in the chest
      "Harvest Hourglass": new Decimal(1 + spares),
    },
    collectibles: {
      "Harvest Hourglass": [
        {
          id: "1",
          coordinates: { x: 0, y: 0 },
          createdAt,
          extendedMs,
        },
      ],
    },
  });

  const extend = (state: Parameters<typeof extendCollectible>[0]["state"]) =>
    extendCollectible({
      state,
      action: {
        type: "collectible.extended",
        name: "Harvest Hourglass",
        location: "farm",
        id: "1",
      },
      createdAt: now,
    });

  it("adds one full duration and burns a spare copy", () => {
    const state = extend(farmWithHourglass(now));

    expect(state.collectibles["Harvest Hourglass"]?.[0].extendedMs).toBe(
      getExpiryCooldown("Harvest Hourglass", TEST_FARM),
    );
    expect(state.inventory["Harvest Hourglass"]).toEqual(new Decimal(1));
  });

  it("does not shift createdAt, so time already served is kept", () => {
    const createdAt = now - 60 * 60 * 1000;
    const state = extend(farmWithHourglass(createdAt));

    expect(state.collectibles["Harvest Hourglass"]?.[0].createdAt).toBe(
      createdAt,
    );
  });

  it("stacks uncapped across repeated extensions", () => {
    const cooldown = getExpiryCooldown("Harvest Hourglass", TEST_FARM);
    const state = extend(extend(farmWithHourglass(now, 2)));

    expect(state.collectibles["Harvest Hourglass"]?.[0].extendedMs).toBe(
      cooldown * 2,
    );
    expect(state.inventory["Harvest Hourglass"]).toEqual(new Decimal(1));
  });

  it("lengthens the boost window rather than opening a second one", () => {
    const cooldown = getExpiryCooldown("Harvest Hourglass", TEST_FARM);
    const state = extend(farmWithHourglass(now));

    const windows = getCropPlotBoostWindows(state).filter(
      (window) => window.from === now,
    );

    expect(windows).toHaveLength(1);
    expect(windows[0].to).toBe(now + cooldown * 2);
  });

  it("cannot be paid for with the placed copy itself", () => {
    expect(() => extend(farmWithHourglass(now, 0))).toThrow(
      "Insufficient ingredient: Harvest Hourglass",
    );
  });

  it("cannot extend an expired collectible", () => {
    const cooldown = getExpiryCooldown("Harvest Hourglass", TEST_FARM);

    expect(() => extend(farmWithHourglass(now - cooldown))).toThrow(
      "Collectible has expired",
    );
  });

  it("can extend a collectible kept alive by an earlier extension", () => {
    const cooldown = getExpiryCooldown("Harvest Hourglass", TEST_FARM);
    const state = extend(farmWithHourglass(now - cooldown, 1, cooldown));

    expect(state.collectibles["Harvest Hourglass"]?.[0].extendedMs).toBe(
      cooldown * 2,
    );
  });

  it("cannot extend a collectible that is not placed", () => {
    expect(() =>
      extend({
        ...farmWithHourglass(now),
        // Lifted into the chest: the record survives without coordinates.
        collectibles: {
          "Harvest Hourglass": [{ id: "1", createdAt: now }],
        },
      }),
    ).toThrow("Collectible is not placed");
  });

  it("is gated behind the SPEED_BOOSTS flag", () => {
    const originalNetwork = CONFIG.NETWORK;
    (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";

    try {
      expect(() =>
        extend({
          ...farmWithHourglass(now),
          username: "not-a-team-member",
        }),
      ).toThrow("Collectible cannot be extended");
    } finally {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = originalNetwork;
    }
  });

  it("cannot extend an unknown collectible", () => {
    expect(() =>
      extendCollectible({
        state: farmWithHourglass(now),
        action: {
          type: "collectible.extended",
          name: "Harvest Hourglass",
          location: "farm",
          id: "2",
        },
        createdAt: now,
      }),
    ).toThrow("Collectible does not exist");
  });

  it("charges a shrine its craft ingredients", () => {
    const state = extendCollectible({
      state: {
        ...TEST_FARM,
        inventory: {
          ...TEST_FARM.inventory,
          Acorn: new Decimal(20),
          "Wild Grass": new Decimal(20),
          Ruffroot: new Decimal(20),
        },
        collectibles: {
          "Sparrow Shrine": [
            { id: "1", coordinates: { x: 0, y: 0 }, createdAt: now },
          ],
        },
      },
      action: {
        type: "collectible.extended",
        name: "Sparrow Shrine",
        location: "farm",
        id: "1",
      },
      createdAt: now,
    });

    expect(state.collectibles["Sparrow Shrine"]?.[0].extendedMs).toBe(
      getExpiryCooldown("Sparrow Shrine", TEST_FARM),
    );
    expect(state.inventory.Acorn).toEqual(new Decimal(5));
    expect(state.inventory["Wild Grass"]).toEqual(new Decimal(10));
    expect(state.inventory.Ruffroot).toEqual(new Decimal(10));
  });

  it("cannot extend a shrine without the ingredients", () => {
    expect(() =>
      extendCollectible({
        state: {
          ...TEST_FARM,
          inventory: { ...TEST_FARM.inventory, Acorn: new Decimal(1) },
          collectibles: {
            "Sparrow Shrine": [
              { id: "1", coordinates: { x: 0, y: 0 }, createdAt: now },
            ],
          },
        },
        action: {
          type: "collectible.extended",
          name: "Sparrow Shrine",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Insufficient ingredient: Acorn");
  });
  // Golden durations, deliberately hardcoded: these are the agreed cross-extension
  // amounts, so a change to either totem's cooldown should fail loudly here.
  describe("totems", () => {
    const FOUR_HOURS = 4 * 60 * 60 * 1000; // Time Warp Totem, under SPEED_BOOSTS
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // Super Totem

    const totemFarm = ({
      placed,
      placedAt = now,
      superSpares = 0,
      warpSpares = 0,
    }: {
      placed: TotemName;
      placedAt?: number;
      superSpares?: number;
      warpSpares?: number;
    }) => ({
      ...TEST_FARM,
      inventory: {
        ...TEST_FARM.inventory,
        "Super Totem": new Decimal(
          superSpares + (placed === "Super Totem" ? 1 : 0),
        ),
        "Time Warp Totem": new Decimal(
          warpSpares + (placed === "Time Warp Totem" ? 1 : 0),
        ),
      },
      collectibles: {
        [placed]: [
          { id: "1", coordinates: { x: 0, y: 0 }, createdAt: placedAt },
        ],
      },
    });

    const extendTotem = (
      state: GameState,
      name: TotemName,
      payWith: TotemName,
    ) =>
      extendCollectible({
        state,
        action: {
          type: "collectible.extended",
          name,
          location: "farm",
          id: "1",
          payWith,
        },
        createdAt: now,
      });

    it("extends a Time Warp Totem with a spare Time Warp Totem", () => {
      const state = extendTotem(
        totemFarm({ placed: "Time Warp Totem", warpSpares: 1 }),
        "Time Warp Totem",
        "Time Warp Totem",
      );

      expect(state.collectibles["Time Warp Totem"]?.[0].extendedMs).toBe(
        FOUR_HOURS,
      );
      expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(1));
    });

    it("extends a Super Totem with a spare Super Totem", () => {
      const state = extendTotem(
        totemFarm({ placed: "Super Totem", superSpares: 1 }),
        "Super Totem",
        "Super Totem",
      );

      expect(state.collectibles["Super Totem"]?.[0].extendedMs).toBe(
        SEVEN_DAYS,
      );
    });

    it("adds only the Time Warp Totem's hours when spent on a Super Totem", () => {
      const state = extendTotem(
        totemFarm({ placed: "Super Totem", warpSpares: 1 }),
        "Super Totem",
        "Time Warp Totem",
      );

      expect(state.collectibles["Super Totem"]?.[0].extendedMs).toBe(
        FOUR_HOURS,
      );
      // The Super Totem is not demoted, and the spent Time Warp Totem is gone.
      expect(state.collectibles["Time Warp Totem"]).toBeUndefined();
      expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(0));
      expect(state.inventory["Super Totem"]).toEqual(new Decimal(1));
    });

    it("promotes a Time Warp Totem paid for with a Super Totem", () => {
      const placedAt = now - 60 * 60 * 1000; // one hour in
      const state = extendTotem(
        totemFarm({ placed: "Time Warp Totem", placedAt, superSpares: 1 }),
        "Time Warp Totem",
        "Super Totem",
      );

      const promoted = state.collectibles["Super Totem"]?.[0];

      expect(state.collectibles["Time Warp Totem"]).toBeUndefined();
      expect(promoted).toMatchObject({
        id: "1",
        coordinates: { x: 0, y: 0 },
        createdAt: placedAt,
      });

      // Seven days on top of what the Time Warp Totem had left, NOT a reset to
      // seven days from now - this is what a naive `extendedMs += added` breaks.
      expect(
        getCollectibleExpiry({
          name: "Super Totem",
          collectible: promoted ?? {},
          game: state,
        }),
      ).toBe(placedAt + FOUR_HOURS + SEVEN_DAYS);

      // The Time Warp Totem is absorbed; the spare Super Totem is now the
      // placement, so its count is unchanged.
      expect(state.inventory["Time Warp Totem"]).toEqual(new Decimal(0));
      expect(state.inventory["Super Totem"]).toEqual(new Decimal(1));
    });

    it("banks the Time Warp Totem's window when promoting", () => {
      const placedAt = now - 60 * 60 * 1000;
      const state = extendTotem(
        totemFarm({ placed: "Time Warp Totem", placedAt, superSpares: 1 }),
        "Time Warp Totem",
        "Super Totem",
      );

      expect(state.boostHistory?.["Time Warp Totem"]).toEqual([
        { from: placedAt, to: placedAt + FOUR_HOURS },
      ]);
    });

    it("leaves one continuous totem window after a promotion", () => {
      const placedAt = now - 60 * 60 * 1000;
      const state = extendTotem(
        totemFarm({ placed: "Time Warp Totem", placedAt, superSpares: 1 }),
        "Time Warp Totem",
        "Super Totem",
      );

      const windows = getMergedTotemWindows(state, 2);

      expect(windows).toHaveLength(1);
      expect(windows[0]).toMatchObject({
        from: placedAt,
        to: placedAt + FOUR_HOURS + SEVEN_DAYS,
      });
    });

    it("cannot pay with a totem the player has no spare of", () => {
      expect(() =>
        extendTotem(
          totemFarm({ placed: "Time Warp Totem" }),
          "Time Warp Totem",
          "Super Totem",
        ),
      ).toThrow("Insufficient ingredient: Super Totem");
    });

    describe("Basic Scarecrow AOE cache", () => {
      const base = 10 * 60 * 1000;

      /**
       * A Time Warp Totem with one minute left and a crop that needs ten: the
       * pre-extension window only covers the first sliver of the grow, so
       * lengthening it moves the crop's derived readyAt earlier - exactly the
       * case where a stale AOE cell would deny the replant its boost.
       */
      const aoeFarm = ({
        placedAt,
        superSpares = 0,
        warpSpares = 0,
      }: {
        placedAt: number;
        superSpares?: number;
        warpSpares?: number;
      }): GameState => {
        const state = {
          ...TEST_FARM,
          inventory: {
            ...TEST_FARM.inventory,
            "Time Warp Totem": new Decimal(1 + warpSpares),
            "Super Totem": new Decimal(superSpares),
          },
          collectibles: {
            "Time Warp Totem": [
              { id: "1", coordinates: { x: 5, y: 5 }, createdAt: placedAt },
            ],
            "Basic Scarecrow": [
              { id: "s", coordinates: { x: 0, y: 0 }, createdAt: now },
            ],
          },
          crops: {
            "1": {
              createdAt: now,
              x: 1,
              y: 0,
              crop: {
                name: "Sunflower" as const,
                plantedAt: now,
                baseDurationMs: base,
              },
            },
          },
        };

        return {
          ...state,
          // Seed the cache with the PRE-extension ready time, as planting would.
          aoe: {
            "Basic Scarecrow": {
              1: {
                0: computeReadyAt({
                  startedAt: now,
                  baseDurationMs: base,
                  windows: getCropPlotBoostWindows(state),
                }),
              },
            },
          },
        };
      };

      it("re-syncs the cache when a top-up lengthens a live window", () => {
        const placedAt = now - FOUR_HOURS + 60 * 1000;
        const farm = aoeFarm({ placedAt, warpSpares: 1 });
        const stale = farm.aoe["Basic Scarecrow"]![1]![0]!;

        const state = extendTotem(farm, "Time Warp Totem", "Time Warp Totem");

        const expected = computeReadyAt({
          startedAt: now,
          baseDurationMs: base,
          windows: getCropPlotBoostWindows(state),
        });
        // The longer window covers the whole grow, so the crop finishes sooner...
        expect(expected).toBeLessThan(stale);
        // ...and the cache must follow it, or replanting in the gap is denied.
        expect(state.aoe["Basic Scarecrow"]![1]![0]).toBe(expected);
      });

      it("re-syncs the cache when a promotion lengthens a live window", () => {
        const placedAt = now - FOUR_HOURS + 60 * 1000;
        const farm = aoeFarm({ placedAt, superSpares: 1 });
        const stale = farm.aoe["Basic Scarecrow"]![1]![0]!;

        const state = extendTotem(farm, "Time Warp Totem", "Super Totem");

        const expected = computeReadyAt({
          startedAt: now,
          baseDurationMs: base,
          windows: getCropPlotBoostWindows(state),
        });
        expect(expected).toBeLessThan(stale);
        expect(state.aoe["Basic Scarecrow"]![1]![0]).toBe(expected);
      });
    });

    it("cannot pay for an hourglass with a totem", () => {
      expect(() =>
        extendCollectible({
          state: {
            ...TEST_FARM,
            inventory: {
              ...TEST_FARM.inventory,
              "Harvest Hourglass": new Decimal(1),
              "Super Totem": new Decimal(1),
            },
            collectibles: {
              "Harvest Hourglass": [
                { id: "1", coordinates: { x: 0, y: 0 }, createdAt: now },
              ],
            },
          },
          action: {
            type: "collectible.extended",
            name: "Harvest Hourglass",
            location: "farm",
            id: "1",
            payWith: "Super Totem",
          },
          createdAt: now,
        }),
      ).toThrow("Cannot extend Harvest Hourglass with Super Totem");
    });
  });
});
