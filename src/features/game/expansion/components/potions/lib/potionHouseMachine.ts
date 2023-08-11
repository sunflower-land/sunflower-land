import { Interpreter, State, assign, createMachine } from "xstate";
import { Potion } from "./types";
import {
  acknowledgePotionHouseIntro,
  getPotionHouseIntroRead,
} from "./introStorage";
import { POTIONS } from "./potions";
import { PotionName } from "features/game/types/game";
import { DesiredAnimation } from "../MixingPotion";
import { getFeedbackText } from "./helpers";

type Potions = [
  PotionName | null,
  PotionName | null,
  PotionName | null,
  PotionName | null
];

export interface PotionHouseContext {
  guessSpot: number;
  selectedPotion: Potion;
  currentGuess: Potions;
  isNewGame: boolean;
  animationQueue: DesiredAnimation[];
  score: number | null;
  feedbackText: string | null;
}

type PotionHouseEvent =
  | { type: "ACKNOWLEDGE" }
  | { type: "OPEN_RULES" }
  | { type: "REMOVE_GUESS"; guessSpot: number }
  | { type: "ADD_GUESS"; guessSpot: number; potion: PotionName }
  | { type: "SELECT_POTION"; potion: Potion }
  | { type: "SELECT_GUESS_SPOT"; guessSpot: number }
  | { type: "MIX_POTION" }
  | { type: "NEXT_ANIMATION"; score: number | null }
  | { type: "NEW_GAME" }
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

export type PotionMachineState = State<
  PotionHouseContext,
  PotionHouseEvent,
  PotionHouseState
>;

export type PotionHouseMachineInterpreter = Interpreter<
  PotionHouseContext,
  any,
  PotionHouseEvent,
  PotionHouseState
>;

const nextValidAnimationIndex = (
  animationQueue: DesiredAnimation[],
  validAnimations: DesiredAnimation[]
) => {
  return animationQueue.findLastIndex((animation) =>
    validAnimations.includes(animation)
  );
};

export const potionHouseMachine = createMachine<
  PotionHouseContext,
  PotionHouseEvent,
  PotionHouseState
>({
  initial: "introduction",
  context: {
    guessSpot: 0,
    selectedPotion: Object.values(POTIONS)[0],
    currentGuess: [null, null, null, null],
    isNewGame: false,
    animationQueue: [],
    score: null,
    feedbackText: "Select your potions and unveil the secrets of the plants!",
  },
  states: {
    introduction: {
      always: {
        target: "playing",
        cond: () => !!getPotionHouseIntroRead(),
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
            animationQueue: (context) => [],
            feedbackText: (context) => {
              return context.score !== null
                ? getFeedbackText(context.score)
                : context.feedbackText;
            },
          }),
          exit: assign({
            feedbackText: null,
          }),
          on: {
            NEXT_ANIMATION: {
              target: "#startMixing",
              cond: (context) => {
                const nextIndex = nextValidAnimationIndex(
                  context.animationQueue,
                  ["startMixing"]
                );

                return context.animationQueue[nextIndex] === "startMixing";
              },
              actions: assign({
                animationQueue: (context) => {
                  const nextIndex = nextValidAnimationIndex(
                    context.animationQueue,
                    ["startMixing"]
                  );

                  return nextIndex >= 0
                    ? context.animationQueue.slice(nextIndex + 1)
                    : context.animationQueue;
                },
                score: (_, event) => event.score,
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
                score: (_, event) => event.score,
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
                cond: (context) => {
                  const nextIndex = nextValidAnimationIndex(
                    context.animationQueue,
                    ["success", "bomb"]
                  );

                  return context.animationQueue[nextIndex] === "success";
                },
                actions: assign({
                  animationQueue: (context) => {
                    const nextIndex = nextValidAnimationIndex(
                      context.animationQueue,
                      ["success", "bomb"]
                    );

                    return nextIndex >= 0
                      ? context.animationQueue.slice(nextIndex + 1)
                      : context.animationQueue;
                  },
                  score: (_context, event) => event.score,
                }),
              },
              {
                target: "bomb",
                cond: (context) => {
                  const nextIndex = nextValidAnimationIndex(
                    context.animationQueue,
                    ["success", "bomb"]
                  );

                  return context.animationQueue[nextIndex] === "bomb";
                },
                actions: assign({
                  animationQueue: (context) => {
                    const nextIndex = nextValidAnimationIndex(
                      context.animationQueue,
                      ["success", "bomb"]
                    );

                    return nextIndex >= 0
                      ? context.animationQueue.slice(nextIndex + 1)
                      : context.animationQueue;
                  },
                  score: (_, event) => event.score,
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
                score: (_, event) => event.score,
              }),
            },
          },
        },
        bomb: {
          on: {
            NEXT_ANIMATION: {
              target: "idle",
              actions: assign({
                score: (_, event) => event.score,
              }),
            },
          },
        },
      },
      on: {
        REMOVE_GUESS: {
          actions: assign((context, event) => {
            const newGuess: Potions = [...context.currentGuess];
            newGuess[event.guessSpot] = null;
            return {
              ...context,
              currentGuess: newGuess,
            };
          }),
        },
        ADD_GUESS: {
          actions: assign((context, event) => {
            const newGuess: Potions = [...context.currentGuess];
            newGuess[event.guessSpot] = event.potion;
            return {
              ...context,
              currentGuess: newGuess,
              guessSpot:
                newGuess.indexOf(null) < 0
                  ? context.guessSpot
                  : newGuess.indexOf(null),
            };
          }),
        },
        SELECT_POTION: {
          actions: assign((context, event) => {
            return {
              ...context,
              selectedPotion: event.potion,
            };
          }),
        },
        SELECT_GUESS_SPOT: {
          actions: assign((context, event) => {
            return {
              ...context,
              guessSpot: event.guessSpot,
            };
          }),
        },
        MIX_POTION: {
          actions: assign((context) => {
            return {
              ...context,
              guessSpot: 0,
              selectedPotion: Object.values(POTIONS)[0],
              currentGuess: [null, null, null, null],
              animationQueue: [...context.animationQueue, "startMixing"],
              isNewGame: false,
            };
          }),
        },
        NEW_GAME: {
          target: "playing",
          actions: assign({
            guessSpot: 0,
            selectedPotion: Object.values(POTIONS)[0],
            currentGuess: [null, null, null, null],
            isNewGame: true,
            score: null,
            feedbackText:
              "Select your potions and unveil the secrets of the plants!",
            animationQueue: [],
          }),
        },
        BOMB: {
          actions: assign((context) => {
            return {
              ...context,
              animationQueue: [...context.animationQueue, "bomb"],
            };
          }),
        },
        SUCCESS: {
          actions: assign((context) => {
            return {
              ...context,
              animationQueue: [...context.animationQueue, "success"],
            };
          }),
        },
      },
    },
  },
  on: { OPEN_RULES: "rules" },
});
