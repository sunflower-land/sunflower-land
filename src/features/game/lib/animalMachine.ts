import { assign, createMachine, Interpreter, State } from "xstate";
import { Animal } from "../types/game";
import { SUNNYSIDE } from "assets/sunnyside";
import { ANIMAL_SLEEP_DURATION } from "../events/landExpansion/feedAnimal";

interface TContext {
  animal?: Animal;
}

export type TState = {
  value: "idle" | "happy" | "sad" | "sleeping" | "initial";
  context: TContext;
};

type AnimalFeedEvent = { type: "FEED"; animal: Animal };

type TEvent = AnimalFeedEvent | { type: "TICK" };

type MachineState = State<TContext, TEvent, MachineState>;

export type AnimalMachineInterpreter = Interpreter<
  TContext,
  any,
  TEvent,
  MachineState
>;

export const ANIMAL_EMOTION_ICONS: Record<
  Exclude<TState["value"], "idle" | "initial">,
  string
> = {
  happy: SUNNYSIDE.icons.happy,
  sad: SUNNYSIDE.icons.sad,
  sleeping: SUNNYSIDE.icons.sleeping,
};

const isAnimalSleeping = (context: TContext) => {
  if (!context.animal) return false;

  return context.animal.asleepAt + ANIMAL_SLEEP_DURATION > Date.now();
};

export const animalMachine = createMachine<TContext, TEvent, TState>({
  // Machine identifier
  id: "animalMachine",

  // Initial state
  initial: "initial",

  // Animal will be passed in on initialization of the machine
  context: {
    animal: undefined,
  },

  // State definitions
  states: {
    initial: {
      always: [
        {
          target: "sleeping",
          cond: (context) => isAnimalSleeping(context),
        },
        {
          target: "idle",
        },
      ],
    },
    happy: {
      after: {
        3000: [
          {
            target: "sleeping",
            cond: (context) => isAnimalSleeping(context),
          },
          { target: "idle" },
        ],
      },
    },
    sad: {
      after: {
        3000: [
          {
            target: "sleeping",
            cond: (context) => isAnimalSleeping(context),
          },
          { target: "idle" },
        ],
      },
    },
    idle: {
      on: {
        FEED: [
          {
            target: "happy",
            cond: (_, event) => event.animal.state === "happy",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "sleeping",
            // If animal is idle after being fed that means they are sleeping
            cond: (_, event) => event.animal.state === "idle",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "sad",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
        ],
      },
    },
    sleeping: {
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
      on: {
        TICK: [
          {
            target: "idle",
            cond: (context) => !isAnimalSleeping(context),
          },
        ],
      },
    },
  },
});
