import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import {
  MOVE_INTERIOR_ITEM_ERRORS,
  moveInteriorItem,
} from "./moveInteriorItem";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  interior: {
    ground: {
      collectibles: {
        "Abandoned Bear": [{ id: "123", coordinates: { x: 1, y: 1 } }],
      },
    },
  },
};

describe("moveInteriorItem", () => {
  it("moves an existing interior collectible to new coordinates", () => {
    const next = moveInteriorItem({
      state: GAME_STATE,
      action: {
        type: "interior.itemMoved",
        name: "Abandoned Bear",
        id: "123",
        coordinates: { x: 4, y: 5 },
      },
    });

    expect(
      next.interior.ground.collectibles["Abandoned Bear"]?.[0].coordinates,
    ).toEqual({ x: 4, y: 5 });
  });

  it("throws when the collectible type is not placed", () => {
    expect(() =>
      moveInteriorItem({
        state: {
          ...GAME_STATE,
          interior: { ground: { collectibles: {} } },
        },
        action: {
          type: "interior.itemMoved",
          name: "Abandoned Bear",
          id: "123",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_INTERIOR_ITEM_ERRORS.NO_COLLECTIBLES);
  });

  it("throws when the collectible id is not placed", () => {
    expect(() =>
      moveInteriorItem({
        state: GAME_STATE,
        action: {
          type: "interior.itemMoved",
          name: "Abandoned Bear",
          id: "does-not-exist",
          coordinates: { x: 2, y: 2 },
        },
      }),
    ).toThrow(MOVE_INTERIOR_ITEM_ERRORS.COLLECTIBLE_NOT_PLACED);
  });
});
