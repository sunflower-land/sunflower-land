import { CHICKEN_FEEDING_TIME } from "features/game/lib/constants";
import { assign, createMachine, State } from "xstate";

const INTERVAL = 1; // 1 second

interface ChickenContext {
  timeElapsed: number;
  timeToEgg: number;
  timeInCurrentState: number;
}

export type ChickenState = {
  value:
    | "hungry"
    | "fed"
    | { fed: "eating" }
    | { fed: "sleeping" }
    | { fed: "walking" }
    | { fed: "happy" }
    | "layingEgg"
    | "eggReady";
  context: ChickenContext;
};

type ChickenEvent = { type: "FEED" } | { type: "COLLECT" } | { type: "TICK" };

export type MachineState = State<ChickenContext, ChickenEvent, ChickenState>;

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const assignTimeInState = assign<ChickenContext, any>({
  timeInCurrentState: (context) => context.timeElapsed + getRndInteger(10, 15),
});

const reset = assign<ChickenContext, ChickenEvent>({
  timeElapsed: 0,
  timeInCurrentState: 0,
});

export const chickenMachine = createMachine<
  ChickenContext,
  ChickenEvent,
  ChickenState
>({
  initial: "hungry",
  context: {
    timeElapsed: 0,
    timeInCurrentState: 0,
    timeToEgg: CHICKEN_FEEDING_TIME,
  },
  states: {
    hungry: {
      on: {
        FEED: {
          target: "fed",
          actions: assignTimeInState,
        },
      },
    },
    fed: {
      initial: "eating",
      invoke: {
        src: () => (cb) => {
          const interval = setInterval(() => {
            cb("TICK");
          }, 1000 * INTERVAL);

          return () => {
            clearInterval(interval);
          };
        },
      },
      states: {
        eating: {
          always: {
            target: "happy",
            cond: (context) => {
              return context.timeElapsed > context.timeInCurrentState;
            },
            actions: assignTimeInState,
          },
        },
        happy: {
          always: {
            target: "walking",
            cond: (context) => {
              return context.timeElapsed > context.timeInCurrentState;
            },
            actions: assignTimeInState,
          },
        },
        walking: {
          always: {
            target: "sleeping",
            cond: (context) => {
              return context.timeElapsed > context.timeInCurrentState;
            },
            actions: assignTimeInState,
          },
        },
        sleeping: {
          always: {
            target: "walking",
            cond: (context) => {
              return context.timeElapsed > context.timeInCurrentState;
            },
            actions: assignTimeInState,
          },
        },
      },
      always: {
        target: "layingEgg",
        cond: (context) => {
          return context.timeElapsed > context.timeToEgg;
        },
        actions: reset,
      },
      on: {
        TICK: {
          actions: assign({
            timeElapsed: (context) => +context.timeElapsed + INTERVAL,
          }),
        },
      },
    },
    layingEgg: {
      after: {
        // after laying gif is finished
        5000: { target: "eggReady" },
      },
    },
    eggReady: {
      on: {
        COLLECT: {
          target: "hungry",
        },
      },
    },
  },
});
