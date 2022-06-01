import { CHICKEN_FEEDING_TIME } from "features/game/lib/constants";
import { assign, createMachine, State } from "xstate";

const INTERVAL = 1; // 1 second

export interface ChickenContext {
  timeElapsed: number;
  timeToEgg: number;
  timeInCurrentState: number;
  isFed: boolean;
}

export type ChickenState = {
  value:
    | "hungry"
    | "fed"
    | { fed: "eating" }
    | { fed: "sleeping" }
    | { fed: "happy" }
    | "eggReady"
    | "eggLaid";
  context: ChickenContext;
};

type ChickenFeedEvent = {
  type: "FEED";
  timeToEgg: number;
};

type ChickenEvent =
  | ChickenFeedEvent
  | { type: "COLLECT" }
  | { type: "TICK" }
  | { type: "LAY" };

export type MachineState = State<ChickenContext, ChickenEvent, ChickenState>;

function getRndInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const assignTimeInState = assign<ChickenContext, any>({
  timeInCurrentState: (context) => context.timeElapsed + getRndInteger(10, 15),
});

const reset = assign<ChickenContext, any>({
  timeElapsed: 0,
  timeInCurrentState: 0,
  isFed: false,
  timeToEgg: Math.ceil(CHICKEN_FEEDING_TIME / 1000),
});

const assignFeedDetails = assign<ChickenContext, ChickenFeedEvent>({
  timeToEgg: (_, event) => event.timeToEgg,
  isFed: true,
});

const assignTimeElapsed = assign<ChickenContext, any>({
  timeElapsed: (context) => context.timeElapsed + INTERVAL,
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
      timeToEgg: Math.ceil(CHICKEN_FEEDING_TIME / 1000), // seconds
      isFed: false,
    },
    states: {
      loading: {
        always: [
          {
            target: "hungry",
            cond: (context) => !context.isFed,
          },
          {
            target: "eggReady",
            cond: (context) => context.timeToEgg === 0,
          },
          { target: "fed" },
        ],
      },
      hungry: {
        on: {
          FEED: {
            target: "fed",
            actions: [assignFeedDetails, assignTimeInState],
          },
        },
      },
      fed: {
        initial: "loading",
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
          loading: {
            always: [
              {
                target: "eating",
                cond: (context) => context.timeElapsed === 0,
              },
              {
                target: "happy",
              },
            ],
          },
          eating: {
            always: {
              target: "happy",
              cond: "timeToTransition",
              actions: assignTimeInState,
            },
          },
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
                actions: assignTimeInState,
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
                actions: assignTimeInState,
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
