import { getKeys } from "../types/craftables";
import { ExpansionRequirements, GameState } from "../types/game";
import { getBumpkinLevel } from "./level";

/**
 * Whether the crafting requirements are met.
 * @param gameState The game state.
 * @param requirements The crafting requirements.
 */
export const craftingRequirementsMet = (
  gameState: Readonly<GameState>,
  requirements?: ExpansionRequirements
) => {
  if (!requirements) {
    return false;
  }

  const hasResources = getKeys(requirements.resources).every((name) =>
    gameState.inventory[name]?.gte(requirements.resources[name] ?? 0)
  );

  const hasLevel = requirements.bumpkinLevel
    ? getBumpkinLevel(gameState.bumpkin?.experience || 0) >=
      (requirements.bumpkinLevel ?? 0)
    : !!gameState.bumpkin;
  const canCraft = hasResources && hasLevel;
  return canCraft;
};
