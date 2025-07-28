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

  if (boostNames.length <= 0) return boostsUsedAt;

  return boostNames.reduce<BoostUsedAt>((acc, boostName) => {
    return {
      ...acc,
      [boostName]: createdAt,
    };
  }, boostsUsedAt);
}
