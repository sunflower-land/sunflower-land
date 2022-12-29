import { GameState } from "features/game/types/game";
import { CONFIG } from "lib/config";

export const hasBetaAccess = (inventory: GameState["inventory"]) => {
  return CONFIG.NETWORK === "mumbai" || !!inventory["Beta Pass"]?.gt(0);
};
