import { Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import { NPCName } from "lib/npcs";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { SceneId } from "../mmoMachine";
import { Moderation } from "features/game/lib/gameMachine";
import { FactionName } from "features/game/types/game";

export interface Player extends Schema {
  username?: string;
  faction?: FactionName;
  sceneId: SceneId;
  tick: number;

  farmId: number;
  experience: number;
  x: number;
  y: number;
  clothing: BumpkinParts & { updatedAt: number };
  moderation: Moderation[];

  npc?: NPCName;
}

export interface Bud extends Schema {
  createdAt: number;
  expiresAt: number;
  authorId: number;
  authorSessionId: string;
  budId: string;
  sceneId: SceneId;
  x: number;
  y: number;
}

export interface Message extends Schema {
  createdAt: number;
  sceneId: SceneId;
  text: string;
  username: string;
  authorSessionId: string;
  authorId: number;
  messageId: string;
}

export interface Reaction extends Schema {
  createdAt: number;
  reaction: "heart" | "sad" | "happy";
  sessionId: string;
  farmId: number;
  sceneId: SceneId;
}

export interface Toast extends Schema {
  createdAt: number;
  reaction: "heart" | "sad" | "happy";
  quantity: number;
  sessionId: string;
  farmId: number;
  sceneId: SceneId;
}

export interface Trade extends Schema {
  text: string;
  sellerId: string;
  createdAt: number;
  buyerId?: string;
  boughtAt?: number;
  sceneId?: string;
  tradeId: string;
}

export interface PlazaRoomState extends Schema {
  mapWidth: number;
  mapHeight: number;

  players: MapSchema<Player>;
  buds: MapSchema<Bud>;

  messages: ArraySchema<Message>;
}
