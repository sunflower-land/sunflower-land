import { INITIAL_BUMPKIN, TEST_FARM } from "features/game/lib/constants";
import { buyAnimal, getBoostedAnimalCapacity } from "./buyAnimal";
import { Animal } from "features/game/types/game";
import { AnimalType } from "features/game/types/animals";

export function makeAnimals(count: number, type: AnimalType) {
  return new Array(count)
    .fill(0)
    .reduce<Record<string, Animal>>((animals, _, index) => {
      return {
        ...animals,
        [String(index)]: {
          id: index.toString(),
          type,
          state: "idle",
          coordinates: { x: index, y: index },
          experience: 0,
          asleepAt: 0,
          lovedAt: 0,
          item: "Petting Hand",
          createdAt: 0,
          awakeAt: 0,
        },
      };
    }, {});
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
          collectibles: {},
          henHouse: {
            level: 1,
            animals: makeAnimals(10, "Chicken"),
          },
        },
        action: {
          id: "0",
          animal: "Chicken",
          type: "animal.bought",
        },
      });
    }).toThrow("You do not have the capacity for this animal");
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
          level: 1,
          animals: makeAnimals(3, "Cow"),
        },
      },
      action: {
        id: "0",
        animal: "Cow",
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
          level: 1,
          animals: makeAnimals(3, "Cow"),
        },
      },
      action: {
        id: "0",
        animal: "Cow",
        type: "animal.bought",
      },
    });

    expect(state.barn?.animals).toMatchObject({
      0: {
        id: "0",
        type: "Cow",
        state: "idle",
        createdAt: expect.any(Number),
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
          level: 1,
          animals: makeAnimals(3, "Cow"),
        },
      },
      action: {
        id: "0",
        animal: "Cow",
        type: "animal.bought",
      },
    });

    expect(state.farmActivity["Cow Bought"]).toBe(1);
    expect(state.farmActivity["Coins Spent"]).toBe(100);
  });
});

describe("getAnimalCapacity", () => {
  it("returns 10 for level 1 with no coop", () => {
    expect(
      getBoostedAnimalCapacity("henHouse", {
        ...TEST_FARM,
        collectibles: {},
      }).capacity,
    ).toBe(10);
  });

  it("returns 15 from level 1 with coop", () => {
    expect(
      getBoostedAnimalCapacity("henHouse", {
        ...TEST_FARM,
        collectibles: {
          "Chicken Coop": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      }).capacity,
    ).toBe(15);
  });

  it("returns 25 from level 2 with coop", () => {
    expect(
      getBoostedAnimalCapacity("henHouse", {
        ...TEST_FARM,
        henHouse: {
          ...TEST_FARM.henHouse,
          level: 2,
        },
        collectibles: {
          "Chicken Coop": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      }).capacity,
    ).toBe(25);
  });

  it("returns 20 from level 3 with no coop", () => {
    expect(
      getBoostedAnimalCapacity("henHouse", {
        ...TEST_FARM,
        henHouse: {
          ...TEST_FARM.henHouse,
          level: 3,
        },
      }).capacity,
    ).toBe(20);
  });

  it("returns 35 from level 3 with coop", () => {
    expect(
      getBoostedAnimalCapacity("henHouse", {
        ...TEST_FARM,
        henHouse: {
          ...TEST_FARM.henHouse,
          level: 3,
        },
        collectibles: {
          "Chicken Coop": [
            {
              coordinates: { x: 0, y: 0 },
              createdAt: 0,
              id: "123",
              readyAt: 0,
            },
          ],
        },
      }).capacity,
    ).toBe(35);
  });
});
