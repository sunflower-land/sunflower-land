import { createMachine, Interpreter, assign } from "xstate";
import { randomID } from "lib/utils/random";
import { bid } from "features/game/actions/bid";
import { Bid, GameState, InventoryItemName } from "features/game/types/game";
import { getAuctionResults } from "features/game/actions/getAuctionResults";
import { autosave } from "features/game/actions/autosave";
import { mintAuctionItem } from "features/game/actions/mintAuctionItem";
import { BumpkinItem } from "../types/bumpkin";
import { CONFIG } from "lib/config";
import { getKeys } from "../types/craftables";

export type AuctionBase = {
  auctionId: string;
  startAt: number;
  endAt: number;
  supply: number;
  sfl: number;
  ingredients: Partial<Record<InventoryItemName, number>>;
  type: "collectible" | "wearable";
};

export type AuctioneerItemName = BumpkinItem | InventoryItemName;

type CollectibleAuction = AuctionBase & {
  type: "collectible";
  collectible: InventoryItemName;
};

type WearableAuction = AuctionBase & {
  type: "wearable";
  wearable: BumpkinItem;
};

export type Auction = CollectibleAuction | WearableAuction;

export interface Context {
  farmId: number;
  sessionId: string;
  token: string;
  deviceTrackerId: string;
  bid?: GameState["auctioneer"]["bid"];
  auctions: Auction[];
  auctionId: string;
  transactionId?: string;
  results?: {
    status: "loser" | "winner" | "pending";
    minimum: {
      tickets: number;
      experience: number;
    };
    participantCount: number;
    supply: number;
  };
}

type BidEvent = {
  type: "BID";
  tickets: number;
};

type MintEvent = {
  type: "MINT";
  item: AuctioneerItemName;
};

export type MintedEvent = {
  item: AuctioneerItemName;
  sessionId: string;
};

type RefreshEvent = {
  type: "REFRESH";
};

export type BlockchainEvent =
  | BidEvent
  | RefreshEvent
  | { type: "OPEN" }
  | { type: "DRAFT_BID" }
  | { type: "CHECK_RESULTS" }
  | { type: "MINT" }
  | { type: "REFUND" };

