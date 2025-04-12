import { createMachine, Interpreter, State, assign } from "xstate";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import { getFarms } from "lib/blockchain/Farm";
import { mintNFTFarm } from "./actions/mintFarm";
import { getCreatedAt } from "lib/blockchain/AccountMinter";
import { Connector } from "wagmi";
import {
  getAccount,
  connect,
  signMessage,
  CreateConnectorFn,
  disconnect,
} from "@wagmi/core";
import { config } from "./WalletProvider";
import { generateSignatureMessage, wallet } from "lib/blockchain/wallet";
import { Effect, postEffect } from "features/game/actions/effect";
import { randomID } from "lib/utils/random";

export const ART_MODE = !CONFIG.API_URL;

export interface Context {
  id?: number;
  address?: string;
  linkedAddress?: string;
  farmAddress?: string;
  errorCode: string;
  jwt?: string;
  signature?: string;
  action?: WalletAction;
  nftReadyAt?: number;
  nftId?: number;
  chainId?: number;
  signInAttempts?: number;
}

export type WalletAction =
  | "specialEvent"
  | "login"
  | "deposit"
  | "confirmDeposit" // Only used if the player has items in their wallet
  | "withdraw"
  | "purchase"
  | "confirmPurchase" // Only used if the player has POL
  | "donate"
  | "dailyReward"
  | "sync"
  | "dequip"
  | "marketplace"
  | "transfer";

// Certain actions do not require an NFT to perform
const NON_NFT_ACTIONS: WalletAction[] = [
  "login",
  "deposit",
  "purchase",
  "donate",
  "dailyReward",
  "specialEvent",
  "dequip",
  "marketplace",
];

const NON_POLYGON_ACTIONS: WalletAction[] = ["login", "dailyReward"];

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
  connector: Connector | CreateConnectorFn;
};

export type WalletEvent =
  | InitialiseEvent
  | ConnectWalletEvent
  | { type: "CONTINUE" }
  | { type: "BACK" }
  | { type: "RESET" }
  | { type: "MINT" }
  | {
      type: "CHAIN_CHANGED";
    }
  | {
      type: "ACCOUNT_CHANGED";
    }
  | {
      type: "DISCONNECT_WALLET";
    };

export type WalletState = {
  value:
    | "initialising"
    | "chooseWallet"
    | "signing"
    | "signingFailed"
    | "linking"
    | "minting"
    | "waiting"
    | "migrating"
    | "ready"
    // Error states
    | "missingNFT"
    | "wrongWallet"
    | "wrongNetwork"
    | "networkNotSupported"
    | "alreadyLinkedWallet"
    | "alreadyHasFarm"
    | "error"
    | "disconnecting";

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
    jwt: "",
    signature: "",
    nftReadyAt: 0,
    action: "" as WalletAction,
    signInAttempts: 0,
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
          const connector = _event?.connector;
          if (!connector) {
            throw new Error("Could not determine wallet provider.");
          }

          let account = getAccount(config);
          // Either the player has tried to connect a different wallet, or they are connecting for the first time
          if (
            account.connector?.uid !== (connector as Connector).uid ||
            account.isDisconnected
          ) {
            try {
              await connect(config, { connector });
            } catch (e) {
              if ((e as any)?.code === 4001) {
                throw new Error(ERRORS.WEB3_REJECTED);
              }

              throw new Error(ERRORS.NO_WEB3);
            }
            account = getAccount(config);
          }

          return {
            address: account.address,
            chainId: account.chain?.id,
          };
        },
        onDone: {
          target: "checking",
          actions: assign<Context, any>({
            address: (_: Context, event: any) => event.data.address,
            chainId: (_: Context, event: any) => event.data.chainId,
          }),
        },
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
          target: "wrongNetwork",
          cond: (context) =>
            !NON_POLYGON_ACTIONS.includes(context.action as WalletAction) &&
            context.chainId !== CONFIG.POLYGON_CHAIN_ID,
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
    signingFailed: {
      on: {
        CONTINUE: {
          target: "signing",
          actions: assign<Context, any>({
            signInAttempts: (_context) => (_context.signInAttempts ?? 0) + 1,
          }),
        },
        BACK: {
          target: "chooseWallet",
          actions: assign<Context, any>({
            signInAttempts: (_context) => 0,
          }),
        },
      },
    },
    disconnecting: {
      invoke: {
        src: async () => {
          await disconnect(config);
        },
        onDone: {
          target: "chooseWallet",
        },
        onError: {
          target: "error",
          actions: assign<Context, any>({
            errorCode: (_context, event) => event.data.message,
          }),
        },
      },
      on: {
        CONNECT_TO_WALLET: {
          target: "initialising",
        },
      },
    },
    signing: {
      id: "signing",
      on: {
        DISCONNECT_WALLET: {
          target: "disconnecting",
        },
        BACK: {
          target: "chooseWallet",
        },
      },
      invoke: {
        src: async (context: Context) => {
          const timestamp = Math.floor(Date.now() / 8.64e7);

          const signature = await signMessage(config, {
            message: generateSignatureMessage({
              address: context.address!,
              nonce: timestamp,
            }),
          });

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
        onError: [
          {
            target: "signingFailed",
            cond: (context) => context.signInAttempts === 0,
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
    linking: {
      id: "linking",
      invoke: {
        src: async (context, event: any) => {
          const signature = event.data.signature;

          await postEffect({
            farmId: Number(context.id),
            token: context.jwt as string,
            transactionId: randomID(), // TODO
            effect: {
              type: "wallet.linked",
              linkedWallet: context.address as string,
              signature,
            } as Effect,
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
        src: async (context) => {
          const createdAt = await getCreatedAt(
            context.address as `0x${string}`,
            context.address as `0x${string}`,
          );

          if (createdAt) {
            // Ensure they still have a farm (wasn't a long time ago)
            const farms = await getFarms(context.address as `0x${string}`);
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
        src: async (context) => {
          const { data } = await postEffect({
            farmId: Number(context.id),
            token: context.jwt as string,
            transactionId: randomID(),
            effect: {
              type: "account.migrated",
            } as Effect,
          });

          return {
            farmAddress: data.farmAddress,
            farmId: data.farmId,
            nftId: data.nftId,
          };
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

    switchingToPolygon: {
      invoke: {
        src: async () => {
          await wallet.switchToPolygon();

          const account = getAccount(config);

          return {
            address: account.address,
            chainId: account.chain?.id,
          };
        },
        onError: {
          target: "networkNotSupported",
        },
        onDone: {
          target: "checking",
          actions: assign({
            address: (_: Context, event: any) => event.data.address,
            chainId: (_: Context, event: any) => event.data.chainId,
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
    wrongWallet: {
      on: {
        CONTINUE: {
          target: "chooseWallet",
        },
      },
    },
    wrongNetwork: {
      on: {
        CONTINUE: {
          target: "switchingToPolygon",
        },
      },
    },
    networkNotSupported: {
      on: {
        CONTINUE: {
          target: "chooseWallet",
        },
      },
    },
    alreadyLinkedWallet: {},
    alreadyHasFarm: {},
    error: {
      on: {
        CONTINUE: {
          target: "chooseWallet",
        },
      },
    },
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
