import { Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import { NPCName } from "lib/npcs";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { SceneId } from "../mmoMachine";
import { Moderation } from "features/game/lib/gameMachine";
import { FactionName } from "features/game/types/game";

export interface InputData {
  x: number;
  y: number;
  tick: number;
  text: string;
}

export interface Player extends Schema {
  username: string;
  farmId: number;
  faction?: FactionName;
  x: number;
  y: number;
  experience: number;
  tick: number;
  clothing: BumpkinParts & { updatedAt: number };
  npc: NPCName;
  sceneId: SceneId;
  moderation: Moderation;

  inputQueue: InputData[];
}

export interface Bud extends Schema {
  farmId: number;
  x: number;
  y: number;
  id: number;
  sceneId: SceneId;
}

export interface Bud extends Schema {
  farmId: number;
  x: number;
  y: number;
  sceneId: SceneId;
  id: number;
}

export interface Message extends Schema {
  text: string;
  farmId?: number;
  sessionId: string;
  sceneId: SceneId;
  sentAt: number;
}

export interface Reaction extends Schema {
  reaction: "heart" | "sad" | "happy";
  farmId?: number;
  sessionId: string;
  sceneId: SceneId;
  sentAt: number;
}

export interface Action extends Schema {
  farmId?: number;
  sceneId: SceneId;
  sentAt: number;
  event: string;
  x?: number;
  y?: number;
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
  reactions: ArraySchema<Reaction>;
  trades: ArraySchema<Trade>;
  actions: ArraySchema<Action>;
}
