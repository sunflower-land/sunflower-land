import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import type { GameState } from "../../types/game";
import { renewWeatherCollectible } from "./renewWeatherCollectible";

describe("renewWeatherCollectible", () => {
  const now = Date.now();

  const usedPinwheelFarm = (overrides?: Partial<GameState>): GameState => ({
    ...TEST_FARM,
    coins: 1000,
    inventory: {
      Wood: new Decimal(100),
      Leather: new Decimal(100),
      "Tornado Pinwheel": new Decimal(1),
    },
    collectibles: {
      "Tornado Pinwheel": [
        {
          id: "1",
          coordinates: { x: 1, y: 1 },
          readyAt: now,
          used: true,
        },
      ],
    },
    ...overrides,
  });

  it("throws if the collectible is not a weather protection item", () => {
    expect(() =>
      renewWeatherCollectible({
        state: TEST_FARM,
        action: {
          type: "weatherCollectible.renewed",
          name: "Fox Shrine" as any,
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Not a weather protection collectible");
  });

  it("throws if the collectible is not placed", () => {
    expect(() =>
      renewWeatherCollectible({
        state: { ...TEST_FARM, collectibles: {} },
        action: {
          type: "weatherCollectible.renewed",
          name: "Tornado Pinwheel",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Invalid collectible");
  });

  it("throws if the id does not match", () => {
    expect(() =>
      renewWeatherCollectible({
        state: usedPinwheelFarm(),
        action: {
          type: "weatherCollectible.renewed",
          name: "Tornado Pinwheel",
          location: "farm",
          id: "does-not-exist",
        },
        createdAt: now,
      }),
    ).toThrow("Collectible does not exist");
  });

  it("throws if the collectible is not used", () => {
    expect(() =>
      renewWeatherCollectible({
        state: usedPinwheelFarm({
          collectibles: {
            "Tornado Pinwheel": [
              { id: "1", coordinates: { x: 1, y: 1 }, readyAt: now },
            ],
          },
        }),
        action: {
          type: "weatherCollectible.renewed",
          name: "Tornado Pinwheel",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Collectible is not used");
  });

  it("throws if the player has insufficient coins", () => {
    expect(() =>
      renewWeatherCollectible({
        state: usedPinwheelFarm({ coins: 0 }),
        action: {
          type: "weatherCollectible.renewed",
          name: "Tornado Pinwheel",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Insufficient Coins");
  });

  it("throws if the player has insufficient ingredients", () => {
    expect(() =>
      renewWeatherCollectible({
        state: usedPinwheelFarm({
          inventory: { "Tornado Pinwheel": new Decimal(1) },
        }),
        action: {
          type: "weatherCollectible.renewed",
          name: "Tornado Pinwheel",
          location: "farm",
          id: "1",
        },
        createdAt: now,
      }),
    ).toThrow("Insufficient ingredient: Wood");
  });

  it("clears the used flag and charges the shop cost", () => {
    const state = renewWeatherCollectible({
      state: usedPinwheelFarm(),
      action: {
        type: "weatherCollectible.renewed",
        name: "Tornado Pinwheel",
        location: "farm",
        id: "1",
      },
      createdAt: now,
    });

    expect(state.collectibles["Tornado Pinwheel"]?.[0].used).toBeUndefined();
    expect(state.coins).toEqual(1000 - 100);
    expect(state.inventory.Wood).toEqual(new Decimal(70));
    expect(state.inventory.Leather).toEqual(new Decimal(95));
  });

  it("scales the renewal cost by the island multiplier", () => {
    const state = renewWeatherCollectible({
      state: usedPinwheelFarm({
        island: { ...TEST_FARM.island, type: "volcano" },
      }),
      action: {
        type: "weatherCollectible.renewed",
        name: "Tornado Pinwheel",
        location: "farm",
        id: "1",
      },
      createdAt: now,
    });

    // volcano multiplier is 2.5 -> 250 coins, 75 Wood, 12.5 Leather
    expect(state.coins).toEqual(1000 - 250);
    expect(state.inventory.Wood).toEqual(new Decimal(25));
    expect(state.inventory.Leather).toEqual(new Decimal(87.5));
  });

  it("renews a collectible placed in the interior", () => {
    const state = renewWeatherCollectible({
      state: usedPinwheelFarm({
        collectibles: {},
        interior: {
          ...TEST_FARM.interior,
          ground: {
            ...TEST_FARM.interior.ground,
            collectibles: {
              "Tornado Pinwheel": [
                {
                  id: "1",
                  coordinates: { x: 1, y: 1 },
                  readyAt: now,
                  used: true,
                },
              ],
            },
          },
        },
      }),
      action: {
        type: "weatherCollectible.renewed",
        name: "Tornado Pinwheel",
        location: "interior",
        id: "1",
      },
      createdAt: now,
    });

    expect(
      state.interior.ground.collectibles["Tornado Pinwheel"]?.[0].used,
    ).toBeUndefined();
  });
});
