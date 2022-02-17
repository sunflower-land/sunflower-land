import { createMachine, Interpreter, assign, TransitionsConfig } from "xstate";
import { EVENTS, GameEvent } from "../events";
import { processEvent } from "./processEvent";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import { metamask } from "../../../lib/blockchain/metamask";

import { GameState } from "../types/game";
import { loadSession } from "../actions/loadSession";
import { INITIAL_FARM } from "./constants";
import { autosave } from "../actions/autosave";
import { mint } from "../actions/mint";
import { LimitedItem } from "../types/craftables";
import { sync } from "../actions/sync";
import { withdraw } from "../actions/withdraw";
import { getVisitState } from "../actions/visit";

export type PastAction = GameEvent & {
  createdAt: Date;
};

export interface Context {
  state: GameState;
  actions: PastAction[];
  sessionId?: string;
}

type MintEvent = {
  type: "MINT";
  item: LimitedItem;
};

type WithdrawEvent = {
  type: "WITHDRAW";
  sfl: number;
  ids: number[];
  amounts: string[];
};

export type BlockchainEvent =
  | {
      type: "SAVE";
    }
  | {
      type: "SYNC";
    }
  | {
      type: "REFRESH";
    }
  | WithdrawEvent
  | GameEvent
  | MintEvent;

// For each game event, convert it to an XState event + handler
const GAME_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  Object.keys(EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      [eventName]: {
        actions: assign((context: Context, event: GameEvent) => ({
          state: processEvent(context.state as GameState, event) as GameState,
          actions: [
            ...context.actions,
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
  value:
    | "loading"
    | "playing"
    | "readonly"
    | "autosaving"
    | "minting"
    | "success"
    | "syncing"
    | "withdrawing"
    | "error";
  context: Context;
};

export type StateKeys = keyof Omit<BlockchainState, "context">;
export type StateValues = BlockchainState[StateKeys];

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
      sessionId: authContext.sessionId,
    },
    states: {
      loading: {
        invoke: {
          src: async (context) => {
            // Load the farm session
            if (context.sessionId) {
              const game = await loadSession({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                signature: authContext.signature as string,
                sender: metamask.myAccount as string,
              });

              if (!game) {
                throw new Error("NO_FARM");
              }

              // add farm address
              game.farmAddress = authContext.address;

              return {
                state: game,
              };
            }

            // Visit farm
            if (authContext.address) {
              const game = await getVisitState(authContext.address as string);

              game.id = authContext.farmId as number;

              return { state: game };
            }

            return { state: INITIAL_FARM };
          },
          onDone: {
            target:
              authContext.sessionId || !authContext.address
                ? "playing"
                : "readonly",
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
          SAVE: {
            target: "autosaving",
          },
          MINT: {
            target: "minting",
          },
          SYNC: {
            target: "syncing",
          },
          WITHDRAW: {
            target: "withdrawing",
          },
        },
      },
      autosaving: {
        on: {
          ...GAME_EVENT_HANDLERS,
        },
        invoke: {
          src: async (context) => {
            const saveAt = new Date();

            if (context.actions.length > 0) {
              await autosave({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                sender: metamask.myAccount as string,
                actions: context.actions,
                signature: authContext.signature as string,
              });
            }
            // This gives the UI time to indicate that a save is taking place both when clicking save
            // and when autosaving
            await new Promise((res) => setTimeout(res, 1000));

            return {
              saveAt,
            };
          },
          onDone: {
            target: "playing",
            // Remove the events that were submitted
            actions: assign((context: Context, event) => ({
              actions: context.actions.filter(
                (action) =>
                  action.createdAt.getTime() > event.data.saveAt.getTime()
              ),
            })),
          },
          onError: {
            target: "error",
          },
        },
      },
      minting: {
        invoke: {
          src: async (context, event) => {
            // Autosave just in case
            if (context.actions.length > 0) {
              await autosave({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                sender: metamask.myAccount as string,
                actions: context.actions,
                signature: authContext.signature as string,
              });
            }

            const session = await mint({
              farmId: Number(authContext.farmId),
              sessionId: context.sessionId as string,
              sender: metamask.myAccount as string,
              signature: authContext.signature as string,
              item: (event as MintEvent).item,
            });

            return {
              sessionId: session?.sessionId,
            };
          },
          onDone: {
            target: "success",
            actions: assign({
              sessionId: (_, event) => event.data.sessionId,
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      syncing: {
        invoke: {
          src: async (context) => {
            // Autosave just in case
            if (context.actions.length > 0) {
              await autosave({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                sender: metamask.myAccount as string,
                actions: context.actions,
                signature: authContext.signature as string,
              });
            }

            const session = await sync({
              farmId: Number(authContext.farmId),
              sessionId: context.sessionId as string,
              signature: authContext.signature as string,
            });

            return {
              sessionId: session?.sessionId,
            };
          },
          onDone: {
            target: "success",
            actions: assign({
              sessionId: (_, event) => event.data.sessionId,
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      withdrawing: {
        invoke: {
          src: async (context, event) => {
            const { amounts, ids, sfl } = event as WithdrawEvent;
            const session = await withdraw({
              farmId: Number(authContext.farmId),
              sessionId: context.sessionId as string,
              signature: authContext.signature as string,
              amounts,
              ids,
              sfl,
            });

            return {
              sessionId: session?.sessionId,
            };
          },
          onDone: {
            target: "success",
            actions: assign({
              sessionId: (_, event) => event.data.sessionId,
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      readonly: {},
      error: {},
      success: {
        on: {
          REFRESH: {
            target: "loading",
          },
        },
      },
    },
  });
}
