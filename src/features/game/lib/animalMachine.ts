import { assign, createMachine, type Interpreter, type State } from "xstate";
import type { Animal, GameState } from "../types/game";
import { getNextLoveAvailableAt } from "../events/landExpansion/loveAnimal";
import { getAnimalReadyAt } from "../lib/animals";

interface TContext {
  animal?: Animal;
  // Latest game state — needed to derive the live (windowed) ready/love times.
  // Kept fresh via the UPDATE_GAME event so a shrine placed mid-sleep applies.
  game?: GameState;
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
type AnimalUpdateGameEvent = { type: "UPDATE_GAME"; game: GameState };
type TEvent =
  | AnimalFeedEvent
  | AnimalLoveEvent
  | AnimalClaimProduceEvent
  | AnimalSickEvent
  | AnimalCureEvent
  | { type: "TICK" }
  | AnimalInstantWakeUpEvent
  | AnimalUpdateGameEvent;

type MachineState = State<TContext, TEvent, MachineState>;

export type AnimalMachineInterpreter = Interpreter<
  TContext,
  any,
  TEvent,
  MachineState
>;

const isAnimalSleeping = (context: TContext) => {
  if (!context.animal) return false;

  // Windowed animals wake earlier than their denormalised `awakeAt`; derive the
  // live ready time when the game is available (fall back to awakeAt otherwise).
  const readyAt = context.game
    ? getAnimalReadyAt(context.animal, context.game)
    : context.animal.awakeAt;

  return readyAt > Date.now();
};

const isAnimalNeedsLove = (context: TContext) => {
  if (!context.animal || !context.game) return false;

  return getNextLoveAvailableAt(context.animal, context.game) < Date.now();
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
    // Keep the latest game in context so windowed ready/love times stay live
    // (e.g. a Collie/Bantam shrine placed while the animal sleeps).
    UPDATE_GAME: {
      actions: assign({
        game: (_, event) => (event as AnimalUpdateGameEvent).game,
      }),
    },

    // If the animal is instant wake up it will be moved to the initial state.
    INSTANT_WAKE_UP: {
      target: "initial",
      actions: assign({
        animal: (_, event) => (event as AnimalInstantWakeUpEvent).animal,
      }),
    },

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
        // Animal has levelled up due to affection. It should remain asleep and then can claim produce once it wakes.
        {
          target: "sleeping",
          cond: (context) =>
            context.animal?.state === "ready" && isAnimalSleeping(context),
        },
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
        CURE: {
          actions: assign({
            animal: (_, event) => (event as AnimalCureEvent).animal,
          }),
        },
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
