import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";
import { CookableName } from "features/game/types/consumables";
import { feedPet, getPetFoodRequests } from "./feedPet";
import { getPetLevel, Pet } from "features/game/types/pets";

describe("feedPet", () => {
  const now = Date.now();
  it("throws an error if pet is not found", () => {
    expect(() =>
      feedPet({
        state: { ...INITIAL_FARM },
        action: {
          type: "pet.fed",
          petId: "Barkley",
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
        action: { type: "pet.fed", petId: "Barkley", food: "Bumpkin Salad" },
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
        action: { type: "pet.fed", petId: "Barkley", food: "Bumpkin Salad" },
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
          petId: "Barkley",
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
          petId: "Barkley",
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
          petId: "Barkley",
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
          petId: "Barkley",
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
          petId: "Barkley",
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
        petId: "Barkley",
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
        petId: "Barkley",
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
        petId: "Barkley",
        food: "Bumpkin Salad",
      },
      createdAt: now,
    });
    const BarkleyData = state.pets?.common?.Barkley;

    expect(BarkleyData?.energy).toEqual(105);
    expect(BarkleyData?.experience).toEqual(1700);
  });

  it("gives experience boost for level 27", () => {
    const level27XP = 27 * 26 * 50;
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
              experience: level27XP, // Level 27
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
        petId: "Barkley",
        food: "Bumpkin Salad",
      },
      createdAt: now,
    });
    const BarkleyData = state.pets?.common?.Barkley;

    expect(BarkleyData?.requests.foodFed).toEqual<CookableName[]>([
      "Bumpkin Salad",
    ]);

    expect(BarkleyData?.requests.fedAt).toEqual(now);
    expect(BarkleyData?.experience).toEqual(level27XP + 100 * 1.1);
  });

  it("gives experience boost for level 40 for nft pets", () => {
    const level40XP = 40 * 39 * 50;
    const state = feedPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          nfts: {
            1: {
              name: "Pet-1",
              id: 1,
              revealAt: 0,
              requests: {
                food: ["Pumpkin Soup", "Bumpkin Salad", "Antipasto"],
                foodFed: [],
              },
              energy: 0,
              experience: level40XP, // Level 40
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
        petId: 1,
        food: "Bumpkin Salad",
      },
      createdAt: now,
    });
    const petData = state.pets?.nfts?.[1];

    expect(petData?.requests.foodFed).toEqual<CookableName[]>([
      "Bumpkin Salad",
    ]);

    expect(petData?.requests.fedAt).toEqual(now);
    expect(petData?.experience).toEqual(level40XP + 100 * 1.25);
  });

  it("gives experience boost for level 85 for nft pets", () => {
    const level85XP = 85 * 84 * 50;
    const state = feedPet({
      state: {
        ...INITIAL_FARM,
        pets: {
          nfts: {
            1: {
              name: "Pet-1",
              id: 1,
              revealAt: 0,
              requests: {
                food: ["Pumpkin Soup", "Bumpkin Salad", "Antipasto"],
                foodFed: [],
              },
              energy: 0,
              experience: level85XP, // Level 85
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
        petId: 1,
        food: "Bumpkin Salad",
      },
      createdAt: now,
    });
    const petData = state.pets?.nfts?.[1];

    expect(petData?.requests.foodFed).toEqual<CookableName[]>([
      "Bumpkin Salad",
    ]);

    expect(petData?.requests.fedAt).toEqual(now);
    expect(petData?.experience).toEqual(level85XP + 100 * 1.5);
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
      const { level: petLevel } = getPetLevel(pet.experience);
      const requests = getPetFoodRequests(pet, petLevel);
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
      const { level: petLevel } = getPetLevel(pet.experience);
      const requests = getPetFoodRequests(pet, petLevel);
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
