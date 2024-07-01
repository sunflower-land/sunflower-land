import Decimal from "decimal.js-light";
import { TEST_FARM } from "../../lib/constants";
import { CollectibleName } from "../../types/craftables";
import { GameState } from "../../types/game";
import { placeCollectible } from "./placeCollectible";

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
    ).toThrow("This collectible is already placed");
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
              createdAt: date,
              readyAt: date,
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
      readyAt: date,
      createdAt: date,
    });
    expect(state.collectibles["Scarecrow"]?.[1]).toEqual({
      id: expect.any(String),
      coordinates: { x: 0, y: 0 },
      readyAt: date,
      createdAt: date,
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
});
