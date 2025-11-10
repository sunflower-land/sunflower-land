import { createMachine, Interpreter, assign } from "xstate";
import { randomID } from "lib/utils/random";
import { bid } from "features/game/actions/bid";
import { cancelBid as cancelBidAction } from "features/game/actions/cancelBid";
import {
  GameState,
  InventoryItemName,
  AuctionNFT,
} from "features/game/types/game";
import { getAuctionResults } from "features/game/actions/getAuctionResults";
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
  chapterLimit: number;
};

export type CollectibleAuction = AuctionBase & {
  type: "collectible";
  collectible: InventoryItemName;
};

export type WearableAuction = AuctionBase & {
  type: "wearable";
  wearable: BumpkinItem;
};

export type NFTAuction = AuctionBase & {
  type: "nft";
  nft: AuctionNFT;
  startId: number;
  chapterLimit: number;
};

export type Auction = CollectibleAuction | WearableAuction | NFTAuction;

export type LeaderboardBid = {
  rank: number;
  tickets: number;
  experience: number;
  sfl: number;
  items: Partial<Record<InventoryItemName, number>>;
  farmId: number;
  username?: string;
};

export type AuctionResults = {
  status: "loser" | "winner" | "pending" | "tiebreaker";
  leaderboard: LeaderboardBid[];
  participantCount: number;
  rank: number;
  supply: number;
  endAt: number;
};
export interface Context {
  farmId: number;
  token: string;
  deviceTrackerId: string;
  username?: string;
  bid?: GameState["auctioneer"]["bid"];
  auctions: Auction[];
  totalSupply: Record<string, number>;
  auctionId: string;
  transactionId: string;
  results?: AuctionResults;
  canAccess: boolean;
  linkedAddress?: string;
}

type BidEvent = {
  type: "BID";
  tickets: number;
  auctionId: string;
};

export type MintedEvent = {
  item: InventoryItemName | BumpkinItem | AuctionNFT;
  sessionId: string;
};

type RefreshEvent = {
  type: "REFRESH";
};

type OpenEvent = {
  type: "OPEN";
  gameState: GameState;
};

export type BlockchainEvent =
  | BidEvent
  | RefreshEvent
  | OpenEvent
  | { type: "DRAFT_BID" }
  | { type: "CANCEL" }
  | { type: "CHECK_RESULTS" }
  | { type: "REFUND" }
  | { type: "CONTINUE" };

export type AuctioneerMachineState = {
  value:
    | "idle"
    | "noAccess"
    | "introduction"
    | "loading"
    | "initialising"
    | "playing"
    | "draftingBid"
    | "bidding"
    | "cancelling"
    | "bidded"
    | "checkingResults"
    | "loser"
    | "tiebreaker"
    | "missingAuction"
    | "refunded"
    | "pending"
    | "winner"
    | "error";
  context: Context;
};

type AuctioneerStateSchema = {
  states: {
    [state in AuctioneerMachineState["value"]]: Record<string, never>;
  };
};

export type MachineInterpreter = Interpreter<
  Context,
  AuctioneerStateSchema,
  BlockchainEvent,
  AuctioneerMachineState
>;

