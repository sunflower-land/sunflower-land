import { GameState } from "../types/game";
import { makeGame } from "./transforms";
import FARM128727 from "../../../../128727.json";

export const OFFLINE_FARM: GameState = {
  ...makeGame({ ...FARM128727.farm }),
  blessing: {
    offering: {
      item: "Green Amulet",
      prize: "Green Amulet",
    },
  },
};
