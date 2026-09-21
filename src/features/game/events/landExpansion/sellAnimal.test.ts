import { INITIAL_FARM } from "features/game/lib/constants";
import { isValidDeal, sellAnimal } from "./sellAnimal";
import Decimal from "decimal.js-light";
import { makeAnimalBuilding } from "features/game/lib/animals";
import { ANIMAL_LEVELS } from "features/game/types/animals";
import type {
  Animal,
  BountyRequest,
  GameState,
} from "features/game/types/game";

/**
 * INITIAL_FARM ships animal buildings EMPTY - `constructBuilding` seeds the
 * starter herd - so these tests, which assume a farm that already has animals,
 * build one explicitly.
 */
const FARM_WITH_HERDS: GameState = {
  ...INITIAL_FARM,
  henHouse: makeAnimalBuilding("Hen House"),
  barn: makeAnimalBuilding("Barn"),
};

describe("animal.sold", () => {
  it("requires deal exists", () => {
    expect(() =>
      sellAnimal({
        state: FARM_WITH_HERDS,
        action: {
          requestId: "123",
          animalId: Object.keys(FARM_WITH_HERDS.henHouse.animals)[0],
          type: "animal.sold",
        },
      }),
    ).toThrow("Bounty does not exist");
  });

  it("requires deal not already made", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...FARM_WITH_HERDS,
          bounties: {
            completed: [
              {
                id: "123",
                soldAt: Date.now(),
              },
            ],
            requests: [
              {
                id: "123",
                coins: 100,

                level: 1,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          requestId: "123",
          animalId: Object.keys(FARM_WITH_HERDS.henHouse.animals)[0],

          type: "animal.sold",
        },
      }),
    ).toThrow("Bounty already completed");
  });

  it("requires player has a chicken", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...FARM_WITH_HERDS,
          bounties: {
            completed: [],
            requests: [
              {
                id: "123",
                coins: 100,

                level: 1,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          requestId: "123",
          animalId: "678",
          type: "animal.sold",
        },
      }),
    ).toThrow("Animal does not exist");
  });

  it("requires chicken is not ready even if they are at the correct level", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...FARM_WITH_HERDS,
          henHouse: {
            level: 1,
            animals: {
              "1": {
                id: "1",
                type: "Chicken",
                state: "ready",
                asleepAt: 0,
                experience: 1920,
                createdAt: Date.now(),
                item: "Petting Hand",
                lovedAt: 0,
                awakeAt: 0,
              },
            },
          },
          bounties: {
            bonusClaimedAt: 0,
            completed: [],
            requests: [
              {
                id: "123",
                coins: 100,
                level: 12,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          requestId: "123",
          animalId: "1",
          type: "animal.sold",
        },
      }),
    ).toThrow("Animal does not meet requirements");
  });

  it("allows chicken to be sold if they are above the current level, even if they are ready", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...FARM_WITH_HERDS,
          henHouse: {
            level: 1,
            animals: {
              "1": {
                id: "1",
                type: "Chicken",
                state: "ready",
                asleepAt: 0,
                experience: 2160,
                createdAt: Date.now(),
                item: "Petting Hand",
                lovedAt: 0,
                awakeAt: 0,
              },
            },
          },
          bounties: {
            bonusClaimedAt: 0,
            completed: [],
            requests: [
              {
                id: "123",
                coins: 100,
                level: 12,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          requestId: "123",
          animalId: "1",
          type: "animal.sold",
        },
      }),
    ).not.toThrow("Animal does not meet requirements");
  });

  it("requires chicken is correct level", () => {
    expect(() =>
      sellAnimal({
        state: {
          ...FARM_WITH_HERDS,
          bounties: {
            completed: [],
            requests: [
              {
                id: "123",
                coins: 100,

                level: 12,
                name: "Chicken",
              },
            ],
          },
        },
        action: {
          requestId: "123",
          animalId: Object.keys(FARM_WITH_HERDS.henHouse.animals)[0],

          type: "animal.sold",
        },
      }),
    ).toThrow("Animal does not meet requirements");
  });

  // Success
  it("removes a chicken", () => {
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        henHouse: {
          ...FARM_WITH_HERDS.henHouse,
          animals: {
            ...FARM_WITH_HERDS.henHouse.animals,
            [animalId]: {
              ...FARM_WITH_HERDS.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,

              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
    });

    expect(state.henHouse.animals[animalId]).toBeUndefined();
    expect(Object.keys(state.henHouse.animals)).toHaveLength(2);
  });

  it("exchanges coins", () => {
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        henHouse: {
          ...FARM_WITH_HERDS.henHouse,
          animals: {
            ...FARM_WITH_HERDS.henHouse.animals,
            [animalId]: {
              ...FARM_WITH_HERDS.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,

              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
    });

    expect(state.coins).toEqual(100);
  });

  it("exchanges tickets", () => {
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        henHouse: {
          ...FARM_WITH_HERDS.henHouse,
          animals: {
            ...FARM_WITH_HERDS.henHouse.animals,
            [animalId]: {
              ...FARM_WITH_HERDS.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { "Amber Fossil": 7 },

              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2024-10-10").getTime(),
    });

    expect(state.inventory["Amber Fossil"]).toEqual(new Decimal(7));
  });

  it("marks as sold", () => {
    const now = Date.now();
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        henHouse: {
          ...FARM_WITH_HERDS.henHouse,
          animals: {
            ...FARM_WITH_HERDS.henHouse.animals,
            [animalId]: {
              ...FARM_WITH_HERDS.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,

              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: now,
    });

    const deal = state.bounties.completed.find((deal) => deal.id === "123");
    expect(deal?.soldAt).toEqual(now);
  });

  it("gives 50% more coins when selling bountiful bounties", () => {
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        bumpkin: {
          ...FARM_WITH_HERDS.bumpkin,
          skills: {
            "Bountiful Bounties": 1,
          },
        },
        henHouse: {
          ...FARM_WITH_HERDS.henHouse,
          animals: {
            ...FARM_WITH_HERDS.henHouse.animals,
            [animalId]: {
              ...FARM_WITH_HERDS.henHouse.animals[animalId],
              experience: 1000,
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",

              coins: 100,
              items: {},
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,
        type: "animal.sold",
      },
    });

    expect(state.coins).toEqual(150);
  });

  it("gives 25% less coins when selling sick animals", () => {
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        henHouse: {
          ...FARM_WITH_HERDS.henHouse,
          animals: {
            ...FARM_WITH_HERDS.henHouse.animals,
            [animalId]: {
              ...FARM_WITH_HERDS.henHouse.animals[animalId],
              experience: 60,
              state: "sick",
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,
              items: {},
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,
        type: "animal.sold",
      },
    });

    // Check coins are halved
    expect(state.coins).toEqual(75);
  });

  it("gives approx 25% less items (rounded down) when selling sick animals", () => {
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        henHouse: {
          ...FARM_WITH_HERDS.henHouse,
          animals: {
            ...FARM_WITH_HERDS.henHouse.animals,
            [animalId]: {
              ...FARM_WITH_HERDS.henHouse.animals[animalId],
              experience: 60,
              state: "sick",
            },
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              coins: 100,
              items: {
                "Amber Fossil": 7,
              },
              level: 1,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,
        type: "animal.sold",
      },
    });

    // Check coins are halved
    expect(state.coins).toEqual(75);
    expect(state.inventory["Amber Fossil"]).toEqual(new Decimal(5));
  });

  it("rewards +1 Horseshoe when Cowboy Hat is worn during Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        bumpkin: {
          ...FARM_WITH_HERDS.bumpkin,
          equipped: {
            ...FARM_WITH_HERDS.bumpkin.equipped,
            hat: "Cowboy Hat",
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { Horseshoe: 7 },
              level: 0,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2024-11-03").getTime(),
    });

    expect(state.inventory["Horseshoe"]).toEqual(new Decimal(8));
  });

  it("stacks Cowboy Set boosts at Bull Run Season", () => {
    const mockDate = new Date(2024, 11, 11);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        bumpkin: {
          ...FARM_WITH_HERDS.bumpkin,
          equipped: {
            ...FARM_WITH_HERDS.bumpkin.equipped,
            hat: "Cowboy Hat",
            shirt: "Cowboy Shirt",
            pants: "Cowboy Trouser",
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { Horseshoe: 7 },
              level: 0,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2024-11-03").getTime(),
    });

    expect(state.inventory["Horseshoe"]).toEqual(new Decimal(10));
  });
  it("rewards +1 Timeshard when Acorn Hat is worn during Winds of Change Chapter", () => {
    const mockDate = new Date(2025, 2, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        bumpkin: {
          ...FARM_WITH_HERDS.bumpkin,
          equipped: {
            ...FARM_WITH_HERDS.bumpkin.equipped,
            hat: "Acorn Hat",
          },
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { Timeshard: 7 },
              level: 0,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });

    expect(state.inventory["Timeshard"]).toEqual(new Decimal(8));
  });

  it("stacks timeshard boosts during Winds of Change Chapter", () => {
    const mockDate = new Date(2025, 2, 5);
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
    const animalId = Object.keys(FARM_WITH_HERDS.henHouse.animals)[0];
    const state = sellAnimal({
      state: {
        ...FARM_WITH_HERDS,
        bumpkin: {
          ...FARM_WITH_HERDS.bumpkin,
          equipped: {
            ...FARM_WITH_HERDS.bumpkin.equipped,
            hat: "Acorn Hat",
          },
        },
        collectibles: {
          Igloo: [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
              createdAt: Date.now() - 100,
              readyAt: Date.now() - 100,
            },
          ],
          Hammock: [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
              createdAt: Date.now() - 100,
              readyAt: Date.now() - 100,
            },
          ],
        },
        bounties: {
          completed: [],
          requests: [
            {
              id: "123",
              items: { Timeshard: 7 },
              level: 0,
              name: "Chicken",
            },
          ],
        },
      },
      action: {
        requestId: "123",
        animalId,

        type: "animal.sold",
      },
      createdAt: new Date("2025-02-05").getTime(),
    });

    expect(state.inventory["Timeshard"]).toEqual(new Decimal(10));
  });
});