export const createAuctioneerMachine = ({
  onUpdate,
}: {
  onUpdate: (game: GameState) => void;
}) =>
  createMachine<Context, BlockchainEvent, AuctioneerMachineState>(
    {
      id: "auctioneerMachine",
      initial: "initialising",
      context: {
        farmId: 0,
        transactionId: "?",
        auctionId: "test-auction-1",
        token: "",
        deviceTrackerId: "",
        canAccess: false,
        linkedAddress: "",
        totalSupply: {},

        // Offline testing
        results: {
          endAt: Date.now() + 100000,
          leaderboard: [
            {
              farmId: 44,
              experience: 10,
              items: { Gold: 50, Gem: 30, Radish: 50 },
              username: "Big Farmer",
              sfl: 1000,
              tickets: 5,
              rank: 1,
            },
            {
              farmId: 1,
              experience: 10,
              items: { Gold: 5, Gem: 3, Radish: 5 },
              sfl: 100,
              tickets: 5,
              username: "Top Dog",
              rank: 2,
            },
            {
              farmId: 122078,
              experience: 10,
              items: { Gold: 5, Gem: 3, Radish: 5 },
              sfl: 100,
              tickets: 5,
              rank: 3,
            },
            {
              farmId: 156788,
              experience: 10,
              items: { Gold: 5, Gem: 3, Radish: 5 },
              sfl: 100,
              tickets: 5,
              rank: 50,
            },
            // {
            //   farmId: 1,
            //   experience: 10,
            //   items: { Gold: 5, "Gem": 3, Radish: 5 },
            //   sfl: 100,
            //   tickets: 5,
            //   rank: 53,
            // },
          ],
          participantCount: 53,
          rank: 56,
          status: "winner",
          supply: 50,
        },

        auctions: [
          {
            auctionId: "test-auction-1",
            type: "collectible",
            collectible: "Sir Goldensnout",
            endAt: Date.now() + 70000,
            startAt: Date.now() - 1000,
            ingredients: {
              Wood: 1,
              Gold: 10,
            },
            sfl: 5,
            supply: 100,
            chapterLimit: 1,
          },
          {
            auctionId: "test-auction-2",
            type: "collectible",
            collectible: "Ancient Human Warhammer",
            startAt: Date.now() + 1000000,
            endAt: Date.now() + 1200000,
            ingredients: {
              Wood: 1,
              Gold: 10,
            },
            sfl: 5,
            supply: 5000,
            chapterLimit: 1,
          },
        ],
      },
      states: {
        idle: {},
        loading: {
          entry: "setTransactionId",
          invoke: {
            src: async (context) => {
              const { auctions, totalSupply } = await loadAuctions({
                token: context.token,
                transactionId: context.transactionId as string,
              });

              return {
                auctions,
                totalSupply,
                auctionId:
                  auctions.length > 0 ? auctions[0].auctionId : undefined,
              };
            },
            onDone: {
              target: "initialising",
              actions: [
                assign({
                  totalSupply: (_, event) => event.data.totalSupply,
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
              target: "noAccess",
              cond: (context) => {
                return !context.canAccess;
              },
            },
            {
              target: "noWallet",
              cond: (context) => {
                return !context.linkedAddress;
              },
            },
            {
              target: "missingAuction",
              cond: (context) =>
                !!context.bid &&
                !context.auctions.find(
                  (auction) => auction.auctionId === context.bid?.auctionId,
                ),
            },
            {
              target: "bidded",
              cond: (context) => !!context.bid,
            },
            {
              target: "introduction",
              cond: () => !localStorage.getItem("auctioneer_tutorial"),
            },
            {
              target: "playing",
            },
          ],
        },
        introduction: {
          on: {
            CONTINUE: {
              target: "playing",
              actions: () =>
                localStorage.setItem(
                  "auctioneer_tutorial",
                  Date.now().toString(),
                ),
            },
          },
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
            CANCEL: {
              target: "playing",
            },
          },
        },
        bidding: {
          entry: "setTransactionId",
          invoke: {
            src: async (context, event) => {
              const { tickets, auctionId } = event as BidEvent;

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
        cancelling: {
          entry: "setTransactionId",
          invoke: {
            src: async (context) => {
              if (!context.bid) {
                throw new Error("No bid to cancel");
              }

              const { game } = await cancelBidAction({
                farmId: Number(context.farmId),
                auctionId: context.bid.auctionId,
                token: context.token as string,
                transactionId: context.transactionId as string,
              });

              onUpdate(game);

              return {
                bid: game.auctioneer.bid,
              };
            },
            onDone: {
              target: "playing",
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
            CANCEL: "cancelling",
            CHECK_RESULTS: "checkingResults",
          },
        },
        checkingResults: {
          entry: "setTransactionId",
          invoke: {
            src: async (context) => {
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
                actions: assign({
                  results: (_, event) => event.data.auctionResult,
                }),
              },
              {
                cond: (_, event) =>
                  event.data.auctionResult.status === "tiebreaker",
                target: "tiebreaker",
                actions: assign({
                  results: (_, event) => event.data.auctionResult,
                }),
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
        noAccess: {},
        noWallet: {},

        missingAuction: {
          on: {
            REFUND: "refunded",
          },
        },

        loser: {
          on: {
            REFUND: "refunded",
          },
        },

        tiebreaker: {
          on: {
            REFUND: "refunded",
          },
        },

        pending: {},
        refunded: {},

        error: {
          on: {
            REFRESH: "loading",
          },
        },
      },
      on: {
        OPEN: {
          target: CONFIG.API_URL ? "loading" : "initialising",
          actions: assign({
            bid: (_, event) => event.gameState.auctioneer.bid,
          }),
        },
      },
    },
    {
      actions: {
        setTransactionId: assign<Context, BlockchainEvent>({
          transactionId: () => randomID(),
        }),
        clearTransactionId: assign<Context, BlockchainEvent>({
          transactionId: () => randomID(),
        }),
      },
    },
  );
