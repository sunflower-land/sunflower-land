import Decimal from "decimal.js-light";
import { CONFIG } from "lib/config";
import {
  ANIMAL_SLEEP_DURATION,
  feedAnimal,
  getFeedBatchSize,
  handleFoodXP,
} from "./feedAnimal";
import {
  BEETLE_FEEDING_XP,
  type BeetleName,
} from "features/game/types/beetles";
import { INITIAL_FARM } from "features/game/lib/constants";
import { ITEM_DETAILS } from "features/game/types/images";
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
          // A level 0 Cow eats a batch of 3 feeds, 5 Kernel Blend each.
          "Kernel Blend": new Decimal(15),
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
          // A level 0 Cow eats a batch of 3 feeds, 5 Kernel Blend each.
          "Kernel Blend": new Decimal(16),
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

  it("sets the state to ready when fed its favourite food batch", () => {
    const chickenId = "xyz";

    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          ...GAME_STATE.inventory,
          // 120 XP to level 3 at 60 per Kernel Blend.
          "Kernel Blend": new Decimal(2),
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

    expect(state.henHouse.animals[chickenId].state).toBe("ready");
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
          // The starter animal (80 XP) eats a batch of 2 feeds.
          "Kernel Blend": new Decimal(6),
        },
      },
      action: {
        type: "animal.fed",
        animal: "Sheep",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(3));
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
          // The starter Cow (80 XP) eats a batch of 2 feeds.
          "Kernel Blend": new Decimal(10),
        },
      },
      action: {
        type: "animal.fed",
        animal: "Cow",
        id: "0",
        item: "Kernel Blend",
      },
    });

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(5));
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
          // 240 XP left in the cycle at 80 per Mixed Grain.
          "Mixed Grain": new Decimal(3),
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

    // One click finishes the second cycle
    expect(state.henHouse.animals["0"].state).toBe("ready");
    expect(state.henHouse.animals["0"].experience).toBe(
      maxLevelXP + cycleXP * 2,
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
          // A level 0 Cow eats a batch of 3 feeds.
          "Kernel Blend": new Decimal(15),
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

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(0.75));
  });

  it("takes 5% less food to feed a cow or sheep if Collie Shrine is active", () => {
    const state = feedAnimal({
      createdAt: now,
      state: {
        ...GAME_STATE,
        inventory: {
          // A level 0 Cow eats a batch of 3 feeds.
          "Kernel Blend": new Decimal(15),
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

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(0.75));
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
          // A level 0 Cow eats a batch of 3 feeds.
          "Kernel Blend": new Decimal(15),
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
          // A level 0 Cow eats a batch of 3 feeds.
          "Kernel Blend": new Decimal(15),
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

    expect(state.inventory["Kernel Blend"]).toEqual(new Decimal(3.75));
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

describe("getFeedBatchSize", () => {
  const pig = (experience: number, mud?: Animal["mud"]): Animal => ({
    id: "1",
    type: "Pig",
    state: "idle",
    createdAt: 0,
    experience,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
    mud,
  });

  const batch = (animal: Animal, skills = {}) =>
    getFeedBatchSize({
      state: {
        ...INITIAL_FARM,
        bumpkin: { ...INITIAL_FARM.bumpkin, skills },
      },
      animal,
    });

  it.each([
    [0, 3],
    [1, 3],
    [2, 6],
    [3, 6],
    [4, 6],
    [5, 9],
    [6, 9],
    [7, 9],
    [8, 9],
    [9, 12],
    [10, 9],
    [11, 9],
    [12, 9],
    [13, 9],
    [14, 12],
    [15, 12],
  ] as const)(
    "a level %s Pig asks for %s of its favourite Slop",
    (level, slops) => {
      expect(batch(pig(ANIMAL_LEVELS.Pig[level]))).toEqual(slops);
    },
  );

  it("asks only for what is left of the level", () => {
    // 100 of the 180 XP to level 1 is done: 80 left at 60 per Slop.
    expect(batch(pig(100))).toEqual(2);
  });

  it("asks for fewer Slops when Mud or Chonky Feed raise their XP", () => {
    // Level 4 needs 360 XP: 6 Hearty Slop, 5 muddy (75 each).
    const level4 = ANIMAL_LEVELS.Pig[4];
    expect(batch(pig(level4, { harvestsRemaining: 3 }))).toEqual(5);
    // Chonky Feed rank 3: 180 XP per Slop.
    expect(batch(pig(level4), { "Chonky Feed": 3 })).toEqual(2);
  });

  it("finishes the current cycle at level 15", () => {
    // 900 of the 960 XP cycle is done: one Gourmet Slop finishes it.
    expect(batch(pig(ANIMAL_LEVELS.Pig[15] + 960 + 900))).toEqual(1);
  });

  it.each([
    [0, 1, 3, 2],
    [1, 1, 3, 2],
    [2, 2, 6, 4],
    [3, 2, 6, 4],
    [4, 2, 6, 4],
    [5, 3, 9, 6],
    [6, 3, 9, 6],
    [7, 3, 9, 6],
    [8, 3, 9, 6],
    [9, 4, 12, 8],
    [10, 3, 9, 6],
    [11, 3, 9, 6],
    [12, 3, 9, 6],
    [13, 3, 9, 6],
    [14, 4, 12, 8],
    [15, 4, 12, 8],
  ] as const)(
    "at level %s a Chicken asks for %s feeds, a Cow %s and a Sheep %s",
    (level, chicken, cow, sheep) => {
      const animal = (type: AnimalType) => ({
        ...pig(ANIMAL_LEVELS[type][level]),
        type,
      });

      expect(batch(animal("Chicken"))).toEqual(chicken);
      expect(batch(animal("Cow"))).toEqual(cow);
      expect(batch(animal("Sheep"))).toEqual(sheep);
    },
  );

  it("asks a Cow only for what is left of the level", () => {
    // 100 of the 180 XP to level 1 is done: 80 left at 60 per Kernel Blend.
    expect(batch({ ...pig(100), type: "Cow" })).toEqual(2);
  });
});

describe("feedAnimal: one-click Pig feeding", () => {
  const now = Date.now();
  const PLACED = [
    { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
  ];

  const pig = (experience: number, mud?: Animal["mud"]): Animal => ({
    id: "1",
    type: "Pig",
    state: "idle",
    createdAt: 0,
    experience,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
    mud,
  });

  const farm = (
    experience = 0,
    {
      skills = {},
      slops = 100,
      mud,
    }: { skills?: object; slops?: number; mud?: Animal["mud"] } = {},
  ): GameState => ({
    ...FARM_WITH_HERDS,
    bumpkin: { ...FARM_WITH_HERDS.bumpkin, skills },
    inventory: {
      ...FARM_WITH_HERDS.inventory,
      "Basic Slop": new Decimal(slops),
      "Hearty Slop": new Decimal(slops),
      "Rich Slop": new Decimal(slops),
      "Gourmet Slop": new Decimal(slops),
      Hay: new Decimal(10),
      Omnifeed: new Decimal(10),
    },
    buildings: { ...FARM_WITH_HERDS.buildings, Pigpen: PLACED, Barn: PLACED },
    pigpen: { level: 1, animals: { "1": pig(experience, mud) } },
  });

  const feed = (state: GameState, item: AnimalFoodName) =>
    feedAnimal({
      state,
      action: { type: "animal.fed", animal: "Pig", id: "1", item },
      createdAt: now,
    });

  it.each([
    [0, "Basic Slop", 3],
    [3, "Hearty Slop", 6],
    [6, "Rich Slop", 9],
    [10, "Gourmet Slop", 9],
  ] as const)(
    "one click levels a level %s Pig up on %s, eating %s",
    (level, slop, eaten) => {
      const state = feed(farm(ANIMAL_LEVELS.Pig[level]), slop);
      const fed = state.pigpen.animals["1"];

      expect(fed.state).toBe("ready");
      expect(getAnimalLevel(fed.experience, "Pig")).toBe(level + 1);
      expect(state.inventory[slop]).toEqual(new Decimal(100 - eaten));
    },
  );

  it("feeds another Slop in the same count, for its lower XP", () => {
    // A level 4 Pig asks for 6 Hearty Slop; 6 Basic Slop give 6 x 10 XP.
    const experience = ANIMAL_LEVELS.Pig[4];
    const state = feed(farm(experience), "Basic Slop");
    const fed = state.pigpen.animals["1"];

    expect(fed.state).toBe("sad");
    expect(fed.experience - experience).toEqual(60);
    expect(state.inventory["Basic Slop"]).toEqual(new Decimal(94));
  });

  it("asks for the rest after a partial feed", () => {
    const experience = ANIMAL_LEVELS.Pig[4];
    const afterBasic = feed(farm(experience), "Basic Slop");
    // 300 XP left at 60 per Hearty Slop.
    const state = feed(afterBasic, "Hearty Slop");

    expect(state.inventory["Hearty Slop"]).toEqual(new Decimal(95));
    expect(state.pigpen.animals["1"].state).toBe("ready");
  });

  it("feeds nothing without the whole batch", () => {
    expect(() => feed(farm(0, { slops: 2 }), "Basic Slop")).toThrow(
      "Player does not have enough Basic Slop",
    );
  });

  it.each([
    [1, 2.25],
    [2, 1.95],
    [3, 1.5],
  ])("at Swill Savvy rank %s the batch of 3 costs %s Slop", (rank, eaten) => {
    const state = feed(
      farm(0, { skills: { "Swill Savvy": rank } }),
      "Basic Slop",
    );

    expect(state.inventory["Basic Slop"]).toEqual(new Decimal(100 - eaten));
  });

  it("boosts every Slop in a muddy batch and spends no Mud charge", () => {
    // Level 4: 5 muddy Hearty Slop at 75 XP each.
    const experience = ANIMAL_LEVELS.Pig[4];
    const state = feed(
      farm(experience, { mud: { harvestsRemaining: 3 } }),
      "Hearty Slop",
    );
    const fed = state.pigpen.animals["1"];

    expect(fed.experience - experience).toEqual(375);
    expect(fed.mud).toEqual({ harvestsRemaining: 3 });
    expect(state.inventory["Hearty Slop"]).toEqual(new Decimal(95));
  });

  it("keeps fractional XP exact on a muddy off-tier batch", () => {
    // 5 Basic Slop at 10 x 1.25 = 12.5 XP each.
    const experience = ANIMAL_LEVELS.Pig[4];
    const state = feed(
      farm(experience, { mud: { harvestsRemaining: 3 } }),
      "Basic Slop",
    );

    expect(state.pigpen.animals["1"].experience - experience).toEqual(62.5);
  });

  it("still feeds one Beetle per click", () => {
    const state = feedAnimal({
      state: {
        ...farm(),
        inventory: { ...farm().inventory, "Green Beetle": new Decimal(5) },
      },
      action: {
        type: "animal.fed",
        animal: "Pig",
        id: "1",
        item: "Green Beetle",
      },
      createdAt: now,
    });

    expect(state.inventory["Green Beetle"]).toEqual(new Decimal(4));
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

describe("feedAnimal: one-click Chicken, Cow and Sheep feeding", () => {
  const now = Date.now();
  const PLACED = [
    { coordinates: { x: 0, y: 0 }, createdAt: 0, id: "0", readyAt: 0 },
  ];

  const animal = (type: AnimalType, experience: number): Animal => ({
    id: "1",
    type,
    state: "idle",
    createdAt: 0,
    experience,
    asleepAt: 0,
    awakeAt: 0,
    lovedAt: 0,
    item: "Petting Hand",
  });

  const farm = (
    type: "Chicken" | "Cow" | "Sheep",
    experience = 0,
    food = 100,
  ): GameState => {
    const herd = { "1": animal(type, experience) };

    return {
      ...FARM_WITH_HERDS,
      inventory: {
        ...FARM_WITH_HERDS.inventory,
        "Kernel Blend": new Decimal(food),
        Hay: new Decimal(food),
        NutriBarley: new Decimal(food),
        "Mixed Grain": new Decimal(food),
        "Green Beetle": new Decimal(5),
      },
      buildings: {
        ...FARM_WITH_HERDS.buildings,
        "Hen House": PLACED,
        Barn: PLACED,
      },
      henHouse: {
        ...FARM_WITH_HERDS.henHouse,
        animals: type === "Chicken" ? herd : {},
      },
      barn: {
        ...FARM_WITH_HERDS.barn,
        animals: type === "Chicken" ? {} : herd,
      },
    };
  };

  const feed = (
    state: GameState,
    type: AnimalType,
    item: AnimalFoodName | BeetleName,
  ) =>
    feedAnimal({
      state,
      action: { type: "animal.fed", animal: type, id: "1", item },
      createdAt: now,
    });

  const fedAnimal = (state: GameState, type: AnimalType) =>
    (type === "Chicken" ? state.henHouse : state.barn).animals["1"];

  it.each([
    ["Chicken", 0, "Kernel Blend", 1],
    ["Cow", 0, "Kernel Blend", 15],
    ["Sheep", 0, "Kernel Blend", 6],
    ["Chicken", 9, "NutriBarley", 4],
    ["Cow", 9, "NutriBarley", 60],
    ["Sheep", 9, "NutriBarley", 24],
  ] as const)(
    "one click levels a %s up from level %s on %s, eating %s",
    (type, level, food, eaten) => {
      const state = feed(farm(type, ANIMAL_LEVELS[type][level]), type, food);
      const fed = fedAnimal(state, type);

      expect(fed.state).toBe("ready");
      expect(getAnimalLevel(fed.experience, type)).toBe(level + 1);
      expect(state.inventory[food]).toEqual(new Decimal(100 - eaten));
    },
  );

  it("feeds another food in the same count, for its lower XP", () => {
    // A level 0 Cow asks for 3 Kernel Blend feeds; 3 Hay feeds give 3 x 10 XP.
    const state = feed(farm("Cow"), "Cow", "Hay");
    const fed = fedAnimal(state, "Cow");

    expect(fed.state).toBe("sad");
    expect(fed.experience).toEqual(30);
    expect(state.inventory.Hay).toEqual(new Decimal(85));
  });

  it("feeds nothing without the whole batch", () => {
    expect(() => feed(farm("Cow", 0, 14), "Cow", "Kernel Blend")).toThrow(
      "Player does not have enough Kernel Blend",
    );
  });

  it("still feeds one Beetle per click", () => {
    const state = feed(farm("Sheep"), "Sheep", "Green Beetle");

    expect(state.inventory["Green Beetle"]).toEqual(new Decimal(4));
  });
});

describe("feedAnimal: Mud", () => {
  const now = Date.now();

  const farm = (overrides: Partial<Animal> = {}): GameState => ({
    ...INITIAL_FARM,
    inventory: {
      ...INITIAL_FARM.inventory,
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

  it("does not spend a use when curing a sick Pig", () => {
    const state = feedAnimal({
      state: farm({ state: "sick", mud: { harvestsRemaining: 3 } }),
      action: {
        type: "animal.fed",
        animal: "Pig",
        id: "1",
        item: "Barn Delight",
      },
      createdAt: now,
    });

    expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 3 });
  });

  it("scales handleFoodXP for the previews too", () => {
    const xp = (mud?: Animal["mud"], skills = {}) =>
      handleFoodXP({
        state: {
          ...INITIAL_FARM,
          bumpkin: { ...INITIAL_FARM.bumpkin, skills },
        },
        animal: "Pig",
        level: 4,
        food: "Hearty Slop",
        mud,
      }).foodXp;

    expect(xp()).toEqual(60);
    expect(xp({ harvestsRemaining: 1 })).toEqual(75);
    expect(xp({ harvestsRemaining: 0 })).toEqual(60);
    // Chonky Feed rank 2 then Mud: 60 x 2.5 x 1.25.
    expect(xp({ harvestsRemaining: 1 }, { "Chonky Feed": 2 })).toEqual(187.5);
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
      "Green Beetle": new Decimal(5),
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
    item: BeetleName = "Green Beetle",
  ) =>
    feedAnimal({
      state,
      action: { type: "animal.fed", animal: type, id: "1", item },
      createdAt: now,
    });

  it.each([
    ["Green Beetle", 80],
    ["Blue Beetle", 160],
    ["Pink Beetle", 320],
    ["Amber Beetle", 640],
  ] as const)("feeds a %s to a Cow for exactly %i XP", (item, xp) => {
    const state = feed(cowFarm(0), "Cow", item);

    expect(BEETLE_FEEDING_XP[item]).toEqual(xp);
    // The Beetle's description states this XP, so keep the two in step.
    expect(ITEM_DETAILS[item].description).toContain(`for ${xp} XP`);
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
          "Green Beetle": new Decimal(1),
        },
        collectibles: { "Dr Cow": PLACED },
      }),
    );

    expect(state.inventory["Green Beetle"]).toEqual(new Decimal(0));
  });

  it("throws without the Beetle", () => {
    expect(() => feed(cowFarm(0, { inventory: {} }))).toThrow(
      "Player does not have enough Green Beetle",
    );
  });

  it("ignores Chonky Feed: no extra XP and still exactly one Beetle", () => {
    const state = feed(
      cowFarm(0, {
        bumpkin: { ...INITIAL_FARM.bumpkin, skills: { "Chonky Feed": 3 } },
      }),
    );

    expect(state.barn.animals["1"].experience).toEqual(80);
    expect(state.inventory["Green Beetle"]).toEqual(new Decimal(4));
  });

  it("grants a muddy Pig 1.25x without spending a Mud charge", () => {
    const state = feed(pigFarm(0, { mud: { harvestsRemaining: 3 } }), "Pig");

    expect(state.pigpen.animals["1"].experience).toEqual(100);
    expect(state.pigpen.animals["1"].mud).toEqual({ harvestsRemaining: 3 });
  });

  it.each([
    ["Green Beetle", 100],
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

    it("is unlocked by holding a Beta Pass", () => {
      const state = cowFarm(0);

      expect(() =>
        feed({
          ...state,
          inventory: { ...state.inventory, "Beta Pass": new Decimal(1) },
        }),
      ).not.toThrow();
    });

    it("rejects a Beetle even when a Golden Cow feeds for free", () => {
      expect(() =>
        feed(cowFarm(0, { collectibles: { "Golden Cow": PLACED } })),
      ).toThrow("Beetle feeding is not available");
    });
  });
});
