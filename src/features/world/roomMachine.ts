import { Room, Client } from "colyseus.js";

import { assign, createMachine, Interpreter, State } from "xstate";
import { PlazaRoomState } from "./types/Room";

export const BACKEND_URL =
  window.location.href.indexOf("localhost") === -1
    ? `${window.location.protocol.replace("http", "ws")}//${
        window.location.hostname
      }${window.location.port && `:${window.location.port}`}`
    : "ws://localhost:2567";
// export const BACKEND_URL =
//   "ws://craig-Servi-1G2TUBXLYVZ7O-1423893005.us-east-1.elb.amazonaws.com";

type RoomSchema = any;

type RoomId = "plaza" | "auction_house";
export interface ChatContext {
  room?: Room<RoomSchema>;
  roomId: RoomId;
  messages: { sessionId: string; text: string }[];
  players: Record<
    string,
    {
      x: number;
      y: number;
    }
  >;
}

export type RoomState = {
  value: "idle" | "initialising" | "ready" | "error";
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
  text: string;
  sessionId: string;
};

export type PlayerQuit = {
  type: "PLAYER_QUIT";
  sessionId: string;
};

export type PlayerJoined = {
  type: "PLAYER_JOINED";
  sessionId: string;
  x: number;
  y: number;
};

export type PlayerMoved = {
  type: "PLAYER_MOVED";
  sessionId: string;
  x: number;
  y: number;
};

export type RoomEvent =
  | { type: "CONNECT" }
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
  RoomState
>;

/**
 * Machine which handles room events
 */
export const roomMachine = createMachine<ChatContext, RoomEvent, RoomState>({
  initial: "idle",
  context: {
    roomId: "plaza",
    messages: [],
    players: {},
  },
  states: {
    idle: {
      on: {
        CONNECT: {
          target: "initialising",
        },
      },
    },
    initialising: {
      invoke: {
        id: "initialising",
        src: (context) => async (cb) => {
          if (!BACKEND_URL) {
            return { room: undefined };
          }

          // await new Promise((r) => setTimeout(r, 2000));
          console.log("room", context.room);

          const currentRoom = context.room?.name;

          if (context.room) {
            await context.room.leave();
          }

          const client = new Client(BACKEND_URL);

          const room = await client.joinOrCreate<PlazaRoomState>(
            context.roomId,
            { previousRoom: currentRoom }
          );

          room.state.messages.onAdd((message: any) => {
            console.log({ message: message, sId: message.sessionId });

            console.log({ message });
            if (message.sessionId && String(message.sessionId).length > 4) {
              cb({
                type: "CHAT_MESSAGE_RECEIVED",
                text: message.text,
                sessionId: message.sessionId,
              });
            }
          });

          room.state.players.onAdd((player: any, sessionId: string) => {
            cb({
              type: "PLAYER_JOINED",
              sessionId: sessionId,
              x: player.x,
              y: player.y,
            });

            player.onChange(() => {
              cb({
                type: "PLAYER_MOVED",
                sessionId: sessionId,
                x: player.x,
                y: player.y,
              });
            });
          });

          room?.state.players.onRemove((_player: any, sessionId: string) => {
            cb({
              type: "PLAYER_QUIT",
              sessionId: sessionId,
            });
          });

          return {
            room,
          };
        },
        onDone: [
          {
            target: "error",
            cond: (_, event) => !event.data.room,
            // Fire off an event, and let the game render player anyway
          },
          {
            target: "ready",
            actions: assign({
              room: (_, event) => event.data.room,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },
    ready: {
      on: {
        CHANGE_ROOM: {
          target: "initialising",
          actions: assign({
            roomId: (_, event) => event.roomId,
            messages: (_) => [],
            players: (_) => ({}),
          }),
        },
        SEND_CHAT_MESSAGE: {
          actions: (context, event) => {
            context.room?.send(0, { text: event.text });
          },
        },
        SEND_POSITION: {
          actions: (context, event) => {
            context.room?.send(0, {
              x: event.x,
              y: event.y,
            });
          },
        },
        CHAT_MESSAGE_RECEIVED: {
          actions: assign({
            messages: (context, event) => {
              return [
                {
                  text: event.text,
                  sessionId: event.sessionId,
                },
                ...context.messages,
              ];
            },
          }),
        },
        PLAYER_MOVED: {
          actions: assign({
            players: (context, event) => {
              return {
                ...context.players,
                [event.sessionId]: {
                  x: event.x,
                  y: event.y,
                },
              };
            },
          }),
        },
        PLAYER_JOINED: {
          actions: assign({
            players: (context, event) => {
              return {
                ...context.players,
                [event.sessionId]: {
                  x: event.x,
                  y: event.y,
                },
              };
            },
          }),
        },
        PLAYER_QUIT: {
          actions: assign({
            players: (context, event) => {
              const newPlayers = context.players;

              delete newPlayers[event.sessionId];

              return newPlayers;
            },
          }),
        },
      },
    },
    kicked: {},
    error: {},
  },
});
