import { assign, createMachine, Interpreter, sendParent } from "xstate";

import { FarmSlot, ItemLimits } from "lib/blockchain/Trader";
import { GameState, InventoryItemName } from "features/game/types/game";

import { loadTradingPost } from "./actions/loadTradingPost";
import { list } from "./actions/list";
import { cancel } from "./actions/cancel";
import { loadSession } from "features/game/actions/loadSession";
import { metamask } from "lib/blockchain/metamask";
import { getLowestGameState } from "features/game/lib/transforms";
import { getOnChainState } from "features/game/actions/onchain";

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
  farmAddress: string;
  token: string;
  tax: string;
  farmSlots?: FarmSlot[];
  remainingListings: number;
  freeListings: number;
  itemLimits: ItemLimits;

  // State
  slotId: number;
  draft: Draft;
  cancel: Cancel;
}

export type BlockchainEvent =
  | {
      type: "BUY";
    }
  | { type: "SELL" }
  | { type: "DRAFT"; slotId: number }
  | {
      type: "LIST";
      draft: Draft;
    }
  | { type: "CANCEL_LISTING"; cancel: Cancel }
  | { type: "BACK" }
  | {
      type: "CONFIRM";
    }
  | { type: "POST" }
  | { type: "CLOSING" };

export type BlockchainState = {
  value:
    | "loading"
    | "buying"
    | { selling: "idle" }
    | { selling: "drafting" }
    | { selling: "confirming" }
    | { selling: "posting" }
    | { selling: "cancelling" }
    | { selling: "confirmingCancel" }
    | "updateSession"
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
          return await loadTradingPost(context.farmId, context.farmAddress);
        },
        onDone: {
          target: "selling",
          actions: assign((_, event) => ({
            farmSlots: event.data.farmSlots,
            remainingListings: event.data.remainingListings,
            freeListings: event.data.freeListings,
            itemLimits: event.data.itemLimits,
          })),
        },
        onError: {
          target: "error",
        },
      },
    },
    buying: {},
    selling: {
      initial: "idle",
      states: {
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
            BACK: {
              target: "idle",
            },
            LIST: {
              target: "confirming",
              actions: assign((_, event) => ({
                draft: event.draft,
              })),
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
              target: "#error",
            },
            onDone: {
              target: "#updateSession",
            },
          },
        },
        confirming: {
          on: {
            POST: {
              target: "posting",
            },
            BACK: {
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
              target: "#error",
            },
            onDone: {
              target: "#updateSession",
            },
          },
        },
      },
    },
    updateSession: {
      id: "updateSession",
      invoke: {
        src: async (context) => {
          const onChainState = await getOnChainState({
            farmAddress: context.farmAddress,
            id: context.farmId,
          });

          const sessionId = await metamask
            .getSessionManager()
            .getSessionId(context.farmId);

          const response = await loadSession({
            farmId: context.farmId,
            sessionId,
            token: context.token,
          });

          const game = response?.game as GameState;

          // Show whatever is lower, on chain or offchain
          const availableState = getLowestGameState({
            first: onChainState.game,
            second: game,
          });

          return { inventory: availableState.inventory, sessionId };
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
    CLOSING: {
      target: "closed",
    },
    BUY: {
      target: "buying",
    },
    SELL: {
      target: "selling",
    },
  },
});
