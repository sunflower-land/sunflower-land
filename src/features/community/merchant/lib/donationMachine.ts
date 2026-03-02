import { createMachine, assign, fromPromise, ActorRefFrom } from "xstate";

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
  to?: `0x${string}`;
};

type Event = DonateEvent | { type: "BOTTLE_CLICK" } | { type: "CLOSE" };

export type DonationState = {
  value: "idle" | "floating" | "donating" | "donated" | "error" | "confirming";
  context: Context;
};

export const donationMachine = createMachine({
  types: {} as {
    context: Context;
    events: Event;
  },
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
        src: fromPromise(async ({ input }: { input: DonateEvent }) => {
          await wallet.donate(
            input.donation,
            input.to || (frogDonationAddress as `0x${string}`),
          );
        }),
        input: ({ event }) => event as DonateEvent,
        onDone: {
          target: "donated",
          actions: assign({ hasDonated: () => true }),
        },
        onError: {
          target: "error",
          actions: assign({
            errorCode: ({ event }) =>
              (event as any).error?.message as ErrorCode,
          }),
        },
      },
    },
    donated: {},
    error: {},
  },
});

export type MachineInterpreter = ActorRefFrom<typeof donationMachine>;