export type AuctioneerMachineState = {
  value:
    | "idle"
    | "loading"
    | "initialising"
    | "playing"
    | "draftingBid"
    | "bidding"
    | "bidded"
    | "checkingResults"
    | "loser"
    | "refunding"
    | "refunded"
    | "pending"
    | "winner"
    | "error"
    // TODO - minting in parent machines
    | "minting"
    | "minted";
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
>(
  {
    id: "auctioneerMachine",
    initial: "idle",
    context: {
      auctionId: "test-auction-1",
      auctions: [
        {
          auctionId: "test-auction-1",
          type: "collectible",
          collectible: "Abandoned Bear",
          endAt: Date.now() + 1000000,
          startAt: Date.now() - 1000,
          ingredients: {
            Wood: 1,
            Gold: 10,
          },
          sfl: 5,
          supply: 100,
        },
      ],
    },
    states: {
      idle: {
        on: {
          OPEN: {
            target: CONFIG.API_URL ? "loading" : "initialising",
          },
        },
      },
      loading: {
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            await new Promise((r) => setTimeout(r, 3000));

            console.log({ event });
            const auctions: Auction[] = [];

            return {
              auctions,
              auction: auctions.length > 0 ? auctions[0].auctionId : undefined,
            };
          },
          onDone: {
            target: "initialising",
            actions: [
              assign({
                auctions: (_, event) => event.data.auctions,
              }),
            ],
          },
          onError: {
            target: "error",
          },
        },
      },
      initialising: {
        always: [
          {
            target: "bidded",
            cond: (context) => !!context.bid,
          },
          {
            target: "playing",
          },
        ],
      },
      playing: {
        entry: "clearTransactionId",
        on: {
          DRAFT_BID: {
            target: "draftingBid",
          },
        },
      },
      draftingBid: {
        on: {
          BID: {
            target: "bidding",
          },
        },
      },
      bidding: {
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            const { tickets } = event as BidEvent;

            console.log({ tickets });
            if (!CONFIG.API_URL) {
              const auction = context.auctions.find(
                (a) => a.auctionId === context.auctionId
              ) as Auction;
              console.log({ auction, context });
              const bid: Bid = {
                auctionId: context.auctionId,
                biddedAt: Date.now(),
                ingredients: getKeys(auction?.ingredients ?? {}).reduce(
                  (acc, name) => ({
                    ...acc,
                    [name]: (auction?.ingredients[name] ?? 0) * tickets,
                  }),
                  {}
                ),
                sfl: auction?.sfl * tickets,
                tickets,
                type: auction.type,
                collectible:
                  auction.type === "collectible"
                    ? auction.collectible
                    : undefined,
                wearable:
                  auction.type === "wearable" ? auction.wearable : undefined,
              };

              console.log({ bid });

              return { bid };
            }

            console.log({ event });
            const { game } = await bid({
              farmId: Number(context.farmId),
              token: context.token as string,
              auctionId: context.auctionId,
              transactionId: context.transactionId as string,
              tickets,
            });

            return {
              inventory: game.inventory,
              balance: game.balance,
              bid: game.auctioneer.bid,
            };
          },
          onDone: {
            target: "bidded",
            actions: [
              // sendParent((context, event) => ({
              //   type: "UPDATE_SESSION",
              //   inventory: event.data.inventory,
              //   balance: event.data.balance,
              //   sessionId: context.sessionId,
              //   deviceTrackerId: context.deviceTrackerId,
              // })),
              assign({
                bid: (_, event) => event.data.bid,
              }),
            ],
          },
          onError: {
            target: "error",
          },
        },
      },
      bidded: {
        on: {
          CHECK_RESULTS: "checkingResults",
        },
      },
      checkingResults: {
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            const auctionResult = await getAuctionResults({
              farmId: Number(context.farmId),
              token: context.token as string,
              auctionId: context.bid?.auctionId as string,
              transactionId: context.transactionId as string,
            });

            return { auctionResult };
          },
          onDone: [
            {
              cond: (_, event) => event.data.auctionResult.status === "winner",
              target: "winner",
            },
            {
              cond: (_, event) => event.data.auctionResult.status === "loser",
              target: "loser",
              actions: assign({
                results: (_, event) => event.data.auctionResult,
              }),
            },
            {
              target: "pending",
            },
          ],
          onError: {
            target: "error",
          },
        },
      },

      winner: {
        on: {
          MINT: "minting",
        },
      },

      minting: {
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            const { item } = event as MintEvent;
            console.log({ event });
            const { sessionId } = await mintAuctionItem({
              farmId: Number(context.farmId),
              sessionId: context.sessionId as string,
              token: context.token as string,
              auctionId: context.bid?.auctionId as string,
              transactionId: context.transactionId as string,
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
            target: "error",
          },
        },
      },
      minted: {
        on: {
          REFRESH: "finish",
        },
      },

      loser: {
        on: {
          REFUND: "refunding",
        },
      },

      pending: {},

      refunding: {
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            console.log({ event });
            try {
              const { farm } = await autosave({
                farmId: Number(context.farmId),
                sessionId: context.sessionId as string,
                actions: [
                  {
                    type: "bid.refunded",
                    createdAt: new Date(),
                  } as any,
                ],
                token: context.token as string,
                fingerprint: "0x",
                deviceTrackerId: context.deviceTrackerId as string,
                transactionId: context.transactionId as string,
              });

              return {
                inventory: farm?.inventory,
                balance: farm?.balance,
                sessionId: context.sessionId,
                deviceTrackerId: context.deviceTrackerId,
              };
            } catch (e) {
              console.log(`e: `, e);
            }
          },
          onDone: {
            target: "refunded",
          },
          onError: {
            target: "error",
          },
        },
      },

      refunded: {
        on: {
          REFRESH: "finish",
        },
      },

      finish: {
        type: "final",
      },
      error: {
        on: {
          REFRESH: "loading",
        },
      },
    },
  },
  {
    actions: {
      setTransactionId: assign<Context, any>({
        transactionId: () => randomID(),
      }),
      clearTransactionId: assign<Context, any>({
        transactionId: () => randomID(),
      }),
    },
  }
);
