import { createMachine, Interpreter, assign, TransitionsConfig } from "xstate";
import { fromWei } from "web3-utils";

import { EVENTS, GameEvent, processEvent } from "../events";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import { metamask } from "../../../lib/blockchain/metamask";

import { GameState } from "../types/game";
import { loadSession } from "../actions/loadSession";
import { INITIAL_FARM } from "./constants";

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

// For each game event, convert it to an XState event + handler
const GAME_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  Object.keys(EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      [eventName]: {
        target: "playing",
        actions: assign((context: Context, event: GameEvent) => ({
          state: processEvent(context.state as GameState, event) as GameState,
          actions: [
            {
              ...event,
              createdAt: new Date(),
            },
          ],
        })),
      },
    }),
    {}
  );

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
      state: INITIAL_FARM,
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

              console.log({ balance: game.balance });
              console.log({ balance: fromWei(game.balance.toString()) });

              return {
                state: {
                  ...game,
                  balance: Number(fromWei(game.balance.toString())),
                },
              };
            }

            // They are an anonymous user
            // TODO: Load from Web3

            return { state: INITIAL_FARM };
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
        on: GAME_EVENT_HANDLERS,
      },
      readonly: {},
      error: {},
    },
  });
}
