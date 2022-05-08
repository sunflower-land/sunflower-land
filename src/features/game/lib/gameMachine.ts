import { createMachine, Interpreter, assign, TransitionsConfig } from "xstate";
import { EVENTS, GameEvent } from "../events";
import { processEvent } from "./processEvent";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import { metamask } from "../../../lib/blockchain/metamask";

import { GameState } from "../types/game";
import { loadSession, MintedAt } from "../actions/loadSession";
import { INITIAL_FARM, EMPTY } from "./constants";
import { autosave } from "../actions/autosave";
import { LimitedItemName } from "../types/craftables";
import { sync } from "../actions/sync";
import { getOnChainState } from "../actions/onchain";
import { ErrorCode, ERRORS } from "lib/errors";
import { updateGame } from "./transforms";
import { getFingerPrint } from "./botDetection";
import { SkillName } from "../types/skills";
import { levelUp } from "../actions/levelUp";
import { reset } from "features/farming/hud/actions/reset";

export type PastAction = GameEvent & {
  createdAt: Date;
};

export interface Context {
  state: GameState;
  onChain: GameState;
  actions: PastAction[];
  offset: number;
  owner?: string;
  sessionId?: string;
  errorCode?: keyof typeof ERRORS;
  fingerprint?: string;
  itemsMintedAt?: MintedAt;
}

type MintEvent = {
  type: "MINT";
  item: LimitedItemName;
  captcha: string;
};

type LevelUpEvent = {
  type: "LEVEL_UP";
  skill: SkillName;
};

type WithdrawEvent = {
  type: "WITHDRAW";
  sfl: number;
  ids: number[];
  amounts: string[];
  captcha: string;
};

type SyncEvent = {
  captcha: string;
  type: "SYNC";
};

export type BlockchainEvent =
  | {
      type: "SAVE";
    }
  | SyncEvent
  | {
      type: "REFRESH";
    }
  | {
      type: "EXPIRED";
    }
  | {
      type: "CONTINUE";
    }
  | {
      type: "RESET";
    }
  | WithdrawEvent
  | GameEvent
  | MintEvent
  | LevelUpEvent;

