import { createMachine, Interpreter, assign } from "xstate";

import { ErrorCode } from "lib/errors";
import { CONFIG } from "lib/config";
import { wallet } from "lib/blockchain/wallet";

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
  value: "idle" | "floating" | "donating" | "donated" | "error" | "confirming";
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
        DONATE: {
          target: "confirming",
        },
      },
    },
    floating: {
      on: {
        DONATE: {
          target: "confirming",
        },
        CLOSE: {
          target: "idle",
        },
      },
    },
    confirming: {
      on: {
        DONATE: {
          target: "donating",
        },
      },
    },
    donating: {
      invoke: {
        src: async (_context: Context, event: any): Promise<void> => {
          const { donation, to } = event as DonateEvent;

          await wallet.donate(donation, to || frogDonationAddress);
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
    donated: {},
    error: {},
  },
});
