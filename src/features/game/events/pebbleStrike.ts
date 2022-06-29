import Decimal from "decimal.js-light";
import { GameState, LandExpansionRock } from "../types/game";

export type PebbleStrikeAction = {
  type: "pebble.struck";
  index: number;
};

type Options = {
  state: GameState;
  action: PebbleStrikeAction;
  createdAt?: number;
};

// 30 minutes
export const PEBBLE_RECOVERY_TIME = 30 * 60;

const STONE_AMOUNT = 0.1;

export function canMine(pebble: LandExpansionRock, now: number = Date.now()) {
  const recoveryTime = PEBBLE_RECOVERY_TIME;
  if (pebble.stone) {
    return now - pebble.stone.minedAt > recoveryTime * 1000;
  }

  return true;
}

export function strikePebble({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const pebble = state.pebbles[action.index];

  if (!pebble) {
    throw new Error("No pebble");
  }

  if (!canMine(pebble, createdAt)) {
    throw new Error("Pebble is still recovering");
  }

  const stoneInInventory = state.inventory.Stone || new Decimal(0);
  const { x, y, height, width } = pebble;

  return {
    ...state,
    inventory: {
      ...state.inventory,
      Stone: stoneInInventory.add(STONE_AMOUNT),
    },
    pebbles: {
      [action.index]: {
        stone: { minedAt: Date.now(), amount: STONE_AMOUNT },
        height,
        width,
        x,
        y,
      },
    },
  };
}
