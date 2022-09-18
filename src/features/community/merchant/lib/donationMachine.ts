import { createMachine, Interpreter, assign } from "xstate";

import { communityContracts } from "features/community/lib/communityContracts";

import { ErrorCode } from "lib/errors";
import { CONFIG } from "lib/config";

const frogDonationAddress = CONFIG.FROG_DONATION;

export interface Context {
  hasDonated: boolean;
  errorCode?: ErrorCode;
}

type DonateEvent = {
  type: "DONATE";
  donation: number;
  to?: string;
};

type Event = DonateEvent | { type: "BOTTLE_CLICK" } | { type: "CLOSE" };

export type DonationState = {
  value: "idle" | "floating" | "donating" | "donated" | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  Event,
  DonationState
>;

const assignErrorMessage = assign<Context, any>({
  errorCode: (_: Context, event: any) => event.data.message,
});

export const donationMachine = createMachine<Context, Event, DonationState>({
  id: "donation",
  initial: "idle",
  context: {
    hasDonated: false,
  },
  states: {
    idle: {
      on: {
        BOTTLE_CLICK: {
          target: "floating",
        },
      },
    },
    floating: {
      on: {
        DONATE: {
          target: "donating",
        },
        CLOSE: {
          target: "idle",
        },
      },
    },
    donating: {
      invoke: {
        src: async (_context: Context, event: any): Promise<void> => {
          const { donation } = event as DonateEvent;

          await communityContracts.donate(donation, frogDonationAddress);
        },
        onDone: {
          target: "donated",
          actions: assign({ hasDonated: (_context, _event) => true }),
        },
        onError: {
          target: "error",
          actions: assignErrorMessage,
        },
      },
    },
    donated: {
      after: {
        1000: {
          target: "idle",
        },
      },
    },
    error: {},
  },
});
