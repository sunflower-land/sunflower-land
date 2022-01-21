import { ERRORS } from "lib/errors";
import { getSignedAddress, saveSignedAddress } from "lib/session/localStorage";
import { createMachine, Interpreter, interpret, assign } from "xstate";

import { metamask } from "../../../lib/blockchain/metamask";

export interface Context {
  errorCode?: keyof typeof ERRORS;
}

export type BlockchainEvent =
  | {
      type: "SIGN";
    }
  | {
      type: "NETWORK_CHANGED";
    }
  | {
      type: "ACCOUNT_CHANGED";
    };

export type BlockchainState = {
  value:
    | "connecting"
    | "ready"
    | "signing"
    | "authorising"
    | "authorised"
    | "unauthorised";
  context: Context;
};

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
  initial: "connecting",
  //initial: "authorised",
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
        SIGN: {
          target: "signing",
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
        src: async () => {
          /**
           * TODO: Screen to let them select a farm
           * For now, let's assume it is the first ID
           */
          const tokenIds = await metamask.getFarm()?.getFarmIds();
          console.log({ tokenIds });
          if (tokenIds?.length === 0) {
            throw new Error("NO_FARM");
          }

          const farmId = tokenIds[0];

          // Already signed
          if (getSignedAddress()) {
            return;
          }

          // Sign transaction -
          const signedAddress = await metamask.signTransaction(
            farmId.toString()
          );
          saveSignedAddress(signedAddress);
        },
        onDone: "authorising",
        onError: {
          target: "unauthorised",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
        },
      },
    },
    authorising: {
      invoke: {
        src: async () => {
          // TODO - in the future, check the new NFT contract address
          const hasFarm = await metamask.getLegacyFarm()?.hasFarm();

          if (!hasFarm) {
            throw new Error(ERRORS.NO_FARM);
          }

          return true;
        },
        onDone: "authorised",
        onError: {
          target: "unauthorised",
          actions: assign({
            errorCode: (context, event) => event.data.message,
          }),
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
