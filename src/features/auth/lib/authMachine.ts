import {
  createMachine,
  assign,
  fromPromise,
  ActorRefFrom,
  SnapshotFrom,
} from "xstate";
import { CONFIG } from "lib/config";
import { ERRORS, ErrorCode } from "lib/errors";

import {
  saveReferrerId,
  getReferrerId as getReferrerIdFromLS,
} from "../actions/createAccount";
import { login, Token, decodeToken } from "../actions/login";
import { randomID } from "lib/utils/random";
import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { getToken, removeJWT, saveJWT } from "../actions/social";
import { signUp, UTM } from "../actions/signup";
import { claimFarm } from "../actions/claimFarm";
import { BumpkinParts } from "lib/utils/tokenUriBuilder";
import { removeMinigameJWTs } from "features/world/ui/community/actions/portal";

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

const storeUTMs = () => {
  const urlParams = new URLSearchParams(window.location.search);

  const utm_source = urlParams.get("utm_source");
  if (utm_source) localStorage.setItem("utm_source", utm_source);

  const utm_medium = urlParams.get("utm_medium");
  if (utm_medium) localStorage.setItem("utm_medium", utm_medium);

  const utm_campaign = urlParams.get("utm_campaign");
  if (utm_campaign) localStorage.setItem("utm_campaign", utm_campaign);

  const utm_content = urlParams.get("utm_content");
  if (utm_content) localStorage.setItem("utm_content", utm_content);

  const utm_term = urlParams.get("utm_term");
  if (utm_term) localStorage.setItem("utm_term", utm_term);
};

const getUTMs = (): UTM => {
  const utm_source = localStorage.getItem("utm_source");
  const utm_medium = localStorage.getItem("utm_medium");
  const utm_campaign = localStorage.getItem("utm_campaign");
  const utm_content = localStorage.getItem("utm_content");
  const utm_term = localStorage.getItem("utm_term");

  return {
    source: utm_source ?? undefined,
    medium: utm_medium ?? undefined,
    campaign: utm_campaign ?? undefined,
    content: utm_content ?? undefined,
    term: utm_term ?? undefined,
  };
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
}

export interface Context {
  user: Authentication;
  errorCode?: ErrorCode;
  transactionId?: string;
  visitingFarmId?: number;
  showPWAInstallPrompt?: boolean;
}

type StartEvent = Farm & {
  type: "START_GAME";
};

type ReturnEvent = {
  type: "RETURN";
};

type PWAInstallPromptShown = {
  type: "PWA_INSTALL_PROMPT_SHOWN";
};

export type CreateFarmEvent = {
  type: "CREATE_FARM";
  donation?: number;
  captcha?: string;
  hasEnoughMatic?: boolean;
  equipment: BumpkinParts;
};

type LoadFarmEvent = {
  type: "LOAD_FARM";
};

type ConnectedWalletEvent = {
  type: "CONNECTED";
  address: string;
  signature: string;
};

type ClaimFarmEvent = {
  type: "CLAIM";
  id: number;
};

export type BlockchainEvent =
  | StartEvent
  | ReturnEvent
  | CreateFarmEvent
  | LoadFarmEvent
  | ConnectedWalletEvent
  | PWAInstallPromptShown
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
  | ClaimFarmEvent
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
    | "unauthorised"
    | "authorised"
    | "connected"
    | "noAccount"
    | "walletInUse"
    | "creating"
    | "claiming";
  context: Context;
};

export type MachineInterpreter = ActorRefFrom<typeof authMachine>;

export type AuthMachineState = SnapshotFrom<typeof authMachine>;

