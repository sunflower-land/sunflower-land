import { isFarmBlacklisted } from "features/game/actions/onchain";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { createMachine, Interpreter, assign } from "xstate";

import { metamask } from "../../../lib/blockchain/metamask";
import { createFarm as createFarmAction } from "../actions/createFarm";
import { login, Token, decodeToken, removeSession } from "../actions/login";
import { oauthorise, redirectOAuth } from "../actions/oauth";
import { CharityAddress } from "../components/CreateFarm";

const getFarmIdFromUrl = () => {
  const paths = window.location.href.split("/visit/");
  const id = paths[paths.length - 1];
  return parseInt(id);
};

const getDiscordCode = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  return code;
};

const deleteFarmUrl = () =>
  window.history.pushState({}, "", window.location.pathname);

type Farm = {
  farmId: number;
  address: string;
  createdAt: number;
  isBlacklisted: boolean;
};

export interface Context {
  errorCode?: keyof typeof ERRORS;
  farmId?: number;
  hash?: string;
  address?: string;
  token?: Token;
  rawToken?: string;
  captcha?: string;
  isBlacklisted?: boolean;
}

export type Screen = "land" | "farm";

type StartEvent = Farm & {
  type: "START_GAME";
  screen: Screen;
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
  captcha: string;
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
      type: "CHAIN_CHANGED";
    }
  | {
      type: "ACCOUNT_CHANGED";
    }
  | {
      type: "REFRESH";
    }
  | {
      type: "LOGOUT";
    }
  | {
      type: "CHOOSE_CHARITY";
    }
  | { type: "CONNECT_TO_DISCORD" }
  | { type: "CONFIRM" };

