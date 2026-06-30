import cloneDeep from "lodash.clonedeep";
import type { GameState } from "./game";
import { getKeys } from "lib/object";
import { CROPS } from "./crops";
import { useNow } from "lib/utils/hooks/useNow";
import { refreshBasicScarecrowTimeAOE } from "features/game/lib/aoe";

// 50% faster crops, +0.2 Crops
export type BuffName = "Power hour";

export type Buff = {
  startedAt: number;
  durationMS: number;
};

export function isBuffActive({
  buff,
  game,
  now,
}: {
  buff: BuffName;
  game: GameState;
  now: number;
}) {
  return (
    game.buffs?.[buff]?.startedAt &&
    game.buffs?.[buff].startedAt + game.buffs?.[buff].durationMS > now
  );
}

export function useActiveBuff({
  buff,
  game,
}: {
  buff: BuffName;
  game: GameState;
}) {
  const { buffs } = game;
  const buffData = buffs?.[buff];
  const buffStartedAt = buffData?.startedAt ?? 0;
  const buffDurationMS = buffData?.durationMS ?? 0;
  const buffEndsAt = buffStartedAt + buffDurationMS;

  const now = useNow({ live: true, autoEndAt: buffEndsAt });
  const isActive = isBuffActive({ buff, game, now });

  return {
    isActive,
    remainingTime: buffEndsAt - now,
  };
}

export function applyBuff({
  buff,
  game,
  now = Date.now(),
}: {
  buff: BuffName;
  game: GameState;
  now?: number;
}) {
  const gameClone = cloneDeep(game);
  if (buff === "Power hour") {
    // Activate the buff FIRST so its speed window is live when we refresh
    // windowed crop timing / AOE below.
    gameClone.buffs = {
      ...(gameClone.buffs ?? {}),
      [buff]: { startedAt: now, durationMS: 1000 * 60 * 60 },
    };

    // Apply speed to existing LEGACY crops (back-date plantedAt). Speed-rate
    // crops accelerate via the Power Hour window itself, so they're skipped here
    // (the window would otherwise double-count); their Basic Scarecrow time-AOE
    // is re-synced from the new windowed ready time afterwards.
    getKeys(gameClone.crops).forEach((cropId) => {
      const plot = gameClone.crops[cropId];

      if (!plot?.crop?.plantedAt) return;
      if (plot.crop.baseDurationMs !== undefined) return;

      const cropDetails = CROPS[plot.crop.name];
      const readyAt = plot.crop.plantedAt + cropDetails.harvestSeconds * 1000;
      const remainingTime = readyAt - now;

      if (remainingTime > 0) {
        const timeReduction = remainingTime / 2;
        plot.crop.plantedAt -= timeReduction;
        plot.crop.boostedTime = (plot.crop.boostedTime ?? 0) + timeReduction;

        const basicScarecrow = gameClone.collectibles["Basic Scarecrow"]?.[0];
        if (
          basicScarecrow?.coordinates &&
          plot.x !== undefined &&
          plot.y !== undefined
        ) {
          const dx = plot.x - basicScarecrow.coordinates.x;
          const dy = plot.y - basicScarecrow.coordinates.y;
          const availableAt = gameClone.aoe["Basic Scarecrow"]?.[dx]?.[dy];

          if (availableAt) {
            gameClone.aoe["Basic Scarecrow"]![dx]![dy] = Math.max(
              now,
              availableAt - timeReduction,
            );
          }
        }
      }
    });

    // Windowed crops: re-sync the Basic Scarecrow time-AOE to the new (Power
    // Hour-boosted) ready time so a replant in the gap isn't denied the boost.
    refreshBasicScarecrowTimeAOE(gameClone);

    return gameClone;
  }

  return gameClone;
}
