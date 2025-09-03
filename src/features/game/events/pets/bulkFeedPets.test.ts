import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { bulkFeedPets, BulkFeedPetsAction } from "./bulkFeedPets";

describe("bulkFeedPets", () => {
  it("throws an error if not enough food in inventory", () => {
    expect(() =>
      bulkFeedPets({
        state: {
          ...INITIAL_FARM,
          pets: {
            commonPets: {
              Barkley: {
                requests: {
                  food: ["Bumpkin Salad"],
                },
                energy: 0,
                experience: 0,
              },
              Meowchi: {
                requests: {
                  food: ["Bumpkin Salad"],
                },
                energy: 0,
                experience: 0,
              },
            },
          },
          inventory: {
            "Bumpkin Salad": new Decimal(1),
          },
        },
        action: {
          type: "pets.bulkFeed",
          pets: [
            { pet: "Barkley", food: "Bumpkin Salad" },
            { pet: "Meowchi", food: "Bumpkin Salad" },
          ],
        },
      }),
    ).toThrow("Not enough food in inventory");
  });

  it("should bulk feed pets", () => {
    const now = Date.now();
    const state: GameState = {
      ...INITIAL_FARM,
      pets: {
        commonPets: {
          Barkley: {
            requests: {
              food: ["Bumpkin Salad"],
            },
            energy: 0,
            experience: 0,
          },
          Meowchi: {
            requests: {
              food: ["Bumpkin Salad"],
            },
            energy: 0,
            experience: 0,
          },
        },
      },
      inventory: {
        "Bumpkin Salad": new Decimal(2),
      },
    };
    const action: BulkFeedPetsAction = {
      type: "pets.bulkFeed",
      pets: [
        { pet: "Barkley", food: "Bumpkin Salad" },
        { pet: "Meowchi", food: "Bumpkin Salad" },
      ],
    };
    const resultState = bulkFeedPets({ state, action, createdAt: now });
    expect(resultState.pets.commonPets.Barkley?.requests.foodFed).toEqual([
      "Bumpkin Salad",
    ]);
    expect(resultState.pets.commonPets.Meowchi?.requests.foodFed).toEqual([
      "Bumpkin Salad",
    ]);
    expect(resultState.pets.commonPets.Barkley?.requests.fedAt).toEqual(now);
    expect(resultState.pets.commonPets.Meowchi?.requests.fedAt).toEqual(now);
    expect(resultState.pets.commonPets.Barkley?.energy).toEqual(100);
    expect(resultState.pets.commonPets.Meowchi?.energy).toEqual(100);
    expect(resultState.pets.commonPets.Barkley?.experience).toEqual(100);
    expect(resultState.pets.commonPets.Meowchi?.experience).toEqual(100);
  });
});
