import { TEST_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { placeBumpkin } from "./placeBumpkin";

const GAME_STATE: GameState = {
  ...TEST_FARM,
};

describe("placeBumpkin", () => {
  it("throws if no bumpkin", () => {
    expect(() =>
      placeBumpkin({
        state: { ...GAME_STATE, bumpkin: undefined as never },
        action: {
          type: "bumpkin.placed",
          coordinates: { x: 1, y: 1 },
          location: "farm",
        },
      }),
    ).toThrow("No bumpkin");
  });

  it("throws if location is invalid", () => {
    expect(() =>
      placeBumpkin({
        state: GAME_STATE,
        action: {
          type: "bumpkin.placed",
          coordinates: { x: 1, y: 1 },
          location: "petHouse" as "farm",
        },
      }),
    ).toThrow("Invalid bumpkin location");
  });

  it("places bumpkin on the farm", () => {
    const result = placeBumpkin({
      state: GAME_STATE,
      action: {
        type: "bumpkin.placed",
        coordinates: { x: 3, y: 5 },
        location: "farm",
      },
    });

    expect(result.bumpkin?.coordinates).toEqual({ x: 3, y: 5 });
    expect(result.bumpkin?.location).toBe("farm");
  });

  it("places bumpkin in the home", () => {
    const result = placeBumpkin({
      state: GAME_STATE,
      action: {
        type: "bumpkin.placed",
        coordinates: { x: 1, y: 2 },
        location: "home",
      },
    });

    expect(result.bumpkin?.coordinates).toEqual({ x: 1, y: 2 });
    expect(result.bumpkin?.location).toBe("home");
  });
});
