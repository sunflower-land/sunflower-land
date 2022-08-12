import { assign, createMachine, Interpreter, sendParent } from "xstate";

import { FarmSlot, Listing } from "lib/blockchain/Trader";
import { loadFarmSlots } from "./actions/loadFarm";

interface Context {
  farmId: number;
  token: string;

  visitingFarmId: number;
  visitingFarmSlots: FarmSlot[];
  purchasingListing: Listing;
}

type BlockchainEvent =
  | { type: "LOAD_FARM"; farmId: number }
  | { type: "PURCHASE"; listing: Listing }
  | { type: "BACK" }
  | { type: "CONFIRM" };

type BlockchainState = {
  value: "idle" | "loadingFarm" | "confirming";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export const buyingMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>(
  {
    initial: "idle",
    states: {
      idle: {
        on: {
          LOAD_FARM: {
            target: "loadingFarm",
            actions: assign((_, event) => ({
              visitingFarmId: event.farmId,
            })),
          },
          PURCHASE: {
            target: "confirming",
            actions: assign((_, event) => ({
              purchasingListing: event.listing,
            })),
          },
        },
      },
      loadingFarm: {
        invoke: {
          src: async (context) => {
            return context.visitingFarmId
              ? await loadFarmSlots(context.visitingFarmId)
              : { farmSlots: [] };
          },
          onDone: {
            target: "idle",
            actions: assign((_, event) => ({
              visitingFarmSlots: event.data.farmSlots,
            })),
          },
        },
      },
      confirming: {
        on: {
          BACK: { target: "idle" },
          CONFIRM: {
            actions: sendParent((context) => ({
              type: "PURCHASE",
              listingId: context.purchasingListing.id,
              sfl: context.purchasingListing.sfl,
            })),
          },
        },
      },
    },
  },
  {}
);