export const authMachine = createMachine(
  {
    id: "authMachine",
    initial: ART_MODE ? "connected" : "idle",
    types: {} as {
      context: Context;
      events: BlockchainEvent;
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

          storeUTMs();
        },
        always: [
          {
            target: "authorised",
            guard: () => !!getToken(),
            actions: [
              "assignWeb2Token",
              "saveToken",
              "setShowPWAInstallPrompt",
            ],
          },
          {
            target: "welcome",
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
          input: ({ context, event }: any) => ({
            transactionId: context.transactionId as string,
            address: (event as ConnectedWalletEvent).address,
            signature: (event as ConnectedWalletEvent).signature,
          }),
          onDone: [
            {
              target: "verifying",
              actions: ["assignToken"],
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
            target: "authorised",
            actions: ["assignToken", "saveToken"],
          },
        },
      },
      authorised: {
        always: [
          {
            target: "noAccount",
            guard: ({ context }) => !context.user.token?.farmId,
          },
          {
            target: "connected",
          },
        ],
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
          PWA_INSTALL_PROMPT_SHOWN: {
            actions: "unsetShowPWAInstallPrompt",
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
        entry: ({ context }) => {
          window.location.href = `${window.location.pathname}#/visit/${context.visitingFarmId}`;
        },
        on: {
          RETURN: {
            target: "idle",
            actions: ["refreshFarm", "deleteFarmIdUrl"],
          },
        },
      },
      noAccount: {
        on: {
          CREATE_FARM: {
            target: "creating",
          },
          CLAIM: {
            target: "claiming",
          },
          BACK: {
            target: "idle",
          },
        },
      },
      walletInUse: {
        on: {
          CLAIM: {
            target: "claiming",
          },
          BACK: {
            target: "idle",
          },
        },
      },
      creating: {
        entry: "setTransactionId",
        invoke: {
          src: fromPromise(
            async ({
              input,
            }: {
              input: {
                rawToken: string;
                transactionId: string;
                equipment: BumpkinParts;
              };
            }) => {
              const { token } = await signUp({
                token: input.rawToken,
                transactionId: input.transactionId,
                referrerId: getReferrerIdFromLS(),
                utm: getUTMs(),
                equipment: input.equipment,
              });

              return { token };
            },
          ),
          input: ({ context, event }: any) => ({
            rawToken: context.user.rawToken as string,
            transactionId: context.transactionId as string,
            equipment: (event as CreateFarmEvent).equipment,
          }),
          onDone: [
            {
              target: "connected",
              actions: ["assignToken", "saveToken"],
            },
          ],
          onError: [
            {
              target: "walletInUse",
              guard: ({ event }: any) =>
                event.error.message === ERRORS.SIGN_UP_FARM_EXISTS_ERROR,
            },
            {
              target: "unauthorised",
              actions: "assignErrorMessage",
            },
          ],
        },
      },

      claiming: {
        entry: "setTransactionId",
        invoke: {
          src: fromPromise(
            async ({
              input,
            }: {
              input: {
                rawToken: string;
                transactionId: string;
                farmId: number;
              };
            }) => {
              const { token } = await claimFarm({
                token: input.rawToken,
                transactionId: input.transactionId,
                farmId: input.farmId,
              });

              return {
                token,
              };
            },
          ),
          input: ({ context, event }: any) => ({
            rawToken: context.user.rawToken as string,
            transactionId: context.transactionId as string,
            farmId: (event as ClaimFarmEvent).id,
          }),
          onDone: [
            {
              target: "connected",
              actions: ["assignToken", "saveToken"],
            },
          ],
          onError: {
            target: "unauthorised",
            actions: "assignErrorMessage",
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
    actors: {
      login: fromPromise(
        async ({
          input,
        }: {
          input: {
            transactionId: string;
            address: string;
            signature: string;
          };
        }): Promise<{ token: string | null }> => {
          const { token } = await login({
            transactionId: input.transactionId,
            address: input.address,
            signature: input.signature,
          });

          return { token };
        },
      ),
    },
    actions: {
      assignToken: assign({
        user: ({ context, event }: any) => ({
          ...context.user,
          token: decodeToken(event.output.token),
          rawToken: event.output.token,
        }),
      }),
      saveToken: ({ context, event }: { context: Context; event: any }) => {
        const hasParamsJWT = new URLSearchParams(window.location.search).get(
          "token",
        );
        if (hasParamsJWT) {
          window.history.pushState({}, "", window.location.pathname);
        }

        saveJWT(event.output?.token ?? context.user.rawToken);
      },
      assignWeb2Token: assign({
        user: ({ context }: any) => ({
          ...context.user,
          token: decodeToken(getToken() as string),
          rawToken: getToken() as string,
        }),
      }),
      assignErrorMessage: assign({
        errorCode: ({ event }: any) => event.error.message,
      }),

      assignVisitingFarmIdFromUrl: assign({
        visitingFarmId: () => getFarmIdFromUrl(),
      }),
      refreshFarm: assign({
        visitingFarmId: undefined,
      }),
      clearSession: () => {
        removeJWT();
        removeMinigameJWTs();
      },
      deleteFarmIdUrl: deleteFarmUrl,
      setTransactionId: assign({
        transactionId: () => randomID(),
      }),
      clearTransactionId: assign({
        transactionId: () => undefined,
      }),
      setShowPWAInstallPrompt: assign({
        showPWAInstallPrompt: () =>
          new URLSearchParams(window.location.search).get("pwaInstall") ===
          "true",
      }),
      unsetShowPWAInstallPrompt: assign({
        showPWAInstallPrompt: () => false,
      }),
    },
    guards: {
      isVisitingUrl: () => window.location.href.includes("visit"),
      hasDiscordCode: () => !!getDiscordCode(),
    },
  },
);
