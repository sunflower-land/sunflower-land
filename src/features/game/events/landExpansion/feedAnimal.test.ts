import Decimal from "decimal.js-light";
import { feedAnimal } from "./feedAnimal";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("feedAnimal", () => {
  const now = Date.now();

  it("gives 10 experience feeding hay to a level 1 chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Hay: new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Hay",
      },
    });

    expect(state.henHouse.animals[chickenId].experience).toBe(10);
  });

  it("gives 20 experience feeding kernel blend to a level 1 chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Kernel Blend",
      },
    });

    expect(state.henHouse.animals[chickenId].experience).toBe(20);
  });

  it("gives 30 experience feeding kernel blend to a level 2 chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 20,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Kernel Blend",
      },
    });

    expect(state.henHouse.animals[chickenId].experience).toBe(50);
  });

  it("feeds a cow", () => {
    const cowId = "123";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(1),
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [cowId]: {
              coordinates: { x: 0, y: 0 },
              id: cowId,
              type: "Cow",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: cowId,
        food: "Kernel Blend",
      },
    });

    expect(state.barn.animals[cowId].experience).not.toBe(0);
  });

  it("requires animal exists", () => {
    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            "Kernel Blend": new Decimal(1),
          },
          barn: {
            ...INITIAL_FARM.barn,
            animals: {},
          },
        },
        action: {
          type: "animal.fed",
          animal: "Cow",
          id: "123",
          food: "Kernel Blend",
        },
      }),
    ).toThrow("Animal 123 not found in building barn");
  });

  it("requires food exists in player inventory", () => {
    const cowId = "123";

    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...INITIAL_FARM,
          barn: {
            ...INITIAL_FARM.barn,
            animals: {
              [cowId]: {
                coordinates: { x: 0, y: 0 },
                id: cowId,
                type: "Cow",
                createdAt: 0,
                state: "idle",
                experience: 0,
                asleepAt: 0,
              },
            },
          },
        },
        action: {
          type: "animal.fed",
          animal: "Cow",
          id: cowId,
          food: "Kernel Blend",
        },
      }),
    ).toThrow("Player does not have any Kernel Blend");
  });

  it("subtracts food from player inventory", () => {
    const cowId = "123";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(2),
        },
        barn: {
          ...INITIAL_FARM.barn,
          animals: {
            [cowId]: {
              coordinates: { x: 0, y: 0 },
              id: cowId,
              type: "Cow",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: cowId,
        food: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toStrictEqual(new Decimal(1));
  });

  it("drops an egg if fed kernel blend to a level 1 chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Kernel Blend",
      },
    });

    expect(state.inventory.Egg).toStrictEqual(new Decimal(1));
  });

  it("does not drop an egg if fed hay to a level 1 chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Hay: new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Hay",
      },
    });

    expect(state.inventory.Egg).toBeUndefined();
  });

  it("drops two eggs and one feather if fed hay to a level 3 chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Hay: new Decimal(1),
        },
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
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Hay",
      },
    });

    expect(state.inventory.Egg).toStrictEqual(new Decimal(2));
    expect(state.inventory.Feather).toStrictEqual(new Decimal(1));
  });

  it("updates asleepAt when levelling up", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 20,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Kernel Blend",
      },
    });

    expect(state.henHouse.animals[chickenId].asleepAt).toBe(now);
  });

  it("does not update asleepAt when not levelling up", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(1),
        },
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
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Kernel Blend",
      },
    });

    expect(state.henHouse.animals[chickenId].asleepAt).toBe(0);
  });

  it("throws if the animal is asleep", () => {
    const chickenId = "xyz";

    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            "Kernel Blend": new Decimal(1),
          },
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
                asleepAt: now,
              },
            },
          },
        },
        action: {
          type: "animal.fed",
          animal: "Chicken",
          id: chickenId,
          food: "Kernel Blend",
        },
      }),
    ).toThrow("Animal is asleep");
  });

  it("feeds for free if Golden Egg is placed and feeding Chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Gold Egg": new Decimal(1),
          Hay: new Decimal(1),
        },
        collectibles: {
          "Gold Egg": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Hay",
      },
    });

    expect(state.inventory.Hay).toStrictEqual(new Decimal(1));
  });

  it("picks the favourite food if Golden Egg is placed and feeding Chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Gold Egg": new Decimal(1),
        },
        collectibles: {
          "Gold Egg": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Hay",
      },
    });

    expect(state.henHouse.animals[chickenId].experience).toBe(20);
  });

  it("does not feed for free if Golden Egg is placed and feeding Cow", () => {
    const cowId = "123";

    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...INITIAL_FARM,
          inventory: {
            ...INITIAL_FARM.inventory,
            "Gold Egg": new Decimal(1),
          },
          collectibles: {
            "Gold Egg": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "1",
                readyAt: 0,
              },
            ],
          },
          barn: {
            ...INITIAL_FARM.barn,
            animals: {
              [cowId]: {
                coordinates: { x: 0, y: 0 },
                id: cowId,
                type: "Cow",
                createdAt: 0,
                state: "idle",
                experience: 50,
                asleepAt: 0,
              },
            },
          },
        },
        action: {
          type: "animal.fed",
          animal: "Cow",
          id: cowId,
          food: "Hay",
        },
      }),
    ).toThrow("Player does not have any Hay");
  });

  it("sets the state to happy if fed favourite food", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Hay: new Decimal(1),
        },
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
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Hay",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("happy");
  });

  it("sets the state to sad not fed favourite food", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          Hay: new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Hay",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("sad");
  });

  it("sets the state to idle if asleep", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(1),
        },
        henHouse: {
          ...INITIAL_FARM.henHouse,
          animals: {
            [chickenId]: {
              coordinates: { x: 0, y: 0 },
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "sad",
              experience: 0,
              asleepAt: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        food: "Kernel Blend",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
  });
});
