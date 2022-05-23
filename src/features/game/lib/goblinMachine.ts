import { createMachine, Interpreter, assign } from "xstate";

import { Context as AuthContext } from "features/auth/lib/authMachine";

import { GameState } from "../types/game";
import { mint } from "../actions/mint";
import {
  LimitedItem,
  LimitedItemName,
  LIMITED_ITEMS,
  makeLimitedItemsByName,
} from "../types/craftables";
import { withdraw } from "../actions/withdraw";
import {
  getOnChainState,
  LimitedItemRecipeWithMintedAt,
} from "../actions/onchain";
import { ERRORS } from "lib/errors";
import { EMPTY } from "./constants";
import { loadSession } from "../actions/loadSession";
import { metamask } from "lib/blockchain/metamask";
import { INITIAL_SESSION } from "./gameMachine";
import { wishingWellMachine } from "features/goblins/wishingWell/wishingWellMachine";
import Decimal from "decimal.js-light";

export type GoblinState = Omit<GameState, "skills">;

export type OnChainLimitedItems = Record<number, LimitedItemRecipeWithMintedAt>;

export interface Context {
  state: GoblinState;
  sessionId?: string;
  errorCode?: keyof typeof ERRORS;
  farmAddress?: string;
  limitedItems: Partial<Record<LimitedItemName, LimitedItem>>;
}

type MintEvent = {
  type: "MINT";
  item: LimitedItemName;
  captcha: string;
};

type WithdrawEvent = {
  type: "WITHDRAW";
  sfl: number;
  ids: number[];
  amounts: string[];
  captcha: string;
};

type OpeningWishingWellEvent = {
  type: "OPENING_WISHING_WELL";
  authState: AuthContext;
};

type UpdateBalance = {
  type: "UPDATE_BALANCE";
  newBalance: Decimal;
};

export type BlockchainEvent =
  | {
      type: "REFRESH";
    }
  | {
      type: "CONTINUE";
    }
  | {
      type: "OPENING_WISHING_WELL";
    }
  | {
      type: "RESET";
    }
  | WithdrawEvent
  | MintEvent
  | OpeningWishingWellEvent
  | UpdateBalance;

export type GoblinMachineState = {
  value:
    | "loading"
    | "wishing"
    | "minting"
    | "minted"
    | "withdrawing"
    | "withdrawn"
    | "playing"
    | "error";
  context: Context;
};

export type StateKeys = keyof Omit<GoblinMachineState, "context">;
export type StateValues = GoblinMachineState[StateKeys];

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  GoblinMachineState
>;

const makeLimitedItemsById = (items: LimitedItemRecipeWithMintedAt[]) => {
  return items.reduce((obj, item) => {
    // Strange items showing up in rare items with 0 values and 0 id
    if (item.mintId > 0) {
      obj[item.mintId] = item;
    }

    return obj;
  }, {} as Record<number, LimitedItemRecipeWithMintedAt>);
};

export function startGoblinVillage(authContext: AuthContext) {
  return createMachine<Context, BlockchainEvent, GoblinMachineState>(
    {
      id: "goblinMachine",
      initial: "loading",
      context: {
        state: EMPTY,
        sessionId: INITIAL_SESSION,
        limitedItems: {},
      },
      states: {
        loading: {
          invoke: {
            src: async () => {
              const farmId = authContext.farmId as number;

              const { game, limitedItems } = await getOnChainState({
                farmAddress: authContext.address as string,
                id: Number(authContext.farmId),
              });

              // Load the Goblin Village
              game.id = farmId;

              // Get session id
              const sessionId = await metamask
                .getSessionManager()
                .getSessionId(farmId);

              const response = await loadSession({
                farmId,
                sessionId,
                token: authContext.rawToken as string,
              });

              game.fields = response?.game.fields || {};

              const limitedItemsById = makeLimitedItemsById(limitedItems);

              return { state: game, limitedItems: limitedItemsById, sessionId };
            },
            onDone: {
              target: "playing",
              actions: assign({
                state: (_, event) => event.data.state,
                limitedItems: (_, event) =>
                  makeLimitedItemsByName(
                    LIMITED_ITEMS,
                    event.data.limitedItems
                  ),
                sessionId: (_, event) => event.data.sessionId,
              }),
            },
            onError: {},
          },
        },
        playing: {
          on: {
            MINT: {
              target: "minting",
            },
            WITHDRAW: {
              target: "withdrawing",
            },
            OPENING_WISHING_WELL: {
              target: "wishing",
            },
          },
        },
        wishing: {
          invoke: {
            id: "wishingWell",
            autoForward: true,
            src: wishingWellMachine,
            data: {
              farmId: () => authContext.farmId,
              farmAddress: () => authContext.address,
              sessionId: (context: Context) => context.sessionId,
              token: () => authContext.rawToken,
              balance: (context: Context) => context.state.balance,
            },
            onDone: {
              target: "playing",
            },
          },
          on: {
            UPDATE_BALANCE: {
              actions: assign({
                state: (context, event) => ({
                  ...context.state,
                  balance: (event as UpdateBalance).newBalance,
                }),
              }),
            },
          },
        },
        minting: {
          invoke: {
            src: async (context, event) => {
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
              target: "minted",
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
        minted: {
          on: {
            REFRESH: "loading",
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
        error: {},
      },
    },
    {
      actions: {
        assignErrorMessage: assign<Context, any>({
          errorCode: (_context, event) => event.data.message,
        }),
      },
    }
  );
}
