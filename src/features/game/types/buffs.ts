import cloneDeep from "lodash.clonedeep";
import { GameState } from "./game";
import { getKeys } from "./decorations";

// 50% faster crops, +0.2 Crops
export type BuffName = "Power hour";

export type Buff = {
  startedAt: number;
  durationMS: number;
};

export function isBuffActive({
  buff,
  game,
  now = Date.now(),
}: {
  buff: BuffName;
  game: GameState;
  now?: number;
}) {
  return (
    game.buffs?.[buff]?.startedAt &&
    game.buffs?.[buff].startedAt + game.buffs?.[buff].durationMS > now
  );
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
        plot.crop.plantedAt -= (plot.crop.plantedAt - now) / 2;
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
