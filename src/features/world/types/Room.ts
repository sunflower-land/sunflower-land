import { Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import { NPCName } from "lib/npcs";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { SceneId } from "../mmoMachine";

export interface InputData {
  x: number;
  y: number;
  tick: number;
  text: string;
}

export interface Player extends Schema {
  farmId: number;
  x: number;
  y: number;
  experience: number;
  tick: number;
  clothing: BumpkinParts & { updatedAt: number };
  npc: NPCName;
  sceneId: SceneId;

  inputQueue: InputData[];
}

export interface Message extends Schema {
  text: string;
  farmId?: number;
  sessionId: string;
  sceneId: SceneId;
  sentAt: number;
}

export interface PlazaRoomState extends Schema {
  mapWidth: number;
  mapHeight: number;

  players: MapSchema<Player>;

  messages: ArraySchema<Message>;
}
