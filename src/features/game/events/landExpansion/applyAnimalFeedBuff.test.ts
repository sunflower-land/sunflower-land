import Decimal from "decimal.js-light";
import {
  applyAnimalFeedBuff,
  APPLY_ANIMAL_FEED_BUFF_ERRORS,
} from "./applyAnimalFeedBuff";
import { isAnimalNeedingLove } from "./loveAnimal";
import { INITIAL_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

describe("applyAnimalFeedBuff", () => {
  const now = Date.now();

  const GAME_STATE: GameState = {
    ...INITIAL_FARM,
    buildings: {
      "Hen House": [
        { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
      ],
      Barn: [
        { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
      ],
    },
  };

  it("applies Salt Lick when animal is awake and idle", () => {
    const chickenId = "c1";
    const state = applyAnimalFeedBuff({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Salt Lick": new Decimal(2),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: now - 100_000,
              awakeAt: now - 50_000,
              lovedAt: now - 100_000,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.feedBuffApplied",
        animal: "Chicken",
        id: chickenId,
        item: "Salt Lick",
      },
    });

    expect(state.inventory["Salt Lick"]).toStrictEqual(new Decimal(1));
    expect(state.henHouse.animals[chickenId].feedBuff).toEqual({
      name: "Salt Lick",
      harvestsRemaining: 3,
    });
  });

  it("applies Salt Lick when animal is asleep", () => {
    const chickenId = "c1";
    const asleepAt = 1_000;
    const awakeAt = 1_000 + 3_600_000;
    const createdAt = 1_150_000;

    const state = applyAnimalFeedBuff({
      createdAt,
      state: {
        ...GAME_STATE,
        inventory: { "Salt Lick": new Decimal(1) },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "happy",
              experience: 0,
              asleepAt,
              awakeAt,
              lovedAt: asleepAt,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.feedBuffApplied",
        animal: "Chicken",
        id: chickenId,
        item: "Salt Lick",
      },
    });
    expect(state.henHouse.animals[chickenId].feedBuff?.name).toBe("Salt Lick");
  });

  it("applies when animal is happy and awake", () => {
    const chickenId = "c1";
    const state = applyAnimalFeedBuff({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: { "Salt Lick": new Decimal(1) },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "happy",
              experience: 0,
              asleepAt: now - 100_000,
              awakeAt: now - 50_000,
              lovedAt: now - 100_000,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.feedBuffApplied",
        animal: "Chicken",
        id: chickenId,
        item: "Salt Lick",
      },
    });
    expect(state.henHouse.animals[chickenId].feedBuff?.name).toBe("Salt Lick");
  });

  it("throws if animal is sick", () => {
    const chickenId = "c1";
    expect(() =>
      applyAnimalFeedBuff({
        createdAt: now,
        state: {
          ...GAME_STATE,
          inventory: { "Salt Lick": new Decimal(1) },
          henHouse: {
            ...GAME_STATE.henHouse,
            animals: {
              [chickenId]: {
                id: chickenId,
                type: "Chicken",
                createdAt: 0,
                state: "sick",
                experience: 0,
                asleepAt: 0,
                awakeAt: 0,
                lovedAt: 0,
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.feedBuffApplied",
          animal: "Chicken",
          id: chickenId,
          item: "Salt Lick",
        },
      }),
    ).toThrow(APPLY_ANIMAL_FEED_BUFF_ERRORS.SICK);
  });

  it("throws NEEDS_LOVE when asleep and love window elapsed", () => {
    const chickenId = "c1";
    const asleepAt = 1_000;
    const awakeAt = 1_000 + 3_600_000;
    const createdAt = 2_000_000;
    expect(
      isAnimalNeedingLove(
        {
          id: chickenId,
          type: "Chicken",
          state: "idle",
          createdAt: 0,
          experience: 0,
          asleepAt,
          awakeAt,
          lovedAt: 1_000,
          item: "Petting Hand",
        },
        createdAt,
        awakeAt,
      ),
    ).toBe(true);

    expect(() =>
      applyAnimalFeedBuff({
        createdAt,
        state: {
          ...GAME_STATE,
          inventory: { "Salt Lick": new Decimal(1) },
          henHouse: {
            ...GAME_STATE.henHouse,
            animals: {
              [chickenId]: {
                id: chickenId,
                type: "Chicken",
                createdAt: 0,
                state: "idle",
                experience: 0,
                asleepAt,
                awakeAt,
                lovedAt: 1_000,
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.feedBuffApplied",
          animal: "Chicken",
          id: chickenId,
          item: "Salt Lick",
        },
      }),
    ).toThrow(APPLY_ANIMAL_FEED_BUFF_ERRORS.NEEDS_LOVE);
  });

  it("throws if animal already has a feed buff", () => {
    const chickenId = "c1";
    expect(() =>
      applyAnimalFeedBuff({
        createdAt: now,
        state: {
          ...GAME_STATE,
          inventory: { "Salt Lick": new Decimal(1) },
          henHouse: {
            ...GAME_STATE.henHouse,
            animals: {
              [chickenId]: {
                id: chickenId,
                type: "Chicken",
                createdAt: 0,
                state: "idle",
                experience: 0,
                asleepAt: now - 100_000,
                awakeAt: now - 50_000,
                lovedAt: now - 100_000,
                item: "Petting Hand",
                feedBuff: { name: "Salt Lick", harvestsRemaining: 2 },
              },
            },
          },
        },
        action: {
          type: "animal.feedBuffApplied",
          animal: "Chicken",
          id: chickenId,
          item: "Salt Lick",
        },
      }),
    ).toThrow(APPLY_ANIMAL_FEED_BUFF_ERRORS.ALREADY_BUFFED);
  });

  it("throws if not enough items", () => {
    const chickenId = "c1";
    expect(() =>
      applyAnimalFeedBuff({
        createdAt: now,
        state: {
          ...GAME_STATE,
          inventory: { "Salt Lick": new Decimal(0) },
          henHouse: {
            ...GAME_STATE.henHouse,
            animals: {
              [chickenId]: {
                id: chickenId,
                type: "Chicken",
                createdAt: 0,
                state: "idle",
                experience: 0,
                asleepAt: now - 100_000,
                awakeAt: now - 50_000,
                lovedAt: now - 100_000,
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.feedBuffApplied",
          animal: "Chicken",
          id: chickenId,
          item: "Salt Lick",
        },
      }),
    ).toThrow(APPLY_ANIMAL_FEED_BUFF_ERRORS.NOT_ENOUGH);
  });

  it("applies Honey Treat (without Salt Lick multiplier)", () => {
    const chickenId = "c1";
    const state = applyAnimalFeedBuff({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: { "Honey Treat": new Decimal(1) },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: now - 100_000,
              awakeAt: now - 50_000,
              lovedAt: now - 100_000,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.feedBuffApplied",
        animal: "Chicken",
        id: chickenId,
        item: "Honey Treat",
      },
    });

    expect(state.inventory["Honey Treat"]).toStrictEqual(new Decimal(0));
    expect(state.henHouse.animals[chickenId].feedBuff).toEqual({
      name: "Honey Treat",
      harvestsRemaining: 3,
    });
    expect(state.henHouse.animals[chickenId].multiplier).toBeUndefined();
  });
  it("doubles the feed buff duration to 6 harvests when Vibraphone is placed", () => {
    const chickenId = "c1";
    const state = applyAnimalFeedBuff({
      createdAt: now,
      state: {
        ...GAME_STATE,
        collectibles: {
          Vibraphone: [{ id: "1", createdAt: 0, coordinates: { x: 0, y: 0 } }],
        },
        inventory: {
          ...GAME_STATE.inventory,
          "Salt Lick": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: now - 100_000,
              awakeAt: now - 50_000,
              lovedAt: now - 100_000,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.feedBuffApplied",
        animal: "Chicken",
        id: chickenId,
        item: "Salt Lick",
      },
    });

    expect(state.henHouse.animals[chickenId].feedBuff).toEqual({
      name: "Salt Lick",
      harvestsRemaining: 6,
    });
  });

  it("keeps 3 harvests when Vibraphone is only in the inventory", () => {
    const chickenId = "c1";
    const state = applyAnimalFeedBuff({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          Vibraphone: new Decimal(1),
          "Salt Lick": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: now - 100_000,
              awakeAt: now - 50_000,
              lovedAt: now - 100_000,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.feedBuffApplied",
        animal: "Chicken",
        id: chickenId,
        item: "Salt Lick",
      },
    });

    expect(state.henHouse.animals[chickenId].feedBuff).toEqual({
      name: "Salt Lick",
      harvestsRemaining: 3,
    });
  });
});

describe("applyAnimalFeedBuff: Truffle Seasoning (Chapter 16)", () => {
  const now = Date.now();
  const chickenId = "seasoned";

  const farm = (overrides: Partial<GameState> = {}): GameState => ({
    ...INITIAL_FARM,
    buildings: {
      "Hen House": [
        { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
      ],
    },
    inventory: { "Truffle Seasoning": new Decimal(1) },
    henHouse: {
      ...INITIAL_FARM.henHouse,
      animals: {
        [chickenId]: {
          id: chickenId,
          type: "Chicken",
          createdAt: 0,
          state: "idle",
          experience: 0,
          asleepAt: now - 100_000,
          awakeAt: now - 50_000,
          lovedAt: now - 100_000,
          item: "Petting Hand",
        },
      },
    },
    ...overrides,
  });

  const season = (state: GameState) =>
    applyAnimalFeedBuff({
      state,
      createdAt: now,
      action: {
        type: "animal.feedBuffApplied",
        animal: "Chicken",
        id: chickenId,
        item: "Truffle Seasoning",
      },
    });

  it("lasts one sleep and costs one Seasoning", () => {
    const state = season(farm());

    expect(state.henHouse.animals[chickenId].feedBuff).toEqual({
      name: "Truffle Seasoning",
      harvestsRemaining: 1,
    });
    expect(state.inventory["Truffle Seasoning"]).toEqual(new Decimal(0));
  });

  it("lasts two sleeps with a placed Vibraphone", () => {
    const state = season(
      farm({
        collectibles: {
          Vibraphone: [{ id: "1", createdAt: 0, coordinates: { x: 0, y: 0 } }],
        },
      }),
    );

    expect(state.henHouse.animals[chickenId].feedBuff).toEqual({
      name: "Truffle Seasoning",
      harvestsRemaining: 2,
    });
  });

  it("leaves the current sleep unchanged when applied to a sleeping animal", () => {
    const base = farm();
    const awakeAt = now + 10 * 60 * 60 * 1000;
    const state = season({
      ...base,
      henHouse: {
        ...base.henHouse,
        animals: {
          [chickenId]: {
            ...base.henHouse.animals[chickenId],
            asleepAt: now - 1000,
            awakeAt,
            lovedAt: now - 1000,
          },
        },
      },
    });

    const chicken = state.henHouse.animals[chickenId];
    expect(chicken.awakeAt).toEqual(awakeAt);
    expect(chicken.feedBuff).toEqual({
      name: "Truffle Seasoning",
      harvestsRemaining: 1,
    });
  });

  it("takes the single treat slot, so it cannot stack with another treat", () => {
    const base = farm();

    expect(() =>
      season({
        ...base,
        henHouse: {
          ...base.henHouse,
          animals: {
            [chickenId]: {
              ...base.henHouse.animals[chickenId],
              feedBuff: { name: "Salt Lick", harvestsRemaining: 3 },
            },
          },
        },
      }),
    ).toThrow(APPLY_ANIMAL_FEED_BUFF_ERRORS.ALREADY_BUFFED);
  });

  describe("off testnet", () => {
    // jest runs on amoy, so the flag-off path is only reachable by pretending
    // to be mainnet.
    let previousNetwork: (typeof CONFIG)["NETWORK"];

    beforeEach(() => {
      previousNetwork = CONFIG.NETWORK;
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = "mainnet";
    });

    afterEach(() => {
      (CONFIG as { NETWORK: "mainnet" | "amoy" }).NETWORK = previousNetwork;
    });

    it("throws without the PIGPEN feature flag", () => {
      expect(() => season(farm())).toThrow(
        APPLY_ANIMAL_FEED_BUFF_ERRORS.NO_FEATURE_ACCESS,
      );
    });

    it("is unlocked by a Beta Pass", () => {
      expect(() =>
        season(
          farm({
            inventory: {
              "Truffle Seasoning": new Decimal(1),
              "Beta Pass": new Decimal(1),
            },
          }),
        ),
      ).not.toThrow();
    });

    it("still applies a Salt Lick", () => {
      const state = applyAnimalFeedBuff({
        state: farm({ inventory: { "Salt Lick": new Decimal(1) } }),
        createdAt: now,
        action: {
          type: "animal.feedBuffApplied",
          animal: "Chicken",
          id: chickenId,
          item: "Salt Lick",
        },
      });

      expect(state.henHouse.animals[chickenId].feedBuff).toEqual({
        name: "Salt Lick",
        harvestsRemaining: 3,
      });
    });
  });
});
