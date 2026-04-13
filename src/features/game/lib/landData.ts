import { GameState } from "../types/game";
import land128727 from "128727.json";
import { makeGame } from "./transforms";

export const OFFLINE_FARM: GameState = {
  ...makeGame(land128727.farm),
  blessing: {
    offering: {
      item: "Green Amulet",
      prize: "Green Amulet",
    },
  },
};
