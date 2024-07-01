import { createMachine, Interpreter, State, assign } from "xstate";
import { CONFIG } from "lib/config";

import { onboardingAnalytics } from "lib/onboardingAnalytics";
import { web3ConnectStrategyFactory } from "../auth/lib/web3-connect-strategy/web3ConnectStrategy.factory";
import { wallet } from "lib/blockchain/wallet";
import { Web3SupportedProviders } from "lib/web3SupportedProviders";
import { linkWallet } from "features/wallet/actions/linkWallet";
import { ERRORS } from "lib/errors";
import { getFarms } from "lib/blockchain/Farm";
import { mintNFTFarm } from "./actions/mintFarm";
import { migrate } from "./actions/migrate";
import { getCreatedAt } from "lib/blockchain/AccountMinter";

export const ART_MODE = !CONFIG.API_URL;

export interface Context {
  id?: number;
  address?: string;
  linkedAddress?: string;
  farmAddress?: string;
  errorCode: string;
  provider: any; // TODO?
  jwt?: string;
  signature?: string;
  action?: WalletAction;
  nftReadyAt?: number;
  nftId?: number;
}

export type WalletAction =
  | "specialEvent"
  | "login"
  | "deposit"
  | "withdraw"
  | "purchase"
  | "donate"
  | "dailyReward"
  | "sync"
  | "dequip"
  | "wishingWell"
  | "connectWallet";

// Certain actions do not require an NFT to perform
const NON_NFT_ACTIONS: WalletAction[] = [
  "login",
  "donate",
  "dailyReward",
  "specialEvent",
  "dequip",
];

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
  | {
      type: "CHAIN_CHANGED";
    }
  | {
      type: "ACCOUNT_CHANGED";
    };

export type WalletState = {
  value:
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
    | "alreadyHasFarm"
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

export const walletMachine = createMachine<Context, WalletEvent, WalletState>({
  id: "walletMachine",
  initial: "chooseWallet",
  context: {
    id: 0,
    nftId: 0,
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
            web3ConnectStrategy.getConnectEventType(),
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
        onDone: {
          target: "checking",
          actions: assign<Context, any>({
            provider: (_: Context, event: any) => event.data.provider,
            address: (_: Context, event: any) => event.data.address,
          }),
        },
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
    checking: {
      always: [
        {
          target: "chooseWallet",
          cond: (context) => !context.address,
        },
        {
          target: "wrongWallet",
          cond: (context) =>
            !!context.linkedAddress &&
            context.linkedAddress !== context.address,
        },
        {
          target: "signing",
          cond: (context) => !context.linkedAddress,
        },
        {
          target: "missingNFT",
          cond: (context) =>
            !NON_NFT_ACTIONS.includes(context.action as WalletAction) &&
            !context.farmAddress,
        },
        {
          target: "ready",
        },
      ],
    },
    signing: {
      id: "signing",
      invoke: {
        src: async (_: Context) => {
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
          actions: assign<Context, any>({
            errorCode: (_context, event) => event.data.message,
          }),
        },
      },
    },

    linking: {
      id: "linking",
      invoke: {
        src: async (context, event: any) => {
          const signature = event.data.signature;

          await linkWallet({
            id: context.id as number,
            jwt: context.jwt as string,
            linkedWallet: context.address as string,
            signature,
            transactionId: "TODOX", // TODO
          });

          await new Promise((r) => setTimeout(r, 1000));
        },
        onDone: [
          {
            target: "missingNFT",
            cond: (context) =>
              !NON_NFT_ACTIONS.includes(context.action as WalletAction) &&
              !context.farmAddress,
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
            actions: assign<Context, any>({
              errorCode: (_context, event) => event.data.message,
            }),
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
            context.address as string,
            context.address as string,
          );

          if (createdAt) {
            // Ensure they still have a farm (wasn't a long time ago)
            const farms = await getFarms(
              wallet.web3Provider,
              context.address as string,
            );
            if (farms.length >= 1) {
              return {
                readyAt: (createdAt + 60) * 1000,
              };
            }
          }

          await mintNFTFarm({
            id: context.id as number,
            jwt: context.jwt as string,
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
        onError: [
          {
            cond: (_, event) =>
              event.data.message === ERRORS.WALLET_ALREADY_LINKED,
            target: "alreadyHasFarm",
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
          const { farmId, farmAddress, nftId } = await migrate({
            id: context.id as number,
            jwt: context.jwt as string,
            transactionId: "0xTODO",
          });

          return { farmAddress, farmId, nftId };
        },
        onDone: [
          {
            target: "ready",
            actions: assign({
              farmAddress: (_, event) => event.data.farmAddress,
              nftId: (_, event) => event.data.nftId,
            }),
          },
        ],
        onError: {
          target: "error",
          actions: assign<Context, any>({
            errorCode: (_context, event) => event.data.message,
          }),
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
    alreadyHasFarm: {},
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
      actions: assign<Context, any>({
        id: (_: Context) => 0,
        jwt: (_: Context) => undefined,
        linkedAddress: (_: Context) => undefined,
        farmAddress: (_: Context) => undefined,
        action: (_: Context) => undefined,
        signature: (_: Context) => undefined,
        address: (_: Context) => undefined,
        provider: (_: Context) => undefined,
      }),
    },
    INITIALISE: {
      target: "checking",
      actions: assign({
        id: (_, event: InitialiseEvent) => event.id,
        jwt: (_, event: InitialiseEvent) => event.jwt,
        linkedAddress: (_, event: InitialiseEvent) => event.linkedAddress,
        farmAddress: (_, event: InitialiseEvent) => event.farmAddress,
        action: (_, event: InitialiseEvent) => event.action,
      }),
    },
  },
});
