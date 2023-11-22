import { CHICKEN_TIME_TO_EGG } from "features/game/lib/constants";
import { randomInt } from "lib/utils/random";
import { assign, createMachine, Interpreter, State } from "xstate";

export interface ChickenContext {
  timeElapsed: number;
  timeToEgg: number;
  timeInCurrentState: number;
  fedAt?: number;
}

export type ChickenState = {
  value:
    | "hungry" // Translation needed
    | "eating" // Translation needed
    | "fed" // Translation needed
    | { fed: "sleeping" } // Translation needed
    | { fed: "happy" } // Translation needed
    | "eggReady" // Translation needed
    | "eggLaid"; // Translation needed
  context: ChickenContext;
};

type ChickenFeedEvent = {
  type: "FEED"; // Translation needed
  fedAt: number;
};

type ChickenEvent =
  | ChickenFeedEvent
  | { type: "COLLECT" } // Translation needed
  | { type: "TICK" } // Translation needed
  | { type: "LAY" }; // Translation needed

export type MachineState = State<ChickenContext, ChickenEvent, ChickenState>;

export type MachineInterpreter = Interpreter<
  ChickenContext,
  any,
  ChickenEvent,
  ChickenState
>;

const assignRandomTimeInState = assign<ChickenContext, any>({
  timeInCurrentState: (context) => context.timeElapsed + randomInt(7, 22),
});

const reset = assign<ChickenContext, any>({
  timeElapsed: 0,
  timeInCurrentState: 0,
  fedAt: undefined,
});

const assignFeedDetails = assign<ChickenContext, ChickenFeedEvent>({
  fedAt: (_, event) => event.fedAt,
});

const assignTimeElapsed = assign<ChickenContext, any>({
  timeElapsed: (context) => {
    const now = Date.now();

    return Math.floor((+now - (context.fedAt as number)) / 1000);
  },
});

export const chickenMachine = createMachine<
  ChickenContext,
  ChickenEvent,
  ChickenState
>(
  {
    initial: "loading", // Translation needed
    context: {
      timeElapsed: 0,
      timeInCurrentState: 0,
      timeToEgg: CHICKEN_TIME_TO_EGG / 1000, // seconds
    },
    states: {
      loading: {
        always: [
          {
            target: "hungry", // Translation needed
            cond: (context) => isNaN(context.fedAt as number),
          },
          {
            target: "eggReady", // Translation needed
            cond: (context) => context.timeToEgg === 0,
          },
          { target: "fed", actions: assignRandomTimeInState }, // Translation needed
        ],
      },
      hungry: {
        on: {
          FEED: {
            target: "eating", // Translation needed
            actions: assignFeedDetails,
          },
        },
      },
      eating: {
        after: {
          5250: {
            target: "fed", // Translation needed
            actions: assignRandomTimeInState,
          },
        },
      },
      fed: {
        initial: "happy", // Translation needed
        invoke: {
          src: () => (cb) => {
            const interval = setInterval(() => {
              cb("TICK"); // Translation needed
            }, 1000);

            return () => {
              clearInterval(interval);
            };
          },
        },
        states: {
          happy: {
            id: "happy", // Translation needed
            always: [
              {
                target: "#eggReady", // Translation needed
                cond: "isEggReady", // Translation needed
              },
              {
                target: "sleeping", // Translation needed
                cond: "timeToTransition", // Translation needed
                actions: assignRandomTimeInState,
              },
            ],
          },
          sleeping: {
            always: [
              {
                target: "#eggReady", // Translation needed
                cond: "isEggReady", // Translation needed
              },
              {
                target: "happy", // Translation needed
                cond: "timeToTransition", // Translation needed
                actions: assignRandomTimeInState,
              },
            ],
          },
        },
        on: {
          TICK: {
            actions: assignTimeElapsed,
          },
        },
      },
      eggReady: {
        id: "eggReady", // Translation needed
        on: {
          LAY: {
            target: "eggLaid", // Translation needed
          },
        },
      },
      eggLaid: {
        on: {
          COLLECT: {
            target: "hungry", // Translation needed
            actions: reset,
          },
        },
      },
    },
  },
  {
    guards: {
      isEggReady: (context) => context.timeElapsed >= context.timeToEgg,
      timeToTransition: (context) =>
        context.timeElapsed > context.timeInCurrentState,
    },
  }
);
