import { randomInt } from "crypto";
import Decimal from "decimal.js-light";
import cloneDeep from "lodash.clonedeep";
import { IRON_MINE_STAMINA_COST } from "../../lib/constants";
import { trackActivity } from "../../types/bumpkinActivity";
import { GameState, Inventory, LandExpansionRock } from "../../types/game";
import { replenishStamina } from "./replenishStamina";

export type LandExpansionIronMineAction = {
  type: "ironRock.mined";
  expansionIndex: number;
  index: number;
};

type DropRandomAmount = () => number;

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionIronMineAction;
  createdAt: number;
  dropRandomAmount?: DropRandomAmount;
};

// 12 hours
export const IRON_RECOVERY_TIME = 12 * 60 * 60;

export function canMine(rock: LandExpansionRock, now: number = Date.now()) {
  const recoveryTime = IRON_RECOVERY_TIME;
  return now - rock.stone.minedAt > recoveryTime * 1000;
}

const dropAmountGenerator = () => randomInt(2, 4);

/**
 * Sets the drop amount for the NEXT mine event on the rock
 */
export function getDropAmount(
  inventory: Inventory,
  dropRandomAmount: DropRandomAmount
) {
  const drop = new Decimal(dropRandomAmount());

  let mul = 1;

  if (inventory["Rocky the Mole"]) {
    mul += 0.25;
  }

  return drop.mul(mul);
}

export function mineIron({
  state,
  action,
  createdAt,
  dropRandomAmount = dropAmountGenerator,
}: Options): GameState {
  const replenishedState = replenishStamina({
    state,
    action: { type: "bumpkin.replenishStamina" },
    createdAt,
  });
  const stateCopy = cloneDeep(replenishedState);
  const { expansions, bumpkin } = stateCopy;
  const expansion = expansions[action.expansionIndex];

  if (!bumpkin) {
    throw new Error("You do not have a Bumpkin");
  }

  if (bumpkin.stamina.value < IRON_MINE_STAMINA_COST) {
    throw new Error("You do not have enough stamina");
  }

  if (!expansion) {
    throw new Error("Expansion does not exist");
  }

  const { iron } = expansion;

  if (!iron) {
    throw new Error("Expansion has no iron");
  }

  const ironRock = iron[action.index];

  if (!ironRock) {
    throw new Error("No iron");
  }

  if (!canMine(ironRock, createdAt)) {
    throw new Error("Iron is still recovering");
  }

  const toolAmount = stateCopy.inventory.Axe || new Decimal(0);

  if (toolAmount.lessThan(1)) {
    throw new Error("No axes left");
  }

  const ironMined = ironRock.stone.amount;
  const amountInInventory = stateCopy.inventory.Iron || new Decimal(0);

  ironRock.stone = {
    minedAt: createdAt,
    amount: getDropAmount(stateCopy.inventory, dropRandomAmount).toNumber(),
  };

  bumpkin.stamina.value = bumpkin.stamina.value - IRON_MINE_STAMINA_COST;

  const activity = bumpkin.activity;
  bumpkin.activity = trackActivity("Iron Mined", activity);

  stateCopy.inventory.Axe = toolAmount.sub(1);
  stateCopy.inventory.Iron = amountInInventory.add(ironMined);

  return stateCopy;
}
