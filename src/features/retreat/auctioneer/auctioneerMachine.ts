import { mint } from "features/game/actions/mint";
import { createMachine, Interpreter, assign } from "xstate";
import { escalate, sendParent } from "xstate/lib/actions";
import { randomID } from "lib/utils/random";
import { AuctioneerItemName } from "features/game/types/auctioneer";
import { bid } from "features/game/actions/bid";
import { GameState } from "features/game/types/game";
import { getAuctionResults } from "features/game/actions/getAuctionResults";
import { autosave } from "features/game/actions/autosave";
import { AuctioneerItem } from "../components/auctioneer/actions/auctioneerItems";

export interface Context {
  farmId: number;
  sessionId: string;
  token: string;
  deviceTrackerId: string;
  bid?: GameState["auctioneer"]["bid"];
  auctioneerItems: AuctioneerItem[];
  auctioneerId: string;
  transactionId?: string;
}

type BidEvent = {
  type: "BID";
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
  | { type: "CHECK_RESULTS" }
  | { type: "MINT" }
  | { type: "REFUND" };

export type AuctioneerMachineState = {
  value:
    | "initialising"
    | "playing"
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
    initial: "initialising",
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
          BID: {
            target: "bidding",
          },
        },
      },
      bidding: {
        entry: "setTransactionId",
        invoke: {
          src: async (context, event) => {
            const { item } = event as BidEvent;

            const { game } = await bid({
              farmId: Number(context.farmId),
              sessionId: context.sessionId as string,
              token: context.token as string,
              item,
              transactionId: context.transactionId as string,
            });

            return {
              inventory: game.inventory,
              balance: game.balance,
            };
          },
          onDone: {
            target: "bidded",
            actions: sendParent((context, event) => ({
              type: "UPDATE_SESSION",
              inventory: event.data.inventory,
              balance: event.data.balance,
              sessionId: context.sessionId,
              deviceTrackerId: context.deviceTrackerId,
            })),
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
            const { item } = event as BidEvent;

            const { status } = await getAuctionResults({
              farmId: Number(context.farmId),
              token: context.token as string,
              item,
              transactionId: context.transactionId as string,
            });

            return { status };
          },
          onDone: [
            {
              cond: (_, event) => event.data.status === "winner",
              target: "winner",
            },
            {
              cond: (_, event) => event.data.status === "loser",
              target: "loser",
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
            const { item } = event as BidEvent;

            const { sessionId } = await mint({
              farmId: Number(context.farmId),
              sessionId: context.sessionId as string,
              token: context.token as string,
              item,
              captcha: "0x",
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
            const { farm } = await autosave({
              farmId: Number(context.farmId),
              sessionId: context.sessionId as string,
              actions: [
                {
                  type: "bid.refunded",
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
