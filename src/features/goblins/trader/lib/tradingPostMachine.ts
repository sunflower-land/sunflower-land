import { assign, createMachine, Interpreter } from "xstate";

import { FarmSlot } from "lib/blockchain/Trader";
import { InventoryItemName } from "features/game/types/game";

import { loadTradingPost } from "./actions/loadTradingPost";
import { list } from "./actions/list";

export interface Draft {
  resourceName: InventoryItemName;
  resourceAmount: number;
  sfl: number;
}

export interface Context {
  farmId: number;
  token: string;
  tax: string;
  farmSlots?: FarmSlot[];
  draft: Draft;
}

export type BlockchainEvent =
  | {
      type: "LIST";
      draft: Draft;
    }
  | { type: "DRAFT" }
  | { type: "CANCEL" }
  | { type: "POST" };

export type BlockchainState = {
  value: "loading" | "idle" | "drafting" | "confirming" | "posting" | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export const tradingPostMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>({
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: async (context) => {
          const farmSlots = await loadTradingPost(context.farmId);
          return { farmSlots };
        },
        onDone: {
          target: "idle",
          actions: assign((_, event) => ({
            farmSlots: event.data.farmSlots,
          })),
        },
        onError: {
          target: "error",
        },
      },
    },
    idle: {
      on: {
        DRAFT: {
          target: "drafting",
        },
      },
    },
    drafting: {
      on: {
        LIST: {
          target: "confirming",
          actions: assign((_, event) => ({
            draft: event.draft,
          })),
        },
        CANCEL: {
          target: "idle",
        },
      },
    },
    confirming: {
      on: {
        POST: {
          target: "posting",
        },
        CANCEL: {
          target: "drafting",
        },
      },
    },
    posting: {
      invoke: {
        src: async (context) => {
          await list({
            draft: context.draft,
            farmId: context.farmId,
            token: context.token,
          });
        },
        onError: {
          target: "error",
        },
        onDone: {
          target: "loading",
        },
      },
    },
    error: {},
  },
});
