import Decimal from "decimal.js-light";
import { levelUpAnimal } from "./levelUpAnimal";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("levelUpAnimal", () => {
  const now = Date.now();

  it("levels up a chicken to level 2 and drops an egg", () => {
    const chickenId = "xyz";

    const state = levelUpAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "levelUp",
              experience: 20,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.leveledUp",
        animal: "Chicken",
        id: chickenId,
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.henHouse.animals[chickenId].experience).toBe(20);
    expect(state.inventory.Egg).toStrictEqual(new Decimal(1));
  });

  it("levels up a chicken to level 3 and drops two eggs and one feather", () => {
    const chickenId = "xyz";

    const state = levelUpAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "levelUp",
              experience: 50,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.leveledUp",
        animal: "Chicken",
        id: chickenId,
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.henHouse.animals[chickenId].experience).toBe(50);
    expect(state.inventory.Egg).toStrictEqual(new Decimal(2));
    expect(state.inventory.Feather).toStrictEqual(new Decimal(1));
  });

  it("levels up a chicken and gives rewards", () => {
    const chickenId = "xyz";

    const state = levelUpAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "levelUp",
              experience: 50,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.leveledUp",
        animal: "Chicken",
        id: chickenId,
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.henHouse.animals[chickenId].asleepAt).toBe(now);
    expect(state.inventory.Egg).toStrictEqual(new Decimal(2));
  });

  it("throws an error if animal is not in levelUp state", () => {
    const chickenId = "xyz";

    expect(() =>
      levelUpAnimal({
        createdAt: now,
        state: {
          ...INITIAL_FARM,
          henHouse: {
            ...INITIAL_FARM.henHouse,
            animals: {
              [chickenId]: {
                coordinates: { x: 0, y: 0 },
                id: chickenId,
                type: "Chicken",
                createdAt: 0,
                state: "idle",
                experience: 50,
                asleepAt: 0,
                lovedAt: 0,
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.leveledUp",
          animal: "Chicken",
          id: chickenId,
        },
      }),
    ).toThrow("Animal is not ready to level up");
  });

  it("throws an error if animal does not exist", () => {
    expect(() =>
      levelUpAnimal({
        createdAt: now,
        state: INITIAL_FARM,
        action: {
          type: "animal.leveledUp",
          animal: "Chicken",
          id: "nonexistent",
        },
      }),
    ).toThrow("Animal nonexistent not found in building henHouse");
  });
});
