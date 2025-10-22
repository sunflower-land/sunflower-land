import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { CollectibleName } from "../../types/craftables";
import { GameState, ShakeItem } from "../../types/game";
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
});
