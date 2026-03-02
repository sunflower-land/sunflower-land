import { createMachine, assign, fromPromise, ActorRefFrom } from "xstate";
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

export type MachineInterpreter = ActorRefFrom<
  ReturnType<typeof createAuctioneerMachine>
>;

export const createAuctioneerMachine = ({
  onUpdate,
}: {
  onUpdate: (game: GameState) => void;
}) =>
  createMachine({
    types: {} as {
      context: Context;
      events: BlockchainEvent;
    },
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
          type: "wearable",
          wearable: "Acorn Hat",
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
        entry: assign({ transactionId: () => randomID() }),
        invoke: {
          src: fromPromise(
            async ({
              input,
            }: {
              input: { token: string; transactionId: string };
            }) => {
              const { auctions, totalSupply } = await loadAuctions({
                token: input.token,
                transactionId: input.transactionId,
              });

              return {
                auctions,
                totalSupply,
                auctionId:
                  auctions.length > 0 ? auctions[0].auctionId : undefined,
              };
            },
          ),
          input: ({ context }) => ({
            token: context.token,
            transactionId: context.transactionId as string,
          }),
          onDone: {
            target: "initialising",
            actions: [
              assign({
                totalSupply: ({ event }) => (event as any).output.totalSupply,
                auctions: ({ event }) => (event as any).output.auctions,
                auctionId: ({ event }) => (event as any).output.auctionId,
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
            guard: ({ context }) => {
              return !context.canAccess;
            },
          },
          {
            target: "noWallet",
            guard: ({ context }) => {
              return !context.linkedAddress;
            },
          },
          {
            target: "missingAuction",
            guard: ({ context }) =>
              !!context.bid &&
              !context.auctions.find(
                (auction) => auction.auctionId === context.bid?.auctionId,
              ),
          },
          {
            target: "bidded",
            guard: ({ context }) => !!context.bid,
          },
          {
            target: "introduction",
            guard: () => !localStorage.getItem("auctioneer_tutorial"),
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
        entry: assign({ transactionId: () => randomID() }),
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
        entry: assign({ transactionId: () => randomID() }),
        invoke: {
          src: fromPromise(
            async ({
              input,
            }: {
              input: {
                farmId: number;
                token: string;
                transactionId: string;
                tickets: number;
                auctionId: string;
              };
            }) => {
              const { game } = await bid({
                farmId: Number(input.farmId),
                token: input.token,
                auctionId: input.auctionId,
                transactionId: input.transactionId,
                tickets: input.tickets,
              });

              onUpdate(game);

              return {
                bid: game.auctioneer.bid,
              };
            },
          ),
          input: ({ context, event }) => {
            const e = event as BidEvent;
            return {
              farmId: context.farmId,
              token: context.token,
              transactionId: context.transactionId as string,
              tickets: e.tickets,
              auctionId: e.auctionId,
            };
          },
          onDone: {
            target: "bidded",
            actions: [
              assign({
                bid: ({ event }) => (event as any).output.bid,
              }),
            ],
          },
          onError: {
            target: "error",
          },
        },
      },
      cancelling: {
        entry: assign({ transactionId: () => randomID() }),
        invoke: {
          src: fromPromise(
            async ({
              input,
            }: {
              input: {
                farmId: number;
                token: string;
                transactionId: string;
                auctionId: string;
              };
            }) => {
              const { game } = await cancelBidAction({
                farmId: Number(input.farmId),
                auctionId: input.auctionId,
                token: input.token,
                transactionId: input.transactionId,
              });

              onUpdate(game);

              return {
                bid: game.auctioneer.bid,
              };
            },
          ),
          input: ({ context }) => {
            if (!context.bid) {
              throw new Error("No bid to cancel");
            }
            return {
              farmId: context.farmId,
              token: context.token,
              transactionId: context.transactionId as string,
              auctionId: context.bid.auctionId,
            };
          },
          onDone: {
            target: "playing",
            actions: [
              assign({
                bid: ({ event }) => (event as any).output.bid,
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
        entry: assign({ transactionId: () => randomID() }),
        invoke: {
          src: fromPromise(
            async ({
              input,
            }: {
              input: {
                farmId: number;
                token: string;
                auctionId: string;
                transactionId: string;
              };
            }) => {
              const auctionResult = await getAuctionResults({
                farmId: Number(input.farmId),
                token: input.token,
                auctionId: input.auctionId,
                transactionId: input.transactionId,
              });

              return { auctionResult };
            },
          ),
          input: ({ context }) => ({
            farmId: context.farmId,
            token: context.token,
            auctionId: context.bid?.auctionId as string,
            transactionId: context.transactionId as string,
          }),
          onDone: [
            {
              guard: ({ event }) =>
                (event as any).output.auctionResult.status === "winner",
              target: "winner",
              actions: assign({
                results: ({ event }) => (event as any).output.auctionResult,
              }),
            },
            {
              guard: ({ event }) =>
                (event as any).output.auctionResult.status === "tiebreaker",
              target: "tiebreaker",
              actions: assign({
                results: ({ event }) => (event as any).output.auctionResult,
              }),
            },
            {
              guard: ({ event }) =>
                (event as any).output.auctionResult.status === "loser",
              target: "loser",
              actions: assign({
                results: ({ event }) => (event as any).output.auctionResult,
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
        target: CONFIG.API_URL ? ".loading" : ".initialising",
        actions: assign({
          bid: ({ event }) => (event as OpenEvent).gameState.auctioneer.bid,
        }),
      },
    },
  });
