import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { Equipped } from "features/game/types/bumpkin";
import { Bumpkin, GameState } from "features/game/types/game";
import { loadBumpkins } from "lib/blockchain/BumpkinDetails";
import { wallet } from "lib/blockchain/wallet";
import { CONFIG } from "lib/config";

import { assign, createMachine, Interpreter, State } from "xstate";
import { loadSession } from "features/game/actions/loadSession";
import { randomID } from "lib/utils/random";
import { getSessionId } from "lib/blockchain/Sessions";
import { OFFLINE_FARM } from "features/game/lib/landData";
import { ReactionName } from "./lib/reactions";

export type Player = {
  connectionId: string;
  bumpkinId: number;
  coordinates: Coordinates;
  updatedAt: number;
  wearables: Equipped;
};

export type ChatMessage = {
  bumpkinId: number;
  text?: string;
  reaction?: ReactionName;
  createdAt: number;
};

export interface ChatContext {
  currentPosition: Coordinates;
  bumpkin: Bumpkin;
  socket?: WebSocket;
  bumpkins: Player[];
  messages: ChatMessage[];
  accountId: number;
  jwt: string;
  game: GameState;
}

export type ChatState = {
  value:
    | "initialising"
    | "connecting"
    | "loadingPlayers"
    | "connected"
    | "disconnecting"
    | "disconnected"
    | "error";
  context: ChatContext;
};

type SendLocationEvent = { type: "SEND_LOCATION"; coordinates: Coordinates };
type SendChatMessageEvent = {
  type: "SEND_CHAT_MESSAGE";
  text: string;
  reaction: ReactionName;
};
type ChatEvent =
  | { type: "PLAYER_UPDATED"; player: Player }
  | { type: "PLAYERS_LOADED"; players: Player[] }
  | { type: "PLAYER_QUIT"; connectionId: string }
  | {
      type: "CHAT_MESSAGE_RECEIVED";
      connectionId: string;
      text?: string;
      reaction?: ReactionName;
    }
  | SendLocationEvent
  | SendChatMessageEvent
  | { type: "TICK" }
  | { type: "DISCONNECT" };

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
  bumpkinId: number;
  wearables: Equipped;
  coordinates: Coordinates;
  updatedAt: number;
};

type PlayerQuitMessage = {
  type: "playerQuit";
  connectionId: string;
};

type ChatSentMessage = {
  type: "chatSent";
  connectionId: string;
  text?: string;
  reaction?: ReactionName;
};

type SendMessage =
  | LoadAllPlayersMessage
  | PlayerUpdatedMessage
  | PlayerQuitMessage
  | ChatSentMessage;

function parseWebsocketMessage(data: string): SendMessage {
  return JSON.parse(data);
}
/**
 * Machine which handles both player events and reacts to web socket events
 */
