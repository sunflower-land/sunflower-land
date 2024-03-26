import {
  createMachine,
  Interpreter,
  assign,
  DoneInvokeEvent,
  sendParent,
} from "xstate";

import { wallet } from "lib/blockchain/wallet";
import { ErrorCode } from "lib/errors";

import { WishingWellTokens, loadWishingWell } from "./actions/loadWishingWell";
import {
  collectFromWell,
  signCollectFromWell,
  SignedTransaction,
} from "./actions/collectFromWell";
import Decimal from "decimal.js-light";
import { reset } from "features/farming/hud/actions/reset";
import { fromWei } from "web3-utils";
import { loadSession } from "features/game/actions/loadSession";
import { randomID } from "lib/utils/random";
import { wish } from "lib/blockchain/WishingWell";

export interface Context {
  state: WishingWellTokens;
  errorCode?: ErrorCode;
  transactionId?: string;
  farmId?: number;
  bumpkinTokenUri?: string;
  sessionId?: string;
  token?: string;
  wallet?: string;
  balance?: Decimal;
  totalRewards?: Decimal;
  transaction?: SignedTransaction;
}

type CaptchaEvent = {
  type: "VERIFIED";
  captcha: string;
};

export type BlockchainEvent =
  | {
      type: "WISH";
    }
  | {
      type: "SEND";
    }
  | {
      type: "GRANT_WISH";
    }
  | {
      type: "CLOSING";
    }
  | CaptchaEvent;

export type BlockchainState = {
  value:
    | "loading"
    | "noLiquidity"
    | "canWish"
    | "waiting"
    | "readyToGrant"
    | "wishing"
    | "wished"
    | "captcha"
    | "signing"
    | "zeroTokens"
    | "granting"
    | "searched"
    | "granted"
    | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

const assignErrorMessage = assign<Context, any>({
  errorCode: (_context, event) => event.data.message,
});

const assignWishingWellState = assign<Context, any>({
  state: (_, event) => event.data.state,
});

const assignTotalRewards = assign<Context, any>({
  totalRewards: (_, event) => event.data.totalRewards,
});

export const wishingWellMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>(
  {
    id: "wishingWell",
    initial: "loading",
    context: {
      state: {
        canCollect: false,
        lpTokens: "0",
        myTokensInWell: "0",
        totalTokensInWell: "0",
        lockedTime: "",
        lockedPeriod: 0,
      },
    },
    states: {
      loading: {
        invoke: {
          src: async () => {
            if (!wallet.myAccount) throw new Error("No account");

            const well = await loadWishingWell(wallet.myAccount);

            return { state: well };
          },
          onDone: [
            {
              target: "noLiquidity",
              actions: assignWishingWellState,
              cond: (_, event: DoneInvokeEvent<Context>) =>
                Number(event.data.state.lpTokens) <= 0,
            },
            {
              target: "canWish",
              actions: assignWishingWellState,
              cond: (_, event: DoneInvokeEvent<Context>) =>
                event.data.state.myTokensInWell === "0",
            },
            {
              target: "waiting",
              actions: assignWishingWellState,
              cond: (_, event: DoneInvokeEvent<Context>) =>
                !!event.data.state.lockedTime,
            },
            {
              target: "readyToGrant",
              actions: assignWishingWellState,
            },
          ],
          onError: {
            target: "error",
          },
        },
      },
      noLiquidity: {},
      canWish: {
        on: {
          WISH: {
            target: "wishing",
          },
        },
      },
      wishing: {
        invoke: {
          src: async () => {
            if (!wallet.myAccount) throw new Error("No account");

            await wish(wallet.web3Provider, wallet.myAccount);
          },
          onDone: {
            target: "wished",
          },
          onError: {
            target: "error",
          },
        },
      },
      waiting: {},
      readyToGrant: {
        on: {
          GRANT_WISH: {
            target: "captcha",
          },
        },
      },
      captcha: {
        on: {
          VERIFIED: {
            target: "signing",
          },
        },
      },
      signing: {
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            const transaction = await signCollectFromWell({
              farmId: context.farmId as number,
              sessionId: context.sessionId as string,
              amount: context.state.myTokensInWell.toString(),
              token: context.token as string,
              captcha: (event as CaptchaEvent).captcha,
              transactionId: context.transactionId as string,
            });
            return { transaction };
          },
          onDone: [
            {
              target: "zeroTokens",
              cond: (_, event) => Number(event.data.transaction.tokens) === 0,
              actions: assign({
                transaction: (_, event) => event.data.transaction,
              }),
            },
            {
              target: "granting",
              actions: assign({
                transaction: (_, event) => event.data.transaction,
              }),
            },
          ],
        },
      },
      zeroTokens: {
        on: {
          WISH: {
            target: "wishing",
          },
        },
      },
      granting: {
        entry: "setTransactionId",
        invoke: {
          src: async (context) => {
            if (!wallet.myAccount) throw new Error("No account");

            // Collect from well and await receipt
            const receipt: any = await collectFromWell(
              wallet.myAccount,
              context.transaction as SignedTransaction
            );

            // Get reward amount from Rewarded event
            const reward = new Decimal(
              fromWei(receipt.events.Rewarded.returnValues[1])
            );

            // Rebase gamestate for player so the reward is added to the players balance off chain
            await reset({
              farmId: Number(context.farmId),
              token: context.token as string,
              fingerprint: "fingerprint",
              transactionId: context.transactionId as string,
            });

            // Reload the session to get the new refreshed balance
            const response = await loadSession({
              token: context.token as string,
              transactionId: context.transactionId as string,
            });

            const well = await loadWishingWell(wallet.myAccount);

            return {
              state: well,
              totalRewards: reward || new Decimal(0),
              newBalance: response?.game.balance,
            };
          },
          onDone: {
            target: "granted",
            actions: [
              assignWishingWellState,
              assignTotalRewards,
              // Update goblin machine balance
              sendParent((_, event) => ({
                type: "UPDATE_BALANCE",
                newBalance: event.data.newBalance,
              })),
            ],
          },
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      wished: {},
      granted: {},
      error: {},
      closed: {
        type: "final",
      },
    },
    on: {
      CLOSING: {
        target: "closed",
      },
    },
  },
  {
    actions: {
      setTransactionId: assign<Context, any>({
        transactionId: () => randomID(),
      }),
    },
  }
);
