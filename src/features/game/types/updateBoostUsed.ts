import { GameState, BoostName, BoostUsedAt } from "./game";

export function updateBoostUsed({
  game,
  boostNames,
  createdAt = Date.now(),
}: {
  game: GameState;
  boostNames: { name: BoostName; value: string }[];
  createdAt: number;
}): BoostUsedAt {
  const { boostsUsedAt = {} } = game;

  if (boostNames.length <= 0) return boostsUsedAt;

  return boostNames.reduce<BoostUsedAt>(
    (acc, boostName) => {
      const { name } = boostName;
      acc[name] = createdAt;
      return acc;
    },
    { ...boostsUsedAt },
  );
}
