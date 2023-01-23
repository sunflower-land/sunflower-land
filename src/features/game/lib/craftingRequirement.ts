import Decimal from "decimal.js-light";
import { Ingredient } from "../types/craftables";
import { GameState } from "../types/game";
import { GoblinState } from "./goblinMachine";
import { getBumpkinLevel } from "./level";

/**
 * The props for the crafting requirements.
 * @param resources The item resources requirements.
 * @param sfl The SFL requirements.
 * @param level The level requirements.
 */
interface RequirementsProps {
  resources?: Ingredient[];
  sfl?: Decimal;
  level?: number;
}

/**
 * Whether the crafting requirements are met.
 * @param gameState The game state.
 * @param requirements The crafting requirements.
 */
export const craftingRequirementsMet = (
  gameState: Readonly<GameState | GoblinState>,
  requirements: RequirementsProps
) => {
  const hasResources = requirements.resources
    ? requirements.resources.every(
        ({ item, amount }) =>
          gameState.inventory[item]?.gte(amount) || amount.equals(0)
      )
    : true;
  const hasBalance = requirements.sfl
    ? gameState.balance.greaterThanOrEqualTo(requirements.sfl)
    : true;
  const hasLevel = requirements.level
    ? getBumpkinLevel(gameState.bumpkin?.experience || 0) >=
      (requirements.level ?? 0)
    : !!gameState.bumpkin;
  const canCraft = hasResources && hasBalance && hasLevel;
  return canCraft;
};
