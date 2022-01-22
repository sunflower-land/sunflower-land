import { ERRORS } from "lib/errors";
import { createMachine, Interpreter, interpret, assign } from "xstate";

import { metamask } from "../../../lib/blockchain/metamask";

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

export type BlockchainEvent =
  | StartEvent
  | VisitEvent
  | {
      type: "NETWORK_CHANGED";
    }
  | {
      type: "ACCOUNT_CHANGED";
    }
  | {
      type: "CREATE_FARM";
    };

export type BlockchainState = {
  value:
    | "connecting"
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
        START: {
          target: "signing",
        },
        VISIT: {
          target: "visiting",
          actions: assign({
            farmId: (context, event) => event.farmId,
          }),
        },
        CREATE_FARM: {
          target: "registering",
        },
        ACCOUNT_CHANGED: {
          target: "connecting",
        },
        NETWORK_CHANGED: {
          target: "connecting",
        },
      },
    },

    signing: {
      invoke: {
        src: async (context, event) => {
          console.log({ event });
          // Sign transaction -
          const { signature, hash } = await metamask.signTransaction(
            ((event as StartEvent).farmId as number).toString()
          );
          console.log({ signature, hash });

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
