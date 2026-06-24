import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { flipBumpkin } from "./flipBumpkin";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: {
    ...TEST_FARM.bumpkin!,
    coordinates: { x: 1, y: 1 },
    location: "farm",
  },
};

describe("flipBumpkin", () => {
  it("throws if no bumpkin", () => {
    expect(() =>
      flipBumpkin({
        state: { ...GAME_STATE, bumpkin: undefined as never },
        action: {
          type: "bumpkin.flipped",
          location: "farm",
        },
      }),
    ).toThrow("No bumpkin");
  });

  it("throws if bumpkin is not placed", () => {
    expect(() =>
      flipBumpkin({
        state: {
          ...GAME_STATE,
          bumpkin: { ...TEST_FARM.bumpkin! },
        },
        action: {
          type: "bumpkin.flipped",
          location: "farm",
        },
      }),
    ).toThrow("Bumpkin is not placed");
  });

  it("flips bumpkin", () => {
    const result = flipBumpkin({
      state: GAME_STATE,
      action: {
        type: "bumpkin.flipped",
        location: "farm",
      },
    });

    expect(result.bumpkin?.flipped).toBe(true);
  });

  it("unflips bumpkin", () => {
    const result = flipBumpkin({
      state: {
        ...GAME_STATE,
        bumpkin: {
          ...GAME_STATE.bumpkin!,
          flipped: true,
        },
      },
      action: {
        type: "bumpkin.flipped",
        location: "farm",
      },
    });

    expect(result.bumpkin?.flipped).toBe(false);
  });
});
