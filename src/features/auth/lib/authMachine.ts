import { createMachine, Interpreter, State, assign } from "xstate";
import { loadBanDetails } from "features/game/actions/bans";
import { isFarmBlacklisted } from "features/game/actions/onchain";
import { CONFIG } from "lib/config";
import { ErrorCode, ERRORS } from "lib/errors";
import { gameAnalytics } from "lib/gameAnalytics";

import { wallet } from "../../../lib/blockchain/wallet";
import {
  createAccount as createFarmAction,
  saveReferrerId,
} from "../actions/createAccount";
import {
  login,
  Token,
  decodeToken,
  removeSession,
  saveSession,
  hasValidSession,
} from "../actions/login";
import { oauthorise } from "../actions/oauth";
import { CharityAddress } from "../components/CreateFarm";
import { randomID } from "lib/utils/random";
import { createFarmMachine } from "./createFarmMachine";
import { getFarm, getFarms } from "lib/blockchain/Farm";
import { getCreatedAt } from "lib/blockchain/AccountMinter";
import { getOnboardingComplete } from "../actions/onboardingComplete";
import { onboardingAnalytics } from "lib/analytics";
import { web3ConnectStrategyFactory } from "./web3-connect-strategy/web3ConnectStrategy.factory";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";
import { savePromoCode } from "features/game/actions/loadSession";
import { hasFeatureAccess } from "lib/flags";
import { TEST_FARM } from "features/game/lib/constants";

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

const getPromoCode = () => {
  const code = new URLSearchParams(window.location.search).get("promo");

  return code;
};

const deleteFarmUrl = () =>
  window.history.pushState({}, "", window.location.pathname);

const isPassiveFailureMessage = (failureMessage: string): boolean => {
  return (
    failureMessage === "User closed modal" ||
    failureMessage === ERRORS.SEQUENCE_NOT_CONNECTED
  );
};

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
    wallet: Web3SupportedProviders;
    provider: any;
  };
  farmId?: number;
}

export interface FullUser extends Authentication {
  type: "FULL";
  farmAddress?: string;
}

export interface Context {
  user: FullUser;
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
  hasEnoughMatic: boolean;
};

type LoadFarmEvent = {
  type: "LOAD_FARM";
};

type ConnectWalletEvent = {
  type: "CONNECT_TO_WALLET";
  chosenProvider: Web3SupportedProviders;
};

export type BlockchainEvent =
  | StartEvent
  | ExploreEvent
  | VisitEvent
  | ReturnEvent
  | CreateFarmEvent
  | LoadFarmEvent
  | ConnectWalletEvent
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
  | { type: "CONTINUE" }
  | { type: "BACK" }
  | { type: "CONNECT_TO_DISCORD" }
  | { type: "CONFIRM" }
  | { type: "SKIP" }
  | { type: "SIGN" }
  | { type: "VERIFIED" }
  | { type: "SET_WALLET" }
  | { type: "SET_TOKEN" }
  | { type: "BUY_FULL_ACCOUNT" }
  | { type: "SIGN_IN" }
  | { type: "SELECT_POKO" }
  | { type: "SELECT_MATIC" };

