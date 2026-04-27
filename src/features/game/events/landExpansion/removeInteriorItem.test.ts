import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import {
  REMOVE_INTERIOR_ITEM_ERRORS,
  removeInteriorItem,
} from "./removeInteriorItem";

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

describe("removeInteriorItem", () => {
  it("removes a collectible's coordinates and stamps removedAt", () => {
    const next = removeInteriorItem({
      state: GAME_STATE,
      action: {
        type: "interior.itemRemoved",
        name: "Abandoned Bear",
        id: "123",
      },
      createdAt: 7_777,
    });

    const bear = next.interior.ground.collectibles["Abandoned Bear"]?.[0];
    expect(bear?.coordinates).toBeUndefined();
    expect(bear?.removedAt).toBe(7_777);
  });

  it("throws when the collectible id is not placed", () => {
    expect(() =>
      removeInteriorItem({
        state: GAME_STATE,
        action: {
          type: "interior.itemRemoved",
          name: "Abandoned Bear",
          id: "nope",
        },
      }),
    ).toThrow(REMOVE_INTERIOR_ITEM_ERRORS.INVALID_COLLECTIBLE);
  });

  it("throws when no bumpkin is present", () => {
    const stateWithoutBumpkin = {
      ...GAME_STATE,
      bumpkin: undefined,
    } as unknown as GameState;
    expect(() =>
      removeInteriorItem({
        state: stateWithoutBumpkin,
        action: {
          type: "interior.itemRemoved",
          name: "Abandoned Bear",
          id: "123",
        },
      }),
    ).toThrow(REMOVE_INTERIOR_ITEM_ERRORS.NO_BUMPKIN);
  });
});
