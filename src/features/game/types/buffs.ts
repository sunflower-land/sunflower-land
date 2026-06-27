import cloneDeep from "lodash.clonedeep";
import type { GameState } from "./game";
import { getKeys } from "lib/object";
import { CROPS } from "./crops";
import { useNow } from "lib/utils/hooks/useNow";
import {
  computeReadyAt,
  getCropPlotBoostWindows,
  workAccruedAt,
} from "features/game/lib/boostWindows";

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
    // Apply speed to existing crops
    getKeys(gameClone.crops).forEach((cropId) => {
      const plot = gameClone.crops[cropId];

      // Half the remaining time to harvest
      if (plot?.crop?.plantedAt) {
        const cropDetails = CROPS[plot.crop.name];
        const windows = getCropPlotBoostWindows(gameClone);
        const baseDurationMs = plot.crop.baseDurationMs;

        const readyAt =
          baseDurationMs !== undefined
            ? computeReadyAt({
                startedAt: plot.crop.plantedAt,
                baseDurationMs,
                windows,
              })
            : plot.crop.plantedAt + cropDetails.harvestSeconds * 1000;
        const remainingTime = readyAt - now;

        if (remainingTime > 0) {
          let timeReduction: number;

          if (baseDurationMs !== undefined) {
            // Speed-rate model: halve the remaining work; the AOE cooldown
            // shrinks by the real time that saves.
            const accrued = workAccruedAt({
              startedAt: plot.crop.plantedAt,
              at: now,
              windows,
            });
            const remainingWork = Math.max(baseDurationMs - accrued, 0);
            plot.crop.baseDurationMs = baseDurationMs - remainingWork / 2;
            timeReduction =
              readyAt -
              computeReadyAt({
                startedAt: plot.crop.plantedAt,
                baseDurationMs: plot.crop.baseDurationMs,
                windows,
              });
          } else {
            timeReduction = remainingTime / 2;
            plot.crop.plantedAt -= timeReduction;
            plot.crop.boostedTime =
              (plot.crop.boostedTime ?? 0) + timeReduction;
          }

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
      }
    });

    return {
      ...gameClone,
      buffs: {
        ...(gameClone.buffs ?? {}),
        [buff]: {
          startedAt: Date.now(),
          durationMS: 1000 * 60 * 60,
        },
      },
    };
  }

  return gameClone;
}
