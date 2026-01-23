import Decimal from "decimal.js-light";
import { ANIMAL_SLEEP_DURATION, feedAnimal, handleFoodXP } from "./feedAnimal";
import { INITIAL_FARM } from "features/game/lib/constants";
import { ANIMAL_LEVELS } from "features/game/types/animals";
import { GameState } from "features/game/types/game";

describe("feedAnimal", () => {
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

  it("throws an error if the animal building is not placed", () => {
    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...GAME_STATE,
          buildings: {
            Barn: [
              {
                id: "123",
                coordinates: undefined,
                createdAt: 0,
                readyAt: 0,
              },
            ],
            "Hen House": [
              {
                id: "456",
                coordinates: undefined,
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "animal.fed",
          animal: "Chicken",
          id: "0",
          item: "Hay",
        },
      }),
    ).toThrow("Building does not exist");
  });

  it("gives 10 experience feeding hay to a level 1 chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          Hay: new Decimal(1),
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
              asleepAt: 0,
              awakeAt: 0,
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
        item: "Hay",
      },
    });

    expect(state.henHouse.animals[chickenId].experience).toBe(10);
  });

  it("gives 60 experience feeding kernel blend to a level 1 chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Kernel Blend": new Decimal(1),
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
              asleepAt: 0,
              awakeAt: 0,
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
        item: "Kernel Blend",
      },
    });

    expect(state.henHouse.animals[chickenId].experience).toBe(60);
  });

  it("gives 60 experience feeding kernel blend to a level 2 chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Kernel Blend": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 20,
              asleepAt: 0,
              awakeAt: 0,
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
        item: "Kernel Blend",
      },
    });

    expect(state.henHouse.animals[chickenId].experience).toBe(80);
  });

  it("feeds a cow", () => {
    const cowId = "123";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Kernel Blend": new Decimal(5),
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            [cowId]: {
              id: cowId,
              type: "Cow",
              createdAt: 0,
              state: "idle",
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
        type: "animal.fed",
        animal: "Cow",
        id: cowId,
        item: "Kernel Blend",
      },
    });

    expect(state.barn.animals[cowId].experience).not.toBe(0);
  });

  it("requires animal exists", () => {
    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...GAME_STATE,
          inventory: {
            ...GAME_STATE.inventory,
            "Kernel Blend": new Decimal(1),
          },
          barn: {
            ...GAME_STATE.barn,
            animals: {},
          },
        },
        action: {
          type: "animal.fed",
          animal: "Cow",
          id: "123",
          item: "Kernel Blend",
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
          ...GAME_STATE,
          barn: {
            ...GAME_STATE.barn,
            animals: {
              [cowId]: {
                id: cowId,
                type: "Cow",
                createdAt: 0,
                state: "idle",
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
          type: "animal.fed",
          animal: "Cow",
          id: cowId,
          item: "Kernel Blend",
        },
      }),
    ).toThrow("Player does not have enough Kernel Blend");
  });

  it("subtracts food from player inventory", () => {
    const cowId = "123";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Kernel Blend": new Decimal(6),
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            [cowId]: {
              id: cowId,
              type: "Cow",
              createdAt: 0,
              state: "idle",
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
        type: "animal.fed",
        animal: "Cow",
        id: cowId,
        item: "Kernel Blend",
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
          ...GAME_STATE,
          inventory: {
            ...GAME_STATE.inventory,
            "Kernel Blend": new Decimal(1),
          },
          henHouse: {
            ...GAME_STATE.henHouse,
            animals: {
              [chickenId]: {
                id: chickenId,
                type: "Chicken",
                createdAt: 0,
                state: "idle",
                experience: 50,
                asleepAt: now,
                awakeAt: now + ANIMAL_SLEEP_DURATION,
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
          item: "Kernel Blend",
        },
      }),
    ).toThrow("Animal is asleep");
  });

  it("throws an error if no food is provided and no Golden Egg is placed", () => {
    const chickenId = "xyz";

    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...GAME_STATE,
          inventory: {},
          collectibles: {},
          henHouse: {
            ...GAME_STATE.henHouse,
            animals: {
              [chickenId]: {
                id: chickenId,
                type: "Chicken",
                createdAt: 0,
                state: "idle",
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
          type: "animal.fed",
          animal: "Chicken",
          id: chickenId,
        },
      }),
    ).toThrow("No food provided");
  });

  it("feeds for free if Golden Egg is placed and feeding Chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
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
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
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
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
      },
    });

    expect(state.henHouse.animals[chickenId].experience).toBe(60);
  });

  it("picks the favourite food if Golden Egg is placed and feeding Chicken", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
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
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
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
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
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
          ...GAME_STATE,
          inventory: {
            ...GAME_STATE.inventory,
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
            ...GAME_STATE.barn,
            animals: {
              [cowId]: {
                id: cowId,
                type: "Cow",
                createdAt: 0,
                state: "idle",
                experience: 50,
                asleepAt: 0,
                lovedAt: 0,
                awakeAt: 0,
                item: "Petting Hand",
              },
            },
          },
        },
        action: {
          type: "animal.fed",
          animal: "Cow",
          id: cowId,
          item: "Hay",
        },
      }),
    ).toThrow("Player does not have enough Hay");
  });

  it("sets the state to happy if fed favourite food", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Kernel Blend": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 120,
              asleepAt: 0,
              awakeAt: 0,
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
        item: "Kernel Blend",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("happy");
  });

  it("sets the state to sad not fed favourite food", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          Hay: new Decimal(1),
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
              asleepAt: 0,
              awakeAt: 0,
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
        item: "Hay",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("sad");
  });

  it("sets the state to ready when levelling up", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Kernel Blend": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: 20,
              asleepAt: 0,
              awakeAt: 0,
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
        item: "Kernel Blend",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("ready");
  });

  it("cures a sick animal for Free when Oracle Syringe is equipped", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          equipped: {
            ...GAME_STATE.bumpkin?.equipped,
            wings: "Oracle Syringe",
          },
        },
        inventory: {
          ...GAME_STATE.inventory,
          "Barn Delight": new Decimal(1),
        },
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
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        item: "Barn Delight",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.inventory["Barn Delight"]).toStrictEqual(new Decimal(1));
    expect(state.henHouse.animals[chickenId].experience).toBe(0);
  });

  it("cures a sick animal with Barn Delight", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Barn Delight": new Decimal(1),
        },
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
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        item: "Barn Delight",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.inventory["Barn Delight"]).toStrictEqual(new Decimal(0));
    expect(state.henHouse.animals[chickenId].experience).toBe(0);
  });

  it("cures a sick animal with Barn Delight with Medic Apron", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          equipped: {
            ...GAME_STATE.bumpkin.equipped,
            coat: "Medic Apron",
          },
        },
        inventory: {
          ...GAME_STATE.inventory,
          "Barn Delight": new Decimal(0.5),
        },
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
        type: "animal.fed",
        animal: "Chicken",
        id: chickenId,
        item: "Barn Delight",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.inventory["Barn Delight"]).toStrictEqual(new Decimal(0));
    expect(state.henHouse.animals[chickenId].experience).toBe(0);
  });

  it("cures a sick animal while its sleeping", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Barn Delight": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            [chickenId]: {
              id: chickenId,
              type: "Chicken",
              createdAt: 0,
              state: "sick",
              experience: 0,
              asleepAt: Date.now() - 1000,
              awakeAt: Date.now() + 24 * 60 * 60 * 1000,
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
        item: "Barn Delight",
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.inventory["Barn Delight"]).toStrictEqual(new Decimal(0));
    expect(state.henHouse.animals[chickenId].experience).toBe(0);
  });

  it("throws an error when trying to cure a healthy animal", () => {
    const chickenId = "xyz";

    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...GAME_STATE,
          inventory: {
            ...GAME_STATE.inventory,
            "Barn Delight": new Decimal(1),
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
                asleepAt: 0,
                awakeAt: 0,
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
          item: "Barn Delight",
        },
      }),
    ).toThrow("Cannot cure a healthy animal");
  });

  it("throws an error when trying to cure without Barn Delight", () => {
    const chickenId = "xyz";

    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...GAME_STATE,
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
          type: "animal.fed",
          animal: "Chicken",
          id: chickenId,
          item: "Barn Delight",
        },
      }),
    ).toThrow("Not enough Barn Delight to cure the animal");
  });

  it("throws if the animal is sick and not fed Barn Delight", () => {
    const chickenId = "xyz";

    expect(() =>
      feedAnimal({
        createdAt: now,
        state: {
          ...GAME_STATE,
          inventory: {
            ...GAME_STATE.inventory,
            "Kernel Blend": new Decimal(1),
          },
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
          type: "animal.fed",
          animal: "Chicken",
          id: chickenId,
          item: "Kernel Blend",
        },
      }),
    ).toThrow("Cannot feed a sick animal");
  });

  it("increments the bumpkin activity when feeding an animal", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Kernel Blend": new Decimal(1),
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.farmActivity["Chicken Fed"]).toBe(1);
  });

  it("increments the bumpkin activity when curing an animal", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Barn Delight": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              state: "sick",
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Barn Delight",
      },
    });

    expect(state.farmActivity["Chicken Cured"]).toBe(1);
  });

  it("takes 10% less food to feed a chicken if a user has a Fat Chicken placed", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Fat Chicken": new Decimal(1),
          Hay: new Decimal(1),
        },
        collectibles: {
          "Fat Chicken": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Hay",
      },
    });

    expect(state.inventory.Hay).toEqual(new Decimal(0.1));
  });

  it("takes 20% less food to feed a chicken if a user has a Cluckulator placed", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          Cluckulator: new Decimal(1),
          "Kernel Blend": new Decimal(1),
        },
        collectibles: {
          Cluckulator: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(0.25));
  });

  it("Applies Fat Chicken and Cluckulator boost", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Fat Chicken": new Decimal(1),
          Cluckulator: new Decimal(1),
          "Kernel Blend": new Decimal(1),
        },
        collectibles: {
          Cluckulator: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
          "Fat Chicken": [
            {
              coordinates: { x: 5, y: 5 },
              createdAt: 0,
              id: "2",
              readyAt: 0,
            },
          ],
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Kernel Blend",
      },
    });
    const result = new Decimal(1).minus(new Decimal(1).times(0.75).times(0.9));
    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(result));
  });

  it("takes 50% less food to feed a sheep if Infernal Bullwhip is worn", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          equipped: {
            ...GAME_STATE.bumpkin?.equipped,
            tool: "Infernal Bullwhip",
          },
        },
        inventory: {
          "Kernel Blend": new Decimal(3),
        },
      },
      action: {
        type: "animal.fed",
        animal: "Sheep",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(1.5));
  });

  it("takes 50% less food to feed a cow if Infernal Bullwhip is worn", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          equipped: {
            ...GAME_STATE.bumpkin?.equipped,
            tool: "Infernal Bullwhip",
          },
        },
        inventory: {
          "Kernel Blend": new Decimal(5),
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(2.5));
  });

  it("sets animal to ready state when completing a cycle at max level", () => {
    // Setup chicken at max level (15)
    const maxLevelXP = ANIMAL_LEVELS["Chicken"][15];
    // Add enough XP to complete one cycle (240 XP - difference between level 14-15)
    const cycleXP = ANIMAL_LEVELS["Chicken"][15] - ANIMAL_LEVELS["Chicken"][14];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Mixed Grain": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              id: "0",
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: maxLevelXP + cycleXP - 60, // One Favourite Food feed away from cycle
              asleepAt: 0,
              awakeAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Mixed Grain",
      },
    });

    expect(state.henHouse.animals["0"].state).toBe("ready");
  });

  it("sets animal to ready state when completing a cycle at max level with a Gold Egg", () => {
    // Setup chicken at max level (15)
    const maxLevelXP = ANIMAL_LEVELS["Chicken"][15];
    // Add enough XP to complete one cycle (240 XP - difference between level 14-15)
    const cycleXP = ANIMAL_LEVELS["Chicken"][15] - ANIMAL_LEVELS["Chicken"][14];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Mixed Grain": new Decimal(1),
        },
        collectibles: {
          "Gold Egg": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              id: "0",
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: maxLevelXP + cycleXP - 60, // One Favourite Food feed away from cycle
              asleepAt: 0,
              awakeAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Mixed Grain",
      },
    });

    expect(state.henHouse.animals["0"].state).toBe("ready");
  });

  it("maintains correct state through multiple cycles", () => {
    // Setup chicken at max level (15)
    const maxLevelXP = ANIMAL_LEVELS["Chicken"][15];
    // Add enough XP to complete one cycle (240 XP - difference between level 14-15)
    const cycleXP = ANIMAL_LEVELS["Chicken"][15] - ANIMAL_LEVELS["Chicken"][14];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Mixed Grain": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              id: "0",
              type: "Chicken",
              createdAt: 0,
              state: "idle",
              experience: maxLevelXP + cycleXP + 80, // One Favourite Food feed into a new cycle
              asleepAt: 0,
              awakeAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Mixed Grain",
      },
    });

    // Should be in happy state since we're mid-cycle
    expect(state.henHouse.animals["0"].state).toBe("happy");
    // Experience should continue accumulating
    expect(state.henHouse.animals["0"].experience).toBe(
      maxLevelXP + cycleXP + 80 + 80,
    );
  });

  it("sets animal to ready state after going over the second cycle", () => {
    const maxLevelXP = ANIMAL_LEVELS["Chicken"][15];
    const cycleXP = ANIMAL_LEVELS["Chicken"][15] - ANIMAL_LEVELS["Chicken"][14];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Mixed Grain": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              experience: maxLevelXP + cycleXP + cycleXP - 70,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Mixed Grain",
      },
    });

    expect(state.henHouse.animals["0"].state).toBe("ready");
  });

  it("correctly transitions to ready state at exact cycle completion", () => {
    const maxLevelXP = ANIMAL_LEVELS["Chicken"][15];
    const cycleXP = ANIMAL_LEVELS["Chicken"][15] - ANIMAL_LEVELS["Chicken"][14];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Mixed Grain": new Decimal(1),
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              id: "0",
              type: "Chicken",
              createdAt: 0,
              state: "happy",
              experience: maxLevelXP + cycleXP * 2 - 80, // One feed away from cycle completion
              asleepAt: 0,
              awakeAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Mixed Grain",
      },
    });

    expect(state.henHouse.animals["0"].state).toBe("ready");
    expect(state.henHouse.animals["0"].experience).toBe(
      maxLevelXP + cycleXP * 2,
    );
  });

  it("sets cow to ready state when completing a cycle at max level", () => {
    // Setup cow at max level (15)
    const maxLevelXP = ANIMAL_LEVELS["Cow"][15];
    // Add enough XP to complete one cycle (240 XP - difference between level 14-15)
    const cycleXP = ANIMAL_LEVELS["Cow"][15] - ANIMAL_LEVELS["Cow"][14];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          "Mixed Grain": new Decimal(5),
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            "0": {
              id: "0",
              type: "Cow",
              createdAt: 0,
              state: "idle",
              experience: maxLevelXP + cycleXP - 60, // One Favourite Food feed away from cycle
              asleepAt: 0,
              awakeAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
        item: "Mixed Grain",
      },
    });

    expect(state.barn.animals["0"].state).toBe("ready");
  });

  it("handles chonky feed skill", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Mixed Grain": new Decimal(2),
        },
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Chonky Feed": 1,
          },
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Mixed Grain",
      },
    });

    const { foodXp } = handleFoodXP({
      state: state,
      animal: "Chicken",
      level: 1,
      food: "Mixed Grain",
    });

    expect(state.inventory["Mixed Grain"]).toEqual(new Decimal(0.5));
    expect(state.henHouse.animals["0"].experience).toEqual(foodXp);
  });
  it("handles chonky feed skill for chicken with Gold Egg placed", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Chonky Feed": 1,
          },
        },
        collectibles: {
          "Gold Egg": [
            {
              id: "1",
              coordinates: {
                x: 0,
                y: 0,
              },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
      },
    });
    expect(state.henHouse.animals["0"].experience).toEqual(120);
  });

  it("handles chonky feed skill for cows with Golden Cow placed", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Chonky Feed": 1,
          },
        },
        collectibles: {
          "Golden Cow": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            "0": {
              ...GAME_STATE.barn.animals["0"],
              type: "Cow",
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
      },
    });
    expect(state.barn.animals["0"].experience).toEqual(240);
  });

  it("handles chonky feed skill for sheep with Golden Sheep placed", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin,
          skills: {
            "Chonky Feed": 1,
          },
        },
        collectibles: {
          "Golden Sheep": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            "0": {
              ...GAME_STATE.barn.animals["0"],
              type: "Sheep",
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Sheep",
        id: "0",
      },
    });
    expect(state.barn.animals["0"].experience).toEqual(120);
  });

  it("feeds a cow for free if the player has a Golden Cow", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Mixed Grain": new Decimal(2),
        },
        collectibles: {
          "Golden Cow": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
      },
    });

    expect(state.inventory["Mixed Grain"]).toEqual(new Decimal(2));
  });

  it("feeds a cow to the next level if the player has a Golden Cow", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        collectibles: {
          "Golden Cow": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
      },
    });

    expect(state.barn.animals["0"].experience).toEqual(200);
  });

  it("feeds a max level chicken the max level xp if the player has a Gold Egg", () => {
    const maxLevelXP = ANIMAL_LEVELS["Chicken"][15];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        collectibles: {
          "Gold Egg": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              experience: maxLevelXP,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
      },
    });

    expect(state.henHouse.animals["0"].experience).toEqual(
      maxLevelXP + maxLevelXP,
    );
  });

  it("feeds a chicken that is over max level the max level xp if the player has a Gold Egg", () => {
    const maxLevelXP = ANIMAL_LEVELS["Chicken"][15];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        collectibles: {
          "Gold Egg": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              experience: maxLevelXP + 100,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
      },
    });

    expect(state.henHouse.animals["0"].experience).toEqual(
      maxLevelXP + maxLevelXP,
    );
  });

  it("feeds a max level cow the max level xp if the player has a Golden Cow", () => {
    const maxLevelXP = ANIMAL_LEVELS["Cow"][15];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        collectibles: {
          "Golden Cow": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            "0": {
              ...GAME_STATE.barn.animals["0"],
              experience: maxLevelXP,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
      },
    });

    expect(state.barn.animals["0"].experience).toEqual(maxLevelXP + maxLevelXP);
  });

  it("feeds a cow that is over max level the max level xp if the player has a Golden Cow", () => {
    const maxLevelXP = ANIMAL_LEVELS["Cow"][15];

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        collectibles: {
          "Golden Cow": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            "0": {
              ...GAME_STATE.barn.animals["0"],
              experience: maxLevelXP + 100,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
      },
    });

    expect(state.barn.animals["0"].experience).toEqual(maxLevelXP + maxLevelXP);
  });

  it("feeds a sheep for free if the player has a Golden Sheep", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Mixed Grain": new Decimal(2),
        },
        collectibles: {
          "Golden Sheep": [
            {
              id: "1",
              coordinates: { x: 0, y: 0 },
              readyAt: 0,
              createdAt: 0,
            },
          ],
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Sheep",
        id: "0",
      },
    });

    expect(state.inventory["Mixed Grain"]).toEqual(new Decimal(2));
  });

  it("takes 5% less food to feed a cow if Dr Cow is placed", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Kernel Blend": new Decimal(5),
        },
        collectibles: {
          "Dr Cow": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "1",
              readyAt: 0,
            },
          ],
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            "0": {
              ...GAME_STATE.barn.animals["0"],
              type: "Cow",
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(0.25));
  });

  it("takes 5% less food to feed a cow or sheep if Collie Shrine is active", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Kernel Blend": new Decimal(5),
        },
        collectibles: {
          "Collie Shrine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: now,
              id: "1",
              readyAt: now,
            },
          ],
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            "0": {
              ...GAME_STATE.barn.animals["0"],
              type: "Cow",
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(0.25));
  });

  it("does not take 5% less food to feed Chicken if Collie Shrine is active", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Kernel Blend": new Decimal(5),
        },
        collectibles: {
          "Collie Shrine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: now,
              id: "1",
              readyAt: now,
            },
          ],
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              type: "Chicken",
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(4));
  });

  it("takes 5% less food to feed a chicken if Bantam Shrine is active", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Kernel Blend": new Decimal(5),
        },
        collectibles: {
          "Bantam Shrine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: now,
              id: "1",
              readyAt: now,
            },
          ],
        },
        henHouse: {
          ...GAME_STATE.henHouse,
          animals: {
            "0": {
              ...GAME_STATE.henHouse.animals["0"],
              type: "Chicken",
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Chicken",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(4.05));
  });

  it("does not take 5% less food to feed cow or sheep if Bantam Shrine is active", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Kernel Blend": new Decimal(5),
        },
        collectibles: {
          "Bantam Shrine": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: now,
              id: "1",
              readyAt: now,
            },
          ],
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            "0": {
              ...GAME_STATE.barn.animals["0"],
              type: "Cow",
              experience: 0,
            },
          },
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(0));
  });
});
