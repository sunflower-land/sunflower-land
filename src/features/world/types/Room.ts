import { Schema, MapSchema, ArraySchema } from "@colyseus/schema";

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

  inputQueue: InputData[];
}

export interface Message extends Schema {
  text: string;
  sessionId?: string;
}

export interface PlazaRoomState extends Schema {
  mapWidth: number;
  mapHeight: number;

  players: MapSchema<Player>;

  messages: ArraySchema<Message>;
}
