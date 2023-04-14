import { marketRate } from "../lib/halvening";
import { BumpkinActivityName } from "./bumpkinActivity";
import { InventoryItemName } from "./game";
import { getSeasonalTicket } from "./seasons";

export type Chore = {
  activity: BumpkinActivityName;
  description: string;
  requirement: number;
  reward: {
    items?: Partial<Record<InventoryItemName, number>>;
    sfl?: number;
  };
};

// Goals should be means - not do X task - reach level 2, not eat 2 potatos

export const CHORES: Chore[] = [
  {
    activity: "Sunflower Harvested",
    description: "Harvest 3 Sunflowers",
    requirement: 3,
    reward: {
      items: {},
      sfl: marketRate(5).toNumber(),
    },
  },
  {
    activity: "Sunflower Sold",
    description: "Sell 5 Sunflowers",
    requirement: 5,
    reward: {
      items: {},
    },
  },
  {
    activity: "Mashed Potato Fed",
    description: "Grow your Bumpkin!",
    requirement: 2,
    reward: {
      items: {},
    },
  },
  {
    activity: "Tree Chopped",
    description: "Chop 3 Trees",
    requirement: 3,
    reward: {
      items: {},
    },
  },
  // Craft Scarecrow
  {
    activity: "Bush Bought",
    description: "Craft a scarecrow",
    requirement: 1,
    reward: {
      items: {
        "Potato Seed": 5,
      },
    },
  },

  // Level up
];
