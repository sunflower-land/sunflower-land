import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { TEST_FARM } from "features/game/lib/constants";
import { getExpiryCooldown } from "features/game/lib/collectibleBuilt";
import { getCropPlotBoostWindows } from "features/game/lib/boostWindows";
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
});
