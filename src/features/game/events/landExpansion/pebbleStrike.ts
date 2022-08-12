import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { GameState, LandExpansionRock } from "../../types/game";

export type PebbleStrikeAction = {
  type: "pebble.struck";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: PebbleStrikeAction;
  createdAt?: number;
};

// 30 minutes
export const PEBBLE_RECOVERY_TIME = 30 * 60;

const STONE_AMOUNT = 0.1;

export function canMine(pebble: LandExpansionRock, now: number = Date.now()) {
  if (!pebble.stone) return true;

  const recoveryTime = PEBBLE_RECOVERY_TIME;

  return now - pebble.stone.minedAt > recoveryTime * 1000;
}

export function strikePebble({
  state,
  action,
  createdAt = Date.now(),
}: Options): GameState {
  const stateCopy = cloneDeep(state);
  const { expansions } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  const { pebbles } = expansion;

  if (!pebbles) {
    throw new Error("Expansion does not have pebbles");
  }

  const pebble = pebbles[action.index];

  if (!pebble) {
    throw new Error("No pebble");
  }

  if (!canMine(pebble, createdAt)) {
    throw new Error("Pebble is still recovering");
  }

  const stoneInInventory = stateCopy.inventory.Stone || new Decimal(0);

  pebble.stone = { minedAt: Date.now(), amount: STONE_AMOUNT };

  return {
    ...stateCopy,
    expansions,
    inventory: {
      ...stateCopy.inventory,
      Stone: stoneInInventory.add(STONE_AMOUNT),
    },
  };
}
