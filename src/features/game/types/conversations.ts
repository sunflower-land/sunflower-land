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

export type Announcements = Record<string, Message>;
