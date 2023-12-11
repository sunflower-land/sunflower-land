import { createMachine, Interpreter, State, assign } from "xstate";
import { CONFIG } from "lib/config";

import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { web3ConnectStrategyFactory } from "../auth/lib/web3-connect-strategy/web3ConnectStrategy.factory";
import { wallet } from "lib/blockchain/wallet";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";
import { linkWallet } from "features/wallet/actions/linkWallet";
import { ERRORS } from "lib/errors";
import { getFarms } from "lib/blockchain/Farm";

export const ART_MODE = !CONFIG.API_URL;

export interface Context {
  address?: string;
  linkedAddress?: string;
  farmAddress?: string;
  errorCode: string;
  provider: any; // TODO?
  jwt?: string;
  signature?: string;
  requiresNFT?: boolean;
}

type ConnectWalletEvent = {
  type: "CONNECT_TO_WALLET";
  chosenProvider: Web3SupportedProviders;
};

export type WalletEvent =
  | ConnectWalletEvent
  | { type: "CONTINUE" }
  | {
      type: "CHAIN_CHANGED";
    }
  | {
      type: "ACCOUNT_CHANGED";
    };

export type WalletState = {
  value:
    | "idle"
    | "initialising"
    | "signing"
    | "linking"
    | "minting"
    | "waiting"
    | "migrating"
    | "ready"
    // Error states
    | "missingNFT"
    | "wrongWallet"
    | "wrongNetwork"
    | "alreadyLinkedWallet"
    | "error";

  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  WalletEvent,
  WalletState
>;

export type WalletMachineState = State<Context, WalletEvent, WalletState>;

export const walletMachine = createMachine({
  id: "walletMachine",
  initial: "idle",
  context: {
    id: 0,
    address: "",
    linkedAddress: "",
    farmAddress: "",
    errorCode: "",
    provider: null,
    jwt: "",
    signature: "",
    requiresNFT: true,
    nftReadyAt: Date.now() + 3 * 1000,
    // wallet: "METAMASK", TODO
  },
  states: {
    idle: {
      on: {
        CONNECT_TO_WALLET: {
          target: "initialising",
        },
      },
    },

    initialising: {
      id: "initialising",
      invoke: {
        src: async (_: Context, event: any) => {
          const _event = event as ConnectWalletEvent | undefined;
          console.log({ _event });
          const chosenWallet = _event?.chosenProvider;
          if (!chosenWallet) {
            throw new Error("Could not determine wallet provider.");
          }

          const web3ConnectStrategy = web3ConnectStrategyFactory(chosenWallet);
          onboardingAnalytics.logEvent(
            web3ConnectStrategy.getConnectEventType()
          );
          if (!web3ConnectStrategy.isAvailable()) {
            web3ConnectStrategy.whenUnavailableAction();
            return;
          }
          await web3ConnectStrategy.initialize();
          await web3ConnectStrategy.requestAccounts();

          const web3 = {
            wallet: chosenWallet,
            provider: web3ConnectStrategy.getProvider(),
          };

          await wallet.initialise(web3.provider, web3.wallet);

          console.log("DEEP IN");
          return {
            address: wallet.myAccount,
            wallet: chosenWallet,
            provider: web3ConnectStrategy.getProvider(),
          };
        },
        onDone: [
          {
            target: "wrongWallet",
            actions: assign<Context, any>({
              provider: (_, event) => event.data.provider,
              address: (_, event) => event.data.address,
            }),
            cond: (context, event) =>
              !!context.linkedAddress &&
              context.linkedAddress !== event.data.address,
          },
          {
            target: "signing",
            actions: assign<Context, any>({
              provider: (_, event) => event.data.provider,
              address: (_, event) => event.data.address,
            }),
            cond: (context) => !context.linkedAddress,
          },
          {
            target: "missingNFT",
            actions: assign<Context, any>({
              provider: (_, event) => event.data.provider,
              address: (_, event) => event.data.address,
            }),
            cond: (context) => context.requiresNFT && !context.farmAddress,
          },
          {
            target: "ready",
            actions: assign<Context, any>({
              provider: (_, event) => event.data.provider,
              address: (_, event) => event.data.address,
            }),
          },
        ],
        onError: [
          {
            target: "wrongNetwork",
            cond: (_context, event) =>
              event.data.message === ERRORS.WRONG_CHAIN,
          },
          {
            target: "error",
            actions: assign<Context, any>({
              errorCode: (_context, event) => event.data.message,
            }),
          },
        ],
      },
    },

    signing: {
      id: "signing",
      invoke: {
        src: async (context) => {
          const timestamp = Math.floor(Date.now() / 8.64e7);
          const { signature } = await wallet.signTransaction(timestamp);

          return { signature };
        },
        onDone: [
          {
            target: "ready",
            actions: assign({
              signature: (_, event) => event.data.signature,
            }),
            // No farm ID = they are on login screen
            cond: (context) => !context.id,
          },
          {
            target: "linking",
            actions: assign({
              signature: (_, event) => event.data.signature,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    linking: {
      id: "linking",
      invoke: {
        src: async (context, event) => {
          const signature = event.data.signature;

          await linkWallet({
            id: context.id,
            jwt: context.jwt,
            linkedWallet: context.address,
            signature,
            transactionId: "TODOX", // TODO
          });

          await new Promise((r) => setTimeout(r, 1000));
        },
        onDone: [
          {
            target: "missingNFT",
            cond: (context) => context.requiresNFT && !context.farmAddress,
          },
          {
            target: "ready",
          },
        ],
        onError: [
          {
            cond: (_, event) =>
              event.data.message === ERRORS.WALLET_ALREADY_LINKED,
            target: "alreadyLinkedWallet",
          },
          {
            target: "error",
          },
        ],
      },
    },

    minting: {
      id: "minting",
      invoke: {
        src: async (context, event) => {
          // Already has a farm, let them wait
          const farms = await getFarms(wallet.web3Provider, context.address);
          if (farms.length === 0) {
            return {
              readyAt: Date.now() + 30 * 1000,
            };
          }

          // Call mint endpoint
          await new Promise((r) => setTimeout(r, 1000));

          return {
            readyAt: Date.now() + 30 * 1000,
          };
        },
        onDone: [
          {
            target: "waiting",
            actions: assign({
              nftReadyAt: (_, event) => event.data.readyAt,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    waiting: {
      on: {
        CONTINUE: {
          target: "migrating",
        },
      },
    },

    migrating: {
      id: "migrating",
      invoke: {
        src: async (context, event) => {
          await new Promise((r) => setTimeout(r, 1000));

          const farmAddress = "0x123"; // TODO
          const farmId = 9;

          return { farmAddress, farmId };
        },
        onDone: [
          {
            target: "ready",
            actions: assign({
              farmAddress: (_, event) => event.data.farmAddress,
              id: (_, event) => event.data.farmId,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    ready: {},

    // Error states
    missingNFT: {
      on: {
        MINT: {
          target: "minting",
        },
      },
    },
    wrongWallet: {},
    wrongNetwork: {},
    alreadyLinkedWallet: {},
    error: {},
  },
  on: {
    CHAIN_CHANGED: {
      target: "idle",
    },
    ACCOUNT_CHANGED: {
      target: "idle",
    },
  },
});
