import { createMachine, Interpreter, assign } from "xstate";
import { escalate, sendParent } from "xstate/lib/actions";
import { randomID } from "lib/utils/random";
import { AuctioneerItemName } from "features/game/types/auctioneer";
import { bid } from "features/game/actions/bid";
import { GameState } from "features/game/types/game";
import { getAuctionResults } from "features/game/actions/getAuctionResults";
import { autosave } from "features/game/actions/autosave";
import { AuctioneerItem } from "../components/auctioneer/actions/auctioneerItems";
import { mintAuctionItem } from "features/game/actions/mintAuctionItem";

export interface Context {
  farmId: number;
  sessionId: string;
  token: string;
  deviceTrackerId: string;
  bid?: GameState["auctioneer"]["bid"];
  auctioneerItems: AuctioneerItem[];
  auctioneerId: string;
  transactionId?: string;
  results?: {
    status: "loser" | "winner" | "pending";
    minimum: {
      lotteryTickets: number;
      biddedAt: number;
    };
    participantCount: number;
    supply: number;
  };
}

type BidEvent = {
  type: "BID";
  item: AuctioneerItemName;
  lotteryTickets: number;
};

type MintEvent = {
  type: "MINT";
  item: AuctioneerItemName;
};

export type MintedEvent = {
  item: AuctioneerItemName;
  sessionId: string;
};

type TickEvent = {
  type: "TICK";
  auctioneerItems: AuctioneerItem[];
};

type RefreshEvent = {
  type: "REFRESH";
};

export type BlockchainEvent =
  | TickEvent
  | BidEvent
  | RefreshEvent
  | { type: "DRAFT_BID" }
  | { type: "CHECK_RESULTS" }
  | { type: "MINT" }
  | { type: "REFUND" };

export type AuctioneerMachineState = {
  value:
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
    initial: "loser",
    states: {
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
            const { item, lotteryTickets } = event as BidEvent;

            console.log({ event });
            const { game } = await bid({
              farmId: Number(context.farmId),
              token: context.token as string,
              item,
              transactionId: context.transactionId as string,
              lotteryTickets,
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
              sendParent((context, event) => ({
                type: "UPDATE_SESSION",
                inventory: event.data.inventory,
                balance: event.data.balance,
                sessionId: context.sessionId,
                deviceTrackerId: context.deviceTrackerId,
              })),
              assign({
                bid: (_, event) => event.data.bid,
              }),
            ],
          },
          onError: {
            actions: escalate((_, event) => ({
              message: event.data.message,
            })),
          },
        },
      },
      bidded: {
        on: {
          CHECK_RESULTS: "checkingResults",
          REFRESH: "finish",
        },
      },
      checkingResults: {
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            const auctionResult = await getAuctionResults({
              farmId: Number(context.farmId),
              token: context.token as string,
              item: context.bid?.item as AuctioneerItemName,
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
            actions: escalate((_, event) => ({
              message: event.data.message,
            })),
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
              item: context.bid?.item as AuctioneerItemName,
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
            actions: escalate((_, event) => ({
              message: event.data.message,
            })),
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
