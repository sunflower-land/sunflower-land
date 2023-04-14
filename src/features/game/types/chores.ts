import { BumpkinActivityName } from "./bumpkinActivity";
import { InventoryItemName } from "./game";

export type Chore = {
  activity: BumpkinActivityName;
  description: string;
  requirement: number;
  reward: {
    items?: Partial<Record<InventoryItemName, number>>;
    sfl?: number;
  };
};

// TODO Goals should be means - not do X task - reach level 2, not eat 2 potatos

export const CHORES: Chore[] = [
  {
    activity: "Sunflower Harvested",
    description: "Harvest 3 Sunflowers",
    requirement: 3,
    reward: {
      items: {},
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
  // {
  //   activity: "Bush Bought",
  //   description: "Craft a scarecrow",
  //   requirement: 1,
  //   reward: {
  //     items: {
  //       "Potato Seed": 5,
  //     },
  //   },
  // },
  // {
  //   activity: "Pumpkin Harvested",
  //   description: "Harvest 10 Pumpkins",
  //   requirement: 10,
  //   reward: {
  //     items: {},
  //   },
  // },
  // {
  //   activity: "Pumpkin Harvested",
  //   description: "Time to expand",
  //   requirement: 1,
  //   reward: {
  //     items: {},
  //   },
  // },

  // Level up
];
