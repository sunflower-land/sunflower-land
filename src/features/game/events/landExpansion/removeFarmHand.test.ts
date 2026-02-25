import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { removeFarmHand } from "./removeFarmHand";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  farmHands: {
    bumpkins: {
      "fh-1": {
        equipped: {
          background: "Farm Background",
          body: "Beige Farmer Potion",
          hair: "Basic Hair",
          shoes: "Black Farmer Boots",
          pants: "Farmer Pants",
          shirt: "Yellow Farmer Shirt",
          tool: "Farmer Pitchfork",
        },
        coordinates: { x: 3, y: 5 },
        location: "farm",
      },
    },
  },
};

describe("removeFarmHand", () => {
  it("throws if the farm hand does not exist", () => {
    expect(() =>
      removeFarmHand({
        state: GAME_STATE,
        action: {
          type: "farmHand.removed",
          id: "nonexistent",
          location: "farm",
        },
      }),
    ).toThrow("Farm hand does not exist");
  });

  it("removes a farm hand from the farm", () => {
    const result = removeFarmHand({
      state: GAME_STATE,
      action: {
        type: "farmHand.removed",
        id: "fh-1",
        location: "farm",
      },
    });

    expect(result.farmHands.bumpkins["fh-1"].coordinates).toBeUndefined();
    expect(result.farmHands.bumpkins["fh-1"].location).toBeUndefined();
    expect(result.farmHands.bumpkins["fh-1"].equipped).toBeDefined();
  });

  it("removes a farm hand from the home", () => {
    const state: GameState = {
      ...GAME_STATE,
      farmHands: {
        bumpkins: {
          "fh-1": {
            ...GAME_STATE.farmHands.bumpkins["fh-1"],
            coordinates: { x: 1, y: 2 },
            location: "home",
          },
        },
      },
    };

    const result = removeFarmHand({
      state,
      action: {
        type: "farmHand.removed",
        id: "fh-1",
        location: "home",
      },
    });

    expect(result.farmHands.bumpkins["fh-1"].coordinates).toBeUndefined();
    expect(result.farmHands.bumpkins["fh-1"].location).toBeUndefined();
  });
});
