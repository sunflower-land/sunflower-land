import { createMachine, Interpreter, assign, DoneInvokeEvent } from "xstate";

import { metamask } from "lib/blockchain/metamask";
import { ERRORS } from "lib/errors";

import { WishingWellTokens, loadWishingWell } from "./actions/loadWishingWell";
import { collectFromWell } from "./actions/collectFromWell";

export interface Context {
  state: WishingWellTokens;
  errorCode?: keyof typeof ERRORS;
  farmId?: number;
  sessionId?: string;
  token?: string;
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
            const well = await loadWishingWell();

            return { state: well };
          },
          onDone: [
            {
              target: "noLiquidity",
              actions: assignWishingWellState,
              cond: (_, event: DoneInvokeEvent<WishingWellTokens>) =>
                Number(event.data.lpTokens) <= 0,
            },
            {
              target: "canWish",
              actions: assignWishingWellState,
              cond: (_, event: DoneInvokeEvent<WishingWellTokens>) =>
                event.data.myTokensInWell === "0",
            },
            {
              target: "waiting",
              actions: assignWishingWellState,
              cond: (_, event: DoneInvokeEvent<WishingWellTokens>) =>
                !!event.data.lockedTime,
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
            target: "granting",
          },
        },
      },
      wishing: {
        invoke: {
          src: async () => {
            await metamask.getWishingWell().wish();
          },
          onDone: {
            target: "wished",
          },
          onError: {
            target: "error",
          },
        },
      },
      granting: {
        invoke: {
          src: async (context, event) => {
            const tokensToPull = Math.min(
              Number(context.state.lpTokens),
              Number(context.state.totalTokensInWell)
            );

            console.log({ event });

            if (tokensToPull === 0) {
              throw new Error(ERRORS.NO_TOKENS);
            }

            await collectFromWell({
              farmId: context.farmId as number,
              sessionId: context.sessionId as string,
              amount: tokensToPull.toString(),
              token: context.token as string,
              captcha: (event as CaptchaEvent).captcha,
            });
          },
          onDone: {
            target: "granted",
          },
          onError: {
            target: "error",
            actions: assignErrorMessage,
          },
        },
      },
      wished: {
        on: {
          CLOSING: {
            target: "closed",
          },
        },
      },
      granted: {
        on: {
          CLOSING: {
            target: "closed",
          },
        },
      },
      searched: {
        // type: "final",
      },
      error: {
        // type: "final",
      },
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
  {}
);
