import { createMachine, Interpreter, State, assign } from "xstate";
import { CONFIG } from "lib/config";

import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { web3ConnectStrategyFactory } from "../auth/lib/web3-connect-strategy/web3ConnectStrategy.factory";
import { wallet } from "lib/blockchain/wallet";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";
import { linkWallet } from "features/wallet/actions/linkWallet";
import { ERRORS } from "lib/errors";
import { getFarms } from "lib/blockchain/Farm";
import { mintFarm } from "./actions/mintFarm";
import { migrate } from "./actions/migrate";
import { getCreatedAt } from "lib/blockchain/AccountMinter";

export const ART_MODE = !CONFIG.API_URL;

export interface Context {
  address?: string;
  linkedAddress?: string;
  farmAddress?: string;
  errorCode: string;
  provider: any; // TODO?
  jwt?: string;
  signature?: string;
  action?: WalletAction;
  nftReadyAt?: number;
}

export type WalletAction =
  | "login"
  | "deposit"
  | "withdraw"
  | "purchase"
  | "donate"
  | "dailyReward"
  | "sync";

// Certain actions do not require an NFT to perform
const NON_NFT_ACTIONS: WalletAction[] = ["login", "donate", "dailyReward"];

type InitialiseEvent = {
  type: "INITIALISE";
  id: number;
  jwt: string;
  linkedAddress: string;
  farmAddress: string;
  action: WalletAction;
};

type ConnectWalletEvent = {
  type: "CONNECT_TO_WALLET";
  chosenProvider: Web3SupportedProviders;
};

export type WalletEvent =
  | InitialiseEvent
  | ConnectWalletEvent
  | { type: "CONTINUE" }
  | { type: "RESET" }
  | { type: "MINT" }
  | { type: "REFRESH" }
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
    | "chooseWallet"
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
    nftReadyAt: 0,
    action: "" as WalletAction,
  },
  states: {
    idle: {
      on: {
        INITIALISE: {
          target: "chooseWallet",
          actions: assign({
            id: (_, event: InitialiseEvent) => event.id,
            jwt: (_, event: InitialiseEvent) => event.jwt,
            linkedAddress: (_, event: InitialiseEvent) => event.linkedAddress,
            farmAddress: (_, event: InitialiseEvent) => event.farmAddress,
            action: (_, event: InitialiseEvent) => event.action,
          }),
        },
      },
    },
    chooseWallet: {
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
            cond: (context) =>
              !NON_NFT_ACTIONS.includes(context.action) && !context.farmAddress,
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
            cond: (context) =>
              !NON_NFT_ACTIONS.includes(context.action) && !context.farmAddress,
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
          const createdAt = await getCreatedAt(
            wallet.web3Provider,
            context.address,
            context.address
          );

          if (createdAt) {
            // Ensure they still have a farm (wasn't a long time ago)
            const farms = await getFarms(wallet.web3Provider, context.address);
            if (farms.length >= 1) {
              return {
                readyAt: (createdAt + 60) * 1000,
              };
            }
          }

          await mintFarm({
            id: context.id,
            jwt: context.jwt,
            transactionId: "0xTODO",
          });

          return {
            readyAt: Date.now() + 60 * 1000,
          };
        },
        onDone: [
          {
            target: "migrating",
            cond: (_, event) => Date.now() > event.data.readyAt,
          },
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
          const { farmId, farmAddress } = await migrate({
            id: context.id,
            jwt: context.jwt,
            transactionId: "0xTODO",
          });

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
      target: "chooseWallet",
    },
    ACCOUNT_CHANGED: {
      target: "chooseWallet",
    },
    RESET: {
      target: "chooseWallet",
      actions: assign({
        id: (_) => 0,
        jwt: (_) => undefined,
        linkedAddress: (_) => undefined,
        farmAddress: (_) => undefined,
        action: (_) => undefined,
        signature: (_) => undefined,
        address: (_) => undefined,
      }),
    },
  },
});
