import { BumpkinActivityName } from "./bumpkinActivity";
import { InventoryItemName } from "./game";

import clickToHarvest from "assets/tutorials/click_to_harvest.png";
import betty from "assets/tutorials/betty.png";
export type Chore = {
  activity: BumpkinActivityName;
  action: string;
  image?: string;
  introduction?: string;
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
    action: "Harvest 3 Sunflowers",
    image: clickToHarvest,
    introduction:
      "These fields ain't gonna plow themselves. Mind lendin' an old farmer a hand with these Sunflowers?",
    requirement: 3,
    reward: {
      items: {},
    },
  },
  {
    activity: "Sunflower Sold",
    action: "Sell 5 Sunflowers",
    image: betty,
    introduction:
      "My old bones ain't cut out for haggling with city folk, could you visit Betty at the market and sell these Sunflowers.",
    requirement: 5,
    reward: {
      items: {},
    },
  },
  {
    activity: "Mashed Potato Fed",
    action: "Grow your Bumpkin!",
    requirement: 2,
    reward: {
      items: {},
    },
  },
  {
    activity: "Tree Chopped",
    action: "Chop 3 Trees",
    requirement: 3,
    reward: {
      items: {},
    },
  },
  // Craft Scarecrow
  // {
  //   activity: "Bush Bought",
  //   action:"Craft a scarecrow",
  //   requirement: 1,
  //   reward: {
  //     items: {
  //       "Potato Seed": 5,
  //     },
  //   },
  // },
  // {
  //   activity: "Pumpkin Harvested",
  //   action:"Harvest 10 Pumpkins",
  //   requirement: 10,
  //   reward: {
  //     items: {},
  //   },
  // },
  // {
  //   activity: "Pumpkin Harvested",
  //   action:"Time to expand",
  //   requirement: 1,
  //   reward: {
  //     items: {},
  //   },
  // },

  // Level up
];
