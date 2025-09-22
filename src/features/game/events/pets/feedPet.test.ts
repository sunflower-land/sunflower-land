import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CookableName } from "features/game/types/consumables";
import { feedPet, getPetFoodRequests } from "./feedPet";
import { Pet } from "features/game/types/pets";

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

  it("throws an error if pet is napping", () => {
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
                  fedAt: now,
                },
                energy: 100,
                experience: 0,
                pettedAt: now - 2 * 60 * 60 * 1000,
              },
            },
          },
        },
        action: { type: "pet.fed", pet: "Barkley", food: "Bumpkin Salad" },
      }),
    ).toThrow("Pet is napping");
  });

  it("throws an error if pet is in neglected state", () => {
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
                  fedAt: now - 4 * 24 * 60 * 60 * 1000,
                },
                energy: 100,
                experience: 0,
                pettedAt: now,
              },
            },
          },
        },
        action: { type: "pet.fed", pet: "Barkley", food: "Bumpkin Salad" },
      }),
    ).toThrow("Pet is in neglected state");
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
                pettedAt: now,
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
                pettedAt: now,
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
                pettedAt: now,
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
                pettedAt: now,
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
                },
                energy: 100,
                experience: 0,
                pettedAt: now,
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
              },
              energy: 0,
              experience: 100,
              pettedAt: now,
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
  it("feeds pet with energy boost", () => {
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
              },
              energy: 0,
              experience: 1500, // Level 5
              pettedAt: now,
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

    expect(BarkleyData?.energy).toEqual(105);
    expect(BarkleyData?.experience).toEqual(1600);
  });

  it("feeds pet with Hound Shrine boost", () => {
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
              },
              energy: 0,
              experience: 1500, // Level 5
              pettedAt: now,
            },
          },
        },
        inventory: {
          "Bumpkin Salad": new Decimal(10),
        },
        collectibles: {
          "Hound Shrine": [{ createdAt: now, id: "1", readyAt: now }],
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

    expect(BarkleyData?.energy).toEqual(105);
    expect(BarkleyData?.experience).toEqual(1700);
  });

  describe("getPetFoodRequests", () => {
    it("omits the hard request if the pet is less than level 10", () => {
      const pet: Pet = {
        name: "Barkley",
        requests: {
          food: ["Pumpkin Soup", "Bumpkin Salad", "Antipasto"],
        },
        energy: 100,
        experience: 0,
        pettedAt: now,
      };
      const requests = getPetFoodRequests(pet);
      expect(requests).toEqual(["Pumpkin Soup", "Bumpkin Salad"]);
      // Make sure the original requests are not modified
      expect(pet.requests.food).toEqual([
        "Pumpkin Soup",
        "Bumpkin Salad",
        "Antipasto",
      ]);
    });

    it("includes the hard request if the pet is level 10 or higher", () => {
      const pet: Pet = {
        name: "Barkley",
        requests: {
          food: ["Pumpkin Soup", "Bumpkin Salad", "Antipasto"],
        },
        energy: 100,
        experience: 5500, // Level 10
        pettedAt: now,
      };
      const requests = getPetFoodRequests(pet);
      expect(requests).toEqual(["Pumpkin Soup", "Bumpkin Salad", "Antipasto"]);
      // Make sure the original requests are not modified
      expect(pet.requests.food).toEqual([
        "Pumpkin Soup",
        "Bumpkin Salad",
        "Antipasto",
      ]);
    });
  });
});
