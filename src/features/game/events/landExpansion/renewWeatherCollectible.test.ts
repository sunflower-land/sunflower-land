import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import type { GameState, PlacedItem } from "../../types/game";
import type { ScheduledWeatherEvent } from "../../types/weather";
import { CONFIG } from "lib/config";
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

  it("throws if the collectible is used but not placed", () => {
    expect(() =>
      renewWeatherCollectible({
        state: usedPinwheelFarm({
          collectibles: {
            "Tornado Pinwheel": [{ id: "1", used: true }],
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
    ).toThrow("Collectible is not placed");
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

describe("renewWeatherCollectible (weather items)", () => {
  const HOUR = 60 * 60 * 1000;
  // A flood in the schedule (spring week of 2026-11-16).
  const FLOOD_START = Date.UTC(2026, 10, 19);
  const FLOOD_END = Date.UTC(2026, 10, 23);
  const AFTER_FLOOD = FLOOD_END + HOUR;
  // The client reads the forecast the server sent.
  const FORECAST: ScheduledWeatherEvent[] = [
    { name: "flood", startAt: FLOOD_START, endAt: FLOOD_END },
    {
      name: "insectPlague",
      startAt: Date.UTC(2026, 10, 23),
      endAt: Date.UTC(2026, 10, 27),
    },
  ];

  const sandbag = (fields: Partial<PlacedItem> = {}): PlacedItem => ({
    id: "1",
    coordinates: { x: 1, y: 1 },
    createdAt: 0,
    readyAt: 0,
    placedAt: FLOOD_START - HOUR,
    ...fields,
  });

  const farm = (
    placement: PlacedItem,
    fields: Partial<GameState> = {},
  ): GameState => ({
    ...TEST_FARM,
    inventory: {
      Sand: new Decimal(10),
      Leather: new Decimal(2),
      Sandbag: new Decimal(1),
    },
    collectibles: { Sandbag: [placement] },
    boostHistory: undefined,
    ...fields,
  });

  const renew = (
    state: GameState,
    createdAt = AFTER_FLOOD,
    extra: {
      name?: "Sandbag" | "Pest Smoker";
      ingredient?: "Green Beetle" | "Sunflower";
    } = {},
  ) =>
    renewWeatherCollectible({
      state: { ...state, weather: { forecast: FORECAST } },
      action: {
        type: "weatherCollectible.renewed",
        name: extra.name ?? "Sandbag",
        location: "farm",
        id: "1",
        ingredient: extra.ingredient,
      },
      createdAt,
    });

  it("renews a copy greyed by an event it was out for", () => {
    const state = renew(farm(sandbag()));

    expect(state.inventory.Sand).toEqual(new Decimal(0));
    expect(state.inventory.Leather).toEqual(new Decimal(0));
    expect(state.inventory.Sandbag).toEqual(new Decimal(1));
    expect(state.collectibles.Sandbag?.[0].usedUntil).toBeUndefined();
    expect(state.collectibles.Sandbag?.[0].placedAt).toBe(AFTER_FLOOD);
    expect(state.boostHistory?.Sandbag).toEqual([
      { from: FLOOD_START - HOUR, to: AFTER_FLOOD },
    ]);
  });

  it("renews a copy with a stored mark", () => {
    const state = renew(
      farm(
        sandbag({
          placedAt: AFTER_FLOOD - 1,
          usedUntil: FLOOD_END,
          weatherCheckedUntil: FLOOD_START,
        }),
      ),
    );

    expect(state.collectibles.Sandbag?.[0].usedUntil).toBeUndefined();
    expect(state.collectibles.Sandbag?.[0].weatherCheckedUntil).toBeUndefined();
  });

  it("throws while the copy is still covering its event", () => {
    expect(() => renew(farm(sandbag()), FLOOD_END - HOUR)).toThrow(
      "Collectible is not used",
    );
  });

  it("throws for a copy that hasn't been used", () => {
    expect(() =>
      renew(farm(sandbag({ placedAt: FLOOD_END + 1 })), AFTER_FLOOD),
    ).toThrow("Collectible is not used");
  });

  it("throws for a copy that isn't placed", () => {
    expect(() =>
      renew(farm(sandbag({ coordinates: undefined, usedUntil: FLOOD_END }))),
    ).toThrow("Collectible is not placed");
  });

  it("throws when the player is short of an ingredient", () => {
    expect(() =>
      renew(
        farm(sandbag(), {
          inventory: { Sand: new Decimal(9), Leather: new Decimal(2) },
        }),
      ),
    ).toThrow("Insufficient ingredient: Sand");
  });

  it("charges the picked ingredient for a recipe with a choice", () => {
    const smoker = sandbag({ placedAt: Date.UTC(2026, 10, 23) - HOUR });
    const plagueEnd = Date.UTC(2026, 10, 27);
    const state = renew(
      {
        ...TEST_FARM,
        inventory: {
          Wood: new Decimal(30),
          Feather: new Decimal(30),
          "Green Beetle": new Decimal(10),
          "Pest Smoker": new Decimal(1),
        },
        collectibles: { "Pest Smoker": [smoker] },
      },
      plagueEnd + HOUR,
      { name: "Pest Smoker", ingredient: "Green Beetle" },
    );

    expect(state.inventory["Green Beetle"]).toEqual(new Decimal(0));
    expect(state.inventory.Wood).toEqual(new Decimal(0));
  });

  it("throws without a pick for a recipe with a choice", () => {
    const smoker = sandbag({ usedUntil: FLOOD_END });

    expect(() =>
      renew(
        { ...TEST_FARM, collectibles: { "Pest Smoker": [smoker] } },
        AFTER_FLOOD,
        { name: "Pest Smoker" },
      ),
    ).toThrow("Invalid ingredient");
  });

  it("throws for a pick the recipe doesn't offer", () => {
    expect(() =>
      renew(farm(sandbag()), AFTER_FLOOD, { ingredient: "Sunflower" }),
    ).toThrow("Invalid ingredient");
  });

  it("doesn't count placed flowers", () => {
    const lure = sandbag({ usedUntil: FLOOD_END });

    expect(() =>
      renewWeatherCollectible({
        state: {
          ...TEST_FARM,
          inventory: {
            Honey: new Decimal(5),
            "Green Beetle": new Decimal(5),
            "Red Pansy": new Decimal(1),
          },
          collectibles: {
            "Wildflower Lure": [lure],
            "Red Pansy": [sandbag({ id: "f1" })],
          },
        },
        action: {
          type: "weatherCollectible.renewed",
          name: "Wildflower Lure",
          location: "farm",
          id: "1",
          ingredient: "Red Pansy",
        },
        createdAt: AFTER_FLOOD,
      }),
    ).toThrow("Insufficient ingredient: Red Pansy");
  });

  describe("without the Weather flag", () => {
    const network = CONFIG.NETWORK;
    beforeAll(() => {
      CONFIG.NETWORK = "mainnet";
    });
    afterAll(() => {
      CONFIG.NETWORK = network;
    });

    it("throws", () => {
      expect(() => renew(farm(sandbag({ usedUntil: FLOOD_END })))).toThrow(
        "Weather items are not available",
      );
    });
  });
});
