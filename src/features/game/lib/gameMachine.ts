import { createMachine, Interpreter, assign, TransitionsConfig } from "xstate";
import { EVENTS, GameEvent } from "../events";
import { processEvent } from "./processEvent";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import { metamask } from "../../../lib/blockchain/metamask";

import { GameState } from "../types/game";
import { loadSession } from "../actions/loadSession";
import { INITIAL_FARM, EMPTY } from "./constants";
import { autosave } from "../actions/autosave";
import { mint } from "../actions/mint";
import { LimitedItem } from "../types/craftables";
import { sync } from "../actions/sync";
import { withdraw } from "../actions/withdraw";
import { getOnChainState } from "../actions/visit";
import { ErrorCode, ERRORS } from "lib/errors";
import { updateGame } from "./transforms";
import { getFingerPrint } from "./botDetection";
import { SkillName } from "../types/skills";
import { levelUp } from "../actions/levelUp";

export type PastAction = GameEvent & {
  createdAt: Date;
};

export interface Context {
  state: GameState;
  actions: PastAction[];
  offset: number;
  sessionId?: string;
  errorCode?: keyof typeof ERRORS;
  fingerprint?: string;
}

type MintEvent = {
  type: "MINT";
  item: LimitedItem;
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
    | "levelling"
    | "withdrawing"
    | "error"
    | "blacklisted";
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

export function startGame(authContext: Options) {
  const handleInitialState = () => {
    if (authContext.sessionId || !authContext.address) {
      return "playing";
    }
    return "readonly";
  };

  return createMachine<Context, BlockchainEvent, BlockchainState>(
    {
      id: "gameMachine",
      initial: "loading",
      context: {
        actions: [],
        state: EMPTY,
        sessionId: authContext.sessionId,
        offset: 0,
      },
      states: {
        loading: {
          invoke: {
            src: async (context) => {
              // Load the farm session
              if (context.sessionId) {
                const response = await loadSession({
                  farmId: Number(authContext.farmId),
                  sessionId: context.sessionId as string,
                  token: authContext.rawToken as string,
                });

                if (!response) {
                  throw new Error("NO_FARM");
                }

                const { game, offset, isBlacklisted } = response;

                // add farm address
                game.farmAddress = authContext.address;

                const fingerprint = await getFingerPrint();

                return {
                  state: game,
                  offset,
                  isBlacklisted,
                  fingerprint,
                };
              }

              // Visit farm
              if (authContext.address) {
                const game = await getOnChainState(
                  authContext.address as string
                );

                game.id = authContext.farmId as number;

                return { state: game };
              }

              return { state: INITIAL_FARM };
            },
            onDone: [
              {
                target: "blacklisted",
                cond: (_, event) => event.data.isBlacklisted,
              },
              {
                target: handleInitialState(),
                actions: assign({
                  state: (_, event) => event.data.state,
                  offset: (_, event) => event.data.offset,
                  fingerprint: (_, event) => event.data.fingerprint,
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
            MINT: {
              target: "minting",
            },
            SYNC: {
              target: "syncing",
            },
            WITHDRAW: {
              target: "withdrawing",
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
                    state: updateGame(
                      event.data.farm,
                      recentActions,
                      context.state
                    ),
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
        minting: {
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

              const { item, captcha } = event as MintEvent;

              const { sessionId } = await mint({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                token: authContext.rawToken as string,
                item,
                captcha,
              });

              return {
                sessionId,
              };
            },
            onDone: {
              target: "success",
              actions: assign((_, event) => ({
                sessionId: event.data.sessionId,
                actions: [],
              })),
            },
            onError: {
              target: "error",
              actions: "assignErrorMessage",
            },
          },
        },
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
              target: "success",
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
        withdrawing: {
          invoke: {
            src: async (context, event) => {
              const { amounts, ids, sfl, captcha } = event as WithdrawEvent;
              const { sessionId } = await withdraw({
                farmId: Number(authContext.farmId),
                sessionId: context.sessionId as string,
                token: authContext.rawToken as string,
                amounts,
                ids,
                sfl,
                captcha,
              });

              return {
                sessionId,
              };
            },
            onDone: {
              target: "success",
              actions: assign({
                sessionId: (_, event) => event.data.sessionId,
              }),
            },
            onError: [
              {
                target: "playing",
                cond: (_, event: any) =>
                  event.data.message === ERRORS.REJECTED_TRANSACTION,
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
        readonly: {},
        error: {
          on: {
            CONTINUE: "playing",
          },
        },
        blacklisted: {},
        success: {
          on: {
            REFRESH: {
              target: "loading",
            },
          },
        },
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
