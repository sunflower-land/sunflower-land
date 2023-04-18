import { sequence } from "0xsequence";
import { createMachine, Interpreter, State, assign } from "xstate";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { loadBanDetails } from "features/game/actions/bans";
import { isFarmBlacklisted } from "features/game/actions/onchain";
import { CONFIG } from "lib/config";
import { ErrorCode, ERRORS } from "lib/errors";

import { wallet, WalletType } from "../../../lib/blockchain/wallet";
import { communityContracts } from "features/community/lib/communityContracts";
import {
  createAccount as createFarmAction,
  saveReferrerId,
} from "../actions/createAccount";
import {
  login,
  Token,
  decodeToken,
  removeSession,
  hasValidSession,
  saveSession,
} from "../actions/login";
import { oauthorise, redirectOAuth } from "../actions/oauth";
import { CharityAddress } from "../components/CreateFarm";
import { randomID } from "lib/utils/random";
import { createFarmMachine } from "./createFarmMachine";
import { SEQUENCE_CONNECT_OPTIONS } from "./sequence";
import { getFarm, getFarms } from "lib/blockchain/Farm";
import { getCreatedAt } from "lib/blockchain/AccountMinter";
import {
  createGuestAccount,
  getGuestKey,
  getGuestModeComplete,
  setGuestKey,
} from "../actions/createGuestAccount";
import { analytics } from "lib/analytics";

export const ART_MODE = !CONFIG.API_URL;

const getFarmIdFromUrl = () => {
  const paths = window.location.href.split("/visit/");
  const id = paths[paths.length - 1];
  return parseInt(id);
};

const getDiscordCode = () => {
  const code = new URLSearchParams(window.location.search).get("code");

  return code;
};

const getReferrerID = () => {
  const code = new URLSearchParams(window.location.search).get("ref");

  return code;
};

const deleteFarmUrl = () =>
  window.history.pushState({}, "", window.location.pathname);

type Farm = {
  farmId: number;
  address: string;
  createdAt: number;
  blacklistStatus: "OK" | "VERIFY" | "PENDING" | "REJECTED" | "BANNED";
  verificationUrl?: string;
};

interface Authentication {
  token?: Token;
  rawToken?: string;
  web3?: {
    wallet: WalletType;
    provider: any;
  };
  farmId?: number;
}

interface GuestUser extends Authentication {
  type: "GUEST";
  guestKey: string | null;
}

interface FullUser extends Authentication {
  type: "FULL";
  farmAddress?: string;
}

