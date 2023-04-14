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
  | "hank-chore-complete"
  | "hank-crafting"
  | "hungry-player";

type Conversation = {
  headline: string;
  content: {
    text: string;
    image?: string;
  }[];
  reward?: {
    items: Partial<Record<InventoryItemName, number>>;
  };
  from: NPCName | "player";
};

export const CONVERSATIONS: Record<ConversationName, Conversation> = {
  "hank-intro": {
    headline: "Help an old man?",
    content: [
      {
        text: "I've been working this land for fifty years, but I still need help sometimes.",
      },

      {
        text: "You look strong! Do you mind helping an old man?",
        image: chores,
      },
    ],
    from: "hank",
  },
  "hank-chore-complete": {
    headline: "Well done.",
    content: [
      {
        text: "Visit Betty and trade your crops for more seeds.",
      },
    ],
    from: "hank",
  },
  "hank-crafting": {
    headline: "I ain't got time to wait",
    content: [
      {
        text: "Those crops are crops are growing slow...",
      },
      {
        text: "Craft a scarecrow.",
        image: crafting,
      },
    ],
    from: "hank",
  },
  "betty-intro": {
    headline: "Parsnips, Potatoes, Pumpkins...",
    content: [
      {
        text: "Howdy y'all! Welcome to the Farmer's Market.",
      },
      {
        text: "From potatoes to parsnips, I've got you covered!",
      },
      {
        text: "Farming is much easier than you think. Plant seeds, harvest crops & sell for money!",
        image: harvesting,
      },
    ],
    from: "betty",
  },
  "hungry-player": {
    headline: "My tummy is rumbling",
    content: [
      {
        text: "Fed me",
      },
    ],
    from: "player",
  },
  "bruce-intro": {
    headline: "Cooking Is Pure Joy.",
    content: [
      {
        text: "I'm the owner of this lovely little bistro.",
      },
      {
        text: "Bring me resources and I will cook food you can eat! This is the how you level up and unlock new skills.",
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
        text: "Loreum Ipsum",
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