describe("isValidDeal: the ready-state level adjustment", () => {
  const cow = (experience: number, state: Animal["state"]): Animal => ({
    id: "1",
    type: "Cow",
    state,
    createdAt: 0,
    experience,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
  });

  const deal = (level: number): BountyRequest => ({
    id: "1",
    name: "Cow",
    level,
    coins: 100,
  });

  const valid = (animal: Animal, level: number) =>
    isValidDeal({ animal, deal: deal(level), game: INITIAL_FARM });

  it("counts a ready animal as one level lower mid-table", () => {
    // Fed past the level 6 threshold but not claimed: the badge still reads 5,
    // so a level 6 bounty has to wait for the claim.
    const animal = cow(ANIMAL_LEVELS.Cow[6], "ready");

    expect(valid(animal, 6)).toBe(false);
    expect(valid(animal, 5)).toBe(true);
  });

  it("does not demote a ready animal at max level", () => {
    // At 15 there is no next level to transition into, so "ready" only means a
    // produce cycle completed. `LevelProgress` guards its own -1 with
    // `isMaxLevel` and shows 15, so eligibility must agree.
    expect(valid(cow(ANIMAL_LEVELS.Cow[15], "ready"), 15)).toBe(true);
  });

  it("does not demote an animal banked above max level", () => {
    expect(valid(cow(ANIMAL_LEVELS.Cow[15] * 3, "ready"), 15)).toBe(true);
  });

  it("does not demote a ready Pig at its Pigpen's cap", () => {
    // A level-1 Pigpen caps Pigs at 5, so a Pig cycling produce there is at
    // its max level even though its XP table runs to 15. The XP sits PAST the
    // cap but SHORT of 15 - a Pig that has banked progress it cannot use yet -
    // so the cap is the only thing that makes it read as maxed.
    expect(INITIAL_FARM.pigpen.level).toBe(1);

    const pig: Animal = {
      ...cow(ANIMAL_LEVELS.Pig[8], "ready"),
      type: "Pig",
    };

    expect(
      isValidDeal({
        animal: pig,
        deal: { id: "1", name: "Pig", level: 5, coins: 100 },
        game: INITIAL_FARM,
      }),
    ).toBe(true);
  });

  it("still requires the level when the animal is not ready", () => {
    expect(valid(cow(ANIMAL_LEVELS.Cow[5], "idle"), 5)).toBe(true);
    expect(valid(cow(ANIMAL_LEVELS.Cow[5], "idle"), 6)).toBe(false);
  });
});
