import harvesting from "assets/tutorials/harvesting_tutorial.png";
import firePit from "assets/tutorials/fire_pit.png";
import workbench from "assets/tutorials/workbench.png";
import chores from "assets/tutorials/chores.png";
import crafting from "assets/tutorials/crafting.png";

import { InventoryItemName } from "./game";
import { NPCName } from "lib/npcs";
import { translate } from "lib/i18n/translate";

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
    headline: translate("hank-intro.headline"),
    content: [
      {
        text: translate("hank-intro.one"),
      },
      {
        text: translate("hank-intro.two"),
      },

      {
        text: translate("hank-intro.three"),
        image: chores,
      },
    ],
    from: "hank",
  },
  "hank-crafting": {
    headline: translate("hank-crafting.headline"),
    content: [
      {
        text: translate("hank-crafting.one"),
      },
      {
        text: translate("hank-crafting.two"),
        image: crafting,
      },
    ],
    from: "hank",
  },
  "betty-intro": {
    headline: translate("betty-intro.headline"),
    content: [
      {
        text: translate("betty-intro.one"),
      },
      {
        text: translate("betty-intro.two"),
      },
      {
        text: translate("betty-intro.three"),
        image: harvesting,
      },
    ],
    from: "betty",
  },
  "bruce-intro": {
    headline: translate("bruce-intro.headline"),
    content: [
      {
        text: translate("bruce-intro.one"),
      },
      {
        text: translate("bruce-intro.two"),
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
    headline: translate("blacksmith-intro.headline"),
    content: [
      {
        text: translate("blacksmith-intro.one"),
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
