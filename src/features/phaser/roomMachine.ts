import { Room, Client } from "colyseus.js";

import { assign, createMachine, Interpreter, State } from "xstate";

export const BACKEND_URL =
  window.location.href.indexOf("localhost") === -1
    ? `${window.location.protocol.replace("http", "ws")}//${
        window.location.hostname
      }${window.location.port && `:${window.location.port}`}`
    : "ws://localhost:2567";

type RoomSchema = any;

export interface ChatContext {
  room?: Room<RoomSchema>;
  name: string;
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

type SendChatMessageEvent = {
  type: "SEND_CHAT_MESSAGE";
  text: string;
};

type SendPositionEvent = {
  type: "SEND_POSITION";
  x: number;
  y: number;
};

type ChatMessageReceived = {
  type: "CHAT_MESSAGE_RECEIVED";
  text: string;
  sessionId: string;
};

type PlayerQuit = {
  type: "PLAYER_QUIT";
  sessionId: string;
};

type PlayerJoined = {
  type: "PLAYER_JOINED";
  sessionId: string;
  x: number;
  y: number;
};

type PlayerMoved = {
  type: "PLAYER_MOVED";
  sessionId: string;
  x: number;
  y: number;
};

export type RoomEvent =
  | { type: "CONNECT" }
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
    name: "part4_room",
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
            return { bumpkins: [] };
          }

          const client = new Client(BACKEND_URL);

          const room = await client.joinOrCreate(context.name, {});

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
        SEND_CHAT_MESSAGE: {
          actions: (context, event) => {
            context.room.send(0, { text: event.text });
          },
        },
        SEND_POSITION: {
          actions: (context, event) => {
            context.room.send(0, {
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
