import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { GameState } from "../../types/game";
import { buyMonument } from "./buyMonument";
import { WorkbenchMonumentName } from "features/game/types/monuments";

const GAME_STATE: GameState = TEST_FARM;

describe("buyMonument", () => {
  it("throws an error if item is not a monument", () => {
    expect(() =>
      buyMonument({
        state: GAME_STATE,
        action: {
          type: "monument.bought",
          name: "Goblin Key" as WorkbenchMonumentName,
        },
      }),
    ).toThrow("This item is not a monument");
  });

  it("does not craft monument if requirements are not met", () => {
    expect(() =>
      buyMonument({
        state: {
          ...GAME_STATE,
          coins: 1000,
          inventory: {},
        },
        action: {
          type: "monument.bought",
          name: "Farmer's Monument",
        },
      }),
    ).toThrow("Insufficient ingredient: Gem");
  });

  it("mints the newly bought monument", () => {
    const item = "Farmer's Monument";
    const state = buyMonument({
      state: {
        ...GAME_STATE,
        coins: 0,
        inventory: {
          Gem: new Decimal(150),
        },
      },
      action: {
        name: item,
        type: "monument.bought",
      },
    });

    const oldAmount = GAME_STATE.inventory[item] ?? new Decimal(0);

    expect(state.inventory[item]).toEqual(oldAmount.add(1));
  });

  it("increments the bought activity", () => {
    const state = buyMonument({
      state: {
        ...GAME_STATE,
        coins: 0,
        inventory: {
          Gem: new Decimal(150),
        },
      },
      action: {
        type: "monument.bought",
        name: "Farmer's Monument",
      },
    });
    expect(state.farmActivity["Farmer's Monument Bought"]).toEqual(1);
  });

  it("requires ID does not exist", () => {
    expect(() =>
      buyMonument({
        state: {
          ...GAME_STATE,
          coins: 9,
          inventory: {
            Gem: new Decimal(150),
            "Basic Land": new Decimal(10),
          },
          buildings: {},
          collectibles: {
            "Farmer's Monument": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "monument.bought",
          name: "Farmer's Monument",
          coordinates: { x: 0, y: 5 },
          id: "123",
        },
      }),
    ).toThrow("ID already exists");
  });

  it("requires monument does not collide", () => {
    expect(() =>
      buyMonument({
        state: {
          ...GAME_STATE,
          coins: 0,
          inventory: {
            Gem: new Decimal(150),
            "Basic Land": new Decimal(10),
          },
          buildings: {},
          collectibles: {
            "Farmer's Monument": [
              {
                id: "123",
                coordinates: { x: 0, y: 0 },
                createdAt: 0,
                readyAt: 0,
              },
            ],
          },
        },
        action: {
          type: "monument.bought",
          name: "Farmer's Monument",
          coordinates: { x: 0, y: 0 },
          id: "456",
        },
      }),
    ).toThrow("Monument collides");
  });

  it("places monument", () => {
    const state = buyMonument({
      state: {
        ...GAME_STATE,
        coins: 0,
        inventory: {
          Gem: new Decimal(150),
          "Basic Land": new Decimal(10),
        },
        buildings: {},
        collectibles: {},
      },
      action: {
        type: "monument.bought",
        name: "Farmer's Monument",
        coordinates: { x: 0, y: 5 },
        id: "456",
      },
    });

    expect(state.collectibles["Farmer's Monument"]?.[0]?.coordinates).toEqual({
      x: 0,
      y: 5,
    });
  });

  it("adds monument to village projects", () => {
    const state = buyMonument({
      state: {
        ...GAME_STATE,
        coins: 4000,
        inventory: {
          Gem: new Decimal(1000),
          "Basic Land": new Decimal(10),
        },
      },
      action: {
        type: "monument.bought",
        name: "Big Banana",
        coordinates: { x: 0, y: 5 },
        id: "456",
      },
    });

    expect(state.socialFarming.villageProjects["Big Banana"]).toEqual({
      cheers: 0,
    });
  });

  it("does not allow a monument to be bought twice", () => {
    const state = buyMonument({
      state: {
        ...GAME_STATE,
        coins: 0,
        inventory: {
          Gem: new Decimal(300),
          "Basic Land": new Decimal(10),
        },
      },
      action: {
        type: "monument.bought",
        name: "Farmer's Monument",
        coordinates: { x: 0, y: 5 },
        id: "456",
      },
      createdAt: 0,
    });

    expect(state.collectibles["Farmer's Monument"]?.[0]?.coordinates).toEqual({
      x: 0,
      y: 5,
    });

    expect(() =>
      buyMonument({
        state: state,
        action: {
          type: "monument.bought",
          name: "Farmer's Monument",
        },
      }),
    ).toThrow("Max monument reached");
  });
});
