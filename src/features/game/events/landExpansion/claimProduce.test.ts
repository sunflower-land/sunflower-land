import Decimal from "decimal.js-light";
import { claimProduce } from "./claimProduce";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("claimProduce", () => {
  const now = Date.now();

  it("claims produce from a chicken and receives an egg", () => {
    const chickenId = "xyz";

    const state = claimProduce({
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
              state: "ready",
              experience: 60,
              asleepAt: 0,
              lovedAt: 0,
              item: "Petting Hand",
            },
          },
        },
      },
      action: {
        type: "produce.claimed",
        animal: "Chicken",
        id: chickenId,
      },
    });

    expect(state.henHouse.animals[chickenId].state).toBe("idle");
    expect(state.henHouse.animals[chickenId].experience).toBe(60);
    expect(state.inventory.Egg).toStrictEqual(new Decimal(1));
  });

  // ... other tests ...

  it("throws an error if animal is not in ready state", () => {
    const chickenId = "xyz";

    expect(() =>
      claimProduce({
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
          type: "produce.claimed",
          animal: "Chicken",
          id: chickenId,
        },
      }),
    ).toThrow("Animal is not ready to claim produce");
  });
});
