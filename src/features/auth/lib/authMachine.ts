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
} from "../actions/login";
import { oauthorise } from "../actions/oauth";
import { CharityAddress } from "../components/CreateFarm";
import { randomID } from "lib/utils/random";
import { getOnboardingComplete } from "../actions/onboardingComplete";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { loadSession, savePromoCode } from "features/game/actions/loadSession";
import { getToken, removeJWT, saveJWT } from "../actions/social";

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

type ConnectedWalletEvent = {
  type: "CONNECTED";
  address: string;
  signature: string;
};

export type BlockchainEvent =
  | StartEvent
  | ReturnEvent
  | CreateFarmEvent
  | LoadFarmEvent
  | ConnectWalletEvent
  | ConnectedWalletEvent
  | {
      type: "REFRESH";
    }
  | {
      type: "LOGOUT";
    }
  | { type: "CONTINUE" }
  | { type: "SIGNUP" }
  | { type: "BACK" }
  | { type: "CONNECT_TO_DISCORD" }
  | { type: "CONFIRM" }
  | { type: "SKIP" }
  | { type: "VERIFIED" }
  | { type: "SIGN_IN" };

export type BlockchainState = {
  value:
    | "idle"
    | "welcome"
    | "signIn"
    | "signUp"
    | "authorising"
    | "visiting"
    | "verifying"
    | "oauthorising"
    | "unauthorised"
    | "connected";
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
    preserveActionOrder: true,
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
            // TODO - look into verifying token
            target: "connected",
            cond: () => !!getToken(),
            actions: ["assignWeb2Token", () => saveJWT(getToken() as string)],
          },
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

      signIn: {
        id: "signIn",
        on: {
          CONNECTED: {
            target: "authorising",
          },
          BACK: {
            target: "welcome",
          },
        },
      },
      signUp: {
        id: "signUp",
        on: {
          CONNECTED: {
            target: "authorising",
          },
          BACK: {
            target: "welcome",
          },
        },
      },

      authorising: {
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
              actions: ["assignToken", "saveToken"],
            },
            {
              target: "verifying",
              actions: ["assignToken", "saveToken"],
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
            actions: ["assignToken", "saveToken"],
          },
        },
      },
      oauthorising: {
        entry: "setTransactionId",
        invoke: {
          src: "oauthorise",
          onDone: {
            target: "connected",
            actions: ["assignToken", "saveToken"],
          },
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
          },
        },
      },
      connected: {
        entry: "clearTransactionId",
        on: {
          RETURN: {
            target: "#idle",
            actions: ["refreshFarm", "deleteFarmIdUrl"],
          },
          REFRESH: {
            target: "#idle",
          },
          LOGOUT: {
            target: "#idle",
            actions: ["clearSession", "refreshFarm"],
          },
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
            target: "idle",
            actions: ["refreshFarm", "deleteFarmIdUrl"],
          },
        },
      },
    },
    on: {
      REFRESH: {
        target: "idle",
        actions: "refreshFarm",
      },
    },
  },
  {
    services: {
      login: async (context, event): Promise<{ token: string | null }> => {
        const { address, signature } = event as any as ConnectedWalletEvent;

        const { token } = await login({
          transactionId: context.transactionId as string,
          address,
          signature,
        });

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
      saveToken: (_: Context, event: any) => {
        // Save primary JWT
        saveJWT(event.data.token);

        // Save Session JWTs if jumping between accounts
        saveSession((event as any).data.account, {
          token: (event as any).data.token,
        });
      },

      assignWeb2Token: assign<Context, any>({
        user: (context, event) => ({
          ...context.user,
          token: decodeToken(getToken() as string),
          rawToken: getToken() as string,
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
      clearSession: () => {
        removeJWT();
        removeSession(wallet.myAccount as string);
      },
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
