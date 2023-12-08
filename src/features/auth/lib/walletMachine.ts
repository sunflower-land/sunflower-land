import { createMachine, Interpreter, State, assign } from "xstate";
import { CONFIG } from "lib/config";

import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { web3ConnectStrategyFactory } from "./web3-connect-strategy/web3ConnectStrategy.factory";
import { wallet } from "lib/blockchain/wallet";
import { ERRORS } from "lib/errors";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";

export const ART_MODE = !CONFIG.API_URL;

export interface Context {
  address?: string;
  linkedAddress?: string;
  nftID?: number;
  errorCode: string;
  provider: any; // TODO?
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
    | "missingNFT"
    | "minting"
    | "ready"
    // Error states
    | "wrongWallet"
    // | "missingWeb3"
    // | "wrongNetwork"
    // | "duplicateAddress"
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
    address: "",
    linkedAddress: "",
    nftID: 123, // TODO
    errorCode: "",
    provider: null,
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
        src: async (context, event) => {
          const _event = event as ConnectWalletEvent | undefined;
          console.log({ _event });
          const chosenWallet =
            _event?.chosenProvider ?? context.user.web3?.wallet;
          if (!chosenWallet) {
            throw new Error("Could not determine wallet provider.");
          }

          console.log({ wallet });
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

          console.log("LETS GO");
          await wallet.initialise(web3.provider, web3.wallet);

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
            target: "ready",
            actions: assign<Context, any>({
              provider: (_, event) => event.data.provider,
              address: (_, event) => event.data.address,
            }),
          },
        ],
        onError: [
          {
            target: "error",
            actions: assign<Context, any>({
              errorCode: (_context, event) => event.data.message,
            }),
          },
        ],
      },
    },

    wrongWallet: {},

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
            target: "linking",
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

          console.log({ link: signature });

          await new Promise((r) => setTimeout(r, 1000));
        },
        onDone: [
          {
            target: "missingNFT",
            cond: (context) => !context.nftID,
          },
          {
            target: "ready",
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    missingNFT: {
      on: {
        MINT: {
          target: "minting",
        },
      },
    },

    minting: {
      id: "minting",
      invoke: {
        src: async (context, event) => {
          await new Promise((r) => setTimeout(r, 1000));
        },
        onDone: [
          {
            target: "ready",
          },
        ],
        onError: {
          target: "error",
        },
      },
    },

    ready: {},

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
