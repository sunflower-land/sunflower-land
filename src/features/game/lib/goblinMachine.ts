import { createMachine, Interpreter, assign, TransitionsConfig } from "xstate";
import { EVENTS, GameEvent } from "../events";
import { processEvent } from "./processEvent";

import { Context as AuthContext } from "features/auth/lib/authMachine";
import { metamask } from "../../../lib/blockchain/metamask";

import { GameState } from "../types/game";
import { loadSession, MintedAt } from "../actions/loadSession";
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
import { reset } from "features/hud/actions/reset";

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
  whitelistedAt?: Date;
  itemsMintedAt?: MintedAt;
  blacklistStatus?: "investigating" | "permanent";
}

type MintEvent = {
  type: "MINT";
  item: LimitedItem;
  captcha: string;
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
  value: "loading";
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

export function startGoblinVillage(authContext: AuthContext) {
  return createMachine<Context, BlockchainEvent, BlockchainState>({
    id: "goblinMachine",
    initial: "loading",
    context: {
      state: EMPTY,
    },
    states: {
      loading: {
        invoke: {
          src: async (context) => {
            // TODO load the on chain data
          },
          onDone: {},
          onError: {},
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
            target: "synced",
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
            target: "withdrawn",
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
      withdrawn: {
        on: {
          REFRESH: {
            target: "loading",
          },
        },
      },
      blacklisted: {
        on: {
          CONTINUE: "playing",
        },
      },
    },
  });
}
