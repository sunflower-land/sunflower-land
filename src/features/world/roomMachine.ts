import { Room, Client } from "colyseus.js";

import { assign, createMachine, Interpreter, State } from "xstate";
import { PlazaRoomState } from "./types/Room";

import { CONFIG } from "lib/config";
import { Bumpkin } from "features/game/types/game";
import { INITIAL_BUMPKIN } from "features/game/lib/constants";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { SPAWNS } from "./lib/spawn";
import { chooseRoom } from "./lib/availableRooms";
import { NPCName } from "lib/npcs";

export type Rooms = {
  plaza: Room<PlazaRoomState> | undefined;
  auction_house: Room<PlazaRoomState> | undefined;
  clothes_shop: Room<PlazaRoomState> | undefined;
  decorations_shop: Room<PlazaRoomState> | undefined;
  windmill_floor: Room<PlazaRoomState> | undefined;
  igor_home: Room<PlazaRoomState> | undefined;
  bert_home: Room<PlazaRoomState> | undefined;
  timmy_home: Room<PlazaRoomState> | undefined;
  betty_home: Room<PlazaRoomState> | undefined;
  woodlands: Room<PlazaRoomState> | undefined;
  dawn_breaker: Room<PlazaRoomState> | undefined;
  marcus_home: Room<PlazaRoomState> | undefined;
  corn_example: Room<PlazaRoomState> | undefined;
};
export type RoomId = keyof Rooms;

export interface ChatContext {
  jwt: string;
  farmId: number;
  bumpkin: Bumpkin;
  rooms: Rooms;
  roomId: RoomId;
  previousRoomId?: RoomId;
  client?: Client;
}

export type RoomState = {
  value: "loading" | "joinRoom" | "ready" | "error" | "introduction";
  context: ChatContext;
};

