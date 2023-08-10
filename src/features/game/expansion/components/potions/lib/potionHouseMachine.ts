import { State, assign, createMachine } from "xstate";
import { Potion } from "./types";
import { Potions } from "features/game/events/landExpansion/mixPotion";
import { MachineInterpreter } from "features/game/lib/gameMachine";
import {
  acknowledgePotionHouseIntro,
  getPotionHouseIntroRead,
} from "./introStorage";

export interface PotionHouseContext {
  guessSpot: number;
  selectedPotion: Potion;
  currentGuess: Potions;
  isNewGame: boolean;
  gameService: MachineInterpreter;
}

type PotionHouseEvent =
  | { type: "MIX_POTION" }
  | { type: "UPDATE_GUESS_SPOT"; guessSpot: number }
  | { type: "ACKNOWLEDGE" }
  | { type: "OPEN_RULES" };

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

export const potionHouseMachine = createMachine<
  PotionHouseContext,
  PotionHouseEvent,
  PotionHouseState
>({
  initial: "introduction",
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
          on: {
            MIX_POTION: "startMixing",
            UPDATE_GUESS_SPOT: {
              actions: (_context, event) =>
                assign({
                  guessSpot: event.guessSpot,
                }),
            },
          },
        },
        startMixing: {},
        loopMixing: {},
        success: {},
        bomb: {},
      },
    },
    endScreen: {},
  },
  on: { OPEN_RULES: "rules" },
});
