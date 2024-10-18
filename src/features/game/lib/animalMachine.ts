import { assign, createMachine, Interpreter, State } from "xstate";
import { Animal } from "../types/game";
import {
  ANIMAL_NEEDS_LOVE_DURATION,
  ANIMAL_SLEEP_DURATION,
} from "../events/landExpansion/feedAnimal";

interface TContext {
  animal?: Animal;
}

export type TState = {
  value:
    | "idle"
    | "happy"
    | "sad"
    | "loved"
    | "sleeping"
    | "needsLove"
    | "initial"
    | "ready";
  context: TContext;
};

type AnimalFeedEvent = { type: "FEED"; animal: Animal };
type AnimalLoveEvent = { type: "LOVE"; animal: Animal };
type AnimalClaimProduceEvent = { type: "CLAIM_PRODUCE"; animal: Animal };

type TEvent =
  | AnimalFeedEvent
  | AnimalLoveEvent
  | AnimalClaimProduceEvent
  | { type: "TICK" };

type MachineState = State<TContext, TEvent, MachineState>;

export type AnimalMachineInterpreter = Interpreter<
  TContext,
  any,
  TEvent,
  MachineState
>;

const isAnimalSleeping = (context: TContext) => {
  if (!context.animal) return false;

  return context.animal.asleepAt + ANIMAL_SLEEP_DURATION > Date.now();
};

const isAnimalNeedsLove = (context: TContext) => {
  if (!context.animal) return false;

  return (
    context.animal.asleepAt + ANIMAL_NEEDS_LOVE_DURATION < Date.now() &&
    context.animal.lovedAt + ANIMAL_NEEDS_LOVE_DURATION < Date.now()
  );
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
          target: "ready",
          cond: (context) => context.animal?.state === "ready",
        },
        {
          target: "needsLove",
          cond: (context) =>
            isAnimalSleeping(context) && isAnimalNeedsLove(context),
        },
        {
          target: "sleeping",
          cond: (context) => isAnimalSleeping(context),
        },
        {
          target: "idle",
        },
      ],
    },
    ready: {
      on: {
        CLAIM_PRODUCE: {
          target: "sleeping",
          actions: assign({
            animal: (_, event) => (event as AnimalClaimProduceEvent).animal,
          }),
        },
      },
    },
    happy: {
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
            target: "sad",
            cond: (_, event) => event.animal.state === "sad",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "ready",
            cond: (_, event) => event.animal.state === "ready",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "idle",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
        ],
      },
      after: {
        1500: [
          {
            target: "sleeping",
            cond: (context) => isAnimalSleeping(context),
          },
          { target: "idle" },
        ],
      },
    },
    sad: {
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
            target: "sad",
            cond: (_, event) => event.animal.state === "sad",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "ready",
            cond: (_, event) => event.animal.state === "ready",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "idle",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
        ],
      },
      after: {
        1500: [
          {
            target: "sleeping",
            cond: (context) => isAnimalSleeping(context),
          },
          { target: "idle" },
        ],
      },
    },
    loved: {
      after: {
        1500: [
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
            target: "sad",
            cond: (_, event) => event.animal.state === "sad",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "ready",
            cond: (_, event) => event.animal.state === "ready",
            actions: assign({
              animal: (_, event) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "idle",
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
          {
            target: "needsLove",
            cond: (context) => isAnimalNeedsLove(context),
          },
        ],
      },
    },
    needsLove: {
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
        LOVE: {
          target: "loved",
          actions: assign({
            animal: (_, event) => (event as AnimalLoveEvent).animal,
          }),
        },
      },
    },
  },
});
