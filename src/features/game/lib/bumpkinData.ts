import { Bumpkin } from "../types/game";
import { BumpkinLevel } from "features/game/lib/level";
import { getLandLimit } from "../expansion/lib/expansionRequirements";

export const INITIAL_BUMPKIN_LEVEL = 1;

// Special case level 1 for testing expansions.
export const INITIAL_EXPANSIONS =
  INITIAL_BUMPKIN_LEVEL === 1
    ? 3
    : getLandLimit(INITIAL_BUMPKIN_LEVEL as BumpkinLevel);

export const INITIAL_BUMPKIN: Bumpkin = {
  id: 1,
  experience: 1,
  tokenUri: "bla",
  equipped: {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    shirt: "Red Farmer Shirt",
    pants: "Brown Suspenders",

    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    beard: "Santa Beard",
    hat: "Deep Sea Helm",
  },
  skills: {},
  achievements: {},
  activity: {
    "Reindeer Carrot Fed": 50,
    "Sunflower Planted": 5,
  },
};
