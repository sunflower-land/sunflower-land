import Decimal from "decimal.js-light";
import { EasterEgg, GameState, InventoryItemName } from "../types/game";

const eggs: Record<number, EasterEgg> = {
    0: 'Blue Egg',
    1: 'Red Egg',
    2: 'Orange Egg',
    3: 'Green Egg',
    4: 'Yellow Egg',
    5: 'Pink Egg',
    6: 'Purple Egg'
}

const HUNT_START_AT_MS = Date.UTC(2022, 3, 16, 12)

export function availableEgg(now: number = Date.now()): EasterEgg { 
    // Get the current time
    const difference = now - HUNT_START_AT_MS
    // 4 hour periods to collect a certain egg
    const periodsElapsed = Math.floor(difference / 1000 / 60 / 60 / 4)
    // Figure out how many periods of four hours have passed.
    const eggIndex = periodsElapsed % 7

    return eggs[eggIndex]
}


export type CollectEggAction = {
    type: "easterEgg.collected";
};
  
type Options = {
    state: GameState;
    action: CollectEggAction;
    createdAt?: number;
};
  
export function collectEgg({ state, action, createdAt = Date.now() }: Options) {
    const egg = availableEgg(createdAt)

    if (!state.inventory["Egg Basket"]?.gte(1)) {
        throw new Error("Missing an egg basket")
    }

    if (state.inventory[egg]) {
        throw new Error("Egg already collected")
    }

    return {
      ...state,
      inventory: {
          ...state.inventory,
          [egg]: new Decimal(1)
      },
    };
  }
  