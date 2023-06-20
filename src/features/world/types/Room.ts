import { Schema, MapSchema, ArraySchema } from "@colyseus/schema";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export interface InputData {
  x: number;
  y: number;
  tick: number;
  text: string;
}

export interface Player extends Schema {
  x: number;
  y: number;
  tick: number;
  clothing: BumpkinParts;

  inputQueue: InputData[];
}

export interface Message extends Schema {
  text: string;
  sessionId?: string;
  sentAt: number;
}

export interface PlazaRoomState extends Schema {
  mapWidth: number;
  mapHeight: number;

  players: MapSchema<Player>;

  messages: ArraySchema<Message>;
}
