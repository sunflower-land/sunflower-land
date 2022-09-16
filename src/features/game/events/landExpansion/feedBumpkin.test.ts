import { INITIAL_FARM } from "features/game/lib/constants";
import { GameState } from "features/game/types/game";
import { feedBumpkin } from "./feedBumpkin";

describe("feedBumpkin", () => {
  it("requires a bumpkin", () => {
    const state: GameState = { ...INITIAL_FARM, bumpkin: undefined };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Egg" },
      })
    ).toThrow("You do not have a Bumpkin");
  });

  it("requires food is in inventory", () => {
    const state: GameState = { ...INITIAL_FARM, inventory: {} };
    expect(() =>
      feedBumpkin({
        state,
        action: { type: "bumpkin.feed", food: "Boiled Egg" },
      })
    ).toThrow("You have none of this food type");
  });
});
