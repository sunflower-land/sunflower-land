import { assign, createMachine, Interpreter } from "xstate";

import { FarmSlot, Listing } from "lib/blockchain/Trader";
import { loadFarmSlots } from "./actions/loadFarm";
import { purchase } from "./actions/purchase";

interface Context {
  farmId: number;
  token: string;

  visitingFarmId: number;
  vistingFarmSlots: FarmSlot[];
  purchasingListing: Listing;
}

type BlockchainEvent =
  | { type: "LOAD_FARM"; farmId: number }
  | { type: "PURCHASE"; listing: Listing }
  | { type: "BACK" }
  | { type: "CONFIRM" };

type BlockchainState = {
  value: "idle" | "loadingFarm" | "purchasing" | "postingPurchase";
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
            target: "purchasing",
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
              vistingFarmSlots: event.data.farmSlots,
            })),
          },
        },
      },
      purchasing: {
        on: {
          BACK: { target: "idle" },
          CONFIRM: { target: "postingPurchase" },
        },
      },
      postingPurchase: {
        invoke: {
          src: async (context) => {
            await purchase({
              listingId: context.purchasingListing.id,
              sfl: context.purchasingListing.sfl,
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
