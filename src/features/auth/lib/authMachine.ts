import { ERRORS } from "lib/errors";
import { createMachine, Interpreter, interpret, assign, actions } from "xstate";

import { metamask } from "../../../lib/blockchain/metamask";
import { createFarm } from "../actions/createFarm";
import { CharityAddress } from "../components/Donation";

export interface Context {
  errorCode?: keyof typeof ERRORS;
  farmId?: number;
  sessionId?: string;
  signature?: string;
  hash?: string;
}

type StartEvent = {
  type: "START";
  farmId: number;
  sessionId: string;
};

type VisitEvent = {
  type: "VISIT";
  farmId: number;
};

type CreateFarmEvent = {
  type: "CREATING_FARM";
  charityAddress: CharityAddress;
  donation: number;
};

export type BlockchainEvent =
  | StartEvent
  | VisitEvent
  | {
      type: "NETWORK_CHANGED";
    }
  | {
      type: "LOADING_FARMS";
    }
  | {
      type: "NO_FARMS";
    }
  | {
      type: "ACCOUNT_CHANGED";
    }
  | CreateFarmEvent
  | {
      type: "FARMS_LOADED";
    }
  | {
      type: "REFRESH";
    };

export type BlockchainState = {
  value:
    | "connecting"
    | "creating"
    | "loadingFarms"
    | "ready"
    | "signing"
    | "registering"
    | "authorising"
    | "authorised"
    | "visiting"
    | "unauthorised";
  context: Context;
};

const API_URL = import.meta.env.VITE_API_URL;

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export const authMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>({
  id: "farmMachine",
  initial: API_URL ? "connecting" : "visiting",
  //initial: "visiting",
  context: {},
  states: {
    connecting: {
      invoke: {
        src: async () => {
          await metamask.initialise();
        },
        onDone: "ready",
        onError: {
          target: "unauthorised",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    ready: {
      on: {
        LOADING_FARMS: {
          target: "loadingFarms",
        },
        START: {
          target: "signing",
        },
        VISIT: {
          target: "visiting",
          actions: assign({
            farmId: (context, event) => event.farmId,
          }),
        },
        CREATING_FARM: {
          target: "creating",
        },
        ACCOUNT_CHANGED: {
          target: "connecting",
        },
        NETWORK_CHANGED: {
          target: "connecting",
        },
      },
    },

    creating: {
      invoke: {
        src: async (context, event) => {
          const charityAddress = (event as CreateFarmEvent)
            .charityAddress as CharityAddress;
          const donation = (event as CreateFarmEvent).donation as number;

          await createFarm(charityAddress, donation);
        },
        onDone: "loadingFarms",
        onError: {
          target: "unauthorised",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },

    loadingFarms: {
      on: {
        FARMS_LOADED: {
          target: "ready",
        },
      },
    },

    signing: {
      invoke: {
        src: async (context, event) => {
          // Sign transaction -
          const { signature, hash } = await metamask.signTransaction(
            ((event as StartEvent).farmId as number).toString()
          );

          return {
            signature,
            hash,
            farmId: (event as StartEvent).farmId,
            sessionId: (event as StartEvent).sessionId,
          };
        },
        onDone: {
          target: "authorised",
          actions: assign({
            signature: (_, event) => event.data.signature,
            hash: (_, event) => event.data.hash,
            farmId: (_, event) => event.data.farmId,
            sessionId: (_, event) => event.data.sessionId,
          }),
        },
        onError: {
          target: "unauthorised",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },

    registering: {
      on: {
        ACCOUNT_CHANGED: {
          target: "connecting",
        },
        NETWORK_CHANGED: {
          target: "connecting",
        },
      },
    },

    authorised: {
      on: {
        ACCOUNT_CHANGED: {
          target: "connecting",
        },
        NETWORK_CHANGED: {
          target: "connecting",
        },
        REFRESH: {
          target: "connecting",
        },
      },
    },

    // An anonymous user is visiting a farm
    visiting: {},

    unauthorised: {
      on: {
        ACCOUNT_CHANGED: {
          target: "connecting",
        },
        NETWORK_CHANGED: {
          target: "connecting",
        },
      },
    },
  },
});
