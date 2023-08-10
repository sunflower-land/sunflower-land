import { assign, createMachine } from "xstate";
import { Potion } from "./types";
import { Potions } from "features/game/events/landExpansion/mixPotion";
import { MachineInterpreter } from "features/game/lib/gameMachine";

export interface PotionHouseContext {
  guessSpot: number;
  selectedPotion: Potion;
  currentGuess: Potions;
  isNewGame: boolean;
  gameService: MachineInterpreter;
}

type PotionHouseEvent =
  | { type: "MIX_POTION" }
  | { type: "UPDATE_GUESS_SPOT"; guessSpot: number };

export type PotionHouseState = {
  value:
    | "introScreen"
    | "playing.idle"
    | "playing.startMixing"
    | "playing.loopMixing"
    | "playing.success"
    | "playing.bomb"
    | "endScreen";
  context: PotionHouseContext;
};

export const potionHouseMachine = createMachine<
  PotionHouseContext,
  PotionHouseEvent,
  PotionHouseState
>({
  initial: "introScreen",
  states: {
    introScreen: {},
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
});