type ChangeRoomEvent = {
  type: "CHANGE_ROOM";
  roomId: RoomId;
  url?: string;
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

type ChangeClothingEvent = {
  type: "CHANGE_CLOTHING";
  clothing: BumpkinParts;
};

type RoomDisconnected = {
  type: "ROOM_DISCONNECTED";
  roomId: RoomId;
};
export type ChatMessageReceived = {
  type: "CHAT_MESSAGE_RECEIVED";
  roomId: RoomId;
  text: string;
  sessionId: string;
  farmId: number;
};

export type PlayerJoined = {
  type: "PLAYER_JOINED";
  farmId: number;
  roomId: RoomId;
  sessionId: string;
  x: number;
  y: number;
  clothing: BumpkinParts;
  npc?: NPCName;
};

export type ClothingChangedEvent = {
  type: "CLOTHING_CHANGED";
  roomId: RoomId;
  clothing: BumpkinParts;
  sessionId: string;
};

export type PlayerQuit = {
  type: "PLAYER_QUIT";
  roomId: string;
  sessionId: string;
};

export type RoomEvent =
  | ChangeRoomEvent
  | SendChatMessageEvent
  | ChatMessageReceived
  | PlayerQuit
  | ChangeClothingEvent
  | PlayerJoined
  | RoomDisconnected
  | SendPositionEvent
  | ClothingChangedEvent
  | { type: "CONTINUE" }
  | { type: "RETRY" };

export type MachineState = State<ChatContext, RoomEvent, RoomState>;

export type MachineInterpreter = Interpreter<
  ChatContext,
  any,
  RoomEvent,
  any,
  any
>;

export const INITIAL_ROOM: RoomId = "marcus_home";

/**
 * Machine which handles room events
 */
export const roomMachine = createMachine<ChatContext, RoomEvent, RoomState>({
  initial: "initialising",
  context: {
    jwt: "",
    farmId: 0,
    roomId: INITIAL_ROOM,
    rooms: {
      plaza: undefined,
      auction_house: undefined,
      clothes_shop: undefined,
      decorations_shop: undefined,
      windmill_floor: undefined,
      igor_home: undefined,
      bert_home: undefined,
      timmy_home: undefined,
      betty_home: undefined,
      woodlands: undefined,
      dawn_breaker: undefined,
      marcus_home: undefined,
      corn_example: undefined,
    },
    bumpkin: INITIAL_BUMPKIN,
  },
  exit: (context) => context.rooms[context.roomId]?.leave(),
  states: {
    initialising: {
      always: [
        {
          target: "introduction",
          cond: () => !localStorage.getItem("mmo_introduction.read"),
        },
        {
          target: "loading",
        },
      ],
    },
    introduction: {
      on: {
        CONTINUE: {
          target: "loading",
          actions: () =>
            localStorage.setItem(
              "mmo_introduction.read",
              Date.now().toString()
            ),
        },
      },
    },
    loading: {
      invoke: {
        id: "loading",
        src: (context, event) => async () => {
          const url = (event as any).url || CONFIG.ROOM_URL;
          if (!url) {
            return { roomId: undefined };
          }

          // Server connection is too fast
          await new Promise((res) => setTimeout(res, 1000));

          const client = new Client(url);

          return { roomId: context.roomId, client };
        },
        onDone: [
          {
            target: "ready",
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

          const available = await context.client.getAvailableRooms();
          const roomId = chooseRoom(context.roomId as RoomId, available);

          if (!roomId) {
            throw new Error("No room available");
          }

          // Leave all rooms when joining a new one
          Object.values(context.rooms).forEach((room) => room?.leave());

          const room = await context.client.joinOrCreate<PlazaRoomState>(
            roomId,
            {
              jwt: context.jwt,
              bumpkin: context.bumpkin,
              farmId: context.farmId,
              x: SPAWNS[context.roomId]?.default.x ?? 0,
              y: SPAWNS[context.roomId]?.default.y ?? 0,
            }
          );

          room.onLeave(() => {
            cb({
              type: "ROOM_DISCONNECTED",
              roomId: roomId as RoomId,
            });
          });

          room.state.messages.onAdd((message) => {
            // Old message
            if (message.sentAt < Date.now() - 5000) {
              return;
            }

            if (message.farmId) {
              cb({
                type: "CHAT_MESSAGE_RECEIVED",
                roomId: roomId as RoomId,

                text: message.text,
                farmId: message.farmId,
                sessionId: message.sessionId,
              });
            }
          });

          room.state.players.onAdd((player: any, sessionId: string) => {
            cb({
              type: "PLAYER_JOINED",
              roomId: roomId as RoomId,
              farmId: player.farmId,
              sessionId: sessionId,
              x: player.x,
              y: player.y,
              clothing: player.clothing,
              npc: player.npc,
            });

            let clothingChangedAt = 0;
            player.onChange(() => {
              if (clothingChangedAt !== player.clothing.updatedAt) {
                clothingChangedAt = player.clothing.updatedAt;
                cb({
                  type: "CLOTHING_CHANGED",
                  roomId: roomId as RoomId,

                  clothing: player.clothing,
                  sessionId: sessionId,
                });
              }
            });
          });

          room.state.players.onRemove((_player: any, sessionId: string) => {
            cb({
              type: "PLAYER_QUIT",
              roomId: roomId as RoomId,

              sessionId: sessionId,
            });
          });

          return { roomId, room };
        },
        onError: {
          target: "error",
        },
        onDone: {
          target: "ready",
          actions: assign({
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
        CHANGE_ROOM: [
          // Change room and provide Custom URL
          {
            target: "loading",
            actions: assign({
              previousRoomId: (context) => context.roomId,
              roomId: (_, event) => event.roomId,
            }),
            cond: (_, event) => {
              return !!event.url;
            },
          },
          {
            target: "joinRoom",
            actions: assign({
              previousRoomId: (context) => context.roomId,
              roomId: (_, event) => event.roomId,
            }),
            // cond: (context, event) => !context.roomId.startsWith(event.roomId),
          },
        ],
        ROOM_DISCONNECTED: {
          target: "error",
          actions: assign({
            rooms: (context) => {
              const rooms = context.rooms;
              delete rooms[context.roomId];
              return rooms;
            },
          }),
        },
        SEND_CHAT_MESSAGE: {
          actions: (context, event) => {
            const room = context.rooms[context.roomId];
            if (!room) return {};

            room.send(0, { text: event.text });
          },
        },
        CHANGE_CLOTHING: {
          actions: [
            (context, event) => {
              const room = context.rooms[context.roomId];
              if (!room) return {};

              room.send(0, { clothing: event.clothing });
            },
            assign({
              bumpkin: (context, event) =>
                ({
                  ...context.bumpkin,
                  equipped: event.clothing,
                } as Bumpkin),
            }),
          ],
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
    error: {
      on: {
        CHANGE_ROOM: [
          // Change room and provide Custom URL
          {
            target: "loading",
            actions: assign({
              previousRoomId: (context) => context.roomId,
              roomId: (_, event) => event.roomId,
            }),
            cond: (_, event) => {
              return !!event.url;
            },
          },
          {
            target: "joinRoom",
          },
        ],
        RETRY: {
          target: "loading",
        },
      },
    },
  },
});
