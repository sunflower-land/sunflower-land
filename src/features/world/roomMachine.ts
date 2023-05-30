import { Room, Client } from "colyseus.js";

import { assign, createMachine, Interpreter, State } from "xstate";
import { PlazaRoomState } from "./types/Room";

import { CONFIG } from "lib/config";
import { Bumpkin } from "features/game/types/game";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";

export type Rooms = {
  plaza: Room<PlazaRoomState> | undefined;
  auction_house: Room<PlazaRoomState> | undefined;
  clothes_shop: Room<PlazaRoomState> | undefined;
};
export type RoomId = keyof Rooms;

export interface ChatContext {
  jwt: string;
  farmId: number;
  bumpkin: Bumpkin;
  rooms: Rooms;
  roomId: RoomId;
  client?: Client;
}

export type RoomState = {
  value: "initialising" | "joinRoom" | "ready" | "error";
  context: ChatContext;
};

type ChangeRoomEvent = {
  type: "CHANGE_ROOM";
  roomId: RoomId;
};
type SendChatMessageEvent = {
  type: "SEND_CHAT_MESSAGE";
  text: string;
};

type SendPositionEvent = {
  type: "SEND_POSITION";
  x: number;
  y: number;
};

export type ChatMessageReceived = {
  type: "CHAT_MESSAGE_RECEIVED";
  roomId: RoomId;
  text: string;
  sessionId: string;
};

export type PlayerQuit = {
  type: "PLAYER_QUIT";
  roomId: string;
  sessionId: string;
};

export type PlayerJoined = {
  type: "PLAYER_JOINED";
  roomId: RoomId;
  sessionId: string;
  x: number;
  y: number;
  clothing: BumpkinParts;
};

export type PlayerMoved = {
  type: "PLAYER_MOVED";
  sessionId: string;
  x: number;
  y: number;
};

export type RoomEvent =
  | ChangeRoomEvent
  | SendChatMessageEvent
  | ChatMessageReceived
  | PlayerQuit
  | PlayerMoved
  | PlayerJoined
  | SendPositionEvent;

export type MachineState = State<ChatContext, RoomEvent, RoomState>;

export type MachineInterpreter = Interpreter<
  ChatContext,
  any,
  RoomEvent,
  any,
  any
>;

/**
 * Machine which handles room events
 */
export const roomMachine = createMachine<ChatContext, RoomEvent, RoomState>({
  initial: "initialising",
  context: {
    jwt: "",
    farmId: 0,
    roomId: "plaza",
    rooms: {
      plaza: undefined,
      auction_house: undefined,
      clothes_shop: undefined,
    },
    // TEMP FIELD - server will set this
    bumpkin: INITIAL_BUMPKIN,
  },
  states: {
    initialising: {
      invoke: {
        id: "initialising",
        src: () => async () => {
          if (!CONFIG.ROOM_URL) {
            return { roomId: undefined };
          }
          const client = new Client(CONFIG.ROOM_URL);

          return { roomId: "plaza", client };
        },
        onDone: [
          {
            target: "joinRoom",
            actions: assign({
              client: (_, event) => event.data.client,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },
    joinRoom: {
      invoke: {
        id: "joinRoom",
        src: (context, event: any) => async (cb) => {
          if (!context.client) {
            throw new Error("You must initialise the client first");
          }

          await context.rooms[context.roomId]?.leave();

          const roomId = (event.roomId ?? event.data.roomId) as RoomId;

          const room = await context.client.joinOrCreate<PlazaRoomState>(
            roomId,
            {
              previousRoomId: context.roomId,
              bumpkin: context.bumpkin,
            }
          );

          room.state.messages.onAdd((message: any) => {
            if (message.sessionId && String(message.sessionId).length > 4) {
              cb({
                type: "CHAT_MESSAGE_RECEIVED",
                roomId,
                text: message.text,
                sessionId: message.sessionId,
              });
            }
          });

          room.state.players.onAdd((player: any, sessionId: string) => {
            cb({
              type: "PLAYER_JOINED",
              roomId,
              sessionId: sessionId,
              x: player.x,
              y: player.y,
              clothing: player.clothing,
            });

            player.onChange(() => {
              cb({
                type: "PLAYER_MOVED",
                roomId,
                sessionId: sessionId,
                x: player.x,
                y: player.y,
              });
            });
          });

          room.state.players.onRemove((_player: any, sessionId: string) => {
            cb({
              type: "PLAYER_QUIT",
              roomId,
              sessionId: sessionId,
            });
          });

          return { roomId, room };
        },
        onError: {
          target: "error",
          cond: (_, event) => !event.data.roo,
          // Fire off an event, and let the game render player anyway
        },
        onDone: {
          target: "ready",
          actions: assign({
            roomId: (_, event) => event.data.roomId,
            rooms: (context, event) => {
              return {
                ...context.rooms,
                [event.data.roomId]: event.data.room,
              };
            },
          }),
        },
      },
    },
    ready: {
      on: {
        CHANGE_ROOM: {
          target: "joinRoom",
        },
        SEND_CHAT_MESSAGE: {
          actions: (context, event) => {
            const room = context.rooms[context.roomId];
            if (!room) return {};

            room.send(0, { text: event.text });
          },
        },
        SEND_POSITION: {
          actions: (context, event) => {
            const room = context.rooms[context.roomId];
            if (!room) return {};

            room.send(0, {
              x: event.x,
              y: event.y,
            });
          },
        },
      },
    },
    kicked: {},
    error: {},
  },
});
