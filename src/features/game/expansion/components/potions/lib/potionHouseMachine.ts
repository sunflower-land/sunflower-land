import { createMachine, assign, Interpreter, State, sendParent } from "xstate";
import { Potion } from "./types";
import { POTIONS } from "./potions";
import {
  acknowledgePotionHouseIntro,
  getPotionHouseIntroRead,
} from "./introStorage";
import { PotionHouse, PotionName } from "features/game/types/game";

interface PotionHouseContext {
  potionHouse?: PotionHouse;
  selectedPotion: Potion;
  guessSpot: number;
  currentGuess: [
    PotionName | null,
    PotionName | null,
    PotionName | null,
    PotionName | null
  ];
  feedbackText: string;
}

type PotionHouseEvent =
  | { type: "ACKNOWLEDGE_INTRO" }
  | { type: "SHOW_RULES" }
  | { type: "CLOSE_RULES" }
  | { type: "SELECT_POTION"; potion: Potion }
  | { type: "CONFIRM_GUESS" }
  | { type: "REMOVE_POTION"; index: number }
  | { type: "ADD_POTION" }
  | { type: "SET_GUESS_SPOT"; index: number }
  | { type: "REVEAL_PRIZE" }
  | { type: "FINISH_GAME" };

export type PotionHouseState = {
  value:
    | "intro"
    | "playing"
    | "rules"
    | "revealing"
    | "gameOver"
    | "revealingPrize"
    | "prizeRevealed"
    | "finished";
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

export const potionHouseMachine = createMachine<
  PotionHouseContext,
  PotionHouseEvent,
  PotionHouseState
>({
  id: "potionHouse",
  initial: getPotionHouseIntroRead() ? "playing" : "intro",
  preserveActionOrder: true,
  states: {
    intro: {
      on: {
        ACKNOWLEDGE_INTRO: {
          target: "playing",
          actions: () => acknowledgePotionHouseIntro(),
        },
      },
    },
    rules: {
      id: "rules",
      on: {
        CLOSE_RULES: {
          target: "playing",
        },
      },
    },
    playing: {
      id: "playing",
      always: {
        target: "gameOver",
        cond: (context) => {
          return context.potionHouse?.game.status === "finished";
        },
      },
      entry: assign(() => ({
        guessSpot: 0,
        selectedPotion: Object.values(POTIONS)[0],
        currentGuess: [null, null, null, null],
        feedbackText:
          "Select your potions and unveil the secrets of the plants!",
      })),
      on: {
        SHOW_RULES: {
          target: "rules",
        },
        SELECT_POTION: {
          actions: assign({
            selectedPotion: (_, event) => event.potion,
          }),
        },
        SET_GUESS_SPOT: {
          actions: assign({
            guessSpot: (_, event) => event.index,
          }),
        },
        CONFIRM_GUESS: {
          actions: [
            sendParent((context) => ({
              type: "potion.mixed",
              attemptNumber:
                (context.potionHouse?.game.attempts.length ?? 0) + 1,
              potions: context.currentGuess,
            })),
            sendParent("MIX_POTION"),
          ],
        },
        REMOVE_POTION: {
          actions: assign((context, event) => {
            const indexToRemove = event.index || context.guessSpot;

            const newGuess: [
              PotionName | null,
              PotionName | null,
              PotionName | null,
              PotionName | null
            ] = [...context.currentGuess];
            newGuess[indexToRemove] = null;

            return {
              currentGuess: newGuess,
              guessSpot: indexToRemove,
            };
          }),
        },
        ADD_POTION: {
          actions: assign((context) => {
            const newGuess: [
              PotionName | null,
              PotionName | null,
              PotionName | null,
              PotionName | null
            ] = [...context.currentGuess];
            newGuess[context.guessSpot] = context.selectedPotion.name;

            const guessSpot = newGuess.indexOf(null);

            return {
              currentGuess: newGuess,
              guessSpot,
            };
          }),
        },
      },
    },
    gameOver: {
      id: "gameOver",
      on: {
        REVEAL_PRIZE: {
          target: "prizeRevealed",
        },
      },
    },
    revealingPrize: {
      after: {
        1000: {
          target: "prizeRevealed",
        },
      },
    },
    prizeRevealed: {
      id: "prizeRevealed",
      on: {
        FINISH_GAME: {
          target: "#finished",
        },
      },
    },
    finished: {
      id: "finished",
      type: "final",
    },
  },
});