export type BlockchainState = {
  value:
    | "visiting"
    | "minimised"
    | "connecting"
    | "connected"
    | "signing"
    | "oauthorising"
    | "blacklisted"
    | { connected: "loadingFarm" }
    | { connected: "farmLoaded" }
    | { connected: "checkingAccess" }
    | { connected: "checkingSupply" }
    | { connected: "supplyReached" }
    | { connected: "noFarmLoaded" }
    | { connected: "creatingFarm" }
    | { connected: "countdown" }
    | { connected: "readyToStart" }
    | { connected: "donating" }
    | { connected: "authorised" }
    | { connected: "blacklisted" }
    | { connected: "visitingContributor" }
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
    initial: API_URL ? "connecting" : "connected",
    context: {},
    states: {
      connecting: {
        id: "connecting",
        invoke: {
          src: "initMetamask",
          onDone: [
            {
              target: "checkFarm",
              cond: "isVisitingUrl",
            },

            { target: "signing" },
          ],
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
        on: {
          ACCOUNT_CHANGED: {
            target: "connecting",
            actions: "refreshFarm",
          },
        },
      },
      signing: {
        invoke: {
          src: "login",
          onDone: [
            {
              target: "oauthorising",
              cond: "hasDiscordCode",
            },
            {
              target: "connected",
              actions: "assignToken",
            },
          ],
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
        on: {
          ACCOUNT_CHANGED: {
            target: "connecting",
            actions: "refreshFarm",
          },
        },
      },
      oauthorising: {
        invoke: {
          src: "oauthorise",
          onDone: {
            target: "connected.loadingFarm",
            actions: "assignToken",
          },
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
        on: {
          ACCOUNT_CHANGED: {
            target: "connecting",
            actions: "refreshFarm",
          },
        },
      },
      connected: {
        initial: API_URL ? "loadingFarm" : "authorised",
        states: {
          loadingFarm: {
            id: "loadingFarm",
            invoke: {
              src: "loadFarm",
              onDone: [
                {
                  target: "countdown",
                  cond: "isFresh",
                },
                {
                  target: "readyToStart",
                  actions: "assignFarm",
                  cond: "hasFarm",
                },

                { target: "checkingAccess" },
              ],
              onError: {
                target: "#unauthorised",
                actions: "assignErrorMessage",
              },
            },
          },
          visitingContributor: {
            on: {
              RETURN: [
                // When returning to this state the original authorised player's data exists in the authMachine context
                {
                  target: "authorised",
                  actions: (context) => {
                    window.location.href = `${window.location.pathname}#/farm/${context.farmId}`;
                  },
                  cond: "hasFarm",
                },
                { target: "readyToStart" },
              ],
            },
          },
          checkingAccess: {
            id: "checkingAccess",
            invoke: {
              src: async (context) => {
                return {
                  hasAccess: context.token?.userAccess.createFarm,
                };
              },
              onDone: [
                {
                  target: "noFarmLoaded",
                  cond: (_, event) => event.data.hasAccess,
                },
                { target: "checkingSupply" },
              ],
              onError: {
                target: "#unauthorised",
                actions: "assignErrorMessage",
              },
            },
          },
          checkingSupply: {
            id: "checkingSupply",
            invoke: {
              src: async () => {
                const totalSupply = await metamask.getFarm()?.getTotalSupply();

                return {
                  totalSupply,
                };
              },
              onDone: [
                {
                  target: "supplyReached",
                  cond: (context, event) =>
                    Number(event.data.totalSupply) >= 150000,
                },
                { target: "noFarmLoaded" },
              ],
              onError: {
                target: "#unauthorised",
                actions: "assignErrorMessage",
              },
            },
          },
          donating: {
            on: {
              CREATE_FARM: {
                target: "creatingFarm",
              },
              REFRESH: {
                target: "#connecting",
              },
            },
          },
          creatingFarm: {
            invoke: {
              src: "createFarm",
              onDone: {
                target: "#connecting",
              },
              onError: {
                target: "#unauthorised",
                actions: "assignErrorMessage",
              },
            },
          },
          countdown: {
            on: {
              REFRESH: {
                target: "#connecting",
              },
            },
          },
          noFarmLoaded: {
            on: {
              CHOOSE_CHARITY: {
                target: "donating",
              },
              CONNECT_TO_DISCORD: {
                // Redirects to Discord OAuth so no need for a state change
                target: "noFarmLoaded",
                actions: redirectOAuth,
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
              START_GAME: [
                {
                  cond: (context) => !!context.isBlacklisted,
                  target: "blacklisted",
                },
                {
                  target: "authorised",
                },
              ],
              EXPLORE: {
                target: "#exploring",
              },
            },
          },
          blacklisted: {},
          authorised: {
            id: "authorised",
            entry: (context, event) => {
              const { screen = "farm" } = event as StartEvent;

              // window.location.href = `${window.location.pathname}#/${screen}/${context.farmId}`;
            },
            on: {
              REFRESH: {
                target: "#connecting",
              },
              EXPLORE: {
                target: "#exploring",
              },
              VISIT: {
                target: "visitingContributor",
              },
              LOGOUT: {
                target: "#connecting",
                actions: ["clearSession", "refreshFarm"],
              },
            },
          },
          supplyReached: {},
        },
        on: {
          ACCOUNT_CHANGED: {
            target: "connecting",
            actions: "refreshFarm",
          },
        },
      },
      unauthorised: {
        id: "unauthorised",
        on: {
          ACCOUNT_CHANGED: {
            target: "connecting",
            actions: "refreshFarm",
          },
        },
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
          ACCOUNT_CHANGED: {
            target: "connecting",
            actions: "refreshFarm",
          },
        },
      },
      // An anonymous user is visiting a farm
      checkFarm: {
        invoke: {
          src: "visitFarm",
          onDone: [
            {
              target: "blacklisted",
              cond: (context) => !!context.isBlacklisted,
              actions: "assignFarm",
            },
            {
              target: "visiting",
              actions: "assignFarm",
              cond: "hasFarm",
            },
          ],
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
        on: {
          ACCOUNT_CHANGED: {
            target: "connecting",
            actions: "refreshFarm",
          },
        },
      },
      blacklisted: {},
      visiting: {
        entry: (context) => {
          window.location.href = `${window.location.pathname}#/visit/${context.farmId}`;
        },
        on: {
          RETURN: {
            target: "connecting",
            actions: ["refreshFarm", "deleteFarmIdUrl"],
          },
          ACCOUNT_CHANGED: {
            target: "connecting",
            actions: "refreshFarm",
          },
        },
      },
      minimised: {},
    },
    on: {
      CHAIN_CHANGED: {
        target: "connecting",
        actions: "refreshFarm",
      },
      REFRESH: {
        target: "connecting",
        actions: "refreshFarm",
      },
    },
  },
  {
    services: {
      initMetamask: async (context, event): Promise<void> => {
        await metamask.initialise();
      },
      loadFarm: async (): Promise<Farm | undefined> => {
        const farmAccounts = await metamask.getFarm()?.getFarms();

        if (farmAccounts?.length === 0) {
          return;
        }

        const createdAt = await metamask
          .getBeta()
          ?.getCreatedAt(metamask.myAccount as string);

        // V1 just support 1 farm per account - in future let them choose between the NFTs they hold
        const farmAccount = farmAccounts[0];

        const isBlacklisted = await isFarmBlacklisted(farmAccount.tokenId);

        return {
          farmId: farmAccount.tokenId,
          address: farmAccount.account,
          createdAt,
          isBlacklisted,
        };
      },
      createFarm: async (context: Context, event: any): Promise<Context> => {
        const { charityAddress, donation, captcha } = event as CreateFarmEvent;

        const newFarm = await createFarmAction({
          charity: charityAddress,
          token: context.rawToken as string,
          captcha: captcha,
        });

        return {
          farmId: newFarm.tokenId,
          address: newFarm.account,
        };
      },
      login: async (): Promise<{ token: string }> => {
        const { token } = await login();

        return {
          token,
        };
      },
      oauthorise: async () => {
        const code = getDiscordCode() as string;
        // Navigates to Discord OAuth Flow
        const { token } = await oauthorise(code);

        return { token };
      },
      visitFarm: async (
        _context: Context,
        event: any
      ): Promise<Farm | undefined> => {
        const farmId = getFarmIdFromUrl() || (event as VisitEvent).farmId;
        const farmAccount = await metamask.getFarm()?.getFarm(farmId);

        const isBlacklisted = await isFarmBlacklisted(farmId);

        return {
          farmId: farmAccount.tokenId,
          address: farmAccount.account,
          createdAt: 0,
          isBlacklisted,
        };
      },
    },
    actions: {
      assignFarm: assign<Context, any>({
        farmId: (_context, event) => event.data.farmId,
        address: (_context, event) => event.data.address,
        isBlacklisted: (_context, event) => event.data.isBlacklisted,
      }),
      assignToken: assign<Context, any>({
        token: (_context, event) => decodeToken(event.data.token),
        rawToken: (_context, event) => event.data.token,
      }),
      assignErrorMessage: assign<Context, any>({
        errorCode: (_context, event) => event.data.message,
      }),
      refreshFarm: assign<Context, any>({
        farmId: () => undefined,
        address: () => undefined,
        token: () => undefined,
        rawToken: () => undefined,
      }),
      clearSession: () => removeSession(metamask.myAccount as string),
      deleteFarmIdUrl: deleteFarmUrl,
    },
    guards: {
      isFresh: (context: Context, event: any) => {
        if (!event.data?.farmId) {
          return false;
        }

        const secondsElapsed =
          Date.now() / 1000 - (event.data as Farm).createdAt;
        return secondsElapsed < 60;
      },
      hasFarm: (context: Context, event: any) => {
        // If coming from the loadingFarm transition the farmId with show up on the event
        // else we check for it on the context
        if (event.data?.farmId) {
          const { farmId } = event.data;

          return !!farmId;
        }

        return !!context.farmId;
      },
      isVisitingUrl: () => window.location.href.includes("visit"),
      hasDiscordCode: () => !!getDiscordCode(),
    },
  }
);
