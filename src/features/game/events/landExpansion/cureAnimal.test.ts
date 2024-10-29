import Decimal from "decimal.js-light";
import { GameState } from "features/game/types/game";
import { TEST_FARM } from "features/game/lib/constants";
import { cureAnimal } from "./cureAnimal";

describe("cureAnimal", () => {
  const now = Date.now();

  it("throws an error if the animal is not sick", () => {
    const chickenId = "xyz";
    const initialState: GameState = {
      ...TEST_FARM,
      inventory: {
        ...TEST_FARM.inventory,
        "Barn Delight": new Decimal(1),
      },
      henHouse: {
        ...TEST_FARM.henHouse,
        animals: {
          [chickenId]: {
            coordinates: { x: 0, y: 0 },
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
    };

    expect(() =>
      cureAnimal({
        createdAt: now,
        state: initialState,
        action: {
          type: "animal.cured",
          animal: "Chicken",
          id: chickenId,
        },
      }),
    ).toThrow("Animal is not sick");
  });

  it("throws an error if no Barn Delight is available", () => {
    const chickenId = "xyz";
    const initialState: GameState = {
      ...TEST_FARM,
      henHouse: {
        ...TEST_FARM.henHouse,
        animals: {
          [chickenId]: {
            coordinates: { x: 0, y: 0 },
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
    };

    expect(() =>
      cureAnimal({
        createdAt: now,
        state: initialState,
        action: {
          type: "animal.cured",
          animal: "Chicken",
          id: chickenId,
        },
      }),
    ).toThrow("No Barn Delight available to cure animal");
  });

  it("throws an error if the animal is not found", () => {
    const initialState: GameState = {
      ...TEST_FARM,
      inventory: {
        ...TEST_FARM.inventory,
        "Barn Delight": new Decimal(1),
      },
    };

    expect(() =>
      cureAnimal({
        createdAt: now,
        state: initialState,
        action: {
          type: "animal.cured",
          animal: "Chicken",
          id: "nonexistent",
        },
      }),
    ).toThrow("Animal nonexistent not found in building henHouse");
  });

  it("cures a sick animal", () => {
    const chickenId = "xyz";
    const initialState: GameState = {
      ...TEST_FARM,
      inventory: {
        ...TEST_FARM.inventory,
        "Barn Delight": new Decimal(1),
      },
      henHouse: {
        ...TEST_FARM.henHouse,
        animals: {
          [chickenId]: {
            coordinates: { x: 0, y: 0 },
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
    };

    const state = cureAnimal({
      createdAt: now,
      state: initialState,
      action: {
        type: "animal.cured",
        animal: "Chicken",
        id: chickenId,
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.inventory["Barn Delight"]).toStrictEqual(new Decimal(0));
  });
});
