import { ERRORS } from "lib/errors";
import { createMachine, Interpreter, assign, DoneInvokeEvent } from "xstate";

import { metamask } from "../../../lib/blockchain/metamask";
import { createFarm as createFarmAction } from "../actions/createFarm";
import { CharityAddress } from "../components/Donation";

type Farm = {
  farmId: number;
  sessionId: string;
  address: string;
};

export interface Context {
  errorCode?: keyof typeof ERRORS;
  farmId?: number;
  sessionId?: string;
  signature?: string;
  hash?: string;
  address?: string;
}

type StartEvent = Farm & {
  type: "START_GAME";
};

type VisitEvent = {
  type: "VISIT";
  farmId: number;
};

type CreateFarmEvent = {
  type: "CREATE_FARM";
  charityAddress: CharityAddress;
  donation: number;
};

export type BlockchainEvent =
  | StartEvent
  | VisitEvent
  | CreateFarmEvent
  | {
      type: "NETWORK_CHANGED";
    }
  | {
      type: "ACCOUNT_CHANGED";
    }
  | {
      type: "REFRESH";
    };

export type BlockchainState = {
  value:
    | "visiting"
    | "connecting"
    | "connected"
    | { connected: "loadingFarm" }
    | { connected: "farmLoaded" }
    | { connected: "noFarmLoaded" }
    | { connected: "creatingFarm" }
    | "readyToStart"
    | "signing"
    | "registering"
    | "authorised"
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
>(
  {
    id: "authMachine",
    initial: API_URL ? "connecting" : "visiting",
    context: {},
    states: {
      connecting: {
        invoke: {
          src: "initMetamask",
          onDone: "connected",
          onError: {
            target: "unauthorised",
            actions: "assingErrorMessage",
          },
        },
      },
      connected: {
        initial: "loadingFarm",
        states: {
          loadingFarm: {
            invoke: {
              src: "loadFarm",
              onDone: [
                {
                  target: "#readyToStart",
                  actions: "assignFarm",
                  cond: "hasFarm",
                },
                { target: "noFarmLoaded" },
              ],
              onError: {
                target: "#unauthorised",
                actions: "assignErrorMessage",
              },
            },
          },
          creatingFarm: {
            invoke: {
              src: "createFarm",
              onDone: "loadingFarm",
              onError: {
                target: "#unauthorised",
                actions: "assignErrorMessage",
              },
            },
          },
          noFarmLoaded: {
            on: {
              CREATE_FARM: {
                target: "creatingFarm",
              },
            },
          },
          farmLoaded: {
            always: {
              target: "#readyToStart",
            },
          },
        },
      },
      readyToStart: {
        id: "readyToStart",
        on: {
          START_GAME: {
            target: "signing",
          },
        },
      },
      signing: {
        invoke: {
          src: "sign",
          onDone: {
            target: "authorised",
            actions: "assignSignature",
          },
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      authorised: {
        on: {
          REFRESH: {
            target: "connecting",
          },
        },
      },
      unauthorised: {
        id: "unauthorised",
      },
      // An anonymous user is visiting a farm
      visiting: {},
    },
    on: {
      ACCOUNT_CHANGED: {
        target: "connecting",
      },
      NETWORK_CHANGED: {
        target: "connecting",
      },
    },
  },
  {
    services: {
      initMetamask: async (): Promise<void> => {
        await metamask.initialise();
      },
      loadFarm: async (): Promise<Farm | undefined> => {
        const farmAccounts = await metamask.getFarm()?.getFarms();

        if (farmAccounts?.length === 0) {
          return;
        }

        // V1 just support 1 farm per account - in future let them choose between the NFTs they hold
        const farmAccount = farmAccounts[0];

        const sessionId = await metamask
          .getSunflowerLand()
          .getSessionId(farmAccount.tokenId);

        return {
          farmId: farmAccount.tokenId,
          address: farmAccount.account,
          sessionId,
        };
      },
      createFarm: async (_context: Context, event: any): Promise<void> => {
        const charityAddress = (event as CreateFarmEvent)
          .charityAddress as CharityAddress;
        const donation = (event as CreateFarmEvent).donation as number;

        await createFarmAction(charityAddress, donation);
      },
      sign: async (context: Context): Promise<{ signature: string }> => {
        // Sign transaction -
        const { signature } = await metamask.signTransaction(context.farmId!);

        return {
          signature,
        };
      },
    },
    actions: {
      assignFarm: assign<Context, any>({
        farmId: (_context, event) => event.data.farmId,
        address: (_context, event) => event.data.address,
        sessionId: (_context, event) => event.data.sessionId,
      }),
      assignSignature: assign<Context, any>({
        signature: (_context, event) => event.data.signature,
      }),
      assignErrorMessage: assign<Context, any>({
        errorCode: (_context, event) => event.data.message,
      }),
    },
    guards: {
      hasFarm: (_context: Context, event: any) => {
        if (!event.data) return false;

        const { farmId, address } = event.data;

        return !!farmId && !!address;
      },
    },
  }
);
