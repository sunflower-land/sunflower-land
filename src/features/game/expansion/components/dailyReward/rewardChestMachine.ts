import { NetworkName } from "features/game/events/landExpansion/updateNetwork";
import { config } from "features/wallet/WalletProvider";
import { NETWORKS, trackDailyReward } from "lib/blockchain/DailyReward";
import { ERRORS } from "lib/errors";
import { getAccount } from "wagmi/actions";
import { assign, createMachine, Interpreter, State } from "xstate";

export interface DailyRewardContext {
  lastUsedCode: number;
  bumpkinLevel: number;
  code: number;
  openedAt: number;
  hasAccess: boolean;
}

/**
 * The Reward Chest can be opened every 24 hours.
 * A user must first 'unlock' it - submit an onchain transaction
 * A user can then  open it - submit a server request (dailyReward.opened)
 */
export type DailyRewardState = {
  value:
    | "initialising"
    | "comingSoon"
    | "locked"
    | "unlocking"
    | "unlocked"
    | "opening"
    | "opened"
    | "error";
  context: DailyRewardContext;
};

export type DailyRewardEvent =
  | { type: "OPEN" }
  | { type: "LOAD" }
  | { type: "UNLOCK" }
  | { type: "ACKNOWLEDGE" }
  | { type: "UPDATE_BUMPKIN_LEVEL"; bumpkinLevel: number };

export type MachineState = State<
  DailyRewardContext,
  DailyRewardEvent,
  DailyRewardState
>;

export type MachineInterpreter = Interpreter<
  DailyRewardContext,
  any,
  DailyRewardEvent,
  DailyRewardState
>;

export const rewardChestMachine = createMachine<
  DailyRewardContext,
  DailyRewardEvent,
  DailyRewardState
>({
  initial: "initialising",
  states: {
    initialising: {
      always: [
        {
          target: "comingSoon",
          cond: (context) => context.bumpkinLevel < 3,
        },
        {
          target: "opened",
          cond: (context) => {
            if (!context.openedAt) {
              return false;
            }

            // Recently opened
            const today = new Date().toISOString().substring(0, 10);
            return (
              new Date(context.openedAt).toISOString().substring(0, 10) ===
              today
            );
          },
        },
        { target: "locked" },
      ],
    },
    comingSoon: {
      on: {
        UPDATE_BUMPKIN_LEVEL: {
          actions: assign({
            bumpkinLevel: (_, event) => event.bumpkinLevel,
          }),
          target: "initialising",
        },
      },
    },
    locked: {
      on: {
        UNLOCK: "unlocking",
      },
    },
    unlocking: {
      invoke: {
        src: async (context) => {
          const { address, chain } = getAccount(config);

          if (!address || !chain) throw new Error("No account");

          const network = Object.entries(NETWORKS).find(
            ([_, network]) => network.id === chain.id,
          )?.[0] as NetworkName;

          if (!network) throw new Error("No network");

          const nextCode = (context.lastUsedCode + 1) % 100;
          await trackDailyReward({
            account: address,
            network,
            code: nextCode,
          });

          return { nextCode };
        },
        onDone: [
          {
            target: "unlocked",
            actions: assign({
              code: (_, event) => event.data.nextCode,
            }),
          },
        ],
        onError: [
          {
            target: "locked",
            cond: (_, event: any) =>
              event.data.message === ERRORS.REJECTED_TRANSACTION,
          },
          {
            target: "error",
          },
        ],
      },
    },
    unlocked: {
      on: {
        OPEN: "opening",
      },
    },
    opening: {
      on: {
        ACKNOWLEDGE: "opened",
      },
    },
    opened: {},
    error: {
      on: {
        LOAD: "locked",
      },
    },
  },
});
