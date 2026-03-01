import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { moveFarmHand } from "./moveFarmHand";

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
        coordinates: { x: 1, y: 1 },
        location: "farm",
      },
    },
  },
};

describe("moveFarmHand", () => {
  it("throws if the farm hand does not exist", () => {
    expect(() =>
      moveFarmHand({
        state: GAME_STATE,
        action: {
          type: "farmHand.moved",
          id: "nonexistent",
          coordinates: { x: 2, y: 2 },
          location: "farm",
        },
      }),
    ).toThrow("Farm hand does not exist");
  });

  it("throws if the farm hand is not placed", () => {
    const state: GameState = {
      ...GAME_STATE,
      farmHands: {
        bumpkins: {
          "fh-1": {
            equipped: GAME_STATE.farmHands.bumpkins["fh-1"].equipped,
          },
        },
      },
    };

    expect(() =>
      moveFarmHand({
        state,
        action: {
          type: "farmHand.moved",
          id: "fh-1",
          coordinates: { x: 2, y: 2 },
          location: "farm",
        },
      }),
    ).toThrow("Farm hand is not placed");
  });

  it("moves a farm hand to new coordinates", () => {
    const result = moveFarmHand({
      state: GAME_STATE,
      action: {
        type: "farmHand.moved",
        id: "fh-1",
        coordinates: { x: 5, y: 3 },
        location: "farm",
      },
    });

    expect(result.farmHands.bumpkins["fh-1"].coordinates).toEqual({
      x: 5,
      y: 3,
    });
    expect(result.farmHands.bumpkins["fh-1"].location).toBe("farm");
  });

  it("moves a farm hand from farm to home", () => {
    const result = moveFarmHand({
      state: GAME_STATE,
      action: {
        type: "farmHand.moved",
        id: "fh-1",
        coordinates: { x: 0, y: 1 },
        location: "home",
      },
    });

    expect(result.farmHands.bumpkins["fh-1"].coordinates).toEqual({
      x: 0,
      y: 1,
    });
    expect(result.farmHands.bumpkins["fh-1"].location).toBe("home");
  });
});
