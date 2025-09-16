import { AOEItemName } from "../expansion/placeable/lib/collisionDetection";
import { CollectibleName } from "../types/craftables";
import { AOE, GameState } from "../types/game";

/**
 * Important: for yield boosts, the gameState.aoe object contains when the boost was last used.
 */
export const canUseYieldBoostAOE = (
  aoe: AOE,
  item: AOEItemName,
  { dx, dy }: { dx: number; dy: number },
  cooldownTime: number,
  createdAt: number,
) => {
  const aoeIdleTime = createdAt - (aoe[item]?.[dx]?.[dy] ?? 0);
  return aoeIdleTime >= cooldownTime;
};

/**
 * Important: for time boosts, the gameState.aoe object contains when the boost is next available.
 */
export const canUseTimeBoostAOE = (
  aoe: AOE,
  item: AOEItemName,
  { dx, dy }: { dx: number; dy: number },
  createdAt: number,
) => {
  const aoeReadyAt = aoe[item]?.[dx]?.[dy] ?? 0;
  return createdAt >= aoeReadyAt;
};

export const setAOELastUsed = (
  aoe: AOE,
  item: AOEItemName,
  { dx, dy }: { dx: number; dy: number },
  createdAt: number,
): void => {
  aoe[item] = aoe[item] ?? {};
  aoe[item][dx] = aoe[item][dx] ?? {};
  aoe[item][dx][dy] = createdAt;
};

export const setAOEAvailableAt = (
  aoe: AOE,
  item: AOEItemName,
  { dx, dy }: { dx: number; dy: number },
  createdAt: number,
  waitTime: number,
): void => {
  aoe[item] = aoe[item] ?? {};
  aoe[item][dx] = aoe[item][dx] ?? {};
  aoe[item][dx][dy] = createdAt + waitTime;
};

export function isCollectibleOnFarm({
  name,
  game,
}: {
  name: CollectibleName;
  game: GameState;
}) {
  const placedOnFarm =
    game.collectibles[name] &&
    game.collectibles[name]?.some(
      (placed) => (placed.readyAt ?? 0) <= Date.now() && placed.coordinates,
    );

  return placedOnFarm;
}
