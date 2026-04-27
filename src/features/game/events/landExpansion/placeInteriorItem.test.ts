import Decimal from "decimal.js-light";
import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { placeInteriorItem } from "./placeInteriorItem";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  balance: new Decimal(0),
  inventory: {
    "Abandoned Bear": new Decimal(2),
  },
  interior: { ground: { collectibles: {} } },
};

describe("placeInteriorItem", () => {
  it("places a collectible into the interior when inventory has it", () => {
    const next = placeInteriorItem({
      state: GAME_STATE,
      action: {
        type: "interior.itemPlaced",
        name: "Abandoned Bear",
        id: "abc",
        coordinates: { x: 2, y: 3 },
      },
      createdAt: 1_000,
    });

    expect(next.interior.ground.collectibles["Abandoned Bear"]).toEqual([
      {
        id: "abc",
        coordinates: { x: 2, y: 3 },
      },
    ]);
  });

  it("reuses an existing un-placed entry instead of creating a duplicate", () => {
    const next = placeInteriorItem({
      state: {
        ...GAME_STATE,
        interior: {
          ground: {
            collectibles: {
              "Abandoned Bear": [{ id: "existing" }],
            },
          },
        },
      },
      action: {
        type: "interior.itemPlaced",
        name: "Abandoned Bear",
        id: "new-id-ignored",
        coordinates: { x: 4, y: 5 },
      },
      createdAt: 1_000,
    });

    const bears = next.interior.ground.collectibles["Abandoned Bear"];
    expect(bears).toHaveLength(1);
    expect(bears?.[0]).toEqual({
      id: "existing",
      coordinates: { x: 4, y: 5 },
    });
  });

  it("throws if the player has none of the item in inventory", () => {
    expect(() =>
      placeInteriorItem({
        state: {
          ...GAME_STATE,
          inventory: {},
        },
        action: {
          type: "interior.itemPlaced",
          name: "Abandoned Bear",
          id: "abc",
          coordinates: { x: 0, y: 0 },
        },
      }),
    ).toThrow("You can't place an item that is not on the inventory");
  });

  it("does not mutate the original state", () => {
    const before = GAME_STATE;
    placeInteriorItem({
      state: before,
      action: {
        type: "interior.itemPlaced",
        name: "Abandoned Bear",
        id: "abc",
        coordinates: { x: 2, y: 3 },
      },
    });
    expect(before.interior.ground.collectibles["Abandoned Bear"]).toBeUndefined();
  });
});
