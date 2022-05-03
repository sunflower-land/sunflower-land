import { createMachine, Interpreter, assign } from "xstate";

import { Context as AuthContext } from "features/auth/lib/authMachine";

import { Inventory } from "../types/game";
import { mint } from "../actions/mint";
import { ItemId, LimitedItem } from "../types/craftables";
import { withdraw } from "../actions/withdraw";
import { getOnChainState, RareItem } from "../actions/onchain";
import { ERRORS } from "lib/errors";

import Decimal from "decimal.js-light";

type GoblinState = {
  balance: Decimal;
  inventory: Inventory;
};

export type OnChainRareItems = Record<ItemId, RareItem>;

export interface Context {
  state: GoblinState;
  sessionId?: string;
  errorCode?: keyof typeof ERRORS;
  farmAddress?: string;
  rareItems: OnChainRareItems;
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
    | "withdrawin"
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

const makeRareItemsById = (items: RareItem[]) => {
  return items.reduce((obj, item) => {
    // Strange items showing up in rare items with 0 values and 0 id
    if (item.mintId > 0) {
      obj[item.mintId] = item;
    }

    return obj;
  }, {} as Record<ItemId, RareItem>);
};

export function startGoblinVillage(authContext: AuthContext) {
  return createMachine<Context, BlockchainEvent, BlockchainState>({
    id: "goblinMachine",
    initial: "loading",
    context: {
      state: {
        balance: new Decimal(0),
        inventory: {},
      },
      sessionId: authContext.sessionId,
      rareItems: [],
    },
    states: {
      loading: {
        invoke: {
          src: async () => {
            const { game, rareItems } = await getOnChainState({
              farmAddress: authContext.address as string,
              id: Number(authContext.farmId),
            });

            game.id = authContext.farmId as number;

            return { state: game, rareItems };
          },
          onDone: {
            target: "playing",
            actions: assign({
              state: (_, event) => event.data.state,
              rareItems: (_, event) => makeRareItemsById(event.data.rareItems),
            }),
          },
          onError: {},
        },
      },
      playing: {},
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
