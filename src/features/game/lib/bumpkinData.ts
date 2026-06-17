import type { Bumpkin } from "../types/game";

export const INITIAL_BUMPKIN_LEVEL = 1;

// Special case level 1 for testing expansions.
export const INITIAL_EXPANSIONS = 3;

export const TEST_BUMPKIN: Bumpkin = {
  id: 1,
  // TODO: feat/crafting-box - remove this
  experience: 200000,
  tokenUri: "bla",
  equipped: {
    body: "Beige Farmer Potion",
    hair: "Basic Hair",
    shirt: "Blue Farmer Shirt",
    pants: "Brown Suspenders",

    shoes: "Black Farmer Boots",
    tool: "Farmer Pitchfork",
    background: "Farm Background",
    beard: "Santa Beard",
    hat: "Deep Sea Helm",
  },
  skills: {},
  achievements: {},
};
