import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { getChestItems } from "./utils/inventory";

const GAME_STATE: GameState = TEST_FARM;

describe("chest", () => {
  it("creates an empty chest", () => {
    const chest = getChestItems({
      ...GAME_STATE,
      collectibles: {},
    });

    expect(chest).toEqual({});
  });

  it("includes the correct amount for items in the chest", () => {
    const chest = getChestItems({
      ...GAME_STATE,
      inventory: {
        "Farm Cat": new Decimal(2),
        "Woody the Beaver": new Decimal(1),
      },
      collectibles: {},
    });

    expect(chest).toEqual({
      "Farm Cat": new Decimal(2),
      "Woody the Beaver": new Decimal(1),
    });
  });

  it("includes a variety of chest items and excludes all items on the basket ", () => {
    const chest = getChestItems({
      ...GAME_STATE,
      inventory: {
        "Potato Seed": new Decimal(5),
        Potato: new Decimal("3"),
        "Roasted Cauliflower": new Decimal(1),
        Stone: new Decimal(5),
        "Ancient Goblin Sword": new Decimal(1),
        Pickaxe: new Decimal(1),
        "Fire Pit": new Decimal(1),
        "Foreman Beaver": new Decimal(1),
      },
      collectibles: {
        Scarecrow: [
          {
            coordinates: { x: 1, y: 1 },
            createdAt: Date.now(),
            id: "asd",
            readyAt: Date.now(),
          },
        ],
      },
    });

    expect(chest).toEqual({
      "Foreman Beaver": new Decimal(1),
    });
  });

  it("excludes items already placed", () => {
    const chest = getChestItems({
      ...GAME_STATE,
      inventory: {
        "Fire Pit": new Decimal(1),
        "Foreman Beaver": new Decimal(1),
        Scarecrow: new Decimal(1),
        "Abandoned Bear": new Decimal(2),
      },
      home: {
        collectibles: {
          "Abandoned Bear": [
            {
              coordinates: { x: 1, y: 1 },
              createdAt: Date.now(),
              id: "asd",
              readyAt: Date.now(),
            },
          ],
        },
      },
      collectibles: {
        Scarecrow: [
          {
            coordinates: { x: 1, y: 1 },
            createdAt: Date.now(),
            id: "asd",
            readyAt: Date.now(),
          },
        ],
      },
    });
    expect(chest).toEqual({
      "Foreman Beaver": new Decimal(1),
      "Abandoned Bear": new Decimal(1),
    });
  });
});
