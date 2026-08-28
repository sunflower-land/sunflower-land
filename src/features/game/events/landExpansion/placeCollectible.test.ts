import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import type { CollectibleName } from "../../types/craftables";
import type { GameState, PlacedItem, ShakeItem } from "../../types/game";
import { placeCollectible } from "./placeCollectible";
import { EXPIRY_COOLDOWNS } from "features/game/lib/collectibleBuilt";
import type { PlaceableLocation } from "features/game/types/collectibles";
import type { Pet, PetName } from "features/game/types/pets";

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
        // (0, 0) is a crop plot on INITIAL_FARM. The reducer now runs the same
        // collision check as the API, so clear the land the placement needs.
        crops: {},
        buildings: {},
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
        buildings: {},
        inventory: {
          Scarecrow: new Decimal(2),
        },
        collectibles: {
          Scarecrow: [
            {
              id: "123",
              coordinates: { x: -1, y: -1 },
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
          x: 1,
          y: 1,
        },
        location: "farm",
      },
    });

    expect(state.collectibles["Scarecrow"]).toHaveLength(2);
    expect(state.collectibles["Scarecrow"]?.[0]).toEqual({
      id: expect.any(String),
      coordinates: { x: -1, y: -1 },
    });
    expect(state.collectibles["Scarecrow"]?.[1]).toEqual({
      id: expect.any(String),
      coordinates: { x: 1, y: 1 },
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
        crops: {},
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
        crops: {},
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

  it("does not restart a village project when re-placing a monument", () => {
    const dateNow = Date.now();
    const state = placeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Basic Cooking Pot": new Decimal(1),
        },
        collectibles: {
          // Previously placed, then removed - its project has already been
          // consumed, so restarting it must go through `project.started`
          "Basic Cooking Pot": [{ id: "123", removedAt: dateNow }],
        },
        crops: {},
      },
      action: {
        id: "123",
        type: "collectible.placed",
        name: "Basic Cooking Pot",
        coordinates: {
          x: 0,
          y: 0,
        },
        location: "farm",
      },
      createdAt: dateNow,
    });

    expect(
      state.socialFarming.villageProjects["Basic Cooking Pot"],
    ).toBeUndefined();
  });

  it("does not restart a village project when moving a monument out of the home", () => {
    const dateNow = Date.now();
    const state = placeCollectible({
      state: {
        ...GAME_STATE,
        inventory: {
          "Basic Cooking Pot": new Decimal(1),
        },
        collectibles: {},
        crops: {},
        home: {
          ...GAME_STATE.home,
          collectibles: {
            "Basic Cooking Pot": [{ id: "123", removedAt: dateNow }],
          },
        },
      },
      action: {
        id: "456",
        type: "collectible.placed",
        name: "Basic Cooking Pot",
        coordinates: {
          x: 0,
          y: 0,
        },
        location: "farm",
      },
      createdAt: dateNow,
    });

    expect(
      state.socialFarming.villageProjects["Basic Cooking Pot"],
    ).toBeUndefined();
    expect(state.collectibles["Basic Cooking Pot"]).toHaveLength(1);
  });

  describe("temporary collectibles", () => {
    const cooldown = EXPIRY_COOLDOWNS["Harvest Hourglass"];

    const farmWithPlacedHourglass = (placed: PlacedItem): GameState => ({
      ...GAME_STATE,
      inventory: { "Harvest Hourglass": new Decimal(2) },
      collectibles: { "Harvest Hourglass": [placed] },
    });

    const place = (state: GameState, location: PlaceableLocation = "farm") =>
      placeCollectible({
        state,
        action: {
          type: "collectible.placed",
          name: "Harvest Hourglass",
          id: "2",
          coordinates: { x: 5, y: 5 },
          location,
        },
        createdAt: date,
      });

    it("cannot place a second one while the first is still active", () => {
      expect(() =>
        place(
          farmWithPlacedHourglass({
            id: "1",
            coordinates: { x: 0, y: 0 },
            createdAt: date,
          }),
        ),
      ).toThrow("Only one of this temporary collectible can be placed");
    });

    // Expired but still on the map: the placement is what blocks a duplicate,
    // not whether its boost is still running.
    it("cannot place a second one while an expired one is still placed", () => {
      expect(() =>
        place(
          farmWithPlacedHourglass({
            id: "1",
            coordinates: { x: 0, y: 0 },
            createdAt: date - cooldown - 1,
          }),
        ),
      ).toThrow("Only one of this temporary collectible can be placed");
    });

    it("can place one when the only other copy has been lifted", () => {
      const state = place(
        {
          ...farmWithPlacedHourglass({
            id: "1",
            createdAt: date,
            removedAt: date,
          }),
          island: { type: "volcano" },
        },
        "home",
      );

      const placed = [
        ...(state.collectibles["Harvest Hourglass"] ?? []),
        ...(state.home.collectibles["Harvest Hourglass"] ?? []),
      ].filter((item) => item.coordinates);

      expect(placed).toHaveLength(1);
    });

    it("cannot place a second one that lives in another location", () => {
      expect(() =>
        place({
          ...GAME_STATE,
          inventory: { "Harvest Hourglass": new Decimal(2) },
          home: {
            ...GAME_STATE.home,
            collectibles: {
              "Harvest Hourglass": [
                { id: "1", coordinates: { x: 0, y: 0 }, createdAt: date },
              ],
            },
          },
        }),
      ).toThrow("Only one of this temporary collectible can be placed");
    });
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
          buildings: {},
          trees: {},
          stones: {},
          iron: {},
          gold: {},
          crops: {},
          fruitPatches: {},
          collectibles: {},
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
          coordinates: { x: 2, y: 2 }, // Use empty farm coordinates
          location: "farm",
        },
        createdAt: dateNow,
      });

      expect(state.collectibles["Flicker"]).toHaveLength(1);
    });
  });

  describe("interior placement", () => {
    it("places a collectible into the interior ground floor", () => {
      const state = placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            "Abandoned Bear": new Decimal(1),
          },
          interior: {
            ground: { collectibles: {} },
          },
        },
        action: {
          id: "ground-1",
          type: "collectible.placed",
          name: "Abandoned Bear",
          // (-5, -5) → layout tile (7, 7) — a valid wood-floor tile on the
          // basic island layout (the default for TEST_FARM). The basic tent
          // only spans tiles x 3-8, y 2-7.
          coordinates: { x: -5, y: -5 },
          location: "interior",
        },
      });

      expect(state.interior.ground.collectibles["Abandoned Bear"]).toEqual([
        {
          id: "ground-1",
          coordinates: { x: -5, y: -5 },
        },
      ]);
    });

    it("places a collectible into the level_one floor", () => {
      const state = placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            "Abandoned Bear": new Decimal(1),
          },
          interior: {
            ground: { collectibles: {} },
            expansion: "level-one-start",
            level_one: { collectibles: {} },
          },
        },
        action: {
          id: "lo-1",
          type: "collectible.placed",
          name: "Abandoned Bear",
          // (0, 0) → layout tile (12, 12) — valid level-one-start tile.
          coordinates: { x: 0, y: 0 },
          location: "level_one",
        },
      });

      expect(state.interior.level_one!.collectibles["Abandoned Bear"]).toEqual([
        {
          id: "lo-1",
          coordinates: { x: 0, y: 0 },
        },
      ]);
    });

    it("moves an unplaced interior collectible to the farm rather than creating a duplicate", () => {
      const state = placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            "Tornado Pinwheel": new Decimal(1),
          },
          collectibles: {},
          interior: {
            ground: {
              collectibles: {
                // Removed from the interior, so it has no coordinates
                "Tornado Pinwheel": [{ id: "interior-1", used: true }],
              },
            },
          },
        },
        action: {
          id: "new-id",
          type: "collectible.placed",
          name: "Tornado Pinwheel",
          coordinates: { x: 1, y: 1 },
          location: "farm",
        },
      });

      // The same instance is moved across — a weather item's `used` flag must
      // survive the move, otherwise it is renewed for free.
      expect(state.collectibles["Tornado Pinwheel"]).toEqual([
        { id: "interior-1", used: true, coordinates: { x: 1, y: 1 } },
      ]);
      expect(state.interior.ground.collectibles["Tornado Pinwheel"]).toEqual(
        [],
      );
    });

    it("moves an unplaced level_one collectible to the home rather than creating a duplicate", () => {
      const state = placeCollectible({
        state: {
          ...GAME_STATE,
          inventory: {
            "Tornado Pinwheel": new Decimal(1),
          },
          collectibles: {},
          interior: {
            ground: { collectibles: {} },
            expansion: "level-one-start",
            level_one: {
              collectibles: {
                "Tornado Pinwheel": [{ id: "lo-1", used: true }],
              },
            },
          },
        },
        action: {
          id: "new-id",
          type: "collectible.placed",
          name: "Tornado Pinwheel",
          coordinates: { x: 1, y: 1 },
          location: "home",
        },
      });

      expect(state.home.collectibles["Tornado Pinwheel"]).toEqual([
        { id: "lo-1", used: true, coordinates: { x: 1, y: 1 } },
      ]);
      expect(
        state.interior.level_one!.collectibles["Tornado Pinwheel"],
      ).toEqual([]);
    });

    it("rejects placing on level_one before the upgrade has been bought", () => {
      expect(() =>
        placeCollectible({
          state: {
            ...GAME_STATE,
            inventory: {
              "Abandoned Bear": new Decimal(1),
            },
            interior: {
              ground: { collectibles: {} },
              // level_one purposely missing
            },
          },
          action: {
            id: "lo-1",
            type: "collectible.placed",
            name: "Abandoned Bear",
            coordinates: { x: 0, y: 0 },
            location: "level_one",
          },
        }),
      ).toThrow("Level one floor has not been unlocked");
    });
  });
});
