import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeBumpkinPlacement } from "./removeBumpkinPlacement";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: {
    ...TEST_FARM.bumpkin!,
    coordinates: { x: 1, y: 1 },
    location: "farm" as const,
  },
};

describe("removeBumpkinPlacement", () => {
  it("throws if no bumpkin", () => {
    expect(() =>
      removeBumpkinPlacement({
        state: { ...GAME_STATE, bumpkin: undefined as never },
        action: {
          type: "bumpkin.removedPlacement",
          location: "farm",
        },
      }),
    ).toThrow("No bumpkin");
  });

  it("throws if bumpkin is not placed", () => {
    expect(() =>
      removeBumpkinPlacement({
        state: {
          ...GAME_STATE,
          bumpkin: { ...TEST_FARM.bumpkin! },
        },
        action: {
          type: "bumpkin.removedPlacement",
          location: "farm",
        },
      }),
    ).toThrow("Bumpkin is not placed");
  });

  it("removes bumpkin placement", () => {
    const result = removeBumpkinPlacement({
      state: GAME_STATE,
      action: {
        type: "bumpkin.removedPlacement",
        location: "farm",
      },
    });

    expect(result.bumpkin?.coordinates).toBeUndefined();
    expect(result.bumpkin?.location).toBeUndefined();
  });
});
