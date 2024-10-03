import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { AnimalType } from "features/game/types/animals";
import { AnimalState } from "features/game/types/game";
import { buyAnimal } from "./buyAnimal";

function makeAnimals(count: number, type: AnimalType) {
  return new Array(count).fill(0).reduce(
    (animals, _, index) => {
      return {
        ...animals,
        [index]: {
          id: index.toString(),
          type,
          state: "idle",
          coordinates: { x: index, y: index },
        },
      };
    },
    {} as Record<string, AnimalState>,
  );
}

describe("buyAnimal", () => {
  const leveledUpBumpkin = { ...INITIAL_BUMPKIN, experience: 300000 };

  it("throws an error if the farm does not have enough coins to buy an animal", () => {
    expect(() =>
      buyAnimal({
        state: {
          ...TEST_FARM,
          coins: 0,
          bumpkin: INITIAL_BUMPKIN,
          buildings: {
            "Hen House": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          id: "0",
          animal: "Chicken",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "animal.bought",
        },
      }),
    ).toThrow("Insufficient coins to buy a Chicken");
  });

  it("throws an error if the player does not have the required building placed", () => {
    expect(() => {
      buyAnimal({
        state: {
          ...TEST_FARM,
          coins: 1000,
          bumpkin: INITIAL_BUMPKIN,
          buildings: {},
        },
        action: {
          id: "0",
          animal: "Chicken",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "animal.bought",
        },
      });
    }).toThrow("You do not have a Hen House");
  });

  it("throws an error if the bumpkin isn't at the required level", () => {
    expect(() => {
      buyAnimal({
        state: {
          ...TEST_FARM,
          coins: 1000,
          bumpkin: leveledUpBumpkin,
          buildings: {},
        },
        action: {
          id: "0",
          animal: "Chicken",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "animal.bought",
        },
      });
    }).toThrow("You do not have a Hen House");
  });

  it("throws an error if the player does not have the capacity", () => {
    expect(() => {
      buyAnimal({
        state: {
          ...TEST_FARM,
          coins: 1000,
          bumpkin: leveledUpBumpkin,
          buildings: {
            "Hen House": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
          henHouse: {
            level: 0,
            animals: makeAnimals(10, "Chicken"),
          },
        },
        action: {
          id: "0",
          animal: "Chicken",
          coordinates: {
            x: 2,
            y: 2,
          },
          type: "animal.bought",
        },
      });
    }).toThrow("You do not have the capacity for this animal");
  });

  it("throws and error if the coordinates collide with another animal", () => {
    expect(() => {
      buyAnimal({
        state: {
          ...TEST_FARM,
          coins: 1000,
          bumpkin: leveledUpBumpkin,
          buildings: {
            "Hen House": [
              {
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                id: "123",
                readyAt: 0,
              },
            ],
          },
          henHouse: {
            level: 0,
            animals: makeAnimals(1, "Chicken"),
          },
        },
        action: {
          id: "0",
          animal: "Chicken",
          coordinates: {
            x: 0,
            y: 0,
          },
          type: "animal.bought",
        },
      });
    }).toThrow("Animal collides");
  });

  it("subtracts the price of the animal (cow) from the farm's coins", () => {
    const state = buyAnimal({
      state: {
        ...TEST_FARM,
        coins: 1000,
        bumpkin: leveledUpBumpkin,
        buildings: {
          Barn: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
        barn: {
          level: 0,
          animals: makeAnimals(3, "Cow"),
        },
      },
      action: {
        id: "0",
        animal: "Cow",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "animal.bought",
      },
    });

    expect(state.coins).toBe(900);
  });

  it("adds the animal to the building in an idle state", () => {
    const state = buyAnimal({
      state: {
        ...TEST_FARM,
        coins: 1000,
        bumpkin: leveledUpBumpkin,
        buildings: {
          Barn: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
        barn: {
          level: 0,
          animals: makeAnimals(3, "Cow"),
        },
      },
      action: {
        id: "0",
        animal: "Cow",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "animal.bought",
      },
    });

    expect(state.barn?.animals).toMatchObject({
      0: {
        id: "0",
        type: "Cow",
        state: "idle",
        createdAt: expect.any(Number),
        coordinates: { x: 2, y: 2 },
      },
    });
  });

  it("tracks the bumpkin activity", () => {
    const state = buyAnimal({
      state: {
        ...TEST_FARM,
        coins: 1000,
        bumpkin: leveledUpBumpkin,
        buildings: {
          Barn: [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
        barn: {
          level: 0,
          animals: makeAnimals(3, "Cow"),
        },
      },
      action: {
        id: "0",
        animal: "Cow",
        coordinates: {
          x: 2,
          y: 2,
        },
        type: "animal.bought",
      },
    });

    expect(state.bumpkin.activity["Cow Bought"]).toBe(1);
    expect(state.bumpkin.activity["Coins Spent"]).toBe(100);
  });
});
