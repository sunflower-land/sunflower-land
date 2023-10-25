import harvesting from "assets/tutorials/harvesting_tutorial.png";
import firePit from "assets/tutorials/fire_pit.png";
import workbench from "assets/tutorials/workbench.png";
import chores from "assets/tutorials/chores.png";
import crafting from "assets/tutorials/crafting.png";

import { InventoryItemName } from "./game";
import { NPCName } from "lib/npcs";

export type ConversationName =
  | "betty-intro"
  | "bruce-intro"
  | "hank-intro"
  | "blacksmith-intro"
  | "hank-crafting";

export type Message = {
  headline: string;
  announceAt?: number;
  content: {
    text: string;
    image?: string;
  }[];
  reward?: {
    items: Partial<Record<InventoryItemName, number>>;
  };
  from: NPCName;
  link?: string;
};

export const CONVERSATIONS: Record<ConversationName, Message> = {
  "hank-intro": {
    headline: "Help an old man?",
    content: [
      {
        text: "Howdy Bumpkin! Welcome to our little patch of paradise.",
      },
      {
        text: "I've been working this land for fifty years but could sure use some help.",
      },

      {
        text: "I can teach you the basics of farming, as long as you help me with my daily chores.",
        image: chores,
      },
    ],
    from: "hank",
  },
  "hank-crafting": {
    headline: "Craft a scarecrow",
    content: [
      {
        text: "Hmmm, those crops are growing awfully slow. I aint' got time to wait around.",
      },
      {
        text: "Craft a scarecrow to speed up your crops.",
        image: crafting,
      },
    ],
    from: "hank",
  },
  "betty-intro": {
    headline: "How to grow your farm",
    content: [
      {
        text: "Hey, hey! Welcome to my market.",
      },
      {
        text: "Bring me your finest harvest, and I will give you a fair price for them!",
      },
      {
        text: "You need seeds? From potatoes to parsnips, I've got you covered!",
        image: harvesting,
      },
    ],
    from: "betty",
  },
  "bruce-intro": {
    headline: "Cooking Introduction",
    content: [
      {
        text: "I'm the owner of this lovely little bistro.",
      },
      {
        text: "Bring me resources and I will cook all the food you can eat!",
        image: firePit,
      },
    ],
    from: "bruce",
    reward: {
      items: {
        "Mashed Potato": 1,
      },
    },
  },
  "blacksmith-intro": {
    headline: "Chop chop chop.",
    content: [
      {
        text: "I'm a master of tools, and with the right resources, I can craft anything you need...including more tools!",
        image: workbench,
      },
    ],
    from: "blacksmith",
    reward: {
      items: {
        Axe: 3,
      },
    },
  },
};

export type Announcements = Record<string, Message>;
