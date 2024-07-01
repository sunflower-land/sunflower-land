import { createMachine, Interpreter, assign } from "xstate";
import { QuestName } from "features/game/types/quests";
import { loadQuests } from "./actions/loadQuests";
import { mintQuestItem } from "./actions/mintQuestItem";
import { wallet } from "lib/blockchain/wallet";

export interface Context {
  jwt: string;
  quests: QuestName[];
  currentQuest?: QuestName;
  bumpkinId: number;
  farmId: number;
}

export type BlockchainEvent =
  | {
      type: "MINT";
    }
  | {
      type: "CONTINUE";
    };

export type QuestMachineState = {
  value:
    | "introduction"
    | "loading"
    | "idle"
    | "minting"
    | "minted"
    | "complete"
    | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  BlockchainEvent,
  QuestMachineState
>;

export const questMachine = createMachine<
  Context,
  BlockchainEvent,
  QuestMachineState
>({
  id: "questMachine",
  initial: "introduction",
  states: {
    introduction: {
      on: {
        CONTINUE: {
          target: "loading",
        },
      },
    },
    loading: {
      invoke: {
        src: async (context) => {
          if (!wallet.myAccount) throw new Error("No account");

          const completedQuests = await loadQuests(
            context.quests,
            context.bumpkinId,
            wallet.myAccount,
          );

          const currentQuest = completedQuests.find(
            (quest) => !quest.isComplete,
          );

          return {
            currentQuest,
          };
        },
        onDone: [
          {
            target: "idle",
            cond: (_, event) => !!event.data.currentQuest,
            actions: assign<Context, any>({
              currentQuest: (_context, event) => event.data.currentQuest.name,
            }),
          },
          {
            target: "complete",
            actions: assign<Context, any>({
              currentQuest: undefined,
            }),
          },
        ],
        onError: {
          target: "error",
        },
      },
    },
    idle: {
      on: {
        MINT: {
          target: "minting",
        },
      },
    },
    minting: {
      invoke: {
        src: async (context) => {
          if (!wallet.myAccount) throw new Error("No account");

          await mintQuestItem({
            quest: context.currentQuest as QuestName,
            jwt: context.jwt,
            farmId: context.farmId,
            account: wallet.myAccount,
          });
        },
        onDone: {
          target: "minted",
        },
        onError: {
          target: "error",
        },
      },
    },
    minted: {
      on: {
        CONTINUE: {
          target: "loading",
        },
      },
    },
    error: {
      on: {
        CONTINUE: {
          target: "loading",
        },
      },
    },
    complete: {
      type: "final",
    },
  },
});
