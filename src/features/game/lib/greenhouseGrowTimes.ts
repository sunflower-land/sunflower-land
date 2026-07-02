import {
  GREENHOUSE_CROPS,
  type GreenHouseCropName,
} from "features/game/types/crops";
import {
  GREENHOUSE_FRUIT_SEEDS,
  type GreenHouseFruitName,
} from "features/game/types/fruits";

/**
 * Base (unboosted) greenhouse grow durations. A dependency-free leaf — the
 * plant write path (plantGreenhouse) and the readiness read path
 * (greenhouseReadiness) both need it, and plantGreenhouse must not import the
 * readiness module: readiness pulls in boostWindows, whose require chain
 * (collectibleBuilt → placeCollectible → criticalHitGenerator) loops back into
 * plantGreenhouse — a require cycle that leaves the constant undefined.
 * Mirrors the mines' resourceRecovery leaf.
 */
export const GREENHOUSE_CROP_TIME_SECONDS: Record<
  GreenHouseCropName | GreenHouseFruitName,
  number
> = {
  Grape: GREENHOUSE_FRUIT_SEEDS["Grape Seed"].plantSeconds,
  Olive: GREENHOUSE_CROPS.Olive.harvestSeconds,
  Rice: GREENHOUSE_CROPS.Rice.harvestSeconds,
};
