import { GameState } from "../types/game";
import { makeGame } from "./transforms";
import FARM128727 from "../../../../128727.json";
import craftingRecipes from "../../../../craftingRecipes.json";
import { Recipes } from "./crafting";

const madeGame: GameState = makeGame({ ...FARM128727.farm });
export const OFFLINE_FARM: GameState = {
  ...madeGame,
  blessing: {
    offering: {
      item: "Green Amulet",
      prize: "Green Amulet",
    },
  },
  craftingBox: {
    ...madeGame.craftingBox,
    recipes: craftingRecipes as Partial<Recipes>,
  },
};
