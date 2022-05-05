import { createMachine, Interpreter, assign } from "xstate";

import { metamask } from "lib/blockchain/metamask";

import { Context as AuthContext } from "features/auth/lib/authMachine";

import { WishingWellTokens, loadWishingWell } from "./actions/loadWishingWell";
import { collectFromWell } from "./actions/collectFromWell";

export interface Context {
  state: WishingWellTokens;
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

export const wishingWellMachine = (authContext: AuthContext) =>
  createMachine<Context, BlockchainEvent, BlockchainState>({
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
              state: (context, event) => event.data.state,
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

            await collectFromWell({
              farmId: authContext.farmId as number,
              sessionId: authContext.sessionId as string,
              amount: tokensToPull.toString(),
              token: authContext.rawToken as string,
              captcha: (event as CaptchaEvent).captcha,
            });
          },
          onDone: {
            target: "searched",
          },
          onError: {
            target: "error",
          },
        },
      },
      wished: {
        type: "final",
      },
      searched: {
        type: "final",
      },
      error: {
        type: "final",
      },
    },
  });
