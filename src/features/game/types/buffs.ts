import cloneDeep from "lodash.clonedeep";
import { GameState } from "./game";
import { getKeys } from "lib/object";
import { CROPS } from "./crops";
import { useNow } from "lib/utils/hooks/useNow";

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
        const readyAt =
          plot.crop.plantedAt + CROPS[plot.crop.name].harvestSeconds * 1000;
        const remainingTime = readyAt - now;
        plot.crop.plantedAt -= remainingTime / 2;
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
