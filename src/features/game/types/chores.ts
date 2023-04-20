import { BumpkinActivityName } from "./bumpkinActivity";
import { InventoryItemName } from "./game";

import clickToHarvest from "assets/tutorials/click_to_harvest.png";
import betty from "assets/tutorials/betty.png";
import bruce from "assets/tutorials/bruce_intro.png";
import workbench from "assets/tutorials/workbench_chat.png";

import { CROPS } from "./crops";
export type Chore = {
  // Challenges
  activity?: BumpkinActivityName;
  bumpkinLevel?: number;
  expansionCount?: number;
  sfl?: number;

  description: string;
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
    description: "Harvest the fields",
    image: clickToHarvest,
    introduction:
      "These fields ain't gonna plow themselves. Harvest 3 Sunflowers.",
    requirement: 3,
    reward: {
      items: {},
    },
  },
  {
    description: `Earn ${CROPS().Sunflower.sellPrice.mul(5)} SFL`,
    sfl: CROPS().Sunflower.sellPrice.mul(5).toNumber(),
    image: betty,
    introduction:
      "If you want to make it big in the farming business, you better start by sellin' sunflowers, buyin' seeds, and reaping the profit.",
    requirement: CROPS().Sunflower.sellPrice.mul(5).toNumber(),
    reward: {
      items: {},
    },
  },
  {
    description: "Reach Level 2",
    bumpkinLevel: 2,
    image: bruce,
    introduction:
      "If you want to level up & unlock new abilities, you better start cookin' up food & chowin' it down.",
    requirement: 2,
    reward: {
      items: {},
    },
  },
  {
    activity: "Tree Chopped",
    description: "Chop 3 Trees",
    requirement: 3,
    image: workbench,
    introduction:
      "My old bones ain't what they used to be, reckon you could lend me a hand with these darn trees needin' choppin? Our local Blacksmith will help you craft some tools.",
    reward: {
      items: {},
    },
  },
  // Craft Scarecrow
  // {
  //   activity: "Bush Bought",
  //   description:"Craft a scarecrow",
  //   requirement: 1,
  //   reward: {
  //     items: {
  //       "Potato Seed": 5,
  //     },
  //   },
  // },
  // {
  //   activity: "Pumpkin Harvested",
  //   description:"Harvest 10 Pumpkins",
  //   requirement: 10,
  //   reward: {
  //     items: {},
  //   },
  // },
  // {
  //   activity: "Pumpkin Harvested",
  //   description:"Time to expand",
  //   requirement: 1,
  //   reward: {
  //     items: {},
  //   },
  // },

  // Level up
];
