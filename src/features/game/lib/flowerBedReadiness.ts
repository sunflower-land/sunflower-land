import { FLOWERS, FLOWER_SEEDS } from "features/game/types/flowers";
import type { GameState, PlantedFlower } from "features/game/types/game";
import { computeReadyAt, getFlowerBoostWindows } from "./boostWindows";

/**
 * The instant a planted flower is ready to harvest, across both boost models.
 * Flowers planted under the speed-rate model (with `baseDurationMs`) derive their
 * ready time live from the flower boost windows (Blossom Hourglass / Moth Shrine);
 * legacy flowers use their back-dated `plantedAt` + base grow duration. Flowers
 * are one-shot (no replenish), so the only phase is `plantedAt`.
 *
 * `baseDurationMs` is a PERMANENT per-flower migration marker: the read path keys
 * off its presence (matching `getFruitReadyAt` / `getTreeReadyAt`), so
 * legacy-shaped flowers still use the old timing — see
 * `PlantedFlower.baseDurationMs`. Lives in `lib` (not `events`) because it is
 * read-model logic consumed by `lib/updateBeehives` for hive pollination.
 */
export const getFlowerReadyAt = (
  flower: PlantedFlower,
  game: GameState,
): number => {
  const { plantSeconds } = FLOWER_SEEDS[FLOWERS[flower.name].seed];
  return computeReadyAt({
    startedAt: flower.plantedAt,
    baseDurationMs: flower.baseDurationMs ?? plantSeconds * 1000,
    windows: getFlowerBoostWindows(game),
  });
};

/**
 * Whether a flower is ready to harvest at `now`. Uses a STRICT `>` (unlike fruit's
 * `>=`) to preserve legacy flower semantics, where readiness was
 * `plantedAt + base < now` (i.e. NOT ready at the exact boundary).
 */
export const isFlowerReadyToHarvest = (
  now: number,
  flower: PlantedFlower,
  game: GameState,
): boolean => now > getFlowerReadyAt(flower, game);
