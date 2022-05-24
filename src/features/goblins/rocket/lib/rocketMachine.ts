import { createMachine, Interpreter, assign } from "xstate";

import { metamask } from "lib/blockchain/metamask";

import { Inventory } from "features/game/types/game";
import { mint } from "features/game/actions/mint";
import { ErrorCode } from "lib/errors";

export interface Context {
  errorCode?: ErrorCode;
}

export type RocketEvent =
  | {
      type: "LAUNCH";
    }
  | {
      type: "REPAIR";
    }
  | {
      type: "START_MISSION";
    }
  | {
      type: "REWARD";
    };

export type RocketState = {
  value:
    | "loading"
    | "crashed"
    | "repairing"
    | "repaired"
    | "launching"
    | "launched"
    | "completed"
    | "rewarding"
    | "rewarded"
    | "error";
  context: Context;
};

export type MachineInterpreter = Interpreter<
  Context,
  any,
  RocketEvent,
  RocketState
>;

const assignErrorMessage = assign<Context, any>({
  errorCode: (_: Context, event: any) => event.data.message,
});

type RocketMachineArgs = {
  inventory: Inventory;
  id: number;
  sessionId: string;
  token: string;
};

export const createRocketMachine = ({
  inventory,
  id,
  sessionId,
  token,
}: RocketMachineArgs) =>
  createMachine<Context, RocketEvent, RocketState>(
    {
      id: "rocket",
      initial: inventory.Observatory ? "rewarded" : "loading",
      context: {},
      states: {
        loading: {
          invoke: {
            src: async () => {
              const isComplete = await metamask
                .getMillionOnMars()
                .hasCompletedMission();
              return { isComplete };
            },
            onDone: [
              {
                target: "completed",
                cond: (_, event) => event.data.isComplete,
              },
              {
                target: "launched",
                cond: () => inventory["Engine Core"]?.gt(0),
              },
              {
                target: "crashed",
              },
            ],
            onError: {
              target: "error",
              actions: assignErrorMessage,
            },
          },
        },
        crashed: {
          on: {
            REPAIR: {
              target: "repairing",
            },
          },
        },
        repairing: {
          invoke: {
            src: async () => {
              await mint({
                farmId: Number(id),
                sessionId: sessionId as string,
                token: token as string,
                item: "Engine Core",
                captcha: "0x",
              });
            },
            onDone: {
              target: "repaired",
            },
            onError: {
              target: "error",
              actions: assignErrorMessage,
            },
          },
        },
        repaired: {
          on: {
            LAUNCH: {
              target: "launching",
            },
          },
        },
        launching: {
          on: {
            START_MISSION: {
              target: "launched",
            },
          },
        },
        completed: {
          on: {
            REWARD: {
              target: "rewarding",
            },
          },
        },
        rewarding: {
          invoke: {
            src: async () => {
              await metamask.getMillionOnMars().trade(id);
            },
            onDone: {
              target: "rewarded",
            },
            onError: {
              target: "error",
              actions: assignErrorMessage,
            },
          },
        },
        rewarded: {},
        launched: {},
        error: {},
      },
    },
    {}
  );
