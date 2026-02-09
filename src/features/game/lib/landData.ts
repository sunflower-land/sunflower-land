import { GameState } from "../types/game";
import FARM_128727 from "../../../../128727.json";
import { makeGame } from "./transforms";

export const OFFLINE_FARM: GameState = {
  ...makeGame(FARM_128727.farm),
  blessing: {
    offering: {
      item: "Green Amulet",
      prize: "Green Amulet",
    },
  },
};
