import {
  assign,
  createMachine,
  fromCallback,
  ActorRefFrom,
  SnapshotFrom,
} from "xstate";
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
type AnimalInstantWakeUpEvent = { type: "INSTANT_WAKE_UP"; animal: Animal };
type TEvent =
  | AnimalFeedEvent
  | AnimalLoveEvent
  | AnimalClaimProduceEvent
  | AnimalSickEvent
  | AnimalCureEvent
  | { type: "TICK" }
  | AnimalInstantWakeUpEvent;

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

const tickCallback = fromCallback(({ sendBack }) => {
  const interval = setInterval(() => {
    sendBack({ type: "TICK" });
  }, 1000);

  return () => {
    clearInterval(interval);
  };
});

export const animalMachine = createMachine({
  types: {} as {
    context: TContext;
    events: TEvent;
  },
  id: "animalMachine",
  initial: "initial",
  context: {
    animal: undefined,
  },
  on: {
    INSTANT_WAKE_UP: {
      target: ".initial",
      actions: assign({
        animal: ({ event }) => (event as AnimalInstantWakeUpEvent).animal,
      }),
    },

    SICK: [
      {
        target: ".sick",
        guard: ({ context }) => {
          return !isAnimalSleeping(context) && !isAnimalNeedsLove(context);
        },
        actions: assign({
          animal: ({ event }) => (event as AnimalSickEvent).animal,
        }),
      },
      {
        actions: assign({
          animal: ({ event }) => {
            return (event as AnimalSickEvent).animal;
          },
        }),
      },
    ],
  },
  states: {
    initial: {
      always: [
        {
          target: "sleeping",
          guard: ({ context }) =>
            context.animal?.state === "ready" && isAnimalSleeping(context),
        },
        {
          target: "ready",
          guard: ({ context }) => context.animal?.state === "ready",
        },
        {
          target: "needsLove",
          guard: ({ context }) =>
            isAnimalSleeping(context) && isAnimalNeedsLove(context),
        },
        {
          target: "sleeping",
          guard: ({ context }) => isAnimalSleeping(context),
        },
        {
          target: "sick",
          guard: ({ context }) => {
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
            animal: ({ event }) => (event as AnimalCureEvent).animal,
          }),
        },
      },
    },
    ready: {
      on: {
        CLAIM_PRODUCE: {
          target: "sleeping",
          actions: assign({
            animal: ({ event }) => (event as AnimalClaimProduceEvent).animal,
          }),
        },
      },
    },
    happy: {
      on: {
        FEED: [
          {
            target: "happy",
            guard: ({ event }) =>
              (event as AnimalFeedEvent).animal.state === "happy",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "sad",
            guard: ({ event }) =>
              (event as AnimalFeedEvent).animal.state === "sad",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "ready",
            guard: ({ event }) =>
              (event as AnimalFeedEvent).animal.state === "ready",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "idle",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
        ],
      },
      after: {
        2000: [
          {
            target: "sleeping",
            guard: ({ context }) => isAnimalSleeping(context),
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
            guard: ({ event }) =>
              (event as AnimalFeedEvent).animal.state === "happy",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "sad",
            guard: ({ event }) =>
              (event as AnimalFeedEvent).animal.state === "sad",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "ready",
            guard: ({ event }) =>
              (event as AnimalFeedEvent).animal.state === "ready",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "idle",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
        ],
      },
      after: {
        2000: [
          {
            target: "sleeping",
            guard: ({ context }) => isAnimalSleeping(context),
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
            guard: ({ event }) =>
              (event as AnimalFeedEvent).animal.state === "happy",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "sad",
            guard: ({ event }) =>
              (event as AnimalFeedEvent).animal.state === "sad",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "ready",
            guard: ({ event }) =>
              (event as AnimalFeedEvent).animal.state === "ready",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
          {
            target: "idle",
            actions: assign({
              animal: ({ event }) => (event as AnimalFeedEvent).animal,
            }),
          },
        ],
      },
    },
    sleeping: {
      invoke: {
        src: tickCallback,
      },
      on: {
        CURE: {
          actions: assign({
            animal: ({ event }) => (event as AnimalCureEvent).animal,
          }),
        },
        TICK: [
          {
            target: "sick",
            guard: ({ context }) =>
              !isAnimalSleeping(context) && context.animal?.state === "sick",
          },
          {
            target: "ready",
            guard: ({ context }) =>
              !isAnimalSleeping(context) && context.animal?.state === "ready",
          },
          {
            target: "idle",
            guard: ({ context }) => !isAnimalSleeping(context),
          },
          {
            target: "needsLove",
            guard: ({ context }) => isAnimalNeedsLove(context),
          },
        ],
      },
    },
    needsLove: {
      invoke: {
        src: tickCallback,
      },
      on: {
        TICK: [
          {
            target: "idle",
            guard: ({ context }) => !isAnimalSleeping(context),
          },
          {
            target: "sick",
            guard: ({ context }) =>
              !isAnimalSleeping(context) && context.animal?.state === "sick",
          },
        ],
        LOVE: {
          target: "sleeping",
          actions: assign({
            animal: ({ event }) => (event as AnimalLoveEvent).animal,
          }),
        },
      },
    },
  },
});

export type AnimalMachineInterpreter = ActorRefFrom<typeof animalMachine>;
export type AnimalMachineState = SnapshotFrom<typeof animalMachine>;
