import { assign, createMachine, Interpreter, sendParent } from "xstate";

import { FarmSlot, ItemLimits } from "lib/blockchain/Trader";
import { InventoryItemName } from "features/game/types/game";

import { loadTradingPost } from "./actions/loadTradingPost";
import { Draft, sellingMachine } from "../../selling/lib/sellingMachine";
import { buyingMachine } from "../../buying/lib/buyingMachine";
import { loadUpdatedSession } from "./actions/loadUpdatedSession";
import { purchase } from "./actions/purchase";
import { list } from "./actions/list";
import { cancel } from "./actions/cancel";
import { escalate } from "xstate/lib/actions";

export interface Cancel {
  listingId: number;
  resourceName: InventoryItemName;
  resourceAmount: number;
}

export interface Context {
  farmId: number;
  farmAddress: string;
  token: string;
  deviceTrackerId: string;
  farmSlots: FarmSlot[];
  remainingListings: number;
  freeListings: number;
  itemLimits: ItemLimits;
}

type ListEvent = {
  type: "LIST";
  slotId: number;
  draft: Draft;
};
type CancelEvent = {
  type: "CANCEL";
  listingId: number;
};
type PurchaseEvent = {
  type: "PURCHASE";
  sfl: number;
  listingId: number;
};
export type BlockchainEvent =
  | { type: "CLOSE" }
  | ListEvent
  | CancelEvent
  | PurchaseEvent;

export type BlockchainState = {
  value:
    | "loading"
    | "trading"
    | "listing"
    | "cancelling"
    | "purchasing"
    | "updatingSession";
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
          actions: escalate((_, event) => ({
            message: event.data.message,
          })),
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
          on: {
            LIST: {
              target: "#listing",
            },
            CANCEL: {
              target: "#cancelling",
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
          on: {
            PURCHASE: {
              target: "#purchasing",
            },
          },
        },
      },
      onDone: {
        target: "#updatingSession",
      },
    },
    listing: {
      id: "listing",
      invoke: {
        src: async (context, event) => {
          await list({
            slotId: (event as ListEvent).slotId,
            draft: (event as ListEvent).draft,
            farmId: context.farmId,
            token: context.token,
          });
        },
        onDone: {
          target: "updatingSession",
        },
        onError: {
          actions: escalate((_, event) => ({
            message: event.data.message,
          })),
        },
      },
    },
    cancelling: {
      id: "cancelling",
      invoke: {
        src: async (context, event) => {
          await cancel({
            listingId: (event as CancelEvent).listingId,
            farmId: context.farmId,
            token: context.token,
          });
        },
        onDone: {
          target: "updatingSession",
        },
        onError: {
          actions: escalate((_, event) => ({
            message: event.data.message,
          })),
        },
      },
    },
    purchasing: {
      id: "purchasing",
      invoke: {
        src: async (context, event) => {
          await purchase({
            listingId: (event as PurchaseEvent).listingId,
            sfl: (event as PurchaseEvent).sfl,
            farmId: context.farmId,
            token: context.token,
            deviceTrackerId: context.deviceTrackerId,
          });
        },
        onDone: {
          target: "updatingSession",
        },
        onError: {
          actions: escalate((_, event) => ({
            message: event.data.message,
          })),
        },
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
        onDone: {
          target: "loading",
          actions: [
            sendParent((_, event) => ({
              type: "UPDATE_SESSION",
              inventory: event.data.inventory,
              balance: event.data.balance,
              sessionId: event.data.sessionId,
            })),
          ],
        },
        onError: {
          actions: escalate((_, event) => ({
            message: event.data.message,
          })),
        },
      },
    },
    closed: {
      type: "final",
    },
  },
  on: {
    CLOSE: {
      target: "closed",
    },
  },
});
