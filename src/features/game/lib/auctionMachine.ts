import { createMachine, Interpreter, assign } from "xstate";
import { randomID } from "lib/utils/random";
import { bid } from "features/game/actions/bid";
import { GameState, InventoryItemName } from "features/game/types/game";
import { getAuctionResults } from "features/game/actions/getAuctionResults";
import { autosave } from "features/game/actions/autosave";
import { BumpkinItem } from "../types/bumpkin";
import { CONFIG } from "lib/config";
import { loadAuctions } from "features/retreat/components/auctioneer/actions/loadAuctions";

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
  token: string;
  bid?: GameState["auctioneer"]["bid"];
  auctions: Auction[];
  auctionId: string;
  transactionId: string;
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
  auctionId: string;
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
    | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  AuctioneerMachineState
>;

// Updates - placeBid, refund

export const createAuctioneerMachine = ({
  onUpdate,
}: {
  onUpdate: (game: GameState) => void;
}) =>
  createMachine<Context, BlockchainEvent, AuctioneerMachineState>(
    {
      id: "auctioneerMachine",
      initial: "idle",
      context: {
        farmId: 0,
        transactionId: "?",
        auctionId: "test-auction-1",
        token: "",
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
        idle: {},
        loading: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              console.log({ event });
              const { auctions } = await loadAuctions({
                token: context.token,
                transactionId: context.transactionId as string,
              });
              console.log({
                auctions,
                id: auctions.length > 0 ? auctions[0].auctionId : undefined,
              });

              return {
                auctions,
                auctionId:
                  auctions.length > 0 ? auctions[0].auctionId : undefined,
              };
            },
            onDone: {
              target: "initialising",
              actions: [
                assign({
                  auctions: (_, event) => event.data.auctions,
                  auctionId: (_, event) => event.data.auctionId,
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
              const { tickets, auctionId } = event as BidEvent;

              const auction = context.auctions.find(
                (a) => a.auctionId === auctionId
              ) as Auction;

              console.log({ auction, context });

              const { game } = await bid({
                farmId: Number(context.farmId),
                token: context.token as string,
                auctionId,
                transactionId: context.transactionId as string,
                tickets,
              });

              onUpdate(game);

              return {
                bid: game.auctioneer.bid,
              };
            },
            onDone: {
              target: "bidded",
              actions: [
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
              console.log({ bid: context.bid });
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
                cond: (_, event) =>
                  event.data.auctionResult.status === "winner",
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

        winner: {},

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
                  sessionId: "X",
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

                onUpdate(farm as GameState);
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
      on: {
        OPEN: {
          target: CONFIG.API_URL ? "loading" : "initialising",
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
