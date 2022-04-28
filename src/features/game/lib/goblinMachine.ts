import { createMachine, Interpreter, assign } from "xstate";

import { Context as AuthContext } from "features/auth/lib/authMachine";

import { Inventory } from "../types/game";
import { EMPTY } from "./constants";
import { mint } from "../actions/mint";
import { LimitedItem } from "../types/craftables";
import { withdraw } from "../actions/withdraw";
import { ERRORS } from "lib/errors";

import Decimal from "decimal.js-light";
import { getOnChainState } from "../actions/visit";

type GoblinState = {
  balance: Decimal;
  inventory: Inventory;
};

export interface Context {
  state: GoblinState;
  sessionId?: string;
  errorCode?: keyof typeof ERRORS;
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
  value: "loading" | "minting" | "withdrawing" | "playing" | "error";
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
      state: {
        balance: new Decimal(0),
        inventory: {},
      },
    },
    states: {
      loading: {
        invoke: {
          src: async () => {
            const { game } = await getOnChainState({
              farmAddress: authContext.address as string,
              id: Number(authContext.farmId),
            });

            game.id = authContext.farmId as number;

            return { state: game };
          },
          onDone: {
            target: "playing",
            actions: assign({
              state: (_, event) => event.data.state,
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
            // TODO add a minted
            target: "withdrawn",
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
      error: {},
    },
  });
}
