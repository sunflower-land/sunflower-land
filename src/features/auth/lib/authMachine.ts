import { canCreateFarm } from "features/game/lib/whitelist";
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

type ExploreEvent = {
  type: "EXPLORE";
};

type VisitEvent = {
  type: "VISIT";
  farmId: number;
};

type ReturnEvent = {
  type: "RETURN";
};

type CreateFarmEvent = {
  type: "CREATE_FARM";
  charityAddress: CharityAddress;
  donation: number;
};

export type BlockchainEvent =
  | StartEvent
  | ExploreEvent
  | VisitEvent
  | ReturnEvent
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
    | "signing"
    | { connected: "loadingFarm" }
    | { connected: "farmLoaded" }
    | { connected: "noFarmLoaded" }
    | { connected: "creatingFarm" }
    | { connected: "readyToStart" }
    | { connected: "authorised" }
    | "exploring"
    | "checkFarm"
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
        id: "connecting",
        invoke: {
          src: "initMetamask",
          onDone: "signing",
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      signing: {
        invoke: {
          src: "sign",
          onDone: {
            target: "connected",
            actions: "assignSignature",
          },
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
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
                  target: "readyToStart",
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
              EXPLORE: {
                target: "#exploring",
              },
            },
          },
          farmLoaded: {
            always: {
              target: "readyToStart",
            },
          },
          readyToStart: {
            on: {
              START_GAME: {
                target: "authorised",
              },
              EXPLORE: {
                target: "#exploring",
              },
            },
          },
          authorised: {
            on: {
              REFRESH: {
                target: "#connecting",
              },
            },
          },
        },
      },
      unauthorised: {
        id: "unauthorised",
      },
      exploring: {
        id: "exploring",
        on: {
          VISIT: {
            target: "checkFarm",
          },
        },
      },
      // An anonymous user is visiting a farm
      checkFarm: {
        invoke: {
          src: "visitFarm",
          onDone: {
            target: "visiting",
            actions: "assignFarm",
            cond: "hasFarm",
          },
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      visiting: {
        on: {
          RETURN: {
            target: "connecting",
            actions: "resetFarm",
          }
        }
      },
    },
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
  {
    services: {
      initMetamask: async (): Promise<void> => {
        await metamask.initialise();

        const isWhitelisted = canCreateFarm(metamask.myAccount as string);
        if (!isWhitelisted) {
          throw new Error(ERRORS.BLOCKED);
        }
      },
      loadFarm: async (): Promise<Farm | undefined> => {
        const farmAccounts = await metamask.getFarm()?.getFarms();

        if (farmAccounts?.length === 0) {
          return;
        }

        // V1 just support 1 farm per account - in future let them choose between the NFTs they hold
        const farmAccount = farmAccounts[0];

        const sessionId = await metamask
          .getSessionManager()
          .getSessionId(farmAccount.tokenId);

        return {
          farmId: farmAccount.tokenId,
          address: farmAccount.account,
          sessionId,
        };
      },
      createFarm: async (context: Context, event: any): Promise<void> => {
        const charityAddress = (event as CreateFarmEvent)
          .charityAddress as CharityAddress;
        const donation = (event as CreateFarmEvent).donation as number;

        await createFarmAction({
          charity: charityAddress,
          donation,
          signature: context.signature as string,
        });
      },
      sign: async (context: Context, sd): Promise<{ signature: string }> => {
        console.log("SIGN!");
        const { signature } = await metamask.signTransaction();

        return {
          signature,
        };
      },
      visitFarm: async (context: Context, event: any): Promise<Farm | undefined> => {
        const farmId = (event as VisitEvent).farmId;
        const farmAccount = await metamask.getFarm()?.getFarm(farmId);

        return {
          farmId: farmAccount.tokenId,
          address: farmAccount.account,
          sessionId: "",
        };
      }
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
      resetFarm: assign<Context, any>({
        farmId: (_context, event) => undefined,
        address: (_context, event) => undefined,
        sessionId: (_context, event) => undefined,
      }),
    },
    guards: {
      hasFarm: (context: Context, event: any) => {
        // If coming from the loadingFarm transition the farmId with show up on the event
        // else we check for it on the context
        if (event.data?.farmId) {
          const { farmId } = event.data;

          return !!farmId;
        }

        return !!context.farmId;
      },
    },
  }
);
