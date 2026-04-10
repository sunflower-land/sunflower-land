import Decimal from "decimal.js-light";
import {
  applyAnimalFeedBuff,
  APPLY_ANIMAL_FEED_BUFF_ERRORS,
  isAnimalNeedingLove,
} from "./applyAnimalFeedBuff";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";

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

  it("sets multiplier to 1.05 when Salt Lick is applied", () => {
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
    expect(state.henHouse.animals[chickenId].multiplier).toBe(1.05);
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
});
