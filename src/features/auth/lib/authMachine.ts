import { canCreateFarm } from "features/game/lib/whitelist";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { createMachine, Interpreter, assign } from "xstate";

import { metamask } from "../../../lib/blockchain/metamask";
import { createFarm as createFarmAction } from "../actions/createFarm";
import { login } from "../actions/login";
import { CharityAddress } from "../components/Donation";

// Hashed eth 0 value
const INITIAL_SESSION =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const getFarmUrl = () => {
  const farmId = new URLSearchParams(window.location.search).get("farmId");

  return parseInt(farmId!);
};

const deleteFarmUrl = () =>
  window.history.pushState({}, "", window.location.pathname);

type Farm = {
  farmId: number;
  sessionId: string;
  address: string;
};

export interface Context {
  errorCode?: keyof typeof ERRORS;
  farmId?: number;
  sessionId?: string;
  token?: string;
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

type LoadFarmEvent = {
  type: "LOAD_FARM";
};

export type BlockchainEvent =
  | StartEvent
  | ExploreEvent
  | VisitEvent
  | ReturnEvent
  | CreateFarmEvent
  | LoadFarmEvent
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

const API_URL = CONFIG.API_URL;

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
          onDone: [
            {
              target: "checkFarm",
              cond: "hasFarmIdUrl",
            },
            { target: "signing" },
          ],
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      signing: {
        invoke: {
          src: "login",
          onDone: {
            target: "connected",
            actions: "assignToken",
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
            id: "loadingFarm",
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
              onDone: {
                target: "authorised",
                actions: "assignFarm",
              },
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
          LOAD_FARM: {
            target: "#loadingFarm",
          },
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
            actions: ["resetFarm", "deleteFarmIdUrl"],
          },
        },
      },
    },
    on: {
      ACCOUNT_CHANGED: {
        target: "connecting",
        actions: "resetFarm",
      },
      NETWORK_CHANGED: {
        target: "connecting",
        actions: "resetFarm",
      },
      REFRESH: {
        target: "connecting",
        actions: "resetFarm",
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
      createFarm: async (context: Context, event: any): Promise<Context> => {
        const charityAddress = (event as CreateFarmEvent)
          .charityAddress as CharityAddress;
        const donation = (event as CreateFarmEvent).donation as number;

        const newFarm = await createFarmAction({
          charity: charityAddress,
          donation,
          token: context.token as string,
        });

        return {
          farmId: newFarm.tokenId,
          address: newFarm.landAddress,
          sessionId: INITIAL_SESSION,
        };
      },
      login: async (): Promise<{ token: string }> => {
        console.log("SIGN!");
        const { token } = await login();

        return {
          token,
        };
      },
      visitFarm: async (
        _context: Context,
        event: any
      ): Promise<Farm | undefined> => {
        const farmId = getFarmUrl() || (event as VisitEvent).farmId;
        const farmAccount = await metamask.getFarm()?.getFarm(farmId);

        return {
          farmId: farmAccount.tokenId,
          address: farmAccount.account,
          sessionId: "",
        };
      },
    },
    actions: {
      assignFarm: assign<Context, any>({
        farmId: (_context, event) => event.data.farmId,
        address: (_context, event) => event.data.address,
        sessionId: (_context, event) => event.data.sessionId,
      }),
      assignToken: assign<Context, any>({
        token: (_context, event) => event.data.token,
      }),
      assignErrorMessage: assign<Context, any>({
        errorCode: (_context, event) => event.data.message,
      }),
      resetFarm: assign<Context, any>({
        farmId: () => undefined,
        address: () => undefined,
        sessionId: () => undefined,
      }),
      deleteFarmIdUrl: () => deleteFarmUrl(),
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
      hasFarmIdUrl: () => !isNaN(getFarmUrl()),
    },
  }
);
