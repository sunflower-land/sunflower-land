import { createMachine, Interpreter, State, assign } from "xstate";
import { CONFIG } from "lib/config";
import { ErrorCode, ERRORS } from "lib/errors";

import { wallet } from "../../../lib/blockchain/wallet";
import { saveReferrerId } from "../actions/createAccount";
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
import { getOnboardingComplete } from "../actions/onboardingComplete";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { web3ConnectStrategyFactory } from "./web3-connect-strategy/web3ConnectStrategy.factory";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";
import { loadSession, savePromoCode } from "features/game/actions/loadSession";
import { portal } from "features/world/ui/community/actions/portal";
import { isValidRedirect } from "features/portal/examples/cropBoom/lib/portalUtil";

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

const getPortal = () => {
  const code = new URLSearchParams(window.location.search).get("portal");

  return code;
};

const getRedirect = () => {
  const code = new URLSearchParams(window.location.search).get("redirect");

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
}

export interface Context {
  user: Authentication;
  errorCode?: ErrorCode;
  transactionId?: string;
  visitingFarmId?: number;
}

type StartEvent = Farm & {
  type: "START_GAME";
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
  | { type: "SIGNUP" }
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
    | "signUp"
    | "initialising"
    | "portaling"
    | "visiting"
    | "connectingToWallet"
    | "setupContracts"
    | "connectedToWallet"
    | "reconnecting"
    | "connected"
    | "signing"
    | "verifying"
    | "oauthorising"
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

type AuthService = {
  loadFarm: { data: Awaited<ReturnType<typeof loadSession>> };
  setupContracts: { data: void };
  createFarm: { data: void };
};

export const authMachine = createMachine(
  {
    id: "authMachine",
    tsTypes: {} as import("./authMachine.typegen").Typegen0,
    initial: ART_MODE ? "connected" : "idle",
    schema: {
      services: {} as AuthService,
      context: {} as Context,
      events: {} as BlockchainEvent,
    },
    context: { user: {} },
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
          SIGNUP: {
            target: "signUp",
            actions: () => onboardingAnalytics.logEvent("create_account"),
          },
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
      signUp: {
        id: "signUp",
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
          src: "setupContracts",
          onDone: [
            {
              target: "visiting",
              cond: "isVisitingUrl",
              actions: "assignVisitingFarmIdFromUrl",
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
        entry: "clearTransactionId",
        always: [
          {
            target: "portalling",
            cond: () => !!getPortal(),
          },
        ],
        on: {
          RETURN: {
            target: "#reconnecting",
            actions: ["refreshFarm", "deleteFarmIdUrl"],
          },
          REFRESH: {
            target: "#reconnecting",
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
        },
      },
      portalling: {
        id: "portalling",
        invoke: {
          src: async (context) => {
            const portalId = getPortal() as string;
            const { token } = await portal({
              portalId,
              token: context.user.rawToken as string,
              farmId: 1, // TODO??
              address: wallet.myAccount as string,
            });

            const redirect = getRedirect() as string;

            if (!isValidRedirect(redirect)) {
              throw new Error("Invalid redirect");
            }

            window.location.href = `${redirect}?jwt=${token}`;
          },
          onError: [
            {
              target: "unauthorised",
              actions: "assignErrorMessage",
            },
          ],
        },
      },
      unauthorised: {
        id: "unauthorised",
        on: {
          RETURN: {
            target: "idle",
          },
        },
      },
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
      setupContracts: async (context) => {
        if (context.user.web3) {
          await wallet.initialise(
            context.user.web3.provider,
            context.user.web3.wallet
          );
        }
      },
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
    },
    actions: {
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
          web3: event.data.web3,
        }),
      }),
      assignVisitingFarmIdFromUrl: assign({
        visitingFarmId: (_) => getFarmIdFromUrl(),
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
      isVisitingUrl: () => window.location.href.includes("visit"),
      hasDiscordCode: () => !!getDiscordCode(),
    },
  }
);
