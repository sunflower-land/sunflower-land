import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Bumpkin, Inventory } from "features/game/types/game";
import { ReactionName } from "./reactions";

export type Player = {
  connectionId: string;
  accountId: number;
  coordinates: Coordinates;
  updatedAt: number;
  bumpkin: Bumpkin;
};

export type ChatMessage = {
  bumpkinId: number;
  text?: string;
  reaction?: ReactionName;
  createdAt: number;
};

export type BumpkinDiscovery = {
  bumpkinId: number;
  sfl?: number;
  items: Inventory;
  createdAt: number;
};
