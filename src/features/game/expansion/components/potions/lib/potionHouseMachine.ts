import { ActorRefFrom, SnapshotFrom, assign, createMachine } from "xstate";
import {
  acknowledgePotionHouseIntro,
  getPotionHouseIntroRead,
} from "./introStorage";
import { POTIONS } from "./potions";
import { PotionName } from "features/game/types/game";
import { DesiredAnimation } from "../MixingPotion";
import { getFeedbackText } from "./helpers";
import { translate } from "lib/i18n/translate";

type Potions = [
  PotionName | null,
  PotionName | null,
  PotionName | null,
  PotionName | null,
];

export interface PotionHouseContext {
  guessSpot: number;
  currentGuess: Potions;
  isNewGame: boolean;
  isFinished: boolean;
  animationQueue: DesiredAnimation[];
  score: number | null;
  feedbackText: string | null;
  multiplier: number;
}

type PotionHouseEvent =
  | { type: "ACKNOWLEDGE" }
  | { type: "OPEN_RULES" }
  | { type: "REMOVE_GUESS"; guessSpot: number }
  | { type: "ADD_GUESS"; guessSpot: number; potion: PotionName }
  | { type: "SELECT_GUESS_SPOT"; guessSpot: number }
  | { type: "MIX_POTION" }
  | { type: "NEXT_ANIMATION"; score: number | null }
  | { type: "NEW_GAME"; multiplier?: number }
  | { type: "BOMB" }
  | { type: "SUCCESS" };

export type PotionHouseState = {
  value:
    | "introduction"
    | "rules"
    | "playing"
    | "playing.idle"
    | "playing.startMixing"
    | "playing.loopMixing"
    | "playing.success"
    | "playing.bomb";
  context: PotionHouseContext;
};

const nextValidAnimationIndex = (
  animationQueue: DesiredAnimation[],
  validAnimations: DesiredAnimation[],
) => {
  for (let i = animationQueue.length - 1; i >= 0; i--) {
    if (validAnimations.includes(animationQueue[i])) {
      return i;
    }
  }
  return -1;
};

function findNextGuessSpot(guess: Potions, currentGuessSpot: number): number {
  for (let i = currentGuessSpot + 1; i < guess.length; i++) {
    if (guess[i] === null) {
      return i;
    }
  }
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === null) {
      return i;
    }
  }

  return currentGuessSpot;
}

