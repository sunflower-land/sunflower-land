import { Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import { NPCName } from "lib/npcs";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { SceneId } from "../mmoMachine";
import { Moderation } from "features/game/lib/gameMachine";
import { FactionName } from "features/game/types/game";
import { PetNFTType } from "features/game/types/pets";

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

export interface Pet extends Schema {
  sessionId: string;
  farmId: number;
  x: number;
  y: number;
  id: number;
  name: string;
  type: PetNFTType;
  sceneId: SceneId;
}

export interface Message extends Schema {
  text: string;
  farmId?: number;
  username?: string;
  sessionId: string;
  sceneId: SceneId;
  sentAt: number;
}

export interface Reaction extends Schema {
  reaction: "heart" | "sad" | "happy";
  quantity?: number;
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

export interface MicroInteraction extends Schema {
  type:
    | "wave"
    | "wave_ack"
    | "wave_cancel"
    | "cheer"
    | "cheer_ack"
    | "cheer_cancel";
  receiverId: number;
  senderId: number;
  sentAt: number;
  sceneId: SceneId;
}

export interface Dog extends Schema {
  id: 1 | 2;
  x: number;
  y: number;
  isWalking: boolean;
}

export type PetalState = "active" | "inactive" | "solved" | "overloaded";

export interface GiantFlower extends Schema {
  puzzleSolvedAt?: number;
  leftPetal?: PetalState;
  rightPetal?: PetalState;
  topPetal?: PetalState;
  bottomPetal?: PetalState;
}

export interface PlazaRoomState extends Schema {
  mapWidth: number;
  mapHeight: number;

  players: MapSchema<Player>;
  buds: MapSchema<Bud>;
  pets: MapSchema<Pet>;

  messages: ArraySchema<Message>;
  reactions: ArraySchema<Reaction>;
  trades: ArraySchema<Trade>;
  microInteractions: ArraySchema<MicroInteraction>;
  actions: ArraySchema<Action>;

  dogs: MapSchema<Dog>;
  giantFlower: GiantFlower;
}
