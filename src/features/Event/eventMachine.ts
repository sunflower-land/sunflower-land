import { createMachine, Interpreter, assign, TransitionsConfig } from "xstate";

import { metamask } from "lib/blockchain/metamask";

import { WishingWellTokens, loadEvent } from "./actions/loadEvent";

export interface Context {
  state: WishingWellTokens;
}

export type BlockchainEvent =
  | {
      type: "THROW";
    }
  | {
      type: "APPROVE";
    }
  | {
      type: "SEND";
    }
  | {
      type: "SEARCH";
    }
  | {
      type: "WITHDRAW";
    };

export type BlockchainState = {
  value:
    | "loading"
    | "ready"
    | "throwing"
    | "approving"
    | "approved"
    | "depositing"
    | "thrown"
    | "withdrawing"
    | "withdrawn"
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

export const eventMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>({
  id: "event",
  initial: "loading",
  context: {
    state: {
      canCollect: false,
      lpTokens: "0",
      myTokensInWell: "0",
      totalTokensInWell: "0",
      lockedTime: "",
    },
  },
  states: {
    loading: {
      invoke: {
        src: async () => {
          const well = await loadEvent();

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
        THROW: {
          target: "throwing",
        },
        SEARCH: {
          target: "searching",
        },
        WITHDRAW: {
          target: "withdrawing",
        },
      },
    },
    throwing: {
      on: {
        APPROVE: {
          target: "approving",
        },
      },
    },
    approving: {
      invoke: {
        src: async (context) => {
          // Approve all
          const amount = context.state.lpTokens.toString();
          await metamask.getPair().approve(amount);
        },
        onDone: {
          target: "approved",
        },
        onError: {
          target: "error",
        },
      },
    },
    approved: {
      on: {
        SEND: {
          target: "depositing",
        },
      },
    },
    depositing: {
      invoke: {
        src: async (context) => {
          const amount = context.state.lpTokens.toString();
          // Approve all
          await metamask.getWishingWell().throwTokens(amount);
        },
        onDone: {
          target: "thrown",
        },
        onError: {
          target: "error",
        },
      },
    },
    searching: {
      invoke: {
        src: async () => {
          await metamask.getWishingWell().collectFromWell();
        },
        onDone: {
          target: "searched",
        },
        onError: {
          target: "error",
        },
      },
    },
    withdrawing: {
      invoke: {
        src: async (context) => {
          console.log("WITHDRAW IT!");
          // Take out all tokens
          const amount = context.state.myTokensInWell.toString();
          await metamask.getWishingWell().takeOut(amount);
        },
        onDone: {
          target: "withdrawn",
        },
        onError: {
          target: "error",
        },
      },
    },
    thrown: {
      type: "final",
    },
    withdrawn: {
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
