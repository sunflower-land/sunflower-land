import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { placeFarmHand } from "./placeFarmHand";

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
      },
    },
  },
};

describe("placeFarmHand", () => {
  it("throws if the farm hand does not exist", () => {
    expect(() =>
      placeFarmHand({
        state: GAME_STATE,
        action: {
          type: "farmHand.placed",
          id: "nonexistent",
          coordinates: { x: 1, y: 1 },
          location: "farm",
        },
      }),
    ).toThrow("Farm hand does not exist");
  });

  it("throws if the location is invalid", () => {
    expect(() =>
      placeFarmHand({
        state: GAME_STATE,
        action: {
          type: "farmHand.placed",
          id: "fh-1",
          coordinates: { x: 1, y: 1 },
          location: "petHouse" as "farm",
        },
      }),
    ).toThrow("Invalid farm hand location");
  });

  it("places a farm hand on the farm", () => {
    const result = placeFarmHand({
      state: GAME_STATE,
      action: {
        type: "farmHand.placed",
        id: "fh-1",
        coordinates: { x: 3, y: 5 },
        location: "farm",
      },
    });

    expect(result.farmHands.bumpkins["fh-1"].coordinates).toEqual({
      x: 3,
      y: 5,
    });
    expect(result.farmHands.bumpkins["fh-1"].location).toBe("farm");
  });

  it("places a farm hand in the home", () => {
    const result = placeFarmHand({
      state: GAME_STATE,
      action: {
        type: "farmHand.placed",
        id: "fh-1",
        coordinates: { x: 1, y: 2 },
        location: "home",
      },
    });

    expect(result.farmHands.bumpkins["fh-1"].coordinates).toEqual({
      x: 1,
      y: 2,
    });
    expect(result.farmHands.bumpkins["fh-1"].location).toBe("home");
  });
});