// For each game event, convert it to an XState event + handler
const GAME_EVENT_HANDLERS: TransitionsConfig<Context, BlockchainEvent> =
  Object.keys(EVENTS).reduce(
    (events, eventName) => ({
      ...events,
      [eventName]: {
        actions: assign((context: Context, event: GameEvent) => ({
          state: processEvent({
            state: context.state as GameState,
            action: event,
            onChain: context.onChain as GameState,
          }) as GameState,
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
    | "syncing"
    | "synced"
    | "levelling"
    | "error"
    | "resetting";
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

type Options = AuthContext & { isNoob: boolean };

const isVisiting = () => window.location.href.includes("visit");

export function startGame(authContext: Options) {
  const handleInitialState = () => {
    if (isVisiting()) {
      return "readonly";
    }
    return "playing";
  };

  return createMachine<Context, BlockchainEvent, BlockchainState>(
    {
      id: "gameMachine",
      initial: "loading",
      context: {
        actions: [],
        state: EMPTY,
        onChain: EMPTY,
        sessionId: authContext.sessionId,
        offset: 0,
      },
      states: {
        loading: {
          invoke: {
            src: async (context) => {
              const { game: onChain, owner } = await getOnChainState({
                farmAddress: authContext.address as string,
                id: authContext.farmId as number,
              });

              // Visit farm
              if (isVisiting()) {
                onChain.id = authContext.farmId as number;

                return { state: onChain, onChain, owner };
              }

              // Load the farm session
              if (context.sessionId) {
                const fingerprint = await getFingerPrint();

                const response = await loadSession({
                  farmId: Number(authContext.farmId),
                  sessionId: context.sessionId as string,
                  token: authContext.rawToken as string,
                });

                if (!response) {
                  throw new Error("NO_FARM");
                }

                const { game, offset, whitelistedAt, itemsMintedAt } = response;

                // add farm address
                game.farmAddress = authContext.address;

                return {
                  state: {
                    ...game,
                    id: Number(authContext.farmId),
                  },
                  offset,
                  whitelistedAt,
                  fingerprint,
                  itemsMintedAt,
                  onChain,
                  owner,
                };
              }

              return { state: INITIAL_FARM };
            },
            onDone: [
              {
                target: handleInitialState(),
                actions: assign({
                  state: (_, event) => event.data.state,
                  onChain: (_, event) => event.data.onChain,
                  owner: (_, event) => event.data.owner,
                  offset: (_, event) => event.data.offset,
                  fingerprint: (_, event) => event.data.fingerprint,
                  itemsMintedAt: (_, event) => event.data.itemsMintedAt,
                }),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        playing: {
          invoke: {
            /**
             * An in game loop that checks if Blockchain becomes out of sync
             * It is a rare event but it saves a user from making too much progress that would not be synced
             */
            src: (context) => (cb) => {
              const interval = setInterval(async () => {
                const sessionID = await metamask
                  .getSessionManager()
                  ?.getSessionId(authContext?.farmId as number);

                if (sessionID !== context.sessionId) {
                  cb("EXPIRED");
                }
              }, 1000 * 20);

              return () => {
                clearInterval(interval);
              };
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
          on: {
            ...GAME_EVENT_HANDLERS,
            SAVE: {
              target: "autosaving",
            },
            SYNC: {
              target: "syncing",
            },
            LEVEL_UP: {
              target: "levelling",
            },
            EXPIRED: {
              target: "error",
              actions: assign((_) => ({
                errorCode: ERRORS.SESSION_EXPIRED as ErrorCode,
              })),
            },
            RESET: {
              target: "resetting",
            },
          },
        },
        autosaving: {
          on: {
            ...GAME_EVENT_HANDLERS,
          },
          invoke: {
            src: async (context, event) => {
              const saveAt = (event as any)?.data?.saveAt || new Date();

              if (context.actions.length === 0) {
                return { verified: true, saveAt, farm: context.state };
              }

              const { verified, farm } = await autosave({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                actions: context.actions,
                token: authContext.rawToken as string,
                offset: context.offset,
                fingerprint: context.fingerprint as string,
              });

              // This gives the UI time to indicate that a save is taking place both when clicking save
              // and when autosaving
              await new Promise((res) => setTimeout(res, 1000));

              return {
                saveAt,
                verified,
                farm,
              };
            },
            onDone: [
              {
                target: "playing",
                actions: assign((context: Context, event) => {
                  // Actions that occured since the server request
                  const recentActions = context.actions.filter(
                    (action) =>
                      action.createdAt.getTime() > event.data.saveAt.getTime()
                  );

                  return {
                    actions: recentActions,
                    state: updateGame(event.data.farm, context.state),
                  };
                }),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        // minting
        syncing: {
          invoke: {
            src: async (context, event) => {
              // Autosave just in case
              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(authContext.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.rawToken as string,
                  offset: context.offset,
                  fingerprint: context.fingerprint as string,
                });
              }

              const { sessionId } = await sync({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                token: authContext.rawToken as string,
                captcha: (event as SyncEvent).captcha,
              });

              return {
                sessionId: sessionId,
              };
            },
            onDone: {
              target: "synced",
              actions: assign((_, event) => ({
                sessionId: event.data.sessionId,
                actions: [],
              })),
            },
            onError: [
              {
                target: "playing",
                cond: (_, event: any) =>
                  event.data.message === ERRORS.REJECTED_TRANSACTION,
                actions: assign((_) => ({
                  actions: [],
                })),
              },
              {
                target: "error",
                actions: "assignErrorMessage",
              },
            ],
          },
        },
        levelling: {
          invoke: {
            src: async (context, event) => {
              // Autosave just in case
              if (context.actions.length > 0) {
                await autosave({
                  farmId: Number(authContext.farmId),
                  sessionId: context.sessionId as string,
                  actions: context.actions,
                  token: authContext.rawToken as string,
                  offset: context.offset,
                  fingerprint: context.fingerprint as string,
                });
              }

              const { farm } = await levelUp({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                token: authContext.rawToken as string,
                fingerprint: context.fingerprint as string,
                skill: (event as LevelUpEvent).skill,
              });

              return {
                farm,
              };
            },
            onDone: [
              {
                target: "playing",
                actions: assign((_, event) => ({
                  // Remove events
                  actions: [],
                  // Update immediately with state from server
                  state: event.data.farm,
                })),
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        resetting: {
          invoke: {
            src: async (context, event) => {
              // Autosave just in case
              const { success } = await reset({
                farmId: Number(authContext.farmId),
                token: authContext.rawToken as string,
                fingerprint: context.fingerprint as string,
              });

              return {
                success,
              };
            },
            onDone: [
              {
                target: "loading",
              },
            ],
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
        readonly: {},
        error: {
          on: {
            CONTINUE: "playing",
          },
        },
        synced: {
          on: {
            REFRESH: {
              target: "loading",
            },
          },
        },
        //  withdrawn
      },
    },
    {
      actions: {
        assignErrorMessage: assign<Context, any>({
          errorCode: (_context, event) => event.data.message,
          actions: [],
        }),
      },
    }
  );
}
