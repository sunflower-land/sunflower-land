import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Bumpkin, Inventory } from "features/game/types/game";
import { CONFIG } from "lib/config";

import { assign, createMachine, Interpreter, State } from "xstate";
import { ReactionName } from "./lib/reactions";
import { BumpkinDiscovery, ChatMessage, Player } from "./lib/types";
import { OFFLINE_BUMPKINS } from "./lib/constants";
import {
  acknowledgeCodeOfConduct,
  getCodeOfConductLastRead,
} from "features/announcements/announcementsStorage";
import { loadRoom } from "./actions/loadRoom";

export type Room = "plaza" | "beach" | "headquarters" | "stoneHaven";

export interface ChatContext {
  currentPosition: Coordinates;
  lastPosition: Coordinates;
  canAccess: boolean;
  bumpkin: Bumpkin;
  socket?: WebSocket;
  bumpkins: Player[];
  messages: ChatMessage[];
  discoveries: BumpkinDiscovery[];
  accountId: number;
  roomId: Room;
  jwt: string;
  kickedAt?: number;
}

export type ChatState = {
  value:
    | "initialising"
    | "codeOfConduct"
    | "connecting"
    | "loadingPlayers"
    | "connected"
    | "closed"
    | "full"
    | "kicked"
    | "disconnecting"
    | "disconnected"
    | "error";
  context: ChatContext;
};

type SendLocationEvent = {
  type: "SEND_LOCATION";
  coordinates: Coordinates;
  previousCoordinates: Coordinates;
};
type SendChatMessageEvent = {
  type: "SEND_CHAT_MESSAGE";
  text: string;
  reaction: ReactionName;
};
type ChatEvent =
  | {
      type: "PLAYER_UPDATED";
      player: {
        connectionId: string;
        coordinates: Coordinates;
        updatedAt: number;
      };
    }
  | { type: "PLAYERS_LOADED"; players: Player[] }
  | { type: "PLAYER_JOINED"; player: Player }
  | { type: "PLAYER_QUIT"; connectionId: string }
  | {
      type: "CHAT_MESSAGE_RECEIVED";
      connectionId: string;
      text?: string;
      reaction?: ReactionName;
    }
  | {
      type: "ITEM_MINTED";
      bumpkinId: number;
      sfl: number;
      items: Inventory;
    }
  | SendLocationEvent
  | SendChatMessageEvent
  | { type: "TICK" }
  | { type: "ACKNOWLEDGE" }
  | { type: "CONNECT" }
  | { type: "DISCONNECT" }
  | { type: "KICKED" };

export type MachineState = State<ChatContext, ChatEvent, ChatState>;

export type MachineInterpreter = Interpreter<
  ChatContext,
  any,
  ChatEvent,
  ChatState
>;

type LoadAllPlayersMessage = {
  type: "playersLoaded";
  connections: Player[];
};

type PlayerUpdatedMessage = {
  type: "playerUpdated";
  connectionId: string;
  coordinates: Coordinates;
  updatedAt: number;
};

type PlayerQuitMessage = {
  type: "playerQuit";
  connectionId: string;
};

type PlayerJoinedMessage = {
  type: "playerJoined";
  player: Player;
};

type ChatSentMessage = {
  type: "chatSent";
  connectionId: string;
  text?: string;
  reaction?: ReactionName;
};

type ItemMintedMessage = {
  type: "itemMinted";
  bumpkinId: number;
  items: Inventory;
  sfl: number;
};

type KickedMessage = {
  type: "kicked";
};

type SendMessage =
  | LoadAllPlayersMessage
  | PlayerUpdatedMessage
  | PlayerQuitMessage
  | ChatSentMessage
  | ItemMintedMessage
  | PlayerJoinedMessage
  | KickedMessage;

function parseWebsocketMessage(data: string): SendMessage {
  return JSON.parse(data);
}

// Bumpkin will be kicked for 1 hour
export const KICKED_COOLDOWN_MS = 1 * 60 * 60 * 1000;

