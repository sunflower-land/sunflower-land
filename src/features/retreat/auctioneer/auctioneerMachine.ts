import { fetchAuctioneerSupply } from "features/game/actions/auctioneer";
import { mint } from "features/game/actions/mint";
import { GoblinRetreatItemName } from "features/game/types/craftables";
import { Inventory } from "lib/blockchain/Inventory";
import { metamask } from "lib/blockchain/metamask";
import { CONFIG } from "lib/config";
import { ERRORS } from "lib/errors";
import Web3 from "web3";
import { createMachine, Interpreter, assign } from "xstate";
import { Item } from "../components/auctioneer/actions/auctioneerItems";

export interface Context {
  farmId: number;
  sessionId: string;
  token: string;
  auctioneerItems: Item[];
  auctioneerId: string;
  auctioneerSupply?: number[];
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
  auctioneerSupply: number[];
};

export type BlockchainEvent = TickEvent | MintEvent;

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

          return {
            auctioneerSupply: supply.map(Number),
          };
        },
        onDone: {
          target: "playing",
          actions: assign({
            auctioneerSupply: (_, event) => event.data.auctioneerSupply,
          }),
        },
        // onError: {
        //   target: "#goblinMachine.error",
        //   actions: "assignErrorMessage",
        // },
      },
    },
    playing: {
      on: {
        MINT: {
          target: "minting",
        },
        TICK: {
          actions: assign({
            auctioneerSupply: (_, event) => event.auctioneerSupply,
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
          const inventory = new Inventory(web3, metamask.myAccount as string);

          const id = setInterval(async () => {
            if (context.auctioneerItems === undefined) {
              throw Error("Could not find auction id");
            }

            callback({
              type: "TICK",
              auctioneerSupply: await inventory.getSupply(
                context.auctioneerItems.map((item) => item.id)
              ),
            });
          }, 1000);

          // Perform cleanup
          return () => clearInterval(id);
        },
      },
    },
    minting: {
      invoke: {
        src: async (context, event) => {
          const { item, captcha } = event as MintEvent;

          console.log({ event });
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
        onError: [
          {
            target: "playing",
            cond: (_, event: any) =>
              event.data.message === ERRORS.REJECTED_TRANSACTION,
          },
          // {
          //   target: "#goblinMachine.error",
          //   actions: "assignErrorMessage",
          // },
        ],
      },
    },
    minted: {},
  },
});
