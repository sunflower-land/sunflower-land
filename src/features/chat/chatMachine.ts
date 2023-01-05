import { Coordinates } from "features/game/expansion/components/MapPlacement";
import { CHICKEN_TIME_TO_EGG } from "features/game/lib/constants";
import { randomInt } from "lib/utils/random";
import { assign, createMachine, Interpreter, State } from "xstate";
import { send } from "xstate/lib/actions";

type LiveBumpkin = {
  bumpkinId: number;
  coordinates: Coordinates;
};

export interface ChatContext {
  bumpkinId: number;
  bumpkins: LiveBumpkin[];
  socket?: WebSocket;
}

export type ChatState = {
  value:
    | "connecting"
    | "loadingPlayers"
    | "connected"
    | "disconnecting"
    | "disconnected"
    | "error";
  context: ChatContext;
};

type SendLocationEvent = { type: "SEND_LOCATION"; coordinates: Coordinates };
type ChatEvent =
  | { type: "PLAYERS_UPDATED"; bumpkins: LiveBumpkin[] }
  | SendLocationEvent
  | { type: "DISCONNECT" };

export type MachineState = State<ChatContext, ChatEvent, ChatState>;

export type MachineInterpreter = Interpreter<
  ChatContext,
  any,
  ChatEvent,
  ChatState
>;

const URL = "wss://5193z7l7da.execute-api.us-east-1.amazonaws.com/hannigan";

type PlayersUpdatedEvent = {
  type: "playersUpdated";
  connections: LiveBumpkin[];
};

function parseWebsocketMessage(data: string): PlayersUpdatedEvent {
  return JSON.parse(data);
}
/**
 * Machine which handles both player events and reacts to web socket events
 */
export const chatMachine = createMachine<ChatContext, ChatEvent, ChatState>({
  initial: "connecting",
  context: {
    bumpkinId: 0,
    bumpkins: [],
  },
  states: {
    connecting: {
      invoke: {
        id: "socket",
        src: async () => {
          const socket = new WebSocket(URL);

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
          context.socket?.send(
            JSON.stringify({
              action: "loadPlayers",
            })
          );

          const bumpkins: LiveBumpkin[] = await new Promise((res) => {
            context.socket?.addEventListener("message", function (event) {
              const body = parseWebsocketMessage(event.data);

              if (body.type !== "playersUpdated") {
                return;
              }

              console.log({ received: event });

              res(body.connections);
            });
          });

          console.log({ set: bumpkins });
          return { bumpkins };
        },
        onDone: {
          target: "connected",
          actions: assign({
            bumpkins: (_, event) => event.data.bumpkins,
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
            // process event type ;)
            console.log({ eventCaught: event });
            const body = parseWebsocketMessage(event.data);

            if (body.type === "playersUpdated") {
              cb({ type: "PLAYERS_UPDATED", bumpkins: body.connections });
            }
          });

          return () => {
            console.log("Clean up?");
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
          actions: (context, event: SendLocationEvent) => {
            JSON.stringify({ send: event });
            context.socket?.send(
              JSON.stringify({
                action: "sendLocation",
                data: {
                  bumpkinId: context.bumpkinId,
                  coordinates: event.coordinates,
                },
              })
            );
          },
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
        // Socket event
        PLAYERS_UPDATED: {
          actions: assign({
            bumpkins: (context, event) => {
              console.log("PLAYERS_UPDTED", { event: event });
              return event.bumpkins.filter(
                (bumpkin) => bumpkin.bumpkinId !== context.bumpkinId
              );
            },
          }),
        },
      },
    },
    disconnected: {},
    error: {},
  },
});
