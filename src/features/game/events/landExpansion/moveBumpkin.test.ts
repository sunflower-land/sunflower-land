import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { moveBumpkin } from "./moveBumpkin";

const GAME_STATE: GameState = {
  ...TEST_FARM,
  bumpkin: {
    ...TEST_FARM.bumpkin!,
    coordinates: { x: 1, y: 1 },
    location: "farm" as const,
  },
};

describe("moveBumpkin", () => {
  it("throws if no bumpkin", () => {
    expect(() =>
      moveBumpkin({
        state: { ...GAME_STATE, bumpkin: undefined as never },
        action: {
          type: "bumpkin.moved",
          coordinates: { x: 2, y: 2 },
          location: "farm",
        },
      }),
    ).toThrow("No bumpkin");
  });

  it("throws if bumpkin is not placed", () => {
    expect(() =>
      moveBumpkin({
        state: {
          ...GAME_STATE,
          bumpkin: { ...TEST_FARM.bumpkin! },
        },
        action: {
          type: "bumpkin.moved",
          coordinates: { x: 2, y: 2 },
          location: "farm",
        },
      }),
    ).toThrow("Bumpkin is not placed");
  });

  it("throws if location is invalid", () => {
    expect(() =>
      moveBumpkin({
        state: GAME_STATE,
        action: {
          type: "bumpkin.moved",
          coordinates: { x: 2, y: 2 },
          location: "petHouse" as "farm",
        },
      }),
    ).toThrow("Invalid bumpkin location");
  });

  it("throws when moving bumpkin to level_one before the floor is unlocked", () => {
    expect(() =>
      moveBumpkin({
        state: GAME_STATE,
        action: {
          type: "bumpkin.moved",
          coordinates: { x: 2, y: 2 },
          location: "level_one",
        },
      }),
    ).toThrow("Level one floor has not been unlocked");
  });

  it("moves bumpkin to new coordinates", () => {
    const result = moveBumpkin({
      state: GAME_STATE,
      action: {
        type: "bumpkin.moved",
        coordinates: { x: 5, y: 3 },
        location: "farm",
      },
    });

    expect(result.bumpkin?.coordinates).toEqual({ x: 5, y: 3 });
    expect(result.bumpkin?.location).toBe("farm");
  });
});
