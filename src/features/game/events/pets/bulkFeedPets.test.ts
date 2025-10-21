import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { bulkFeedPets, BulkFeedPetsAction } from "./bulkFeedPets";

describe("bulkFeedPets", () => {
  const now = Date.now();
  it("throws an error if not enough food in inventory", () => {
    expect(() =>
      bulkFeedPets({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: {
                  food: ["Bumpkin Salad"],
                  fedAt: now,
                },
                energy: 0,
                experience: 0,
                pettedAt: now,
              },
              Meowchi: {
                name: "Meowchi",
                requests: {
                  food: ["Bumpkin Salad"],
                  fedAt: now,
                },
                energy: 0,
                experience: 0,
                pettedAt: now,
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
            { petId: "Barkley", food: "Bumpkin Salad" },
            { petId: "Meowchi", food: "Bumpkin Salad" },
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
        common: {
          Barkley: {
            name: "Barkley",
            requests: {
              food: ["Bumpkin Salad"],
              fedAt: now,
            },
            energy: 0,
            experience: 0,
            pettedAt: now,
          },
          Meowchi: {
            name: "Meowchi",
            requests: {
              food: ["Bumpkin Salad"],
              fedAt: now,
            },
            energy: 0,
            experience: 0,
            pettedAt: now,
          },
        },
      },

      collectibles: {
        Barkley: [
          {
            createdAt: now,
            id: "1",
            readyAt: now,
            coordinates: { x: 1, y: 1 },
          },
        ],
        Meowchi: [
          {
            createdAt: now,
            id: "1",
            readyAt: now,
            coordinates: { x: 1, y: 1 },
          },
        ],
      },
      inventory: {
        "Bumpkin Salad": new Decimal(2),
      },
    };
    const action: BulkFeedPetsAction = {
      type: "pets.bulkFeed",
      pets: [
        { petId: "Barkley", food: "Bumpkin Salad" },
        { petId: "Meowchi", food: "Bumpkin Salad" },
      ],
    };
    const resultState = bulkFeedPets({ state, action, createdAt: now });
    expect(resultState.pets?.common?.Barkley?.requests.foodFed).toEqual([
      "Bumpkin Salad",
    ]);
    expect(resultState.pets?.common?.Meowchi?.requests.foodFed).toEqual([
      "Bumpkin Salad",
    ]);
    expect(resultState.pets?.common?.Barkley?.requests.fedAt).toEqual(now);
    expect(resultState.pets?.common?.Meowchi?.requests.fedAt).toEqual(now);
    expect(resultState.pets?.common?.Barkley?.energy).toEqual(100);
    expect(resultState.pets?.common?.Meowchi?.energy).toEqual(100);
    expect(resultState.pets?.common?.Barkley?.experience).toEqual(100);
    expect(resultState.pets?.common?.Meowchi?.experience).toEqual(100);
  });
});