export type BlockchainState = {
  value:
    | "idle"
    | "welcome"
    | "createWallet"
    | "signIn"
    | "initialising"
    | "visiting"
    | "connectingToWallet"
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
    | { connected: "offer" }
    | { connected: "selectPaymentMethod" }
    | { connected: "creatingPokoFarm" }
    | { connected: "creatingFarm" }
    | { connected: "funding" }
    | { connected: "countdown" }
    | { connected: "readyToStart" }
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
      user: ART_MODE
        ? {
            type: "FULL",
            // Random ID
            farmId: Math.floor(Math.random() * (500 + 1)),
          }
        : { type: "FULL" },
    },
    states: {
      idle: {
        id: "idle",
        entry: () => {
          const referrerId = getReferrerID();

          if (referrerId) {
            saveReferrerId(referrerId);
          }

          const promoCode = getPromoCode();
          if (promoCode) {
            onboardingAnalytics.logEvent(`promo_code_${promoCode}` as any);
            savePromoCode(promoCode);
          }
        },
        always: [
          {
            target: "welcome",
            cond: () => !getOnboardingComplete(),
          },
          {
            target: "signIn",
          },
        ],
        on: {
          SIGN_IN: {
            target: "signIn",
          },
        },
      },
      welcome: {
        on: {
          SIGN_IN: {
            target: "signIn",
            actions: () => onboardingAnalytics.logEvent("connect_wallet"),
          },
          CONTINUE: [
            {
              target: "signIn",
              cond: () => hasFeatureAccess(TEST_FARM, "NEW_FARM_FLOW"),
              actions: () => onboardingAnalytics.logEvent("create_account"),
            },
            {
              target: "createWallet",
              actions: () => onboardingAnalytics.logEvent("create_account"),
            },
          ],
        },
      },

      createWallet: {
        on: {
          CONTINUE: {
            target: "signIn",
            actions: () => onboardingAnalytics.logEvent("connect_wallet"),
          },
        },
      },
      signIn: {
        id: "signIn",
        on: {
          CONNECT_TO_WALLET: {
            target: "connectingToWallet",
          },
          BACK: {
            target: "welcome",
          },
        },
      },
      reconnecting: {
        id: "reconnecting",
        always: [
          {
            target: "connectingToWallet",
            cond: (context) => !!context.user.web3?.wallet,
          },
          { target: "idle" },
        ],
      },
      connectingToWallet: {
        id: "connectingToWallet",
        invoke: {
          src: "initWallet",
          onDone: [
            {
              target: "setupContracts",
              actions: "assignUser",
            },
          ],
          onError: [
            {
              target: "idle",
              cond: (_, event) => isPassiveFailureMessage(event.data.message),
            },
            {
              target: "unauthorised",
              actions: "assignErrorMessage",
            },
          ],
        },
      },
      setupContracts: {
        invoke: {
          src: async (context) => {
            console.log({ isWeb3: context.user.web3 });
            if (context.user.web3) {
              await wallet.initialise(
                context.user.web3.provider,
                context.user.web3.wallet
              );
              // await communityContracts.initialise(context.user.web3.provider);
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
            // This enables pop ups to load during the sequence signing flow
            {
              target: "connectedToWallet",
              cond: (context) =>
                context.user.web3?.wallet === Web3SupportedProviders.SEQUENCE,
              actions: (context) =>
                onboardingAnalytics.logEvent("wallet_connected", {
                  wallet: context.user.web3?.wallet,
                }),
            },
            {
              target: "signing",
              actions: (context) =>
                onboardingAnalytics.logEvent("wallet_connected", {
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

                { target: "funding" },
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
          funding: {
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
                actions: () => onboardingAnalytics.logEvent("mint_farm"),
              },
              REFRESH: {
                target: "#reconnecting",
              },

              BACK: {
                target: "#signIn",
              },
              SELECT_POKO: {
                target: "creatingPokoFarm",
                actions: () => onboardingAnalytics.logEvent("select_poko"),
              },
              // SELECT_MATIC: {
              //   target: "funding",
              //   actions: () => analytics.logEvent("select_matic"),
              // },
            },
          },
          // selectPaymentMethod: {
          //   on: {
          //     BACK: {
          //       target: "offer",
          //     },
          //     SELECT_POKO: {
          //       target: "creatingPokoFarm",
          //       actions: () => analytics.logEvent("select_poko"),
          //     },
          //     SELECT_MATIC: {
          //       target: "funding",
          //       actions: () => analytics.logEvent("select_matic"),
          //     },
          //   },
          // },
          creatingPokoFarm: {
            on: {
              CONTINUE: {
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
          offer: {
            entry: () => onboardingAnalytics.logEvent("offer_seen"),
            on: {
              CONTINUE: {
                // target: "selectPaymentMethod",
                target: "funding",
                actions: () => onboardingAnalytics.logEvent("offer_accepted"),
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
                if (window.location.hash.includes("world")) return;

                if (!ART_MODE) {
                  window.history.replaceState(
                    null,
                    "",
                    `${window.location.pathname}#/land/${context.user.farmId}`
                  );
                }
              },
              (context) => {
                gameAnalytics.initialise();

                onboardingAnalytics.initialise({
                  id: context.user.farmId as number,
                  type: context.user.type,
                  wallet: context.user.web3?.wallet as string,
                });
              },
              () => onboardingAnalytics.logEvent("login"),
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
                actions: "assignUser",
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
                target: "funding",
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
      initWallet: async (context, event: any) => {
        const _event = event as ConnectWalletEvent | undefined;

        const wallet = _event?.chosenProvider ?? context.user.web3?.wallet;

        if (!wallet) {
          throw new Error("Could not determine wallet provider.");
        }

        const web3ConnectStrategy = web3ConnectStrategyFactory(wallet);

        onboardingAnalytics.logEvent(web3ConnectStrategy.getConnectEventType());

        if (!web3ConnectStrategy.isAvailable()) {
          web3ConnectStrategy.whenUnavailableAction();
          return;
        }

        await web3ConnectStrategy.initialize();
        await web3ConnectStrategy.requestAccounts();

        return {
          web3: {
            wallet: wallet,
            provider: web3ConnectStrategy.getProvider(),
          },
        };
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

        const { charityAddress, captcha, hasEnoughMatic } =
          event as CreateFarmEvent;

        await createFarmAction({
          charity: charityAddress,
          token: context.user.rawToken,
          captcha,
          transactionId: context.transactionId as string,
          account: wallet.myAccount,
          hasEnoughMatic,
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
      assignUser: assign<Context, any>({
        user: (_context, event) => ({
          type: "FULL",
          web3: event.data.web3,
        }),
      }),
      refreshFarm: assign<Context, any>({
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
        return secondsElapsed < 30;
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
