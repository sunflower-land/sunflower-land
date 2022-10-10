import Decimal from "decimal.js-light";
import { canMine } from "features/game/expansion/lib/utils";
import cloneDeep from "lodash.clonedeep";
import { IRON_MINE_STAMINA_COST } from "../../lib/constants";
import { trackActivity } from "../../types/bumpkinActivity";
import { GameState } from "../../types/game";
import { replenishStamina } from "./replenishStamina";

export type LandExpansionIronMineAction = {
  type: "ironRock.mined";
  expansionIndex: number;
  index: number;
};

type Options = {
  state: Readonly<GameState>;
  action: LandExpansionIronMineAction;
  createdAt?: number;
};

export enum MINE_ERRORS {
  NO_PICKAXES = "No pickaxes left",
  NO_IRON = "No iron",
  STILL_RECOVERING = "Iron is still recovering",
  EXPANSION_HAS_NO_IRON = "Expansion has no iron",
  NO_EXPANSION = "Expansion does not exist",
  NO_STAMINA = "You do not have enough stamina",
  NO_BUMPKIN = "You do not have a Bumpkin",
}

// 12 hours
export const IRON_RECOVERY_TIME = 12 * 60 * 60;

export function mineIron({
  state,
  action,
  createdAt = Date.now(),
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
    throw new Error(MINE_ERRORS.NO_BUMPKIN);
  }

  if (bumpkin.stamina.value < IRON_MINE_STAMINA_COST) {
    throw new Error(MINE_ERRORS.NO_STAMINA);
  }

  if (!expansion) {
    throw new Error(MINE_ERRORS.NO_EXPANSION);
  }

  const { iron } = expansion;

  if (!iron) {
    throw new Error(MINE_ERRORS.EXPANSION_HAS_NO_IRON);
  }

  const ironRock = iron[action.index];

  if (!ironRock) {
    throw new Error(MINE_ERRORS.NO_IRON);
  }

  if (!canMine(ironRock, IRON_RECOVERY_TIME, createdAt)) {
    throw new Error(MINE_ERRORS.STILL_RECOVERING);
  }

  const toolAmount = stateCopy.inventory["Stone Pickaxe"] || new Decimal(0);

  if (toolAmount.lessThan(1)) {
    throw new Error(MINE_ERRORS.NO_PICKAXES);
  }

  const ironMined = ironRock.stone.amount;
  const amountInInventory = stateCopy.inventory.Iron || new Decimal(0);

  ironRock.stone = {
    minedAt: createdAt,
    amount: 2,
  };
  bumpkin.stamina.value -= IRON_MINE_STAMINA_COST;

  bumpkin.activity = trackActivity("Iron Mined", bumpkin.activity);

  stateCopy.inventory["Stone Pickaxe"] = toolAmount.sub(1);
  stateCopy.inventory.Iron = amountInInventory.add(ironMined);

  return stateCopy;
}
