import { assign, createMachine, Interpreter } from "xstate";

import { FarmSlot } from "lib/blockchain/Trader";
import { InventoryItemName } from "features/game/types/game";

import { loadTradingPost } from "./actions/loadTradingPost";
import { list } from "./actions/list";
import { cancel } from "./actions/cancel";

export interface Draft {
  slotId: number;
  resourceName: InventoryItemName;
  resourceAmount: number;
  sfl: number;
}

export interface Cancel {
  listingId: number;
  resourceName: InventoryItemName;
  resourceAmount: number;
}

export interface Context {
  farmId: number;
  token: string;
  tax: string;
  farmSlots?: FarmSlot[];
  slotId: number;
  draft: Draft;
  cancel: Cancel;
}

export type BlockchainEvent =
  | {
      type: "LIST";
      draft: Draft;
    }
  | { type: "DRAFT"; slotId: number }
  | { type: "CANCEL" }
  | { type: "CANCEL_LISTING"; cancel: Cancel }
  | { type: "BACK" }
  | {
      type: "CONFIRM";
    }
  | { type: "POST" };

export type BlockchainState = {
  value:
    | "loading"
    | "idle"
    | "drafting"
    | "confirming"
    | "posting"
    | "confirmingCancel"
    | "cancelling"
    | "error";
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
          actions: assign((_, event) => ({
            slotId: event.slotId,
          })),
        },
        CANCEL_LISTING: {
          target: "confirmingCancel",
          actions: assign((_, event) => ({
            cancel: event.cancel,
          })),
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
            slotId: context.slotId,
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
    confirmingCancel: {
      on: {
        BACK: {
          target: "idle",
        },
        CONFIRM: {
          target: "cancelling",
        },
      },
    },
    cancelling: {
      invoke: {
        src: async (context) => {
          await cancel({
            listingId: context.cancel.listingId,
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
