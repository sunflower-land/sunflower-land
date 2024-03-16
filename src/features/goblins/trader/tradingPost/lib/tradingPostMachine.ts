import { assign, createMachine, Interpreter, sendParent } from "xstate";

import { FarmSlot, ItemLimits } from "lib/blockchain/Trader";
import { InventoryItemName } from "features/game/types/game";

import { loadTradingPost } from "./actions/loadTradingPost";
import { sellingMachine } from "../../selling/lib/sellingMachine";
import { buyingMachine } from "../../buying/lib/buyingMachine";
import { loadUpdatedSession } from "./actions/loadUpdatedSession";
import { purchase } from "./actions/purchase";
import { cancel } from "./actions/cancel";
import { escalate } from "xstate/lib/actions";
import { randomID } from "lib/utils/random";
import { wallet } from "lib/blockchain/wallet";

export interface Cancel {
  listingId: number;
  resourceName: InventoryItemName;
  resourceAmount: number;
}

export interface Context {
  farmId: number;
  farmAddress: string;
  token: string;
  wallet: string;
  deviceTrackerId: string;
  farmSlots: FarmSlot[];
  remainingListings: number;
  freeListings: number;
  itemLimits: ItemLimits;
  transactionId?: string;
}

type CancelEvent = {
  type: "CANCEL";
  listingId: number;
};
type PurchaseEvent = {
  type: "PURCHASE";
  sfl: number;
  listingId: number;
};
export type BlockchainEvent = { type: "CLOSE" } | CancelEvent | PurchaseEvent;

export type BlockchainState = {
  value:
    | "loading"
    | "trading"
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
>(
  {
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
      cancelling: {
        id: "cancelling",
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            if (!wallet.myAccount) throw new Error("No account");

            await cancel({
              listingId: (event as CancelEvent).listingId,
              farmId: context.farmId,
              token: context.token,
              transactionId: context.transactionId as string,
              account: wallet.myAccount,
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
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            if (!wallet.myAccount) throw new Error("No account");

            await purchase({
              listingId: (event as PurchaseEvent).listingId,
              sfl: (event as PurchaseEvent).sfl,
              farmId: context.farmId,
              token: context.token,
              deviceTrackerId: context.deviceTrackerId,
              transactionId: context.transactionId as string,
              account: wallet.myAccount,
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
        entry: "setTransactionId",
        invoke: {
          src: async (context) => {
            if (!wallet.myAccount) throw new Error("No account");

            return loadUpdatedSession(
              context.farmId,
              wallet.myAccount,
              context.farmAddress,
              context.token,
              context.transactionId as string,
              context.wallet
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
                deviceTrackerId: event.data.deviceTrackerId,
              })),
              assign((_, event) => ({
                deviceTrackerId: event.data.deviceTrackerId,
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
  },
  {
    actions: {
      setTransactionId: assign<Context, any>({
        transactionId: () => randomID(),
      }),
    },
  }
);
