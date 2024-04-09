import { createMachine, Interpreter, assign, sendParent } from "xstate";

import { InventoryItemName } from "features/game/types/game";

import { Listing } from "lib/blockchain/Trader";

export interface Draft {
  resourceName: InventoryItemName;
  resourceAmount: number;
  sfl: number;
}

interface Context {
  farmId: number;
  token: string;

  draftingSlotId: number;
  draft: Draft;

  cancellingListing: Listing;
}

type BlockchainEvent =
  | { type: "CANCEL_LISTING"; listing: Listing }
  | { type: "UPDATE_DRAFT"; slotId: number; draft: Draft }
  | { type: "CONFIRM" }
  | { type: "BACK" };

type BlockchainState = {
  value: "idle" | "drafting" | "confirming" | "cancelling";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export const sellingMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>(
  {
    initial: "idle",
    states: {
      idle: {
        on: {
          CANCEL_LISTING: {
            target: "cancelling",
            actions: assign((_, event) => ({
              cancellingListing: event.listing,
            })),
          },
        },
      },
      cancelling: {
        on: {
          BACK: { target: "idle" },
          CONFIRM: {
            actions: sendParent((context) => ({
              type: "CANCEL",
              listingId: context.cancellingListing.id,
            })),
          },
        },
      },
      exit: {
        type: "final",
      },
    },
  },
  {}
);
