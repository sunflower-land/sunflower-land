import { createMachine, Interpreter, assign } from "xstate";

import { Context as AuthContext } from "features/auth/lib/authMachine";

import { GameState } from "../types/game";
import { mint } from "../actions/mint";
import { LimitedItemName } from "../types/craftables";
import { withdraw } from "../actions/withdraw";
import {
  getOnChainState,
  LimitedItemRecipeWithMintedAt,
} from "../actions/onchain";
import { ERRORS } from "lib/errors";
import { EMPTY } from "./constants";

export type GoblinState = Omit<GameState, "skills">;

export type OnChainLimitedItems = Record<number, LimitedItemRecipeWithMintedAt>;

export interface Context {
  state: GoblinState;
  sessionId?: string;
  errorCode?: keyof typeof ERRORS;
  farmAddress?: string;
  limitedItems: OnChainLimitedItems;
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

export type BlockchainEvent =
  | {
      type: "REFRESH";
    }
  | {
      type: "CONTINUE";
    }
  | {
      type: "RESET";
    }
  | WithdrawEvent
  | MintEvent;

export type BlockchainState = {
  value:
    | "loading"
    | "minting"
    | "minted"
    | "withdrawing"
    | "withdrawn"
    | "playing"
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
  return createMachine<Context, BlockchainEvent, BlockchainState>({
    id: "goblinMachine",
    initial: "loading",
    context: {
      state: EMPTY,
      sessionId: authContext.sessionId,
      limitedItems: [],
    },
    states: {
      loading: {
        invoke: {
          src: async () => {
            const { game, limitedItems } = await getOnChainState({
              farmAddress: authContext.address as string,
              id: Number(authContext.farmId),
            });

            game.id = authContext.farmId as number;

            return { state: game, limitedItems };
          },
          onDone: {
            target: "playing",
            actions: assign({
              state: (_, event) => event.data.state,
              limitedItems: (_, event) =>
                makeLimitedItemsById(event.data.limitedItems),
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
  });
}
