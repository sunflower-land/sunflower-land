import { GameState, BoostName, BoostUsedAt } from "./game";

export function updateBoostUsed({
  game,
  boostNames,
  createdAt = Date.now(),
}: {
  game: GameState;
  boostNames: BoostName[];
  createdAt: number;
}): BoostUsedAt {
  const { boostsUsedAt = {} } = game;
  boostNames.forEach((boostName) => (boostsUsedAt[boostName] = createdAt));

  return boostsUsedAt;
}