/**
 * Machine which handles both player events and reacts to web socket events
 */
export const websocketMachine = createMachine<
  ChatContext,
  ChatEvent,
  ChatState
>({
  initial: "initialising",
  context: {
    bumpkin: {} as Bumpkin,
    bumpkins: [],
    messages: [],
    discoveries: [],
    accountId: 0,
    jwt: "",
    currentPosition: { x: 0, y: 0 },
    lastPosition: { x: 0, y: 0 },
    canAccess: false,
    kickedAt: 0,
    roomId: "plaza",
  },
  states: {
    initialising: {
      always: [
        {
          target: "kicked",
          cond: (context) =>
            !!context.kickedAt &&
            context.kickedAt + KICKED_COOLDOWN_MS > Date.now(),
        },
        {
          target: "closed",
          cond: (context) => !context.canAccess,
        },
        {
          target: "codeOfConduct",
          cond: () => {
            const lastRead = getCodeOfConductLastRead();
            return (
              !lastRead ||
              Date.now() - lastRead.getTime() > 3 * 24 * 60 * 60 * 1000
            );
          },
        },
        {
          target: "loadingPlayers",
        },
      ],
    },
    codeOfConduct: {
      on: {
        ACKNOWLEDGE: {
          target: "initialising",
          actions: () => {
            acknowledgeCodeOfConduct();
          },
        },
      },
    },
    loadingPlayers: {
      invoke: {
        id: "loadingPlayers",
        src: async (context) => {
          if (!CONFIG.WEBSOCKET_URL) {
            return { bumpkins: OFFLINE_BUMPKINS };
          }

          const { players, isFull } = await loadRoom({
            token: context.jwt,
            roomId: context.roomId,
          });

          return {
            bumpkins: players,
            isFull,
          };
        },
        onDone: [
          {
            target: "full",
            cond: (_, event) => event.data.isFull,
          },
          {
            target: "connecting",
            actions: assign({
              bumpkins: (_, event) => event.data.bumpkins,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },
    connecting: {
      invoke: {
        id: "socket",
        src: async (context) => {
          if (!CONFIG.WEBSOCKET_URL) {
            return { socket: null };
          }

          const socket = new WebSocket(
            `${CONFIG.WEBSOCKET_URL}?token=${context.jwt}&roomId=${
              context.roomId
            }&farmId=${context.accountId}&x=${Math.floor(
              context.currentPosition?.x
            )}&y=${Math.floor(context.currentPosition?.y)}`
          );

          await new Promise((res) => {
            socket.addEventListener("open", res);
          });

          return { socket };
        },
        onDone: {
          target: "connected",
          actions: assign({
            socket: (_, event) => event.data.socket,
          }),
        },
        onError: {
          target: "error",
        },
      },
    },

    connected: {
      invoke: {
        src: (context) => (cb) => {
          context.socket?.addEventListener("close", function () {
            cb("DISCONNECT");
          });

          context.socket?.addEventListener("message", function (event) {
            const body = parseWebsocketMessage(event.data);

            if (body.type === "playerUpdated") {
              cb({ type: "PLAYER_UPDATED", player: body });
            }

            if (body.type === "playerQuit") {
              cb({ type: "PLAYER_QUIT", connectionId: body.connectionId });
            }

            if (body.type === "playersLoaded") {
              cb({ type: "PLAYERS_LOADED", players: body.connections });
            }

            if (body.type === "playerJoined") {
              cb({ type: "PLAYER_JOINED", player: body.player });
            }

            if (body.type === "kicked") {
              cb({ type: "KICKED" });
            }

            if (body.type === "chatSent") {
              cb({
                type: "CHAT_MESSAGE_RECEIVED",
                text: body.text,
                reaction: body.reaction,
                connectionId: body.connectionId,
              });
            }

            if (body.type === "itemMinted") {
              cb({
                type: "ITEM_MINTED",
                bumpkinId: body.bumpkinId,
                sfl: body.sfl,
                items: body.items,
              });
            }
          });

          const messageCleanup = setInterval(() => {
            cb("TICK");
          }, 5000);

          return () => {
            context.socket?.close();
            clearInterval(messageCleanup);
          };
        },
        onError: [
          {
            target: "error",
          },
        ],
      },
      on: {
        // Player event
        SEND_LOCATION: {
          actions: [
            (context, event: SendLocationEvent) => {
              context.socket?.send(
                JSON.stringify({
                  action: "sendLocation",
                  data: {
                    bumpkinId: context.bumpkin.id,
                    coordinates: event.coordinates,
                  },
                })
              );
            },
            assign({
              lastPosition: (_, event) => event.previousCoordinates,
              currentPosition: (_, event) => event.coordinates,
            }),
          ],
        },
        // Player event
        SEND_CHAT_MESSAGE: {
          actions: [
            (context, event: SendChatMessageEvent) => {
              JSON.stringify({ sendEvent: event });
              context.socket?.send(
                JSON.stringify({
                  action: "sendChatMessage",
                  data: {
                    text: event.text,
                    reaction: event.reaction,
                  },
                })
              );
            },
            assign({
              messages: (context, event) => [
                {
                  bumpkinId: context.bumpkin.id,
                  createdAt: Date.now(),
                  text: event.text,
                  reaction: event.reaction,
                } as ChatMessage,
                ...context.messages,
              ],
            }),
          ],
        },
        // Player event
        DISCONNECT: {
          target: "disconnected",
          actions: [
            (context) => context.socket?.close(),
            assign({
              socket: (_) => undefined,
            }),
          ],
        },
        // Socket events
        PLAYER_UPDATED: {
          actions: assign({
            bumpkins: (context, event) => {
              const bumpkins = context.bumpkins;
              const bumpkin = bumpkins.find(
                (b) => b.connectionId === event.player.connectionId
              ) as Player;

              if (bumpkin) {
                bumpkin.oldCoordinates = bumpkin.coordinates;
                bumpkin.coordinates = event.player.coordinates;
              }

              return bumpkins;
            },
          }),
        },
        PLAYER_QUIT: {
          actions: assign({
            bumpkins: (context, event) => {
              return context.bumpkins.filter(
                (bumpkin) => bumpkin.connectionId !== event.connectionId
              );
            },
          }),
        },
        PLAYERS_LOADED: {
          actions: assign({
            bumpkins: (context, event) => event.players,
          }),
        },
        PLAYER_JOINED: {
          actions: assign({
            bumpkins: (context, event) => [...context.bumpkins, event.player],
          }),
        },
        // Basic cleanup behaviour
        TICK: {
          actions: assign({
            messages: (context) =>
              context.messages.filter(
                (m) => m.createdAt > Date.now() - 5 * 1000
              ),
            discoveries: (context) =>
              context.discoveries.filter(
                (m) => m.createdAt > Date.now() - 5 * 1000
              ),
          }),
        },
        CHAT_MESSAGE_RECEIVED: {
          actions: assign({
            messages: (context, event) => {
              const bumpkinId =
                context.bumpkins.find(
                  (b) => b.connectionId === event.connectionId
                )?.bumpkin.id ?? 0;

              return [
                {
                  text: event.text,
                  reaction: event.reaction,
                  createdAt: Date.now(),
                  bumpkinId: bumpkinId,
                },
                ...context.messages,
              ];
            },
          }),
        },
        ITEM_MINTED: {
          actions: assign({
            discoveries: (context, event) => {
              return [
                { ...event, createdAt: Date.now() },
                ...context.discoveries,
              ];
            },
          }),
        },
        KICKED: {
          target: "kicked",
          actions: assign({
            kickedAt: (_) => Date.now(),
          }),
        },
      },
    },
    disconnected: {
      on: {
        CONNECT: "initialising",
      },
    },
    error: {
      on: {
        CONNECT: "initialising",
      },
    },
    closed: {},
    kicked: {},
    full: {},
  },
});