export const exploreMachine = createMachine<ChatContext, ChatEvent, ChatState>({
  initial: "initialising",
  context: {
    bumpkin: {} as Bumpkin,
    bumpkins: [],
    messages: [],
    accountId: 0,
    jwt: "",
    currentPosition: { x: 0, y: 0 },
    game: OFFLINE_FARM,
  },
  states: {
    initialising: {
      invoke: {
        id: "init",
        src: async (context) => {
          const bumpkins = await loadBumpkins(
            wallet.web3Provider,
            wallet.myAccount
          );

          // Get sessionId
          const sessionId = await getSessionId(
            wallet.web3Provider,
            wallet.myAccount,
            context.accountId
          );

          const response = await loadSession({
            farmId: context.accountId,
            bumpkinTokenUri: bumpkins[0]?.tokenURI,
            sessionId,
            token: context.jwt as string,
            transactionId: randomID(),
          });

          return {
            bumpkin: response?.game.bumpkin,
            game: response?.game,
          };
        },
        onDone: {
          target: "connecting",
          actions: assign({
            bumpkin: (_, event) => event.data.bumpkin,
            game: (_, event) => event.data.game,
          }),
        },
        onError: {
          target: "error",
        },
      },
    },
    connecting: {
      invoke: {
        id: "socket",
        src: async (context) => {
          console.log({ context });
          if (!CONFIG.WEBSOCKET_URL) {
            throw new Error("No websocket URL provided");
          }

          const socket = new WebSocket(
            `${CONFIG.WEBSOCKET_URL}?token=${context.jwt}&farmId=${context.accountId}&x=${context.currentPosition?.x}&y=${context.currentPosition?.y}`
          );

          console.log("Connect");
          await new Promise((res) => {
            socket.addEventListener("open", res);
          });

          return { socket };
        },
        onDone: {
          target: "loadingPlayers",
          actions: assign({
            socket: (_, event) => event.data.socket,
          }),
        },
        onError: {
          target: "error",
        },
      },
    },
    loadingPlayers: {
      invoke: {
        id: "loadingPlayers",
        src: async (context) => {
          console.log("Load players");
          context.socket?.send(
            JSON.stringify({
              action: "loadPlayers",
            })
          );

          const bumpkins: Player[] = await new Promise((res) => {
            const listener = function (event: any) {
              const body = parseWebsocketMessage(event.data);
              console.log({ body });
              if (body.type === "playersLoaded") {
                console.log({ received: event });

                context.socket?.removeEventListener("message", listener);

                res(body.connections);
                return;
              }
            };

            context.socket?.addEventListener("message", listener);
          });

          console.log({ set: bumpkins });
          return { bumpkins };
        },
        onDone: {
          target: "connected",
          actions: assign({
            bumpkins: (context, event) =>
              (event.data.bumpkins as Player[]).filter(
                (bumpkin) => bumpkin.bumpkinId !== context.bumpkin.id
              ),
          }),
        },
        onError: {
          target: "error",
        },
      },
      on: {
        DISCONNECT: {
          target: "disconnected",
          actions: [
            (context) => context.socket?.close(),
            assign({
              socket: (_) => undefined,
            }),
          ],
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
            // process event type ;)
            console.log({ eventCaught: event });
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

            if (body.type === "chatSent") {
              cb({
                type: "CHAT_MESSAGE_RECEIVED",
                text: body.text,
                reaction: body.reaction,
                connectionId: body.connectionId,
              });
            }
          });

          const messageCleanup = setInterval(() => {
            cb("TICK");
          }, 5000);

          return () => {
            console.log("Clean up?");
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
              JSON.stringify({ sendEvent: event });
              context.socket?.send(
                JSON.stringify({
                  action: "sendLocation",
                  data: {
                    bumpkinId: context.bumpkin.id,
                    wearables: context.bumpkin.equipped,
                    coordinates: event.coordinates,
                  },
                })
              );
            },
            assign({
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
                },
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
              let bumpkins = context.bumpkins;
              const bumpkinIndex = bumpkins.findIndex(
                (bumpkin) => bumpkin.bumpkinId === event.player.bumpkinId
              );

              console.log({ found: bumpkinIndex });
              if (bumpkinIndex === -1) {
                bumpkins = [...bumpkins, event.player];
              } else {
                bumpkins[bumpkinIndex] = event.player;
              }

              // Filter out ourselves ;)
              return bumpkins.filter(
                (bumpkin) => bumpkin.bumpkinId !== context.bumpkin.id
              );
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
            bumpkins: (context, event) =>
              event.players.filter(
                (player) => player.bumpkinId !== context.bumpkin.id
              ),
          }),
        },
        // Basic cleanup behaviour
        TICK: {
          actions: assign({
            messages: (context) =>
              context.messages.filter(
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
                )?.bumpkinId ?? 0;

              console.log({
                lookFor: event.connectionId,
                connections: context.bumpkins,
              });

              console.log({ bumpkinId });
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
      },
    },
    disconnected: {},
    error: {},
  },
});
