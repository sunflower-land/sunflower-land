import { assign, createMachine, Interpreter, State } from "xstate";
import { Animal } from "../types/game";

interface TContext {
  animal?: Animal;
}

export type TState = {
  value: "idle" | "happy" | "sad" | "sleeping";
  context: TContext;
};

type AnimalFeedEvent = { type: "FEED"; animal: Animal };
type AnimalWakeUpEvent = { type: "WAKE_UP"; animal: Animal };

type TEvent = AnimalFeedEvent | AnimalWakeUpEvent;

type MachineState = State<TContext, TEvent, MachineState>;

export type AnimalMachineInterpreter = Interpreter<
  TContext,
  any,
  TEvent,
  MachineState
>;

const isAnimalSleeping = (context: TContext) => {
  if (!context.animal) return false;

  return context.animal.asleepAt + 24 * 60 * 60 * 1000 > Date.now();
};

export const animalMachine = createMachine<TContext, TEvent, TState>({
  // Machine identifier
  id: "animalMachine",

  // Initial state
  initial: "idle",

  // Local context for entire machine
  context: {
    animal: undefined,
  },

  // State definitions
  states: {
    happy: {
      after: {
        5000: [
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
        5000: [
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
            // Only transition to 'searching' if the guard (cond) evaluates to true
            cond: (context) => context.animal?.state === "happy", // or { type: 'searchValid' }
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
      on: {
        WAKE_UP: {
          target: "idle",
          actions: assign({
            animal: (_, event) => (event as AnimalWakeUpEvent).animal,
          }),
        },
      },
    },
  },
});
