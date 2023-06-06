import { createMachine, assign, Interpreter, State } from "xstate";
import { Combination, GuessFeedback, Potion, PotionName, Turn } from "./types";
import {
  calculateScore,
  generatePotionCombination,
  getFeedbackText,
  initialiseGuessGrid,
} from "./helpers";
import { POTIONS } from "./potions";

export type Game = {
  selectedPotion: Potion;
  guesses: Turn[];
  currentGuess: (PotionName | null)[];
  guessRow: number;
  guessSpot: number;
  combination: Combination;
  feedbackText: string;
};

interface PotionHouseContext {
  farmId: number;
  sessionId: string;
  jwt: string;
  fingerprint: string;
  deviceTrackerId: string;
  transactionId: string;
  game?: Game;
}

type PotionHouseEvent =
  | { type: "ACKNOWLEDGE_INTRO" }
  | { type: "SHOW_RULES" }
  | { type: "CLOSE_RULES" }
  | { type: "SELECT_POTION"; potion: Potion }
  | { type: "CONFIRM_GUESS" }
  | { type: "REMOVE_POTION"; index: number }
  | { type: "ADD_POTION" }
  | { type: "SET_GUESS_SPOT"; index: number };

export type PotionHouseState = {
  value: "intro" | "playing" | "rules" | "gameOver";
  context: PotionHouseContext;
};

export type MachineState = State<
  PotionHouseContext,
  PotionHouseEvent,
  PotionHouseState
>;

export type MachineInterpreter = Interpreter<
  PotionHouseContext,
  any,
  PotionHouseEvent,
  PotionHouseState
>;

export const getTurnFeedback = (game: Game) => {
  const { code, bomb } = game.combination;

  return game.currentGuess.map((guess, index) => {
    if (guess === "Golden Syrup") return "correct";

    if (guess === bomb) return "bombed";

    if (guess === code[index]) return "correct";

    if (code.includes(guess as PotionName)) return "almost";

    return "incorrect";
  }) as GuessFeedback[];
};

export const potionHouseMachine = createMachine<
  PotionHouseContext,
  PotionHouseEvent,
  PotionHouseState
>({
  id: "potionHouse",
  initial: "intro",
  states: {
    intro: {
      on: {
        ACKNOWLEDGE_INTRO: {
          target: "playing",
        },
      },
    },
    rules: {
      on: {
        CLOSE_RULES: {
          target: "playing",
        },
      },
    },
    playing: {
      entry: assign(() => ({
        game: {
          selectedPotion: POTIONS[0],
          guesses: initialiseGuessGrid(3),
          currentGuess: [null, null, null, null],
          guessRow: 2,
          guessSpot: 0,
          combination: generatePotionCombination(),
          feedbackText:
            "Select your potions and unveil the secrets of the plants!",
        },
      })),
      on: {
        SHOW_RULES: {
          target: "rules",
        },
        SELECT_POTION: {
          actions: assign({
            game: (context, event) => {
              console.log({ event });
              return {
                ...(context.game as Game),
                selectedPotion: event.potion,
              };
            },
          }),
        },
        SET_GUESS_SPOT: {
          actions: assign({
            game: (context, event) => ({
              ...(context.game as Game),
              guessSpot: event.index,
            }),
          }),
        },
        CONFIRM_GUESS: {
          actions: assign((context) => {
            if (!context.game) return context;

            const { game } = context;

            const feedback = getTurnFeedback(game);

            const newTurn: Turn = {
              guess: game.currentGuess,
              feedback,
            };

            const score = calculateScore(feedback);

            const updatedGuesses = game.guesses.map((guess, index) =>
              index === game.guessRow ? newTurn : guess
            );

            const guessRow = game.guessRow - 1;
            const feedbackText = getFeedbackText(score);

            return {
              game: {
                ...context.game,
                guesses: updatedGuesses,
                currentGuess: [null, null, null, null],
                guessSpot: 0,
                selectedPotion: POTIONS[0],
                guessRow,
                feedbackText,
              } as Game,
            };
          }),
        },
        REMOVE_POTION: {
          actions: assign((context, event) => {
            if (!context.game) return context;

            const { game } = context;

            const indexToRemove = event.index || game.guessSpot;

            const newGuess = [...game.currentGuess];
            newGuess[indexToRemove] = null;

            return {
              game: {
                ...game,
                currentGuess: newGuess,
                guessSpot: indexToRemove,
              },
            };
          }),
        },
        ADD_POTION: {
          actions: assign((context) => {
            if (!context.game) return context;

            const { game } = context;

            const newGuess = [...game.currentGuess];
            newGuess[game.guessSpot] = game.selectedPotion.name;

            const guessSpot = newGuess.indexOf(null);

            return {
              game: {
                ...game,
                currentGuess: newGuess,
                guessSpot,
              },
            };
          }),
        },
      },
    },
    gameOver: {},
  },
});
