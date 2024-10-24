import { GameState } from "features/game/types/game";
import { discoverRecipe } from "./discoverRecipe";
import Decimal from "decimal.js-light";
import { INITIAL_FARM } from "features/game/lib/constants";

describe("discoverRecipe", () => {
  it("should throw if the recipe cannot be discovered", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {
        ...INITIAL_FARM.inventory,
      },
    };

    expect(() =>
      discoverRecipe({
        state,
        action: {
          type: "recipe.discovered",
          recipe: "Dirt Path",
        },
      }),
    ).toThrow("Recipe cannot be discovered");
  });

  it("should throw if player does not have the required number of basic lands", () => {
    const state: GameState = {
      ...INITIAL_FARM,
      inventory: {
        ...INITIAL_FARM.inventory,
        "Basic Land": new Decimal(0),
      },
    };

    expect(() =>
      discoverRecipe({
        state,
        action: {
          type: "recipe.discovered",
          recipe: "Basic Bed",
        },
      }),
    ).toThrow("Insufficient Basic Land");
  });
});
