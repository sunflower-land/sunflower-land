import { createMachine, Interpreter, assign } from "xstate";

import { EVENTS, GameEvent, processEvent } from "../events";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import { metamask } from "../../../lib/blockchain/metamask";
import { loadSession } from "src/api/session";

import { DEFAULT_FARM, GameState } from "./types";

type PastAction = GameEvent & {
  createdAt: Date;
};

export interface Context {
  state: GameState;
  actions: PastAction[];
}

export type BlockchainEvent =
  | {
      type: "SAVE";
    }
  | GameEvent;

const GAME_EVENT_HANDLERS = Object.keys(EVENTS).reduce(
  (events, eventName) => ({
    ...events,
    [eventName]: {
      target: "playing",
      actions: assign({
        state: (context: Context, event: GameEvent) =>
          processEvent(context.state as GameState, event),
        actions: (_, event: GameEvent) => [
          {
            ...event,
            createdAt: new Date(),
          },
        ],
      }),
    },
  }),
  {}
);

console.log({ GAME_EVENT_HANDLERS });

export type BlockchainState = {
  value: "loading" | "playing" | "readonly" | "saving" | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export function startGame(authContext: AuthContext) {
  return createMachine<Context, BlockchainEvent, BlockchainState>({
    id: "gameMachine",
    initial: "loading",
    context: {
      actions: [],
      state: DEFAULT_FARM,
    },
    states: {
      loading: {
        invoke: {
          src: async () => {
            // Load the farm session
            if (authContext.sessionId) {
              const game = await loadSession({
                farmId: authContext.farmId as number,
                sessionId: authContext.sessionId as string,
                signature: authContext.signature as string,
                hash: authContext.hash as string,
                sender: metamask.myAccount as string,
              });

              console.log({ game });

              return { state: game };
            }

            // They are an anonymous user
            // TODO: Load from Web3

            return { state: DEFAULT_FARM };
          },
          onDone: {
            //target: authContext.sessionId ? "playing" : "readonly",
            target: authContext.sessionId ? "playing" : "playing",
            actions: assign({
              state: (context, event) => event.data.state,
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      playing: {
        on: {
          ...GAME_EVENT_HANDLERS,
        },
      },
      readonly: {},
      error: {},
    },
  });
}
