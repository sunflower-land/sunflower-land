import { GameState } from "../types/game";
import { makeGame } from "./transforms";
import Farm from "128727.json";

export const OFFLINE_FARM: GameState = {
  ...makeGame(Farm.farm),
  blessing: {
    offering: {
      item: "Green Amulet",
      prize: "Green Amulet",
    },
  },
};
