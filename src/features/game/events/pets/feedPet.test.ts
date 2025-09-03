import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CookableName } from "features/game/types/consumables";
import { feedPet } from "./feedPet";

describe("feedPet", () => {
  const now = Date.now();
  it("throws an error if pet is not found", () => {
    expect(() =>
      feedPet({
        state: { ...INITIAL_FARM },
        action: {
          type: "pet.fed",
          pet: "Barkley",
          food: "Bumpkin Salad",
        },
      }),
    ).toThrow("Pet not found");
  });

  it("throws an error if there are no requests", () => {
    expect(() =>
      feedPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: {
                  food: [],
                },
                energy: 100,
                experience: 0,
              },
            },
          },
        },
        action: {
          type: "pet.fed",
          pet: "Barkley",
          food: "Bumpkin Salad",
        },
      }),
    ).toThrow("No requests found");
  });
  it("throws an error if the food is not in the requests today", () => {
    expect(() =>
      feedPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: {
                  food: ["Pumpkin Soup", "Roast Veggies", "Antipasto"],
                },
                energy: 100,
                experience: 0,
              },
            },
          },
        },
        action: {
          type: "pet.fed",
          pet: "Barkley",
          food: "Bumpkin Salad",
        },
      }),
    ).toThrow("Food not found");
  });

  it("throws an error if the food has been fed today", () => {
    expect(() =>
      feedPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: {
                  food: ["Pumpkin Soup", "Bumpkin Salad", "Antipasto"],
                  foodFed: ["Bumpkin Salad"],
                  fedAt: now,
                },
                energy: 100,
                experience: 0,
              },
            },
          },
        },
        action: {
          type: "pet.fed",
          pet: "Barkley",
          food: "Bumpkin Salad",
        },
        createdAt: now,
      }),
    ).toThrow("Food has been fed today");
  });

  it("does not throw an error if different food has been fed today", () => {
    expect(() =>
      feedPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: {
                  food: ["Pumpkin Soup", "Bumpkin Salad", "Antipasto"],
                  foodFed: ["Antipasto"],
                  fedAt: now,
                },
                energy: 100,
                experience: 0,
              },
            },
          },
          inventory: {
            "Bumpkin Salad": new Decimal(10),
          },
        },
        action: {
          type: "pet.fed",
          pet: "Barkley",
          food: "Bumpkin Salad",
        },
        createdAt: now,
      }),
    ).not.toThrow();
  });

  it("throws an error if not enough food in inventory", () => {
    expect(() =>
      feedPet({
        state: {
          ...INITIAL_FARM,
          pets: {
            common: {
              Barkley: {
                name: "Barkley",
                requests: {
                  food: ["Pumpkin Soup", "Bumpkin Salad", "Antipasto"],
                  foodFed: [],
                  fedAt: 0,
                },
                energy: 100,
                experience: 0,
              },
            },
          },
          inventory: {
            "Bumpkin Salad": new Decimal(0),
          },
        },
        action: {
          type: "pet.fed",
          pet: "Barkley",
          food: "Bumpkin Salad",
        },
        createdAt: now,
      }),
    ).toThrow("Not enough food in inventory");
  });

  it("feeds pet", () => {
    const state = feedPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          common: {
            Barkley: {
              name: "Barkley",
              requests: {
                food: ["Pumpkin Soup", "Bumpkin Salad", "Antipasto"],
                foodFed: [],
                fedAt: 0,
              },
              energy: 0,
              experience: 100,
            },
          },
        },
        inventory: {
          "Bumpkin Salad": new Decimal(10),
        },
      },
      action: {
        type: "pet.fed",
        pet: "Barkley",
        food: "Bumpkin Salad",
      },
      createdAt: now,
    });
    const BarkleyData = state.pets?.common?.Barkley;

    expect(BarkleyData?.requests.foodFed).toEqual<CookableName[]>([
      "Bumpkin Salad",
    ]);
    expect(BarkleyData?.requests.fedAt).toEqual(now);
    expect(state.inventory["Bumpkin Salad"]).toEqual(new Decimal(9));
    expect(BarkleyData?.energy).toEqual(100);
    expect(BarkleyData?.experience).toEqual(200);
  });
});
