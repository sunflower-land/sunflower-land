import { CONFIG } from "lib/config";

export const ARCADE_GAMES = {
  GREEDY_GOBLIN: {
    title: "Greedy Goblin",
    donationAddress: CONFIG.GREEDY_GOBLIN_DONATION || "",
  },
  CHICKEN_FIGHT: {
    title: "Chicken Fight (2p)",
    donationAddress: CONFIG.CHICKEN_FIGHT_DONATION || "",
  },
};
