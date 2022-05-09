import { createMachine, Interpreter, assign } from "xstate";

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
      type: "SEARCH";
    }
  | {
      type: "CLOSING";
    }
  | CaptchaEvent;

export type BlockchainState = {
  value:
    | "loading"
    | "ready"
    | "wishing"
    | "wished"
    | "captcha"
    | "searching"
    | "searched"
    | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

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

            return {
              state: well,
            };
          },
          onDone: {
            target: "ready",
            actions: assign({
              state: (_, event) => event.data.state,
            }),
          },
          onError: {
            target: "error",
          },
        },
      },
      ready: {
        on: {
          WISH: {
            target: "wishing",
          },
          SEARCH: {
            target: "captcha",
          },
        },
      },
      captcha: {
        on: {
          VERIFIED: {
            target: "searching",
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
      searching: {
        invoke: {
          src: async (context, event) => {
            console.log({ contextIs: context.state });
            const tokensToPull = Math.min(
              Number(context.state.lpTokens),
              Number(context.state.totalTokensInWell)
            );
            console.log({ tokensToPull });
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
            target: "searched",
          },
          onError: {
            target: "error",
            actions: "assignErrorMessage",
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
      searched: {
        type: "final",
      },
      error: {
        type: "final",
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
  {
    actions: {
      assignErrorMessage: assign<Context, any>({
        errorCode: (_context, event) => event.data.message,
      }),
    },
  }
);
