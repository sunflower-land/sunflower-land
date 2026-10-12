import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import { ANIMAL_SLEEP_DURATION, feedAnimal, handleFoodXP } from "./feedAnimal";
import {
  BEETLE_FEEDING_XP,
  type BeetleName,
} from "features/game/types/beetles";
import { INITIAL_FARM } from "features/game/lib/constants";
import { ANIMAL_LEVELS, type AnimalType } from "features/game/types/animals";
import { getAnimalLevel } from "features/game/lib/animals";
import type {
  Animal,
  AnimalFoodName,
  GameState,
} from "features/game/types/game";
import { makeAnimalBuilding } from "features/game/lib/animals";

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

describe("feedAnimal", () => {
  const now = Date.now();

  const GAME_STATE: GameState = {
    ...FARM_WITH_HERDS,
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

  it("takes 25% less food when Honey Treat buff is active", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          "Kernel Blend": new Decimal(5),
        },
        barn: {
          ...GAME_STATE.barn,
          animals: {
            "0": {
              ...GAME_STATE.barn.animals["0"],
              type: "Cow",
              experience: 0,
              feedBuff: { name: "Honey Treat", harvestsRemaining: 3 },
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

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(1.25));
  });

  it("records Golden Cow in boostsUsedAt when feeding a cow for free", () => {
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

    expect(state.boostsUsedAt?.["Golden Cow"]).toEqual(now);
  });

  it("records Golden Sheep in boostsUsedAt when feeding a sheep for free", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
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

    expect(state.boostsUsedAt?.["Golden Sheep"]).toEqual(now);
  });

  it("records Gold Egg in boostsUsedAt when feeding a chicken for free", () => {
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

    expect(state.boostsUsedAt?.["Gold Egg"]).toEqual(now);
  });

  describe("when over the building's capacity", () => {
    // Hen House level 1 has a base capacity of 10 animals (no Chicken Coop).
    const makeChickens = (count: number): Record<string, Animal> => {
      const animals: Record<string, Animal> = {};
      for (let i = 0; i < count; i++) {
        const id = `chicken-${i}`;
        animals[id] = {
          id,
          type: "Chicken",
          state: "idle",
          // Oldest first: chicken-0 has the smallest createdAt.
          createdAt: i + 1,
          experience: 0,
          asleepAt: 0,
          awakeAt: 0,
          lovedAt: 0,
          item: "Petting Hand",
        };
      }
      return animals;
    };

    const overCapacityState: GameState = {
      ...GAME_STATE,
      inventory: {
        ...GAME_STATE.inventory,
        Hay: new Decimal(10),
        "Barn Delight": new Decimal(10),
      },
      henHouse: {
        ...GAME_STATE.henHouse,
        level: 1,
        animals: makeChickens(11),
      },
    };

    it("throws when feeding an animal beyond capacity (oldest are locked)", () => {
      expect(() =>
        feedAnimal({
          createdAt: now,
          state: overCapacityState,
          action: {
            type: "animal.fed",
            animal: "Chicken",
            id: "chicken-0", // oldest -> locked
            item: "Hay",
          },
        }),
      ).toThrow("Animal exceeds building capacity and cannot be fed");
    });

    it("allows feeding the newest animals that remain within capacity", () => {
      const state = feedAnimal({
        createdAt: now,
        state: overCapacityState,
        action: {
          type: "animal.fed",
          animal: "Chicken",
          id: "chicken-10", // newest -> feedable
          item: "Hay",
        },
      });

      expect(state.henHouse.animals["chicken-10"].experience).toBe(10);
    });

    it("does not lock any animals when exactly at capacity", () => {
      const state = feedAnimal({
        createdAt: now,
        state: {
          ...overCapacityState,
          henHouse: {
            ...overCapacityState.henHouse,
            animals: makeChickens(10), // exactly at capacity
          },
        },
        action: {
          type: "animal.fed",
          animal: "Chicken",
          id: "chicken-0",
          item: "Hay",
        },
      });

      expect(state.henHouse.animals["chicken-0"].experience).toBe(10);
    });

    it("unlocks all animals when the capacity collectible is placed", () => {
      const state = feedAnimal({
        createdAt: now,
        state: {
          ...overCapacityState,
          collectibles: {
            ...overCapacityState.collectibles,
            "Chicken Coop": [
              {
                id: "1",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "animal.fed",
          animal: "Chicken",
          id: "chicken-0", // would be locked without the Chicken Coop
          item: "Hay",
        },
      });

      expect(state.henHouse.animals["chicken-0"].experience).toBe(10);
    });

    it("still allows curing a sick over-capacity animal", () => {
      const sickChickens = makeChickens(11);
      sickChickens["chicken-0"].state = "sick"; // oldest -> locked

      const state = feedAnimal({
        createdAt: now,
        state: {
          ...overCapacityState,
          henHouse: {
            ...overCapacityState.henHouse,
            animals: sickChickens,
          },
        },
        action: {
          type: "animal.fed",
          animal: "Chicken",
          id: "chicken-0",
          item: "Barn Delight",
        },
      });

      expect(state.henHouse.animals["chicken-0"].state).toBe("idle");
    });

    it("breaks createdAt ties by purchase (insertion) order, not id", () => {
      // 11 chickens all created at the same time -> exactly 1 is locked.
      // Insert the oldest (by purchase order) first, giving it an id that is
      // NOT the lexicographically smallest, so an id-based tie-break would lock
      // a different animal.
      const makeChicken = (id: string): Animal => ({
        id,
        type: "Chicken",
        state: "idle",
        createdAt: 1000,
        experience: 0,
        asleepAt: 0,
        awakeAt: 0,
        lovedAt: 0,
        item: "Petting Hand",
      });

      const animals: Record<string, Animal> = {
        "m-first": makeChicken("m-first"),
      };
      for (let i = 0; i < 10; i++) {
        animals[`a-${i}`] = makeChicken(`a-${i}`);
      }

      const state: GameState = {
        ...overCapacityState,
        henHouse: { ...overCapacityState.henHouse, animals },
      };

      // The first-inserted animal is locked, even though its id sorts last.
      expect(() =>
        feedAnimal({
          createdAt: now,
          state,
          action: {
            type: "animal.fed",
            animal: "Chicken",
            id: "m-first",
            item: "Hay",
          },
        }),
      ).toThrow("Animal exceeds building capacity and cannot be fed");

      // A later-purchased animal with a smaller id stays feedable.
      const fed = feedAnimal({
        createdAt: now,
        state,
        action: {
          type: "animal.fed",
          animal: "Chicken",
          id: "a-0",
          item: "Hay",
        },
      });
      expect(fed.henHouse.animals["a-0"].experience).toBe(10);
    });
  });
});

describe("feedAnimal: Pig level is not capped by the Pigpen", () => {
  const now = Date.now();

  const farm = (experience: number): GameState => ({
    ...FARM_WITH_HERDS,
    inventory: {
      ...FARM_WITH_HERDS.inventory,
      "Hearty Slop": new Decimal(50),
      "Rich Slop": new Decimal(50),
    },
    buildings: {
      ...FARM_WITH_HERDS.buildings,
      Pigpen: [
        { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
      ],
    },
    pigpen: {
      level: 1,
      animals: {
        "1": {
          id: "1",
          type: "Pig",
          state: "idle",
          createdAt: 0,
          experience,
          asleepAt: 0,
          awakeAt: 0,
          lovedAt: 0,
          item: "Petting Hand",
        },
      },
    },
  });

  const feed = (state: GameState, item: AnimalFoodName) =>
    feedAnimal({
      state,
      action: { type: "animal.fed", animal: "Pig", id: "1", item },
      createdAt: now,
    });

  it("levels a Pig past 5 in a level 1 Pigpen", () => {
    // Just short of level 6: one favourite feed crosses the threshold.
    const state = feed(farm(ANIMAL_LEVELS.Pig[6] - 1), "Hearty Slop");
    const pig = state.pigpen.animals["1"];

    expect(getAnimalLevel(pig.experience, "Pig")).toBe(6);
    expect(pig.state).toBe("ready");
  });

  it("uses the favourite food of the Pig's real level, not the pen's", () => {
    // A level 7 Pig wants Rich Slop; Hearty Slop is a sad feed at that level.
    const state = feed(farm(ANIMAL_LEVELS.Pig[7]), "Hearty Slop");

    expect(state.pigpen.animals["1"].state).toBe("sad");
  });
});

describe("feedAnimal: Pig Slops", () => {
  const now = Date.now();
  const PLACED = [
    { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
  ];

  const pig = (experience: number): Animal => ({
    id: "1",
    type: "Pig",
    state: "idle",
    createdAt: 0,
    experience,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
  });

  const farm = (experience = 0, skills = {}): GameState => ({
    ...FARM_WITH_HERDS,
    bumpkin: { ...FARM_WITH_HERDS.bumpkin, skills },
    inventory: {
      ...FARM_WITH_HERDS.inventory,
      "Basic Slop": new Decimal(10),
      "Hearty Slop": new Decimal(10),
      "Rich Slop": new Decimal(10),
      "Gourmet Slop": new Decimal(10),
      Hay: new Decimal(10),
      Omnifeed: new Decimal(10),
    },
    buildings: { ...FARM_WITH_HERDS.buildings, Pigpen: PLACED, Barn: PLACED },
    pigpen: { level: 1, animals: { "1": pig(experience) } },
  });

  const feed = (state: GameState, item: AnimalFoodName) =>
    feedAnimal({
      state,
      action: { type: "animal.fed", animal: "Pig", id: "1", item },
      createdAt: now,
    });

  it.each([
    [0, "Basic Slop", 60],
    [2, "Basic Slop", 60],
    [3, "Hearty Slop", 60],
    [5, "Hearty Slop", 60],
    [6, "Rich Slop", 60],
    [9, "Rich Slop", 60],
    [10, "Gourmet Slop", 80],
    [15, "Gourmet Slop", 80],
  ] as const)(
    "a level %s Pig's favourite is %s, worth %s XP",
    (level, slop, xp) => {
      const experience = ANIMAL_LEVELS.Pig[level];
      const fed = feed(farm(experience), slop).pigpen.animals["1"];

      expect(fed.state).toBe("happy");
      expect(fed.experience - experience).toEqual(xp);
    },
  );

  it.each([
    ["Basic Slop", 10],
    ["Rich Slop", 20],
    ["Gourmet Slop", 30],
  ] as const)("a level 4 Pig eats %s for %s XP", (slop, xp) => {
    const experience = ANIMAL_LEVELS.Pig[4];
    const fed = feed(farm(experience), slop).pigpen.animals["1"];

    expect(fed.state).toBe("sad");
    expect(fed.experience - experience).toEqual(xp);
  });

  it("eats one Slop per feeding", () => {
    const state = feed(farm(), "Basic Slop");

    expect(state.inventory["Basic Slop"]).toEqual(new Decimal(9));
  });

  it.each([
    [1, 0.75],
    [2, 0.65],
    [3, 0.5],
  ])("at Swill Savvy rank %s eats %s of a Slop", (rank, eaten) => {
    const state = feed(farm(0, { "Swill Savvy": rank }), "Basic Slop");

    expect(state.inventory["Basic Slop"]).toEqual(new Decimal(10 - eaten));
  });

  it.each(["Hay", "Omnifeed"] as const)("does not feed a Pig %s", (food) => {
    expect(() => feed(farm(), food)).toThrow(
      "This animal cannot eat this food",
    );
  });

  it("does not feed a Cow a Slop", () => {
    const state = farm();
    const cowId = Object.keys(state.barn.animals).find(
      (id) => state.barn.animals[id].type === "Cow",
    ) as string;

    expect(() =>
      feedAnimal({
        state,
        action: {
          type: "animal.fed",
          animal: "Cow",
          id: cowId,
          item: "Basic Slop",
        },
        createdAt: now,
      }),
    ).toThrow("This animal cannot eat this food");
  });
});

describe("feedAnimal: Mud", () => {
  const now = Date.now();

  const farm = (overrides: Partial<Animal> = {}, skills = {}): GameState => ({
    ...INITIAL_FARM,
    bumpkin: { ...INITIAL_FARM.bumpkin, skills },
    inventory: {
      ...INITIAL_FARM.inventory,
      "Hearty Slop": new Decimal(1000),
      "Basic Slop": new Decimal(1000),
      "Barn Delight": new Decimal(10),
    },
    buildings: {
      ...INITIAL_FARM.buildings,
      Pigpen: [
        { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
      ],
    },
    pigpen: {
      level: 1,
      animals: {
        "1": {
          id: "1",
          type: "Pig",
          state: "idle",
          createdAt: 0,
          // Level 4, whose favourite is Hearty Slop; far enough from level 5
          // that a few feeds never make it ready.
          experience: ANIMAL_LEVELS.Pig[4],
          asleepAt: 0,
          awakeAt: 0,
          lovedAt: 0,
          item: "Petting Hand",
          ...overrides,
        },
      },
    },
  });

  const feed = (
    state: GameState,
    item: AnimalFoodName | "Barn Delight" = "Hearty Slop",
  ) =>
    feedAnimal({
      state,
      action: { type: "animal.fed", animal: "Pig", id: "1", item },
      createdAt: now,
    });

  const gained = (state: GameState, item?: AnimalFoodName) =>
    feed(state, item).pigpen.animals["1"].experience - ANIMAL_LEVELS.Pig[4];

  it("grants a Pig without Mud the base XP", () => {
    expect(gained(farm())).toEqual(60);
  });

  it("grants a muddy Pig 1.25x XP", () => {
    expect(gained(farm({ mud: { harvestsRemaining: 3 } }))).toEqual(75);
  });

  it("keeps the fraction when 1.25x does not land on a whole number", () => {
    // Basic Slop is worth 10 XP to a level 4 Pig.
    expect(
      gained(farm({ mud: { harvestsRemaining: 3 } }), "Basic Slop"),
    ).toEqual(12.5);
  });

  it("never spends a Mud charge on feeding", () => {
    let state = farm({ mud: { harvestsRemaining: 3 } });

    [1, 2, 3, 4].forEach(() => {
      const before = state.pigpen.animals["1"].experience;
      state = feed(state);
      expect(state.pigpen.animals["1"].experience - before).toEqual(75);
      expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 3 });
    });
  });

  it("applies after Chonky Feed", () => {
    // 60 x 2.5 (rank 2) x 1.25
    expect(
      gained(farm({ mud: { harvestsRemaining: 3 } }, { "Chonky Feed": 2 })),
    ).toEqual(187.5);
  });

  it("stays exact with Chonky Feed on an off-tier Slop", () => {
    // 10 x 2.5 x 1.25 = 31.25, with no floating-point drift.
    expect(
      gained(
        farm({ mud: { harvestsRemaining: 3 } }, { "Chonky Feed": 2 }),
        "Basic Slop",
      ),
    ).toEqual(31.25);
  });

  it("runs independently of a spice-rack treat", () => {
    const feedBuff = { name: "Salt Lick" as const, harvestsRemaining: 3 };
    const state = feed(farm({ mud: { harvestsRemaining: 3 }, feedBuff }));

    expect(state.pigpen.animals["1"].experience - ANIMAL_LEVELS.Pig[4]).toEqual(
      75,
    );
    // Treats count down on harvest, not on feeding.
    expect(state.pigpen.animals["1"].feedBuff).toEqual(feedBuff);
    expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 3 });
  });

  it("does not spend a use when curing a sick Pig", () => {
    const state = feed(
      farm({ state: "sick", mud: { harvestsRemaining: 3 } }),
      "Barn Delight",
    );

    expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 3 });
  });

  it("scales handleFoodXP for the previews too", () => {
    const xp = (mud?: Animal["mud"]) =>
      handleFoodXP({
        state: INITIAL_FARM,
        animal: "Pig",
        level: 4,
        food: "Hearty Slop",
        mud,
      }).foodXp;

    expect(xp()).toEqual(60);
    expect(xp({ harvestsRemaining: 1 })).toEqual(75);
    expect(xp({ harvestsRemaining: 0 })).toEqual(60);
  });
});

