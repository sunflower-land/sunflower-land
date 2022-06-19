import { createMachine, Interpreter, assign } from "xstate";

import { Inventory } from "features/game/types/game";
import { mint } from "features/game/actions/mint";
import { ErrorCode } from "lib/errors";

export interface Context {
  errorCode?: ErrorCode;
}

export type RocketEvent =
  | {
      type: "GIFT_TELESCOPE";
    }
  | { type: "END_EVENT" };

export type RocketState = {
  value: "loading" | "available" | "launching" | "gifting" | "ended" | "error";
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

const canEndEvent = (inventory: Inventory) =>
  (!!inventory["Engine Core"] || !!inventory["Observatory"]) &&
  !inventory["Telescope"];

export const createRocketMachine = ({
  inventory,
  id,
  sessionId,
  token,
}: RocketMachineArgs) =>
  createMachine<Context, RocketEvent, RocketState>(
    {
      id: "rocket",
      initial: "loading",
      context: {},
      states: {
        loading: {
          always: [
            {
              target: "available",
              cond: () => canEndEvent(inventory),
            },
            {
              target: "ended",
              cond: () => !canEndEvent(inventory),
            },
          ],
        },
        available: {
          on: {
            GIFT_TELESCOPE: {
              target: "gifting",
            },
          },
        },
        gifting: {
          invoke: {
            src: async () => {
              await mint({
                farmId: Number(id),
                sessionId: sessionId as string,
                token: token as string,
                item: "Telescope",
                captcha: "0x",
              });
            },
            onDone: {
              target: "launching",
            },
            onError: {
              target: "error",
              actions: assignErrorMessage,
            },
          },
        },
        launching: {
          on: {
            END_EVENT: {
              target: "ended",
            },
          },
        },
        ended: {},
        error: {},
      },
    },
    {}
  );
