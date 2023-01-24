import { InventoryItemName } from "features/game/types/game";
import { assign, createMachine, Interpreter, State } from "xstate";

export interface DiggingContext {
  id: number;
  discovered?: InventoryItemName | null;
  dugAt?: number;
}

export type DiggingState = {
  value:
    | "loading"
    | "idle"
    | "digging"
    | "noShovel"
    | "treasureFound"
    | "treasureNotFound"
    | "opacityTransition"
    | "acknowledged"
    | "dug";
  context: DiggingContext;
};

type FinishDiggingEvent = {
  type: "FINISH_DIGGING";
  discovered: InventoryItemName | null;
  dugAt: number;
};

type DiggingEvent =
  | FinishDiggingEvent
  | { type: "NO_SHOVEL" }
  | { type: "DIG" }
  | { type: "ACKNOWLEDGE" };

export type MachineState = State<DiggingContext, DiggingEvent, DiggingState>;

export type MachineInterpreter = Interpreter<
  DiggingContext,
  any,
  DiggingEvent,
  DiggingState
>;

export const canDig = (dugAt?: number) => {
  if (!dugAt) return true;

  const today = new Date().getUTCDay();

  return new Date(dugAt).getUTCDay() !== today;
};

/**
 * Machine to handle digging for treasure UI only
 */
export const treasureDigMachine = createMachine<
  DiggingContext,
  DiggingEvent,
  DiggingState
>({
  initial: "loading",
  states: {
    loading: {
      always: [
        {
          target: "dug",
          cond: (context) => !canDig(context.dugAt),
        },
        { target: "idle" },
      ],
    },
    idle: {
      on: {
        DIG: { target: "digging" },
        NO_SHOVEL: { target: "noShovel" },
      },
    },
    noShovel: {
      after: {
        1000: {
          target: "idle",
        },
      },
    },
    digging: {
      on: {
        FINISH_DIGGING: [
          {
            target: "treasureFound",
            cond: (_: DiggingContext, event: FinishDiggingEvent) => {
              return !!event.discovered;
            },
            actions: assign<DiggingContext, FinishDiggingEvent>({
              discovered: (_, event) => event.discovered,
              dugAt: (_, event) => event.dugAt,
            }),
          },
          {
            target: "treasureNotFound",
            actions: assign<DiggingContext, FinishDiggingEvent>({
              discovered: (_, event) => event.discovered,
              dugAt: (_, event) => event.dugAt,
            }),
          },
        ],
      },
    },
    treasureFound: {
      on: {
        ACKNOWLEDGE: { target: "opacityTransition" },
      },
    },
    treasureNotFound: {
      on: {
        ACKNOWLEDGE: { target: "opacityTransition" },
      },
    },
    opacityTransition: {
      after: {
        150: { target: "dug" },
      },
    },
    dug: {
      after: {
        1000: [
          {
            target: "idle",
            cond: (context) => canDig(context.dugAt),
          },
          {
            target: "dug",
          },
        ],
      },
    },
  },
});