describe("feedAnimal: direct Beetle feeding", () => {
  const now = Date.now();
  const PLACED = [
    { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
  ];

  const animal = (
    type: Animal["type"],
    experience: number,
    overrides: Partial<Animal> = {},
  ): Animal => ({
    id: "1",
    type,
    state: "idle",
    createdAt: 0,
    experience,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
    ...overrides,
  });

  const farm = (overrides: Partial<GameState> = {}): GameState => ({
    ...FARM_WITH_HERDS,
    inventory: {
      ...FARM_WITH_HERDS.inventory,
      "Brown Beetle": new Decimal(5),
      "Blue Beetle": new Decimal(5),
      "Pink Beetle": new Decimal(5),
      "Amber Beetle": new Decimal(5),
    },
    buildings: {
      ...FARM_WITH_HERDS.buildings,
      "Hen House": PLACED,
      Barn: PLACED,
      Pigpen: PLACED,
    },
    ...overrides,
  });

  const cowFarm = (
    experience: number,
    overrides: Partial<GameState> = {},
    cow: Partial<Animal> = {},
  ) =>
    farm({
      barn: {
        ...FARM_WITH_HERDS.barn,
        animals: { "1": animal("Cow", experience, cow) },
      },
      ...overrides,
    });

  const pigFarm = (
    experience: number,
    {
      mud,
      skills,
    }: { mud?: Animal["mud"]; skills?: GameState["bumpkin"]["skills"] } = {},
  ) =>
    farm({
      pigpen: {
        level: 3,
        animals: { "1": animal("Pig", experience, mud ? { mud } : {}) },
      },
      ...(skills ? { bumpkin: { ...INITIAL_FARM.bumpkin, skills } } : {}),
    });

  const feed = (
    state: GameState,
    type: AnimalType = "Cow",
    item: BeetleName = "Brown Beetle",
  ) =>
    feedAnimal({
      state,
      action: { type: "animal.fed", animal: type, id: "1", item },
      createdAt: now,
    });

  it.each([
    ["Brown Beetle", 80],
    ["Blue Beetle", 160],
    ["Pink Beetle", 320],
    ["Amber Beetle", 640],
  ] as const)("feeds a %s to a Cow for exactly %i XP", (item, xp) => {
    const state = feed(cowFarm(0), "Cow", item);

    expect(BEETLE_FEEDING_XP[item]).toEqual(xp);
    expect(state.barn.animals["1"].experience).toEqual(xp);
    expect(state.inventory[item]).toEqual(new Decimal(4));
  });

  it.each(["Chicken", "Sheep", "Pig"] as const)(
    "feeds a Beetle to a %s for the same XP",
    (type) => {
      const base =
        type === "Pig"
          ? pigFarm(0)
          : farm({
              [type === "Chicken" ? "henHouse" : "barn"]: {
                ...FARM_WITH_HERDS[type === "Chicken" ? "henHouse" : "barn"],
                animals: { "1": animal(type, 0) },
              },
            });
      const state = feed(base, type, "Amber Beetle");
      const key =
        type === "Chicken" ? "henHouse" : type === "Pig" ? "pigpen" : "barn";

      expect(state[key].animals["1"].experience).toEqual(640);
    },
  );

  it("counts as the favourite: the animal is happy, not sad", () => {
    const state = feed(cowFarm(0));

    expect(state.barn.animals["1"].state).toEqual("happy");
  });

  it("levels the animal up and makes it ready when the XP crosses a level", () => {
    const state = feed(cowFarm(ANIMAL_LEVELS.Cow[1] - 50));

    expect(state.barn.animals["1"].experience).toEqual(
      ANIMAL_LEVELS.Cow[1] + 30,
    );
    expect(getAnimalLevel(state.barn.animals["1"].experience, "Cow")).toEqual(
      1,
    );
    expect(state.barn.animals["1"].state).toEqual("ready");
  });

  it("follows the normal feeding rules: an asleep animal cannot be fed", () => {
    expect(() =>
      feed(cowFarm(0, {}, { awakeAt: now + 60 * 60 * 1000 })),
    ).toThrow("Animal is asleep");
  });

  it("follows the normal feeding rules: a sick animal cannot be fed", () => {
    expect(() => feed(cowFarm(0, {}, { state: "sick" }))).toThrow(
      "Cannot feed a sick animal",
    );
  });

  it("uses exactly one Beetle, ignoring feed-saving boosts", () => {
    const state = feed(
      cowFarm(0, {
        inventory: {
          ...FARM_WITH_HERDS.inventory,
          "Brown Beetle": new Decimal(1),
        },
        collectibles: { "Dr Cow": PLACED },
      }),
    );

    expect(state.inventory["Brown Beetle"]).toEqual(new Decimal(0));
  });

  it("throws without the Beetle", () => {
    expect(() => feed(cowFarm(0, { inventory: {} }))).toThrow(
      "Player does not have enough Brown Beetle",
    );
  });

  it("ignores Chonky Feed: no extra XP and still exactly one Beetle", () => {
    const state = feed(
      cowFarm(0, {
        bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Chonky Feed": 3 } },
      }),
    );

    expect(state.barn.animals["1"].experience).toEqual(80);
    expect(state.inventory["Brown Beetle"]).toEqual(new Decimal(4));
  });

  it("grants a muddy Pig 1.25x without spending a Mud charge", () => {
    const state = feed(pigFarm(0, { mud: { harvestsRemaining: 3 } }), "Pig");

    expect(state.pigpen.animals["1"].experience).toEqual(100);
    expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 3 });
  });

  it.each([
    ["Brown Beetle", 100],
    ["Blue Beetle", 200],
    ["Pink Beetle", 400],
    ["Amber Beetle", 800],
  ] as const)(
    "gives a muddy Pig with Chonky Feed only the Mud bonus: %s = %i XP",
    (item, xp) => {
      const state = feed(
        pigFarm(0, {
          mud: { harvestsRemaining: 3 },
          skills: { "Chonky Feed": 2 },
        }),
        "Pig",
        item,
      );

      expect(state.pigpen.animals["1"].experience).toEqual(xp);
    },
  );

  it("keeps counting XP at the max level", () => {
    const state = feed(cowFarm(ANIMAL_LEVELS.Cow[15]), "Cow", "Amber Beetle");

    expect(state.barn.animals["1"].experience).toEqual(
      ANIMAL_LEVELS.Cow[15] + 640,
    );
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

    it("does not feed a Beetle without the BEETLE_FEEDING feature flag", () => {
      expect(() => feed(cowFarm(0))).toThrow("Beetle feeding is not available");
    });

    it("is not unlocked by holding a Beta Pass", () => {
      const state = cowFarm(0);

      expect(() =>
        feed({
          ...state,
          inventory: { ...state.inventory, "Beta Pass": new Decimal(1) },
        }),
      ).toThrow("Beetle feeding is not available");
    });

    it("rejects a Beetle even when a Golden Cow feeds for free", () => {
      expect(() =>
        feed(cowFarm(0, { collectibles: { "Golden Cow": PLACED } })),
      ).toThrow("Beetle feeding is not available");
    });
  });
});
