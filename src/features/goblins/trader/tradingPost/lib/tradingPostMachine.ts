import { assign, createMachine, Interpreter, sendParent } from "xstate";

import { FarmSlot, ItemLimits } from "lib/blockchain/Trader";
import { InventoryItemName } from "features/game/types/game";

import { loadTradingPost } from "./actions/loadTradingPost";
import { sellingMachine } from "../../selling/lib/sellingMachine";
import { buyingMachine } from "../../buying/lib/buyingMachine";
import { loadUpdatedSession } from "./actions/loadUpdatedSession";

export interface Cancel {
  listingId: number;
  resourceName: InventoryItemName;
  resourceAmount: number;
}

export interface Context {
  farmId: number;
  farmAddress: string;
  token: string;
  farmSlots: FarmSlot[];
  remainingListings: number;
  freeListings: number;
  itemLimits: ItemLimits;
}

export type BlockchainEvent =
  | { type: "CLOSE" }
  | { type: "BUY" }
  | { type: "SELL" };

export type BlockchainState = {
  value: "loading" | "trading" | "updatingSession" | "error";
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
          return await loadTradingPost(context.farmId, context.farmAddress);
        },
        onDone: {
          target: "trading",
          actions: [
            assign((_, event) => ({
              farmSlots: event.data.farmSlots,
              remainingListings: event.data.remainingListings,
              freeListings: event.data.freeListings,
              itemLimits: event.data.itemLimits,
            })),
          ],
        },
        onError: {
          target: "error",
        },
      },
    },
    trading: {
      type: "parallel",
      states: {
        selling: {
          invoke: {
            id: "selling",
            autoForward: true,
            src: sellingMachine,
            data: {
              farmId: (context: Context) => context.farmId,
              token: (context: Context) => context.token,
            },
          },
        },
        buying: {
          invoke: {
            id: "buying",
            autoForward: true,
            src: buyingMachine,
            data: {
              farmId: (context: Context) => context.farmId,
              token: (context: Context) => context.token,
            },
          },
        },
      },
      onDone: {
        target: "#updatingSession",
      },
    },

    updatingSession: {
      id: "updatingSession",
      invoke: {
        src: async (context) => {
          return loadUpdatedSession(
            context.farmId,
            context.farmAddress,
            context.token
          );
        },
        onError: {
          target: "error",
        },
        onDone: {
          target: "loading",
          actions: [
            sendParent((_, event) => ({
              type: "UPDATE_SESSION",
              inventory: event.data.inventory,
              sessionId: event.data.sessionId,
            })),
          ],
        },
      },
    },
    error: {
      id: "error",
    },
    closed: {
      type: "final",
    },
  },
  on: {
    CLOSE: {
      target: "closed",
    },
    // BUY: {
    //   target: "trading.buying",
    // },
    // SELL: {
    //   target: "trading.selling",
    // },
  },
});
