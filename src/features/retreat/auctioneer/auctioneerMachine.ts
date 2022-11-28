import { fetchAuctioneerSupply } from "features/game/actions/auctioneer";
import { mint } from "features/game/actions/mint";
import { GoblinRetreatItemName } from "features/game/types/craftables";
import { Inventory } from "lib/blockchain/Inventory";
import { CONFIG } from "lib/config";
import Web3 from "web3";
import { createMachine, Interpreter, assign } from "xstate";
import { Item } from "../components/auctioneer/actions/auctioneerItems";
import { escalate } from "xstate/lib/actions";
import { wallet } from "lib/blockchain/wallet";

export interface Context {
  farmId: number;
  sessionId: string;
  token: string;
  auctioneerItems: Item[];
  auctioneerId: string;
}

type MintEvent = {
  type: "MINT";
  item: GoblinRetreatItemName;
  captcha: string;
};

export type MintedEvent = {
  item: GoblinRetreatItemName;
  sessionId: string;
};

type TickEvent = {
  type: "TICK";
  auctioneerItems: Item[];
};

type RefreshEvent = {
  type: "REFRESH";
};

export type BlockchainEvent = TickEvent | MintEvent | RefreshEvent;

export type AuctioneerMachineState = {
  value: "loading" | "playing" | "minting" | "minted" | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  AuctioneerMachineState
>;

export const auctioneerMachine = createMachine<
  Context,
  BlockchainEvent,
  AuctioneerMachineState
>({
  id: "auctioneerMachine",
  initial: "loading",
  states: {
    loading: {
      invoke: {
        src: async (context) => {
          const ids = context.auctioneerItems.map((item) => item.id);
          const supply = await fetchAuctioneerSupply(ids);

          const auctioneerItems = context.auctioneerItems.map(
            (item, index) => ({
              ...item,
              totalMinted: supply[index],
            })
          );

          return { auctioneerItems };
        },
        onDone: {
          target: "playing",
          actions: assign({
            auctioneerItems: (_, event) => event.data.auctioneerItems,
          }),
        },
        onError: {
          actions: escalate((_, event) => ({
            message: event.data.message,
          })),
        },
      },
    },
    playing: {
      on: {
        MINT: {
          target: "minting",
        },
        TICK: {
          actions: assign({
            auctioneerItems: (_, event) => event.auctioneerItems,
          }),
        },
      },
      invoke: {
        src: (context) => (callback) => {
          if (context.auctioneerId === undefined) {
            throw Error("Could not find auction id");
          }

          const web3 = new Web3(
            `wss://polygon-${CONFIG.NETWORK}.g.alchemy.com/v2/${Buffer.from(
              context.auctioneerId,
              "base64"
            ).toString("ascii")}`
          );
          const inventory = new Inventory(web3, wallet.myAccount as string);

          const id = setInterval(async () => {
            if (context.auctioneerItems === undefined) {
              throw Error("Could not find auction id");
            }

            const ids = context.auctioneerItems.map((item) => item.id);
            const supply = await inventory.getSupply(ids);

            const auctioneerItems = context.auctioneerItems.map(
              (item, index) => ({
                ...item,
                totalMinted: supply[index],
              })
            );

            callback({
              type: "TICK",
              auctioneerItems,
            });
          }, 1000);

          // Perform cleanup
          return () => clearInterval(id);
        },
        onError: {
          actions: escalate((_, event) => ({
            message: event.data.message,
          })),
        },
      },
    },
    minting: {
      invoke: {
        src: async (context, event) => {
          const { item, captcha } = event as MintEvent;

          const { sessionId } = await mint({
            farmId: Number(context.farmId),
            sessionId: context.sessionId as string,
            token: context.token as string,
            item,
            captcha,
          });

          return {
            sessionId,
            item,
          } as MintedEvent;
        },
        onDone: {
          target: "minted",
          actions: assign((_, event) => ({
            sessionId: event.data.sessionId,
            actions: [],
          })),
        },
        onError: {
          actions: escalate((_, event) => ({
            message: event.data.message,
          })),
        },
      },
    },
    minted: {
      on: {
        REFRESH: "finish",
      },
    },
    finish: {
      type: "final",
    },
  },
});
