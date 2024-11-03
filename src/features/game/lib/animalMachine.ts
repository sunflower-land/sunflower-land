import { assign, createMachine, Interpreter, State } from "xstate";
import { Animal } from "../types/game";

interface TContext {
  animal?: Animal;
}

export type TState = {
  value:
    | "idle"
    | "happy"
    | "sad"
    | "sleeping"
    | "needsLove"
    | "sick"
    | "initial"
    | "ready";
  context: TContext;
};

type AnimalFeedEvent = { type: "FEED"; animal: Animal };
type AnimalLoveEvent = { type: "LOVE"; animal: Animal };
type AnimalCureEvent = { type: "CURE"; animal: Animal };
type AnimalSickEvent = { type: "SICK"; animal: Animal };
type AnimalClaimProduceEvent = { type: "CLAIM_PRODUCE"; animal: Animal };

type TEvent =
  | AnimalFeedEvent
  | AnimalLoveEvent
  | AnimalClaimProduceEvent
  | AnimalSickEvent
  | AnimalCureEvent
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

  return context.animal.awakeAt > Date.now();
};

const isAnimalNeedsLove = (context: TContext) => {
  if (!context.animal) return false;

  return (
    context.animal.asleepAt +
      (context.animal.awakeAt - context.animal.asleepAt) / 3 <
      Date.now() &&
    context.animal.lovedAt +
      (context.animal.awakeAt - context.animal.asleepAt) / 3 <
      Date.now()
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
  on: {
    // Sickness can happen at any time so it will be handled here.
    // If the animal is sleeping or needs love, it will not be moved into the sick state.
    SICK: [
      {
        target: "sick",
        cond: (context) => {
          return !isAnimalSleeping(context) && !isAnimalNeedsLove(context);
        },
        actions: assign({
          animal: (_, event) => (event as AnimalSickEvent).animal,
        }),
      },
      {
        actions: assign({
          animal: (_, event) => {
            return (event as AnimalSickEvent).animal;
          },
        }),
      },
    ],
  },
  // State definitions
  states: {
    initial: {
      always: [
        // Even if the animal is sick, it can still be ready to claim produce
        {
          target: "ready",
          cond: (context) => context.animal?.state === "ready",
        },
        {
          target: "needsLove",
          cond: (context) =>
            isAnimalSleeping(context) && isAnimalNeedsLove(context),
        },
        // Even if the animal is sick, it can still be sleeping
        {
          target: "sleeping",
          cond: (context) => isAnimalSleeping(context),
        },
        {
          target: "sick",
          cond: (context) => {
            return (
              !isAnimalSleeping(context) && context.animal?.state === "sick"
            );
          },
        },
        {
          target: "idle",
        },
      ],
    },
    sick: {
      id: "sick",
      on: {
        CURE: {
          target: "idle",
          actions: assign({
            animal: (_, event) => (event as AnimalCureEvent).animal,
          }),
        },
      },
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
        2000: [
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
        2000: [
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
            target: "sick",
            cond: (context) =>
              !isAnimalSleeping(context) && context.animal?.state === "sick",
          },
          {
            target: "ready",
            cond: (context) =>
              !isAnimalSleeping(context) && context.animal?.state === "ready",
          },
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
          {
            target: "sick",
            cond: (context) =>
              !isAnimalSleeping(context) && context.animal?.state === "sick",
          },
        ],
        LOVE: {
          target: "sleeping",
          actions: assign({
            animal: (_, event) => (event as AnimalLoveEvent).animal,
          }),
        },
      },
    },
  },
});
