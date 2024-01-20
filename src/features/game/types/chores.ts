import { BumpkinActivityName } from "./bumpkinActivity";
import { InventoryItemName } from "./game";

import clickToHarvest from "assets/tutorials/click_to_harvest.png";
import betty from "assets/tutorials/betty.png";
import bruce from "assets/tutorials/bruce_intro.png";
import workbench from "assets/tutorials/workbench_chat.png";
import { translate } from "lib/i18n/translate";

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
    description: translate("chores.harvestFields"),
    image: clickToHarvest,
    introduction: translate("chores.harvestFieldsIntro"),
    requirement: 3,
    reward: {
      items: {},
    },
  },
  {
    description: `Earn ${CROPS().Sunflower.sellPrice.mul(5)} SFL`, //Translate
    sfl: CROPS().Sunflower.sellPrice.mul(5).toNumber(),
    image: betty,
    introduction: translate("chores.earnSflIntro"),
    requirement: CROPS().Sunflower.sellPrice.mul(5).toNumber(),
    reward: {
      items: {},
    },
  },
  {
    description: translate("chores.reachLevel"),
    bumpkinLevel: 2,
    image: bruce,
    introduction: translate("chores.reachLevelIntro"),
    requirement: 2,
    reward: {
      items: {},
    },
  },
  {
    activity: "Tree Chopped",
    description: translate("chores.chopTrees"),
    requirement: 3,
    image: workbench,
    introduction: translate("chores.helpWithTrees"),
    reward: {
      items: {},
    },
  },
  // Craft Scarecrow
  // {
  //   activity: "Bush Bought",
  //   description: translate("hank-crafting.headline"),
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