export interface Context {
  user: GuestUser | FullUser;
  errorCode?: ErrorCode;
  transactionId?: string;
  blacklistStatus?: "OK" | "VERIFY" | "PENDING" | "REJECTED";
  verificationUrl?: string;
  visitingFarmId?: number;
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
  | { type: "CONFIRM" }
  | { type: "SKIP" }
  | { type: "CONNECT_TO_METAMASK" }
  | { type: "CONNECT_TO_WALLET_CONNECT" }
  | { type: "CONNECT_TO_SEQUENCE" }
  | { type: "CONNECT_AS_GUEST" }
  | { type: "SIGN" }
  | { type: "VERIFIED" }
  | { type: "SET_WALLET" }
  | { type: "SET_TOKEN" }
  | { type: "BUY_FULL_ACCOUNT" }
  | { type: "SIGN_IN" };

export type BlockchainState = {
  value:
    | "idle"
    | "signIn"
    | "initialising"
    | "visiting"
    | "connectingToMetamask"
    | "connectingToWalletConnect"
    | "connectingToSequence"
    | "connectingAsGuest"
    | "setupContracts"
    | "connectedToWallet"
    | "reconnecting"
    | "connected"
    | "signing"
    | "verifying"
    | "oauthorising"
    | "blacklisted"
    | { connected: "loadingFarm" }
    | { connected: "farmLoaded" }
    | { connected: "noFarmLoaded" }
    | { connected: "creatingFarm" }
    | { connected: "countdown" }
    | { connected: "readyToStart" }
    | { connected: "donating" }
    | { connected: "authorised" }
    | { connected: "blacklisted" }
    | "exploring"
    | "checkFarm"
    | "unauthorised";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  BlockchainState
>;

export type AuthMachineState = State<Context, BlockchainEvent, BlockchainState>;

export const authMachine = createMachine<
  Context,
  BlockchainEvent,
  BlockchainState
>(
  {
    id: "authMachine",
    initial: ART_MODE ? "connected" : "idle",
    context: {
      user: {
        type: "GUEST",
        guestKey: getGuestKey(),
      },
    },
    states: {
      idle: {
        id: "idle",
        entry: () => {
          const referrerId = getReferrerID();

          if (referrerId) {
            saveReferrerId(referrerId);
          }
        },
        always: {
          target: "signIn",
          cond: () => !!getGuestModeComplete(),
        },
        on: {
          SIGN_IN: {
            target: "signIn",
          },
          CONNECT_AS_GUEST: {
            target: "connectingAsGuest",
          },
        },
      },
      signIn: {
        id: "signIn",
        on: {
          CONNECT_TO_METAMASK: {
            target: "connectingToMetamask",
          },
          CONNECT_TO_WALLET_CONNECT: {
            target: "connectingToWalletConnect",
          },
          CONNECT_TO_SEQUENCE: {
            target: "connectingToSequence",
          },
          RETURN: {
            target: "idle",
          },
        },
      },
      reconnecting: {
        id: "reconnecting",
        always: [
          {
            target: "connectingToMetamask",
            cond: (context) => context.user.web3?.wallet === "METAMASK",
          },
          {
            target: "connectingToSequence",
            cond: (context) => context.user.web3?.wallet === "SEQUENCE",
          },
          {
            target: "connectingToWalletConnect",
            cond: (context) => !!context.user.web3?.wallet,
          },
          { target: "idle" },
        ],
      },
      connectingToMetamask: {
        id: "connectingToMetamask",
        invoke: {
          src: "initMetamask",
          onDone: {
            target: "setupContracts",
            actions: "assignGuestUser",
          },
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      connectingToWalletConnect: {
        id: "connectingToWalletConnect",
        invoke: {
          src: "initWalletConnect",
          onDone: {
            target: "setupContracts",
            actions: "assignGuestUser",
          },
          onError: [
            {
              target: "idle",
              cond: (_, event) => event.data.message === "User closed modal",
            },
            {
              target: "unauthorised",
              actions: "assignErrorMessage",
            },
          ],
        },
      },
      connectingToSequence: {
        id: "connectingToSequence",
        invoke: {
          src: "initSequence",
          onDone: {
            target: "setupContracts",
            actions: "assignGuestUser",
          },
          onError: [
            {
              target: "idle",
              cond: (_, event) =>
                event.data.message === ERRORS.SEQUENCE_NOT_CONNECTED,
            },
            {
              target: "unauthorised",
              actions: "assignErrorMessage",
            },
          ],
        },
      },
      connectingAsGuest: {
        entry: "setTransactionId",
        invoke: {
          src: async (context) => {
            if (context.user.type !== "GUEST") throw new Error("Not a guest");

            // Sleep 500ms to show Loading screen
            await new Promise((resolve) => setTimeout(resolve, 500));

            if (!context.user.guestKey) {
              const guestKey = await createGuestAccount({
                transactionId: context.transactionId as string,
              });

              setGuestKey(guestKey);

              analytics.logEvent("play_as_guest");
            }
          },
          onDone: {
            target: "#authorised",
            actions: assign({
              user: (context) => ({
                ...context.user,
                guestKey: getGuestKey(),
              }),
            }),
          },
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      setupContracts: {
        invoke: {
          src: async (context) => {
            if (context.user.web3) {
              await wallet.initialise(
                context.user.web3.provider,
                context.user.web3.wallet
              );
              await communityContracts.initialise(context.user.web3.provider);
            }
          },
          onDone: [
            {
              target: "checkFarm",
              cond: "isVisitingUrl",
              actions: assign({
                visitingFarmId: (_context) => getFarmIdFromUrl(),
              }),
            },
            {
              target: "signing",
              cond: (context) => context.user.web3?.wallet === "METAMASK",
            },
            {
              target: "connectedToWallet",
              actions: (context) =>
                analytics.logEvent("wallet_connected", {
                  wallet: context.user.web3?.wallet,
                }),
            },
          ],
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      connectedToWallet: {
        always: { target: "signing", cond: () => hasValidSession() },
        on: { SIGN: { target: "signing" } },
      },
      signing: {
        entry: "setTransactionId",
        invoke: {
          src: "login",
          onDone: [
            {
              target: "oauthorising",
              cond: "hasDiscordCode",
            },
            {
              target: "connected",
              cond: (_, event) =>
                !!decodeToken(event.data.token).userAccess.verified,
              actions: "assignToken",
            },
            {
              target: "verifying",
              actions: "assignToken",
            },
          ],
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      verifying: {
        on: {
          VERIFIED: {
            target: "connected",
            actions: [
              "assignToken",
              (_, event) =>
                saveSession((event as any).data.account, {
                  token: (event as any).data.token,
                }),
            ],
          },
        },
      },
      oauthorising: {
        entry: "setTransactionId",
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
      },
      connected: {
        initial: ART_MODE ? "authorised" : "loadingFarm",
        states: {
          loadingFarm: {
            id: "loadingFarm",
            entry: "setTransactionId",
            invoke: {
              src: "loadFarm",
              onDone: [
                {
                  target: "countdown",
                  cond: "isFresh",
                },
                {
                  // event.data can be undefined if the player has no farms
                  cond: (_, event) => event.data?.blacklistStatus === "BANNED",
                  actions: "assignFullUser",
                  target: "blacklisted",
                },
                {
                  target: "authorised",
                  actions: "assignFullUser",
                  cond: "hasFarm",
                },

                { target: "noFarmLoaded" },
              ],
              onError: [
                {
                  target: "#loadingFarm",
                  cond: () => !wallet.isAlchemy,
                  actions: () => {
                    wallet.overrideProvider();
                  },
                },
                {
                  target: "#unauthorised",
                  actions: "assignErrorMessage",
                },
              ],
            },
          },
          donating: {
            invoke: {
              id: "createFarmMachine",
              src: createFarmMachine,
              data: {
                token: (context: Context) => context.user.rawToken,
              },
              onError: {
                target: "#unauthorised",
                actions: "assignErrorMessage",
              },
            },
            on: {
              CREATE_FARM: {
                target: "creatingFarm",
              },
              REFRESH: {
                target: "#reconnecting",
              },
            },
          },
          creatingFarm: {
            entry: "setTransactionId",
            invoke: {
              src: "createFarm",
              onDone: {
                target: "#reconnecting",
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
                target: "#reconnecting",
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
          readyToStart: {
            invoke: {
              src: async () => ({
                skipSplash: window.location.hash.includes("retreat"),
              }),
              onDone: {
                cond: (_, event) => event.data.skipSplash,
                target: "authorised",
              },
            },
            on: {
              START_GAME: [
                {
                  cond: (context) => context.blacklistStatus !== "OK",
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
          blacklisted: {
            on: {
              SKIP: {
                target: "authorised",
              },
            },
          },
          authorised: {
            id: "authorised",
            entry: [
              "clearTransactionId",
              (context) => {
                if (window.location.hash.includes("retreat")) return;

                if (!ART_MODE) {
                  if (context.user.type === "GUEST") {
                    window.location.href = `${window.location.pathname}#/land/guest`;
                  }

                  if (context.user.type === "FULL") {
                    window.location.href = `${window.location.pathname}#/land/${context.user.farmId}`;
                  }
                }
              },
              (context) =>
                analytics.initialise({
                  id: context.user.farmId as number,
                  type: context.user.type,
                }),
              () => analytics.logEvent("login"),
            ],
            on: {
              RETURN: {
                target: "#reconnecting",
                actions: ["refreshFarm", "deleteFarmIdUrl"],
              },
              REFRESH: {
                target: "#reconnecting",
              },
              EXPLORE: {
                target: "#exploring",
              },
              LOGOUT: {
                target: "#idle",
                actions: ["clearSession", "refreshFarm"],
              },
              SET_WALLET: {
                actions: "assignGuestUser",
              },
              SET_TOKEN: {
                actions: [
                  "assignToken",
                  (_, event) =>
                    saveSession((event as any).data.account, {
                      token: (event as any).data.token,
                    }),
                ],
              },
              BUY_FULL_ACCOUNT: {
                target: "donating",
              },
              SIGN_IN: {
                target: "#signIn",
              },
            },
          },
          supplyReached: {},
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
            actions: assign({ visitingFarmId: (_, event) => event.farmId }),
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
              cond: (_, event) => event.data.blacklistStatus !== "OK",
            },
            {
              target: "visiting",
            },
          ],
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      blacklisted: {},
      visiting: {
        entry: (context) => {
          window.location.href = `${window.location.pathname}#/visit/${context.visitingFarmId}`;
        },
        on: {
          RETURN: {
            target: "reconnecting",
            actions: ["refreshFarm", "deleteFarmIdUrl"],
          },
        },
      },
    },
    on: {
      CHAIN_CHANGED: {
        target: "reconnecting",
        actions: "refreshFarm",
      },
      ACCOUNT_CHANGED: {
        target: "reconnecting",
        actions: "refreshFarm",
      },
      REFRESH: {
        target: "reconnecting",
        actions: "refreshFarm",
      },
    },
  },
  {
    services: {
      initMetamask: async () => {
        const _window = window as any;

        // TODO add type support
        if (_window.ethereum) {
          const provider = _window.ethereum;

          if (provider.isPhantom) {
            throw new Error(ERRORS.PHANTOM_WALLET_NOT_SUPPORTED);
          }
          await provider.request({
            method: "eth_requestAccounts",
          });

          return { web3: { wallet: "METAMASK", provider } };
        } else {
          throw new Error(ERRORS.NO_WEB3);
        }
      },
      initWalletConnect: async () => {
        // TODO abstract RPC constants
        const provider = new WalletConnectProvider({
          rpc: {
            80001: "https://matic-mumbai.chainstacklabs.com",
            137: "https://polygon-rpc.com/",
          },
        });
        //  Enable session (triggers QR Code modal)
        await provider.enable();

        const name = provider.walletMeta?.name;

        return { web3: { wallet: name, provider } };
      },
      initSequence: async () => {
        const network = CONFIG.NETWORK === "mainnet" ? "polygon" : "mumbai";

        const sequenceWallet = await sequence.initWallet(network);
        await sequenceWallet.connect(SEQUENCE_CONNECT_OPTIONS);

        if (!sequenceWallet.isConnected()) {
          throw Error(ERRORS.SEQUENCE_NOT_CONNECTED);
        }

        const provider = sequenceWallet.getProvider();

        return { web3: { wallet: "SEQUENCE", provider } };
      },
      loadFarm: async (context): Promise<Farm | undefined> => {
        if (!wallet.myAccount) return;

        const farmAccounts = await getFarms(
          wallet.web3Provider,
          wallet.myAccount
        );

        if (farmAccounts?.length === 0) return;

        const createdAt = await getCreatedAt(
          wallet.web3Provider,
          wallet.myAccount,
          wallet.myAccount as string
        );

        // V1 just support 1 farm per account - in future let them choose between the NFTs they hold
        const farmAccount = farmAccounts[0];

        const { verificationUrl, isBanned } = await loadBanDetails(
          farmAccount.tokenId,
          context.user.rawToken as string,
          context.transactionId as string
        );

        return {
          farmId: parseInt(farmAccount.tokenId),
          address: farmAccount.account,
          createdAt,
          blacklistStatus: isBanned ? "BANNED" : "OK",
          verificationUrl,
        };
      },
      createFarm: async (context: Context, event: any) => {
        if (!context.user.rawToken) throw new Error("No token");
        if (!wallet.myAccount) throw new Error("No account");

        const { charityAddress, captcha } = event as CreateFarmEvent;

        let guestKey: string | undefined = undefined;
        if (context.user.type === "GUEST") {
          guestKey = context.user.guestKey ?? undefined;
        }

        await createFarmAction({
          charity: charityAddress,
          token: context.user.rawToken,
          captcha,
          transactionId: context.transactionId as string,
          account: wallet.myAccount,
          guestKey,
        });
      },
      login: async (context): Promise<{ token: string | null }> => {
        let token: string | null = null;

        if (wallet.myAccount) {
          ({ token } = await login(
            context.transactionId as string,
            wallet.myAccount
          ));
        }

        return { token };
      },
      oauthorise: async (context) => {
        if (!wallet.myAccount) throw new Error("No account");

        const code = getDiscordCode() as string;
        // Navigates to Discord OAuth Flow
        const { token } = await oauthorise(
          code,
          context.transactionId as string,
          wallet.myAccount
        );

        return { token };
      },
      visitFarm: async (context: Context): Promise<Farm> => {
        if (!context.visitingFarmId) throw new Error("No Visiting Farm ID");

        const farmAccount = await getFarm(
          wallet.web3Provider,
          context.visitingFarmId
        );
        const isBlacklisted = await isFarmBlacklisted(context.visitingFarmId);

        return {
          farmId: parseInt(farmAccount.tokenId),
          address: farmAccount.account,
          createdAt: 0,
          blacklistStatus: isBlacklisted ? "REJECTED" : "OK",
        };
      },
    },
    actions: {
      assignFullUser: assign<Context, any>({
        user: (context, event) => ({
          ...context.user,
          type: "FULL",
          web3: context.user.web3,
          farmId: event.data.farmId,
          farmAddress: event.data.address,
        }),
        blacklistStatus: (_, event) => event.data.blacklistStatus,
        verificationUrl: (_, event) => event.data.verificationUrl,
      }),
      assignToken: assign<Context, any>({
        user: (context, event) => ({
          ...context.user,
          token: decodeToken(event.data.token),
          rawToken: event.data.token,
        }),
      }),
      assignErrorMessage: assign<Context, any>({
        errorCode: (_context, event) => event.data.message,
      }),
      assignGuestUser: assign<Context, any>({
        user: (_context, event) => ({
          type: "GUEST",
          guestKey: getGuestKey(),
          web3: event.data.web3,
        }),
      }),
      refreshFarm: assign<Context, any>({
        user: () => ({
          type: "GUEST",
          guestKey: getGuestKey(),
        }),
        visitingFarmId: undefined,
      }),
      clearSession: () => removeSession(wallet.myAccount as string),
      deleteFarmIdUrl: deleteFarmUrl,
      setTransactionId: assign<Context, any>({
        transactionId: () => randomID(),
      }),
      clearTransactionId: assign<Context, any>({
        transactionId: () => undefined,
      }),
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

        if (context.user.type === "FULL") return !!context.user.farmId;

        return false;
      },
      isVisitingUrl: () => window.location.href.includes("visit"),
      hasDiscordCode: () => !!getDiscordCode(),
    },
  }
);
