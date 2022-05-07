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
    | "readonly"
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
  // Temp check for determining if in visiting i.e. readonly state
  const isVisiting = () => {
    return authContext.sessionId === undefined || authContext.sessionId === "";
  };

  // Temp Initial redirection to readonly state if in visiting mode, else loading
  const handleInitialState = () => {
    if (isVisiting()) {
      return "readonly";
    }
    return "loading";
  };

  return createMachine<Context, BlockchainEvent, BlockchainState>({
    id: "goblinMachine",
    initial: "loading",
    context: {
      state: EMPTY,
      sessionId: authContext.sessionId,
      limitedItems: {},
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

            const limitedItemsById = makeLimitedItemsById(limitedItems);

            // Forbid entry to Goblin Village while in Visiting i.e. readonly state
            // [TODO: check if we need to forbid from loading only, else rm this]
            // if (isVisiting()) return {};

            // Load the Goblin Village
            return { state: game, limitedItems: limitedItemsById };
          },
          onDone: {
            /*[TODO: add proper transitions for readonly, below is temp logic]*/
            target: handleInitialState() === "loading" ? "playing" : "readonly",
            actions: assign({
              state: (_, event) => event.data.state,
              limitedItems: (_, event) =>
                makeLimitedItemsByName(LIMITED_ITEMS, event.data.limitedItems),
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
      readonly: {
        on: {
          /*[TODO: add proper transitions for goback, below is fallback]*/
          REFRESH: "loading",
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
