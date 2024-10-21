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
              lovedAt: 0,
              item: "Petting Hand",
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

  it("gives 60 experience feeding kernel blend to a level 1 chicken", () => {
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
              lovedAt: 0,
              item: "Petting Hand",
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

    expect(state.henHouse.animals[chickenId].experience).toBe(60);
  });

  it("gives 60 experience feeding kernel blend to a level 2 chicken", () => {
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
              lovedAt: 0,
              item: "Petting Hand",
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

    expect(state.henHouse.animals[chickenId].experience).toBe(80);
  });

  it("feeds a cow", () => {
    const cowId = "123";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(5),
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
              lovedAt: 0,
              item: "Petting Hand",
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
                lovedAt: 0,
                item: "Petting Hand",
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
    ).toThrow("Player does not have enough Kernel Blend");
  });

  it("subtracts food from player inventory", () => {
    const cowId = "123";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...INITIAL_FARM,
        inventory: {
          ...INITIAL_FARM.inventory,
          "Kernel Blend": new Decimal(6),
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
              lovedAt: 0,
              item: "Petting Hand",
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
                lovedAt: 0,
                item: "Petting Hand",
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
              lovedAt: 0,
              item: "Petting Hand",
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
              lovedAt: 0,
              item: "Petting Hand",
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

    expect(state.henHouse.animals[chickenId].experience).toBe(60);
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
                lovedAt: 0,
                item: "Petting Hand",
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
    ).toThrow("Player does not have enough Hay");
  });

  it("sets the state to happy if fed favourite food", () => {
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
              experience: 120,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
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
              lovedAt: 0,
              item: "Petting Hand",
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

  it("sets the state to ready when levelling up", () => {
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
              lovedAt: 0,
              item: "Petting Hand",
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

    expect(state.henHouse.animals[chickenId].state).toBe("ready");
  });

  it("throws if the animal is sick", () => {
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
                state: "sick",
                experience: 0,
                asleepAt: 0,
                lovedAt: 0,
                item: "Petting Hand",
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
    ).toThrow("Cannot feed a sick animal");
  });
});
