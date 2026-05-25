import type { InventoryItemName } from "./game";
import type { NPCName } from "lib/npcs";

export type ConversationName = string;

export type Message = {
  headline: string;
  announceAt?: number;
  expiresAt?: number;
  content: {
    text: string;
    image?: string;
  }[];
  reward?: {
    items: Partial<Record<InventoryItemName, number>>;
    coins?: number;
  };
  from: NPCName;
  link?: string;
};

export type Announcements = Record<string, Message>;
