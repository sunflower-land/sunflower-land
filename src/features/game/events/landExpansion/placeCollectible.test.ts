import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { CollectibleName } from "../../types/craftables";
import { GameState, PlacedItem, ShakeItem } from "../../types/game";
import { placeCollectible } from "./placeCollectible";
import { Pet, PetName } from "features/game/types/pets";

const date = Date.now();
const GAME_STATE: GameState = TEST_FARM;
describe("Place Collectible", () => {
  it("Requires a collectible is not already placed", () => {
    expect(() =>
      placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            Scarecrow: new Decimal(1),
          },
          collectibles: {
            Scarecrow: [
              {
                coordinates: {
                  x: 1,
                  y: 1,
                },
                createdAt: date,
                id: "234",
                readyAt: date + 10 * 1000,
              },
            ],
          },
        },
        action: {
          id: "123",
          type: "collectible.placed",
          name: "Scarecrow",
          coordinates: {
            x: 0,
            y: 0,
          },
          location: "farm",
        },
      }),
    ).toThrow("You can't place an item that is not on the inventory");
  });

  it("Requires a collectible is on the inventory to be placed", () => {
    expect(() =>
      placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {},
          collectibles: {},
        },
        action: {
          id: "123",
          type: "collectible.placed",
          name: "Scarecrow",
          coordinates: {
            x: 0,
            y: 0,
          },
          location: "farm",
        },
      }),
    ).toThrow("You can't place an item that is not on the inventory");
  });

  it("Places a collectible", () => {
    const state = placeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Brazilian Flag": new Decimal(1),
        },
        collectibles: {},
      },
      action: {
        id: "123",
        type: "collectible.placed",
        name: "Brazilian Flag",
        coordinates: {
          x: 0,
          y: 0,
        },
        location: "farm",
      },
    });

    expect(state.collectibles["Brazilian Flag"]).toHaveLength(1);
  });

  it("Places multiple scarecrows", () => {
    const state = placeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          Scarecrow: new Decimal(2),
        },
        collectibles: {
          Scarecrow: [
            {
              id: "123",
              coordinates: { x: 1, y: 1 },
            },
          ],
        },
      },
      createdAt: date,
      action: {
        id: "1234",
        type: "collectible.placed",
        name: "Scarecrow",
        coordinates: {
          x: 0,
          y: 0,
        },
        location: "farm",
      },
    });

    expect(state.collectibles["Scarecrow"]).toHaveLength(2);
    expect(state.collectibles["Scarecrow"]?.[0]).toEqual({
      id: expect.any(String),
      coordinates: { x: 1, y: 1 },
    });
    expect(state.collectibles["Scarecrow"]?.[1]).toEqual({
      id: expect.any(String),
      coordinates: { x: 0, y: 0 },
    });
  });

  it("adds monument to village projects", () => {
    const state = placeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Teamwork Monument": new Decimal(1),
        },
        collectibles: {},
        buildings: {},
        trees: {},
        stones: {},
      },
      action: {
        id: "123",
        type: "collectible.placed",
        name: "Teamwork Monument",
        coordinates: {
          x: 0,
          y: 0,
        },
        location: "farm",
      },
    });

    expect(state.socialFarming.villageProjects["Teamwork Monument"]).toEqual({
      cheers: 0,
    });
  });

  it("does not add monument to village projects when in completedProjects", () => {
    const dateNow = Date.now();
    const state = placeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Big Orange": new Decimal(1),
        },
        collectibles: {},
        buildings: {},
        trees: {},
        stones: {},
        socialFarming: {
          ...GAME_STATE.socialFarming,
          completedProjects: ["Big Orange"],
        },
      },
      action: {
        id: "123",
        type: "collectible.placed",
        name: "Big Orange",
        coordinates: {
          x: 0,
          y: 0,
        },
        location: "farm",
      },
      createdAt: dateNow,
    });

    expect(state.socialFarming.villageProjects["Big Orange"]).toBeUndefined();
    expect(state.collectibles["Big Orange"]).toHaveLength(1);
  });

  it("Cannot place a building", () => {
    expect(() =>
      placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            Scarecrow: new Decimal(2),
            Carrot: new Decimal(10),
            "Fire Pit": new Decimal(10),
          },
          collectibles: {},
        },
        action: {
          id: "123",
          type: "collectible.placed",
          name: "Fire Pit" as CollectibleName,
          coordinates: {
            x: 0,
            y: 0,
          },
          location: "farm",
        },
      }),
    ).toThrow("You cannot place this item");
  });
  it("should use existing data from land if placing in home", () => {
    const dateNow = Date.now();
    const state = placeCollectible({
      state: {
        ...GAME_STATE,
        island: {
          type: "volcano",
        },
        inventory: {
          "Maneki Neko": new Decimal(1),
        },
        collectibles: {
          "Maneki Neko": [
            {
              id: "123",
              removedAt: dateNow,
              readyAt: dateNow,
              createdAt: dateNow,
              shakenAt: dateNow,
            },
          ],
        },
      },
      action: {
        id: "123",
        type: "collectible.placed",
        name: "Maneki Neko",
        coordinates: {
          x: 5,
          y: 5,
        },
        location: "home",
      },
      createdAt: dateNow,
    });

    expect(state.home.collectibles["Maneki Neko"]).toEqual<ShakeItem[]>([
      {
        id: "123",
        readyAt: dateNow,
        createdAt: dateNow,
        shakenAt: dateNow,
        coordinates: {
          x: 5,
          y: 5,
        },
      },
    ]);
    expect(state.collectibles["Maneki Neko"]).toEqual<ShakeItem[]>([]);
  });

  it("Places a pet", () => {
    const dateNow = Date.now();
    const state = placeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          Barkley: new Decimal(1),
        },
        collectibles: {},
      },
      action: {
        id: "123",
        type: "collectible.placed",
        name: "Barkley",
        coordinates: {
          x: 5,
          y: 5,
        },
        location: "farm",
      },
      createdAt: dateNow,
    });

    expect(state.pets?.common).toEqual<Partial<Record<PetName, Pet>>>({
      Barkley: {
        name: "Barkley",
        experience: 0,
        energy: 0,
        requests: {
          food: [],
          fedAt: dateNow,
        },
        pettedAt: dateNow,
      },
    });
  });

  it("Places a pet", () => {
    const dateNow = Date.now();
    const state = placeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          Barkley: new Decimal(1),
          Meowchi: new Decimal(1),
        },
        collectibles: {},
        pets: {
          common: {
            Barkley: {
              name: "Barkley",
              experience: 0,
              energy: 0,
              requests: {
                food: ["Pumpkin Cake", "Pumpkin Soup", "Antipasto"],
                fedAt: dateNow,
              },
              pettedAt: dateNow,
            },
          },
        },
      },
      action: {
        id: "123",
        type: "collectible.placed",
        name: "Meowchi",
        coordinates: {
          x: 5,
          y: 5,
        },
        location: "farm",
      },
      createdAt: dateNow,
    });

    expect(state.pets?.common).toEqual<Partial<Record<PetName, Pet>>>({
      Barkley: {
        name: "Barkley",
        experience: 0,
        energy: 0,
        requests: {
          food: ["Pumpkin Cake", "Pumpkin Soup", "Antipasto"],
          fedAt: dateNow,
        },
        pettedAt: dateNow,
      },
      Meowchi: {
        name: "Meowchi",
        experience: 0,
        energy: 0,
        requests: {
          food: [],
          fedAt: dateNow,
        },
        pettedAt: dateNow,
      },
    });
  });

  describe("Pet House Breed Limits", () => {
    // Pet house level 1: 3 breed, level 2: 5 breeds, level 3: 7 breeds
    it("throws error when adding new breed exceeds limit (level 1)", () => {
      const dateNow = Date.now();

      // Level 1 allows 3 breeds. Have 1 Dog placed. Adding Cat (new breed) should throw.
      const placedPets: Partial<Record<PetName, PlacedItem[]>> = {
        Barkley: [{ id: "1", coordinates: { x: 0, y: 0 } }],
        Meowchi: [{ id: "2", coordinates: { x: 2, y: 0 } }],
        Twizzle: [{ id: "3", coordinates: { x: 4, y: 0 } }],
      };

      expect(() =>
        placeCollectible({
          state: {
            ...GAME_STATE,
            inventory: {
              Pip: new Decimal(1),
            },
            petHouse: {
              level: 1,
              pets: placedPets,
            },
          },
          action: {
            id: "2",
            type: "collectible.placed",
            name: "Pip",
            coordinates: { x: 2, y: 0 },
            location: "petHouse",
          },
          createdAt: dateNow,
        }),
      ).toThrow("Pet house breed limit reached");
    });

    it("allows multiple pets of same breed (level 1)", () => {
      const dateNow = Date.now();

      // Level 1 allows 1 breed. Have 1 Dog. Adding another Dog (Biscuit) should allow.
      const placedPets: Partial<Record<PetName, PlacedItem[]>> = {
        Barkley: [{ id: "1", coordinates: { x: 0, y: 0 } }],
      };

      const state = placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            Biscuit: new Decimal(1),
          },
          petHouse: {
            level: 1,
            pets: placedPets,
          },
        },
        action: {
          id: "2",
          type: "collectible.placed",
          name: "Biscuit",
          coordinates: { x: 2, y: 0 },
          location: "petHouse",
        },
        createdAt: dateNow,
      });

      expect(state.petHouse.pets["Biscuit"]).toHaveLength(1);
    });

    it("allows 4 breeds at level 2", () => {
      const dateNow = Date.now();

      // Level 2 allows 4 breeds: Dog, Cat, Owl, Horse
      const placedPets: Partial<Record<PetName, PlacedItem[]>> = {
        Barkley: [{ id: "1", coordinates: { x: 0, y: 0 } }],
        Meowchi: [{ id: "2", coordinates: { x: 2, y: 0 } }],
        Twizzle: [{ id: "3", coordinates: { x: 4, y: 0 } }],
        Burro: [{ id: "4", coordinates: { x: 0, y: 2 } }],
      };

      const state = placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            Pinto: new Decimal(1),
          },
          petHouse: {
            level: 2,
            pets: placedPets,
          },
        },
        action: {
          id: "5",
          type: "collectible.placed",
          name: "Pinto",
          coordinates: { x: 2, y: 2 },
          location: "petHouse",
        },
        createdAt: dateNow,
      });

      expect(state.petHouse.pets["Pinto"]).toHaveLength(1);
    });

    it("throws when adding 6th breed at level 2", () => {
      const dateNow = Date.now();

      // Level 2 allows 4 breeds. Have Dog, Cat, Owl, Horse. Adding Bull (5th breed) should throw.
      const placedPets: Partial<Record<PetName, PlacedItem[]>> = {
        Barkley: [{ id: "1", coordinates: { x: 0, y: 0 } }],
        Meowchi: [{ id: "2", coordinates: { x: 2, y: 0 } }],
        Twizzle: [{ id: "3", coordinates: { x: 4, y: 0 } }],
        Burro: [{ id: "4", coordinates: { x: 0, y: 2 } }],
        Mudhorn: [{ id: "5", coordinates: { x: 2, y: 4 } }],
      };

      expect(() =>
        placeCollectible({
          state: {
            ...GAME_STATE,
            inventory: {
              Pip: new Decimal(1),
            },
            petHouse: {
              level: 2,
              pets: placedPets,
            },
          },
          action: {
            id: "5",
            type: "collectible.placed",
            name: "Pip",
            coordinates: { x: 2, y: 2 },
            location: "petHouse",
          },
          createdAt: dateNow,
        }),
      ).toThrow("Pet house breed limit reached");
    });

    it("does not check breed limit when placing in farm location", () => {
      const dateNow = Date.now();

      // Breed limit only applies to pet house; placing on farm should work
      const placedPets: Partial<Record<PetName, PlacedItem[]>> = {
        Barkley: [{ id: "1", coordinates: { x: 0, y: 0 } }],
        Meowchi: [{ id: "2", coordinates: { x: 2, y: 0 } }],
      };

      const state = placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            Flicker: new Decimal(1),
          },
          petHouse: {
            level: 1,
            pets: placedPets,
          },
        },
        action: {
          id: "3",
          type: "collectible.placed",
          name: "Flicker",
          coordinates: { x: 10, y: 10 },
          location: "farm",
        },
        createdAt: dateNow,
      });

      expect(state.collectibles["Flicker"]).toHaveLength(1);
    });
  });
});
