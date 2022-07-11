import { createMachine, Interpreter, assign } from "xstate";

import { InventoryItemName } from "features/game/types/game";

import { cancel } from "./actions/cancel";
import { list } from "./actions/list";
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
  | { type: "DRAFT_LISTING"; slotId: number }
  | { type: "UPDATE_DRAFT"; slotId: number; draft: Draft }
  | { type: "CONFIRM" }
  | { type: "BACK" };

type BlockchainState = {
  value:
    | "idle"
    | "drafting"
    | "confirming"
    | "cancelling"
    | "postingListing"
    | "postingCancellation";
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
          DRAFT_LISTING: {
            target: "drafting",
            actions: assign((_, event) => ({
              draftingSlotId: event.slotId,
            })),
          },
          CANCEL_LISTING: {
            target: "cancelling",
            actions: assign((_, event) => ({
              cancellingListing: event.listing,
            })),
          },
        },
      },
      drafting: {
        on: {
          BACK: { target: "idle" },
          CONFIRM: { target: "confirming" },
          UPDATE_DRAFT: {
            actions: assign((_, event) => ({
              draftingSlotId: event.slotId,
              draft: event.draft,
            })),
          },
        },
      },
      confirming: {
        on: {
          BACK: { target: "drafting" },
          CONFIRM: { target: "postingListing" },
        },
      },
      cancelling: {
        on: {
          BACK: { target: "idle" },
          CONFIRM: { target: "postingCancellation" },
        },
      },
      postingListing: {
        invoke: {
          src: async (context) => {
            await list({
              slotId: context.draftingSlotId,
              draft: context.draft,
              farmId: context.farmId,
              token: context.token,
            });
          },
          onDone: {
            target: "exit",
          },
        },
      },
      postingCancellation: {
        invoke: {
          src: async (context) => {
            await cancel({
              listingId: context.cancellingListing.id,
              farmId: context.farmId,
              token: context.token,
            });
          },
          onDone: {
            target: "exit",
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

// initial: "idle",
//       states: {
//         idle: {
//           on: {
//             DRAFT: {
//               target: "drafting",
// actions: assign((_, event) => ({
//   slotId: event.slotId,
// })),
//             },
//             CANCEL_LISTING: {
//               target: "confirmingCancel",
//               actions: assign((_, event) => ({
//                 cancel: event.cancel,
//               })),
//             },
//           },
//         },
//         drafting: {
//           on: {
//             BACK: {
//               target: "idle",
//             },
//             LIST: {
//               target: "confirming",
//               actions: assign((_, event) => ({
//                 draft: event.draft,
//               })),
//             },
//           },
//         },
//         confirmingCancel: {
//           on: {
//             BACK: {
//               target: "idle",
//             },
//             CONFIRM: {
//               target: "cancelling",
//             },
//           },
//         },
//         cancelling: {
//
//         },
//         confirming: {
//           on: {
//             POST: {
//               target: "posting",
//             },
//             BACK: {
//               target: "drafting",
//             },
//           },
//         },
//         posting: {
//
//           },
//         },
//       },
