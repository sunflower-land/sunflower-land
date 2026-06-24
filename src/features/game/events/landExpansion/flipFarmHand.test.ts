import { TEST_FARM } from "features/game/lib/constants";
import type { GameState } from "features/game/types/game";
import { flipFarmHand } from "./flipFarmHand";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  farmHands: {
    bumpkins: {
      "fh-1": {
        equipped: TEST_FARM.bumpkin!.equipped,
        coordinates: { x: 1, y: 1 },
        location: "farm",
      },
    },
  },
};

describe("flipFarmHand", () => {
  it("throws if farm hand does not exist", () => {
    expect(() =>
      flipFarmHand({
        state: GAME_STATE,
        action: {
          type: "farmHand.flipped",
          id: "missing",
          location: "farm",
        },
      }),
    ).toThrow("Farm hand does not exist");
  });

  it("throws if farm hand is not placed", () => {
    expect(() =>
      flipFarmHand({
        state: {
          ...GAME_STATE,
          farmHands: {
            bumpkins: {
              "fh-1": {
                equipped: TEST_FARM.bumpkin!.equipped,
              },
            },
          },
        },
        action: {
          type: "farmHand.flipped",
          id: "fh-1",
          location: "farm",
        },
      }),
    ).toThrow("Farm hand is not placed");
  });

  it("flips farm hand", () => {
    const result = flipFarmHand({
      state: GAME_STATE,
      action: {
        type: "farmHand.flipped",
        id: "fh-1",
        location: "farm",
      },
    });

    expect(result.farmHands.bumpkins["fh-1"].flipped).toBe(true);
  });

  it("unflips farm hand", () => {
    const result = flipFarmHand({
      state: {
        ...GAME_STATE,
        farmHands: {
          bumpkins: {
            "fh-1": {
              ...GAME_STATE.farmHands.bumpkins["fh-1"],
              flipped: true,
            },
          },
        },
      },
      action: {
        type: "farmHand.flipped",
        id: "fh-1",
        location: "farm",
      },
    });

    expect(result.farmHands.bumpkins["fh-1"].flipped).toBe(false);
  });
});
