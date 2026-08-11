import type { GameState } from "../types/game";

import { INITIAL_FARM } from "./constants";

export const STATIC_OFFLINE_FARM: GameState = {
  ...INITIAL_FARM,
  bumpkin: {
    ...INITIAL_FARM.bumpkin,
    experience: 10000,
  },
};