export const potionHouseMachine = createMachine({
  types: {} as {
    context: PotionHouseContext;
    events: PotionHouseEvent;
  },
  initial: "introduction",
  context: {
    guessSpot: 0,
    currentGuess: [null, null, null, null],
    isFinished: false,
    isNewGame: false,
    animationQueue: [],
    score: null,
    feedbackText: translate("rules.potion.feedback"),
    multiplier: 1,
  },
  states: {
    introduction: {
      always: {
        target: "playing",
        guard: () => !!getPotionHouseIntroRead(),
      },
      on: {
        ACKNOWLEDGE: {
          actions: () => acknowledgePotionHouseIntro(),
          target: "playing",
        },
      },
    },
    rules: {
      on: { ACKNOWLEDGE: "playing" },
    },
    playing: {
      initial: "idle",
      states: {
        idle: {
          entry: assign({
            animationQueue: () => [] as DesiredAnimation[],
            feedbackText: ({ context }) => {
              return context.score !== null
                ? getFeedbackText(context.score)
                : context.feedbackText;
            },
          }),
          exit: assign({
            feedbackText: () => null,
          }),
          on: {
            NEXT_ANIMATION: {
              target: "#startMixing",
              guard: ({ context }) => {
                const nextIndex = nextValidAnimationIndex(
                  context.animationQueue,
                  ["startMixing"],
                );

                return context.animationQueue[nextIndex] === "startMixing";
              },
              actions: assign({
                animationQueue: ({ context }) => {
                  const nextIndex = nextValidAnimationIndex(
                    context.animationQueue,
                    ["startMixing"],
                  );

                  return nextIndex >= 0
                    ? context.animationQueue.slice(nextIndex + 1)
                    : context.animationQueue;
                },
                score: ({ event }) =>
                  (event as { type: "NEXT_ANIMATION"; score: number | null })
                    .score,
              }),
            },
          },
        },
        startMixing: {
          id: "startMixing",
          on: {
            NEXT_ANIMATION: {
              target: "loopMixing",
              actions: assign({
                score: ({ event }) =>
                  (event as { type: "NEXT_ANIMATION"; score: number | null })
                    .score,
              }),
            },
          },
        },
        loopMixing: {
          id: "loopMixing",
          on: {
            NEXT_ANIMATION: [
              {
                target: "success",
                guard: ({ context }) => {
                  const nextIndex = nextValidAnimationIndex(
                    context.animationQueue,
                    ["success", "bomb"],
                  );

                  return context.animationQueue[nextIndex] === "success";
                },
                actions: assign({
                  animationQueue: ({ context }) => {
                    const nextIndex = nextValidAnimationIndex(
                      context.animationQueue,
                      ["success", "bomb"],
                    );

                    return nextIndex >= 0
                      ? context.animationQueue.slice(nextIndex + 1)
                      : context.animationQueue;
                  },
                  score: ({ event }) =>
                    (event as { type: "NEXT_ANIMATION"; score: number | null })
                      .score,
                }),
              },
              {
                target: "bomb",
                guard: ({ context }) => {
                  const nextIndex = nextValidAnimationIndex(
                    context.animationQueue,
                    ["success", "bomb"],
                  );

                  return context.animationQueue[nextIndex] === "bomb";
                },
                actions: assign({
                  animationQueue: ({ context }) => {
                    const nextIndex = nextValidAnimationIndex(
                      context.animationQueue,
                      ["success", "bomb"],
                    );

                    return nextIndex >= 0
                      ? context.animationQueue.slice(nextIndex + 1)
                      : context.animationQueue;
                  },
                  score: ({ event }) =>
                    (event as { type: "NEXT_ANIMATION"; score: number | null })
                      .score,
                }),
              },
            ],
          },
        },
        success: {
          on: {
            NEXT_ANIMATION: {
              target: "idle",
              actions: assign({
                score: ({ event }) =>
                  (event as { type: "NEXT_ANIMATION"; score: number | null })
                    .score,
              }),
            },
          },
        },
        bomb: {
          on: {
            NEXT_ANIMATION: {
              target: "idle",
              actions: assign({
                score: ({ event }) =>
                  (event as { type: "NEXT_ANIMATION"; score: number | null })
                    .score,
              }),
            },
          },
        },
      },
      on: {
        REMOVE_GUESS: {
          actions: assign(({ context, event }) => {
            const newGuess: Potions = [...context.currentGuess];
            newGuess[
              (event as { type: "REMOVE_GUESS"; guessSpot: number }).guessSpot
            ] = null;

            return {
              ...context,
              currentGuess: newGuess,
            };
          }),
        },
        ADD_GUESS: {
          actions: assign(({ context, event }) => {
            const e = event as {
              type: "ADD_GUESS";
              guessSpot: number;
              potion: PotionName;
            };
            const newGuess: Potions = [...context.currentGuess];
            newGuess[e.guessSpot] = e.potion;

            const guessSpot = findNextGuessSpot(newGuess, e.guessSpot);

            return {
              ...context,
              currentGuess: newGuess,
              guessSpot,
            };
          }),
        },
        SELECT_GUESS_SPOT: {
          actions: assign(({ context, event }) => {
            return {
              ...context,
              guessSpot: (
                event as { type: "SELECT_GUESS_SPOT"; guessSpot: number }
              ).guessSpot,
            };
          }),
        },
        MIX_POTION: {
          actions: assign(({ context }) => {
            return {
              ...context,
              guessSpot: 0,
              selectedPotion: Object.values(POTIONS)[0],
              currentGuess: [null, null, null, null] as Potions,
              animationQueue: [
                ...context.animationQueue,
                "startMixing" as DesiredAnimation,
              ],
              isNewGame: false,
              multiplier: context.multiplier,
            };
          }),
        },
        NEW_GAME: {
          target: ".playing",
          actions: assign(({ context, event }) => {
            const e = event as { type: "NEW_GAME"; multiplier?: number };
            return {
              guessSpot: 0,
              selectedPotion: Object.values(POTIONS)[0],
              currentGuess: [null, null, null, null] as Potions,
              isNewGame: true,
              isFinished: context.isFinished,
              score: null,
              feedbackText: translate("rules.potion.feedback"),
              animationQueue: [] as DesiredAnimation[],
              multiplier: e.multiplier ?? context.multiplier ?? 1,
            };
          }),
        },
        BOMB: {
          actions: assign(({ context }) => {
            return {
              ...context,
              animationQueue: [
                ...context.animationQueue,
                "bomb" as DesiredAnimation,
              ],
            };
          }),
        },
        SUCCESS: {
          actions: assign(({ context }) => {
            return {
              ...context,
              animationQueue: [
                ...context.animationQueue,
                "success" as DesiredAnimation,
              ],
            };
          }),
        },
      },
    },
  },
  on: { OPEN_RULES: ".rules" },
});

export type PotionMachineState = SnapshotFrom<typeof potionHouseMachine>;
export type PotionHouseMachineInterpreter = ActorRefFrom<
  typeof potionHouseMachine
>;
