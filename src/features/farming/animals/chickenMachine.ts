import { CHICKEN_TIME_TO_EGG } from "features/game/lib/constants";
import { assign, createMachine, Interpreter, State } from "xstate";

export interface ChickenContext {
  timeElapsed: number;
  timeToEgg: number;
  timeInCurrentState: number;
  fedAt: number;
}

export type ChickenState = {
  value:
    | "hungry"
    | "eating"
    | "fed"
    | { fed: "sleeping" }
    | { fed: "happy" }
    | "eggReady"
    | "eggLaid";
  context: ChickenContext;
};

type ChickenFeedEvent = {
  type: "FEED";
  fedAt: number;
};

type ChickenEvent =
  | ChickenFeedEvent
  | { type: "COLLECT" }
  | { type: "TICK" }
  | { type: "LAY" };

export type MachineState = State<ChickenContext, ChickenEvent, ChickenState>;

export type MachineInterpreter = Interpreter<
  ChickenContext,
  any,
  ChickenEvent,
  ChickenState
>;

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const assignRandomTimeInState = assign<ChickenContext, any>({
  timeInCurrentState: (context) => context.timeElapsed + getRndInteger(7, 21),
});

const reset = assign<ChickenContext, any>({
  timeElapsed: 0,
  timeInCurrentState: 0,
  fedAt: 0,
});

const assignFeedDetails = assign<ChickenContext, ChickenFeedEvent>({
  fedAt: (_, event) => event.fedAt,
});

const assignTimeElapsed = assign<ChickenContext, any>({
  timeElapsed: (context) => {
    const now = Date.now();

    return Math.floor((+now - context.fedAt) / 1000);
  },
});

export const chickenMachine = createMachine<
  ChickenContext,
  ChickenEvent,
  ChickenState
>(
  {
    initial: "loading",
    context: {
      timeElapsed: 0,
      timeInCurrentState: 0,
      timeToEgg: CHICKEN_TIME_TO_EGG / 1000, // seconds
      fedAt: 0,
    },
    states: {
      loading: {
        always: [
          {
            target: "hungry",
            cond: (context) => !context.fedAt,
          },
          {
            target: "eggReady",
            cond: (context) => context.timeToEgg === 0,
          },
          { target: "fed", actions: assignRandomTimeInState },
        ],
      },
      hungry: {
        on: {
          FEED: {
            target: "eating",
            actions: assignFeedDetails,
          },
        },
      },
      eating: {
        after: {
          7000: {
            target: "fed",
            actions: assignRandomTimeInState,
          },
        },
      },
      fed: {
        initial: "happy",
        invoke: {
          src: () => (cb) => {
            const interval = setInterval(() => {
              cb("TICK");
            }, 1000);

            return () => {
              clearInterval(interval);
            };
          },
        },
        states: {
          happy: {
            id: "happy",
            always: [
              {
                target: "#eggReady",
                cond: "isEggReady",
              },
              {
                target: "sleeping",
                cond: "timeToTransition",
                actions: assignRandomTimeInState,
              },
            ],
          },
          sleeping: {
            always: [
              {
                target: "#eggReady",
                cond: "isEggReady",
              },
              {
                target: "happy",
                cond: "timeToTransition",
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
        id: "eggReady",
        on: {
          LAY: {
            target: "eggLaid",
          },
        },
      },
      eggLaid: {
        on: {
          COLLECT: {
            target: "hungry",
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
